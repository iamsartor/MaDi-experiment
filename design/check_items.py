#!/usr/bin/env python3
"""Check a <studyId>.items.json file before using it (e.g. one an AI wrote).

Usage:
    python design/check_items.py design/studies/my-study.items.json

Prints every problem found and exits with 1 if there is any. See
docs/new-study.md for the format and a prompt to create the file with an AI.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ID_ITEM = re.compile(r"^I\d{2,3}$")
ID_SEG = re.compile(r"^S\d{1,2}$")
ID_OPT = re.compile(r"^O\d{1,2}$")
STUDY = re.compile(r"^[a-z0-9][a-z0-9-]{1,60}$")


def check(doc) -> list[str]:
    p = []
    if not isinstance(doc, dict):
        return ["The file must contain one JSON object { … }."]
    sid = doc.get("studyId")
    if not isinstance(sid, str) or not STUDY.match(sid):
        p.append('studyId: use lowercase letters, digits and dashes, e.g. "pricing-2027".')
    for key in ("title", "intro"):
        if not isinstance(doc.get(key), str) or not doc[key].strip():
            p.append(f"{key}: missing or empty.")
    q = doc.get("question")
    if not isinstance(q, dict):
        p.append("question: missing (needs prompt, best, worst).")
    else:
        for key in ("prompt", "best", "worst"):
            if not isinstance(q.get(key), str) or not q[key].strip():
                p.append(f"question.{key}: missing or empty.")
    items = doc.get("items")
    if not isinstance(items, list):
        p.append("items: must be a list.")
        items = []
    if items and not 6 <= len(items) <= 40:
        p.append(f"items: {len(items)} items; MaxDiff works best with 6 to 40 (ideally 8 to 30).")
    seen = set()
    for n, it in enumerate(items, 1):
        if not isinstance(it, dict):
            p.append(f"items[{n}]: must be {{\"id\": …, \"text\": …}}.")
            continue
        iid, text = it.get("id"), it.get("text")
        if not isinstance(iid, str) or not ID_ITEM.match(iid):
            p.append(f"items[{n}]: id {iid!r} should look like I01, I02 …")
        elif iid in seen:
            p.append(f"items[{n}]: id {iid} is used twice.")
        seen.add(iid)
        if not isinstance(text, str) or not text.strip():
            p.append(f"items[{n}] ({iid}): text is empty.")
        elif len(text) > 120:
            p.append(f"items[{n}] ({iid}): text is {len(text)} characters; keep items short (under ~80).")
    texts = [it.get("text", "").strip().lower() for it in items if isinstance(it, dict)]
    for t in {t for t in texts if t and texts.count(t) > 1}:
        p.append(f'items: the text "{t}" appears more than once.')
    segs = doc.get("segmentQuestions", [])
    if not isinstance(segs, list):
        p.append("segmentQuestions: must be a list (or left out).")
        segs = []
    sseen = set()
    for n, q in enumerate(segs, 1):
        if not isinstance(q, dict):
            p.append(f"segmentQuestions[{n}]: must be an object.")
            continue
        qid = q.get("id")
        if not isinstance(qid, str) or not ID_SEG.match(qid) or qid in sseen:
            p.append(f"segmentQuestions[{n}]: id {qid!r} should be unique and look like S1, S2 …")
        sseen.add(qid)
        if not isinstance(q.get("text"), str) or not q["text"].strip():
            p.append(f"segmentQuestions[{n}] ({qid}): text is empty.")
        opts = q.get("options")
        if not isinstance(opts, list) or len(opts) < 2:
            p.append(f"segmentQuestions[{n}] ({qid}): needs at least 2 options.")
            continue
        oseen = set()
        for o in opts:
            oid = o.get("id") if isinstance(o, dict) else None
            if not isinstance(oid, str) or not ID_OPT.match(oid) or oid in oseen:
                p.append(f"segmentQuestions[{n}] ({qid}): option id {oid!r} should be unique and look like O1, O2 …")
            oseen.add(oid)
            if not isinstance(o, dict) or not str(o.get("text", "")).strip():
                p.append(f"segmentQuestions[{n}] ({qid}): option {oid} has no text.")
    return p


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    if len(argv) != 1:
        print(__doc__)
        return 2
    path = Path(argv[0])
    try:
        doc = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"Not valid JSON: {e}")
        return 1
    problems = check(doc)
    if problems:
        print(f"{len(problems)} problem(s) in {path.name}:")
        for x in problems:
            print("  -", x)
        return 1
    n = len(doc["items"])
    print(f"OK: {doc['studyId']} with {n} items and {len(doc.get('segmentQuestions', []))} segment question(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
