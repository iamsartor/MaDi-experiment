#!/usr/bin/env python3
"""Upload a study design to Firestore, or change its status.

Uploads <studyId>.design.json (ids only, never wording) to studies/<studyId>.

Requires `pip install firebase-admin` and a service-account key JSON
(Firebase console -> Project settings -> Service accounts -> Generate new
private key). Keep the key OUTSIDE the repository.

Usage:
    python design/upload_study.py design/studies/restaurant-demo.design.json --credentials ~/keys/madi.json
    python design/upload_study.py design/studies/restaurant-demo.design.json --credentials ~/keys/madi.json --open
    python design/upload_study.py --status closed --study restaurant-demo --credentials ~/keys/madi.json

Status: draft (default on upload) -> open (accepts responses) -> closed.
Re-uploading a design for a study that already has responses is refused unless
--force is given, because old responses refer to the old versions.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path


def connect(credentials=None, project=None):
    import firebase_admin
    from firebase_admin import credentials as fb_cred, firestore

    if not firebase_admin._apps:
        if credentials:
            firebase_admin.initialize_app(fb_cred.Certificate(str(Path(credentials).expanduser())))
        elif os.environ.get("FIRESTORE_EMULATOR_HOST"):
            return _emulator_client(project)
        else:
            raise SystemExit("Give --credentials (service-account key) or set FIRESTORE_EMULATOR_HOST.")
    return firestore.client()


def _emulator_client(project=None):
    """Firestore client for the local emulator (no credentials needed)."""
    from google.auth.credentials import AnonymousCredentials
    from google.cloud import firestore as gfs
    return gfs.Client(project=project or "demo-maxdiff", credentials=AnonymousCredentials())


def check_ids_only(cfg: dict):
    allowed = {"studyId", "status", "setSize", "itemIds", "versions", "segmentQuestions", "createdAt"}
    extra = set(cfg) - allowed
    if extra:
        raise SystemExit(f"Refusing upload: unexpected fields {sorted(extra)} (wording must not go to Firestore).")


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("design_file", nargs="?", type=Path)
    p.add_argument("--credentials")
    p.add_argument("--project", help="only with the emulator")
    p.add_argument("--open", action="store_true", help="upload with status open")
    p.add_argument("--status", choices=["draft", "open", "closed"], help="only change the status")
    p.add_argument("--study", help="study id, with --status")
    p.add_argument("--force", action="store_true")
    a = p.parse_args(argv)

    db = connect(a.credentials, a.project)

    if a.status and not a.design_file:
        if not a.study:
            raise SystemExit("--status needs --study")
        db.collection("studies").document(a.study).update({"status": a.status})
        print(f"studies/{a.study}: status = {a.status}")
        return 0

    if not a.design_file:
        p.error("give a design file, or --status with --study")
    cfg = json.loads(a.design_file.read_text(encoding="utf-8"))
    check_ids_only(cfg)
    sid = cfg["studyId"]
    from google.cloud.firestore_v1.base_query import FieldFilter
    has_responses = any(True for _ in db.collection("responses")
                        .where(filter=FieldFilter("studyId", "==", sid)).limit(1).stream())
    if has_responses and not a.force:
        raise SystemExit(f"'{sid}' already has responses; re-uploading would change its versions. Use --force if you are sure.")
    cfg["status"] = a.status or ("open" if a.open else "draft")
    db.collection("studies").document(sid).set(cfg)
    print(f"Uploaded studies/{sid} ({len(cfg['versions'])} versions, status {cfg['status']})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
