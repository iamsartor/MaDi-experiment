#!/usr/bin/env python3
"""Collect offline survey results (saved files or pasted text) into one batch file.

Respondents of an offline build (design/build_html.py --mode offline) send their
result back themselves, e.g. in Teams: either the saved .json file or the copied
text. Put everything into one folder (pasted text saved as .txt) and run:

    python analysis/collect_offline.py <folder> --study <studyId> \\
        --design design/studies/<studyId>.design.json
    # -> analysis/data/<studyId>.offline.<YYYYMMDD-HHMM>.jsonl

What it does:
  - reads every *.json and *.txt in the folder (not in subfolders),
  - repairs what chat apps do to pasted text: byte-order mark, surrounding
    whitespace, typographic quotes, non-breaking and zero-width spaces,
  - accepts pretty-printed or compact JSON, and several results in one .txt
    (one per line),
  - checks each result against the design and lists invalid ones with the reason
    (they are not written),
  - drops exact duplicates (e.g. the same person sent the file and the text),
  - sets _id to the file name (plus -1, -2 … when a file holds several results).

The output has the same shape as analysis/export.py batches, so the notebook
reads it with SOURCE = "file". Results contain ids only, never wording.
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent

# What chat apps and word processors put into pasted text.
REPLACE = {
    "﻿": "",      # byte-order mark
    "​": "",      # zero-width space
    "‌": "",
    "‍": "",
    "⁠": "",      # word joiner
    " ": " ",     # non-breaking space
    " ": " ",     # narrow non-breaking space
    "“": '"',     # “
    "”": '"',     # ”
    "„": '"',     # „
    "‟": '"',     # ‟
    "″": '"',     # ″
}


def clean_text(text: str) -> str:
    for a, b in REPLACE.items():
        text = text.replace(a, b)
    return text.strip()


def read_text(path: Path) -> str:
    """Read a file as text; UTF-8 (with or without BOM), or UTF-16 if it has a UTF-16 BOM."""
    raw = path.read_bytes()
    if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):
        return raw.decode("utf-16", errors="replace")
    return raw.decode("utf-8", errors="replace")


def parse_results(text: str) -> list:
    """Return the JSON values in `text`; raise ValueError if it cannot be read.

    Tries, in order: the whole text as one JSON value (pretty or compact; a list
    counts as several results), one JSON value per line, and finally the lines
    joined back together (for chat apps that wrap long lines).
    """
    text = clean_text(text)
    if not text:
        raise ValueError("file is empty")
    try:
        v = json.loads(text)
        return v if isinstance(v, list) else [v]
    except json.JSONDecodeError as e:
        whole_err = e
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    if len(lines) > 1:
        try:
            return [json.loads(ln) for ln in lines]
        except json.JSONDecodeError:
            pass
        joined = "".join(lines)
        dec, pos, out = json.JSONDecoder(), 0, []
        try:
            while pos < len(joined):
                v, pos = dec.raw_decode(joined, pos)
                out.append(v)
                while pos < len(joined) and joined[pos] in " \t,":
                    pos += 1
            return out
        except json.JSONDecodeError:
            pass
    raise ValueError(f"not valid JSON ({whole_err.msg}, line {whole_err.lineno} column {whole_err.colno})")


def validate(r, study_id: str, design: dict) -> str | None:
    """Return the reason a result is invalid, or None if it is fine."""
    if not isinstance(r, dict):
        return "not a result object"
    if r.get("studyId") != study_id:
        return f"studyId is {r.get('studyId')!r}, expected {study_id!r}"
    versions = {v.get("version", n): v for n, v in enumerate(design.get("versions", []))}
    v = r.get("version")
    if not isinstance(v, int) or isinstance(v, bool) or v not in versions:
        return f"version {v!r} does not exist in the design"
    screens = [frozenset(s["items"]) for s in versions[v]["screens"]]
    answers = r.get("answers")
    if not isinstance(answers, list):
        return "answers missing"
    if len(answers) != len(screens):
        return f"{len(answers)} answers, expected {len(screens)} (screens of version {v})"
    left = Counter(screens)
    for n, a in enumerate(answers, 1):
        if not isinstance(a, dict) or not isinstance(a.get("set"), list):
            return f"answer {n}: no set"
        s = a["set"]
        fs = frozenset(s)
        if len(fs) != len(s) or left[fs] == 0:
            return f"answer {n}: set {s} is not a screen of version {v}"
        left[fs] -= 1
        best, worst = a.get("best"), a.get("worst")
        if best not in s or worst not in s:
            return f"answer {n}: best/worst not in the set"
        if best == worst:
            return f"answer {n}: best and worst are the same ({best})"
    segs = r.get("segments", {})
    if not isinstance(segs, dict):
        return "segments is not an object"
    known = {q["id"]: set(q["options"]) for q in design.get("segmentQuestions", [])}
    for qid, opt in segs.items():
        if qid not in known or opt not in known[qid]:
            return f"segment answer {qid}={opt!r} is not in the design"
    return None


def canonical(r: dict) -> str:
    return json.dumps({k: x for k, x in r.items() if k != "_id"}, sort_keys=True, separators=(",", ":"))


def collect(folder: Path, study_id: str, design: dict):
    """Return (valid results, invalid [(name, reason)], duplicates [(name, kept)], files read)."""
    files = sorted(
        (p for p in Path(folder).iterdir() if p.is_file() and p.suffix.lower() in (".json", ".txt")),
        key=lambda p: (p.suffix.lower() != ".json", p.name.lower()),  # saved files first
    )
    valid, invalid, dups, seen = [], [], [], {}
    for p in files:
        try:
            results = parse_results(read_text(p))
        except ValueError as e:
            invalid.append((p.name, str(e)))
            continue
        many = len(results) > 1
        for n, r in enumerate(results, 1):
            rid = f"{p.stem}-{n}" if many else p.stem
            name = f"{p.name} (result {n})" if many else p.name
            reason = validate(r, study_id, design)
            if reason:
                invalid.append((name, reason))
                continue
            key = canonical(r)
            if key in seen:
                dups.append((name, seen[key]))
                continue
            seen[key] = name
            valid.append({**{k: x for k, x in r.items() if k != "_id"}, "_id": rid})
    return valid, invalid, dups, len(files)


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("folder", type=Path, help="folder with the result files (.json, .txt)")
    p.add_argument("--study", required=True, help="studyId")
    p.add_argument("--design", type=Path, required=True, help="<studyId>.design.json")
    p.add_argument("--out", type=Path, default=None,
                   help="default: analysis/data/<studyId>.offline.<YYYYMMDD-HHMM>.jsonl")
    a = p.parse_args(argv)

    if not a.folder.is_dir():
        raise SystemExit(f"Not a folder: {a.folder}")
    design = json.loads(a.design.read_text(encoding="utf-8"))
    if design.get("studyId") != a.study:
        raise SystemExit(f"The design file is for {design.get('studyId')!r}, not {a.study!r}.")
    valid, invalid, dups, nfiles = collect(a.folder, a.study, design)

    print(f"Files read:  {nfiles}")
    print(f"Valid:       {len(valid)}")
    print(f"Invalid:     {len(invalid)}")
    for name, reason in invalid:
        print(f"  - {name}: {reason}")
    print(f"Duplicates:  {len(dups)}")
    for name, kept in dups:
        print(f"  - {name} (same as {kept})")
    if not valid:
        print("Output:      none written (no valid results)")
        return 1
    out = a.out or HERE / "data" / f"{a.study}.offline.{datetime.now():%Y%m%d-%H%M}.jsonl"
    if out.exists():
        raise SystemExit(f"{out} already exists; wait a minute or give --out.")
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8") as f:
        for r in valid:
            f.write(json.dumps(r) + "\n")
    print(f"Output:      {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
