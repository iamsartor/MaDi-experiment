#!/usr/bin/env python3
"""Build the survey link for a study, with the wording packed after "#".

The wording (title, intro, question, item and segment texts) is compressed into
the link's fragment. Browsers never send the fragment to a server, so the
wording reaches neither GitHub Pages nor Firebase; only people who have the
link can read it.

Usage:
    python design/make_link.py design/studies/restaurant-demo.items.json
    python design/make_link.py ITEMS.json --mode test        # does not save answers
    python design/make_link.py ITEMS.json --mode local       # static design file, no Firebase

Treat the printed link as confidential: it contains the wording.
"""
from __future__ import annotations

import argparse
import base64
import json
import sys
import zlib
from pathlib import Path
from urllib.parse import quote

DEFAULT_BASE = "https://iamsartor.github.io/MaDi-experiment/survey/"


def wording_payload(items_doc: dict) -> dict:
    """The minimal wording the survey page needs, keyed by id."""
    return {
        "studyId": items_doc["studyId"],
        "title": items_doc.get("title", ""),
        "intro": items_doc.get("intro", ""),
        "question": items_doc.get("question", {}),
        "items": {it["id"]: it["text"] for it in items_doc["items"]},
        "segments": {
            q["id"]: {"text": q.get("text", q["id"]),
                      "options": {o["id"]: o.get("text", o["id"]) for o in q["options"]}}
            for q in items_doc.get("segmentQuestions", [])
        },
    }


def encode(payload: dict) -> str:
    """JSON -> raw deflate -> base64url without padding (decoded in survey/app.js)."""
    raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    c = zlib.compressobj(9, zlib.DEFLATED, -15)
    packed = c.compress(raw) + c.flush()
    return base64.urlsafe_b64encode(packed).decode("ascii").rstrip("=")


def decode(token: str) -> dict:
    data = base64.urlsafe_b64decode(token + "=" * (-len(token) % 4))
    return json.loads(zlib.decompress(data, -15).decode("utf-8"))


def build_link(items_doc: dict, base: str = DEFAULT_BASE, mode: str = "live") -> str:
    q = f"?study={quote(items_doc['studyId'])}"
    if mode != "live":
        q += f"&mode={mode}"
    return f"{base}{q}#w={encode(wording_payload(items_doc))}"


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("items_file", type=Path)
    p.add_argument("--base", default=DEFAULT_BASE, help=f"survey page URL (default {DEFAULT_BASE})")
    p.add_argument("--mode", choices=["live", "test", "local"], default="live")
    a = p.parse_args(argv)
    doc = json.loads(a.items_file.read_text(encoding="utf-8"))
    link = build_link(doc, a.base, a.mode)
    print(link)
    print(f"\n({len(link)} characters; keep this link confidential, it contains the wording)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
