#!/usr/bin/env python3
"""Pull one analysis batch of responses from Firestore into a local JSONL file.

A "batch" is every response of one study at the moment you run this. Each run
writes a new, timestamped file, so earlier analyses stay reproducible.

Requires:
    pip install firebase-admin
    a service-account key JSON (Firebase console -> Project settings ->
    Service accounts -> Generate new private key). Keep it OUTSIDE the repo.

Usage:
    python analysis/export.py restaurant-demo --credentials ~/keys/maxdiff-sa.json
    # -> analysis/data/restaurant-demo.20261111-0930.jsonl

Against the local emulator (no key needed):
    FIRESTORE_EMULATOR_HOST=localhost:8080 python analysis/export.py restaurant-demo --project demo-maxdiff

Responses contain item ids only; wording is joined later from the local items file.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent


def _plain(v):
    """Convert Firestore types (timestamps) to JSON-safe values."""
    if hasattr(v, "isoformat"):
        return v.isoformat()
    if isinstance(v, dict):
        return {k: _plain(x) for k, x in v.items()}
    if isinstance(v, list):
        return [_plain(x) for x in v]
    return v


def pull_batch(study_id, credentials=None, project=None, out_dir=None, collection="responses"):
    """Download all responses of `study_id`; return the path of the written JSONL file."""
    import firebase_admin
    from firebase_admin import credentials as fb_cred, firestore
    from google.cloud.firestore_v1.base_query import FieldFilter

    if credentials:
        if not firebase_admin._apps:
            firebase_admin.initialize_app(fb_cred.Certificate(str(Path(credentials).expanduser())))
        db = firestore.client()
    elif os.environ.get("FIRESTORE_EMULATOR_HOST"):
        from google.auth.credentials import AnonymousCredentials
        from google.cloud import firestore as gfs
        db = gfs.Client(project=project or "demo-maxdiff", credentials=AnonymousCredentials())
    else:
        raise SystemExit("Give --credentials (service-account key) or set FIRESTORE_EMULATOR_HOST.")
    docs = db.collection(collection).where(filter=FieldFilter("studyId", "==", study_id)).stream()

    out_dir = Path(out_dir or HERE / "data")
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{study_id}.{datetime.now():%Y%m%d-%H%M}.jsonl"
    n = 0
    with path.open("w", encoding="utf-8") as f:
        for d in docs:
            rec = _plain(d.to_dict())
            rec["_id"] = d.id
            f.write(json.dumps(rec) + "\n")
            n += 1
    print(f"Pulled {n} responses for '{study_id}' into {path}")
    return path


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("study_id")
    p.add_argument("--credentials", help="service-account key JSON (keep outside the repo)")
    p.add_argument("--project", help="project id, only needed with the emulator")
    p.add_argument("--out-dir", default=None, help="default: analysis/data/")
    a = p.parse_args(argv)
    pull_batch(a.study_id, a.credentials, a.project, a.out_dir)
    return 0


if __name__ == "__main__":
    sys.exit(main())
