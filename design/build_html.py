#!/usr/bin/env python3
"""Build ONE self-contained HTML file for a study, to share e.g. via Teams.

The file contains everything: page, styles, survey code, the Firebase SDK, the
study design (ids) and the wording. Respondents open it in their browser; the
only network call is saving their answers (ids only) to Firestore.

In --mode offline the file has no Firebase SDK and makes no network call at all:
at the end the respondent saves or copies the result (ids only) and sends it
back, e.g. in Teams. Collect the results with analysis/collect_offline.py.

The file contains the wording, so treat it as confidential. Output goes to
dist/ (git-ignored).

Usage:
    python design/build_html.py design/studies/restaurant-demo.items.json
    python design/build_html.py ITEMS.json --mode test     # try it: nothing is saved
    python design/build_html.py ITEMS.json --mode offline  # no network; results come back by Teams
    python design/build_html.py ITEMS.json --out ~/Desktop/restaurant-survey.html

Before sending a live file: upload the design (design/upload_study.py) and set
the study to open. A file built from an older design must not be used after the
design was regenerated, because the version numbers would no longer match.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SURVEY = ROOT / "survey"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from make_link import wording_payload  # noqa: E402


def read_firebase_config() -> dict:
    """Parse the key: "value" pairs of survey/firebase-config.js."""
    src = (SURVEY / "firebase-config.js").read_text(encoding="utf-8")
    body = src[src.index("{") + 1: src.index("}")]
    cfg = dict(re.findall(r'(\w+)\s*:\s*"([^"]*)"', body))
    if "projectId" not in cfg:
        raise SystemExit("Could not read the Firebase config from survey/firebase-config.js")
    return cfg


MODES = ("live", "test", "offline")
FIREBASE_BLOCK = re.compile(r"// firebase-block-start\n.*?// firebase-block-end\n", re.S)
OFFLINE_STUB = ("// Offline build: the Firebase code was removed by design/build_html.py.\n"
                "async function firestore() { throw new Error(\"Offline mode makes no network calls.\"); }\n")


def strip_firebase(app_js: str) -> str:
    """Remove the Firebase code from app.js for offline builds."""
    out, n = FIREBASE_BLOCK.subn(OFFLINE_STUB, app_js)
    if n != 1:
        raise SystemExit("survey/app.js: firebase-block markers not found exactly once.")
    return out


def safe_script(text: str) -> str:
    """Make text safe inside a <script> element."""
    return text.replace("</script", "<\\/script").replace("<!--", "<\\!--")


def build_html(items_doc: dict, design: dict, mode: str = "live", emulator: bool = False) -> str:
    if design.get("studyId") != items_doc.get("studyId"):
        raise SystemExit("The items file and the design file belong to different studies.")
    ids = {it["id"] for it in items_doc["items"]}
    if set(design["itemIds"]) != ids:
        raise SystemExit("The design does not match the items file; regenerate the design.")
    if mode not in MODES:
        raise SystemExit(f"Unknown mode {mode!r}; use one of {', '.join(MODES)}.")
    offline = mode == "offline"
    embed = {
        "design": design,
        "wording": wording_payload(items_doc),
        "firebaseConfig": None if offline else read_firebase_config(),
        "mode": mode,
        "emulator": emulator and not offline,
    }
    if offline:
        contact = items_doc.get("contact")
        embed["contact"] = contact.strip() if isinstance(contact, str) and contact.strip() else None
    css = (SURVEY / "styles.css").read_text(encoding="utf-8")
    app = (SURVEY / "app.js").read_text(encoding="utf-8")
    if offline:
        app = strip_firebase(app)
        firebase_tag = ""
    else:
        firebase = (SURVEY / "vendor" / "firebase-lite.iife.js").read_text(encoding="utf-8")
        firebase_tag = f"<script>\n{safe_script(firebase)}\n</script>\n"
    title = html.escape(items_doc.get("title") or "Survey")
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<title>{title}</title>
<!-- MaxDiff survey, single-file build of study "{html.escape(design['studyId'])}" ({mode} mode). Built by design/build_html.py. -->
<style>
{css}
</style>
</head>
<body>
<main id="app" aria-live="polite"><p class="muted">Loading…</p></main>
<noscript><p>Please open this file in a web browser with JavaScript enabled (Edge, Chrome, Firefox or Safari).</p></noscript>
<script>window.MAXDIFF_EMBED = {safe_script(json.dumps(embed, ensure_ascii=False))};</script>
{firebase_tag}<script type="module">
{safe_script(app)}
</script>
</body>
</html>
"""


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("items_file", type=Path, help="<studyId>.items.json (wording)")
    p.add_argument("--design", type=Path, default=None,
                   help="<studyId>.design.json (default: next to the items file)")
    p.add_argument("--mode", choices=MODES, default="live",
                   help="live saves answers to Firestore; test saves nothing and shows the record "
                        "at the end; offline makes no network call, the respondent sends the result back")
    p.add_argument("--out", type=Path, default=None, help="default: dist/<studyId>[-test|-offline].html")
    p.add_argument("--emulator", action="store_true", help=argparse.SUPPRESS)  # developer testing only
    a = p.parse_args(argv)

    items_doc = json.loads(a.items_file.read_text(encoding="utf-8"))
    sid = items_doc["studyId"]
    design_path = a.design or a.items_file.with_name(f"{sid}.design.json")
    design = json.loads(design_path.read_text(encoding="utf-8"))
    out = a.out or ROOT / "dist" / (f"{sid}.html" if a.mode == "live" else f"{sid}-{a.mode}.html")
    out = out.expanduser()
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(build_html(items_doc, design, a.mode, a.emulator), encoding="utf-8")
    kb = out.stat().st_size / 1024
    print(f"Wrote {out} ({kb:.0f} KB, {a.mode} mode). It contains the wording: share it only internally.")
    if a.mode == "offline" and not items_doc.get("contact"):
        print('Tip: add "contact": "<your name>" to the items file so the end screen says whom to send the result to.')
    return 0


if __name__ == "__main__":
    sys.exit(main())
