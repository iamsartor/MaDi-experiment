"""Tests for analysis/collect_offline.py and the offline result (ids only)."""
import copy
import json
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "analysis"))
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "design"))

import collect_offline as co        # noqa: E402
import models                       # noqa: E402
import simulate_respondents as sim  # noqa: E402

STUDY = "restaurant-demo"
DESIGN = json.loads((ROOT / f"design/studies/{STUDY}.design.json").read_text())
ITEMS = json.loads((ROOT / f"design/studies/{STUDY}.items.json").read_text())


def offline_results(n=3, seed=11):
    """Simulated respondents shaped like the offline survey page writes them."""
    responses, _ = sim.simulate(DESIGN, n, seed=seed)
    out = []
    for r in responses:
        r = {k: v for k, v in r.items() if k != "createdAt"}  # the page sends no timestamp
        r["client"] = {"mobile": r["client"]["mobile"], "offline": True}
        out.append(r)
    return out


def line(r):
    """Exactly what the page saves and copies: compact JSON plus a newline."""
    return json.dumps(r, separators=(",", ":"), ensure_ascii=False) + "\n"


def run(folder):
    return co.collect(folder, STUDY, DESIGN)


def test_valid_file_gives_one_line(tmp_path):
    r = offline_results(1)[0]
    (tmp_path / "anna.json").write_text(line(r), encoding="utf-8")
    out = tmp_path / "batch.jsonl"
    assert co.main([str(tmp_path), "--study", STUDY, "--design",
                    str(ROOT / f"design/studies/{STUDY}.design.json"), "--out", str(out)]) == 0
    lines = out.read_text(encoding="utf-8").splitlines()
    assert len(lines) == 1
    got = json.loads(lines[0])
    assert got["_id"] == "anna" and got["answers"] == r["answers"] and got["client"]["offline"] is True
    # the notebook reads it as is
    assert models.load_responses(out)[0]["_id"] == "anna"


def test_pretty_printed_smart_quotes_bom_and_multi_line_txt(tmp_path):
    a, b, c = offline_results(3)
    pretty = json.dumps(a, indent=2)
    smart = "﻿  " + pretty.replace('"', "“", 1).replace('"', "”") + "\n\n"
    (tmp_path / "pasted-anna.txt").write_text(smart, encoding="utf-8")
    (tmp_path / "pasted-two.txt").write_text(
        line(b).replace('"', "„") + " \n" + line(c), encoding="utf-8")
    valid, invalid, dups, nfiles = run(tmp_path)
    assert nfiles == 2 and invalid == [] and dups == []
    assert sorted(r["_id"] for r in valid) == ["pasted-anna", "pasted-two-1", "pasted-two-2"]


def test_wrapped_long_line_is_joined(tmp_path):
    text = line(offline_results(1)[0])
    (tmp_path / "wrapped.txt").write_text("\n".join(text[i:i + 70] for i in range(0, len(text), 70)))
    valid, invalid, _, _ = run(tmp_path)
    assert len(valid) == 1 and invalid == []


def test_duplicate_file_and_pasted_text_dropped(tmp_path):
    r = offline_results(1)[0]
    (tmp_path / "anna.json").write_text(line(r), encoding="utf-8")
    (tmp_path / "anna-teams.txt").write_text(json.dumps(r, indent=2).replace('"', "“"), encoding="utf-8")
    valid, invalid, dups, nfiles = run(tmp_path)
    assert nfiles == 2 and len(valid) == 1 and invalid == []
    assert valid[0]["_id"] == "anna" and dups == [("anna-teams.txt", "anna.json")]


def _tamper_set(r):
    r["answers"][0]["set"][0] = next(i for i in DESIGN["itemIds"] if i not in r["answers"][0]["set"])


def _same_screen_twice(r):
    r["answers"][1] = copy.deepcopy(r["answers"][0])


@pytest.mark.parametrize("mutate,reason", [
    (lambda r: r.__setitem__("studyId", "other-study"), "studyId"),
    (lambda r: r.__setitem__("version", 999), "version 999"),
    (_tamper_set, "not a screen of version"),
    (_same_screen_twice, "not a screen of version"),
    (lambda r: r["answers"][0].__setitem__("worst", r["answers"][0]["best"]), "best and worst are the same"),
    (lambda r: r["answers"][0].__setitem__("best", "I99"), "not in the set"),
    (lambda r: r["answers"].pop(), "answers, expected"),
    (lambda r: r["segments"].__setitem__("S1", "O9"), "segment answer"),
])
def test_invalid_results_rejected_with_reason(tmp_path, mutate, reason):
    r = offline_results(1)[0]
    mutate(r)
    (tmp_path / "bad.json").write_text(line(r), encoding="utf-8")
    (tmp_path / "junk.txt").write_text("Hi Michael, here is my result!", encoding="utf-8")
    valid, invalid, _, _ = run(tmp_path)
    assert valid == []
    reasons = dict(invalid)
    assert reason in reasons["bad.json"]
    assert "not valid JSON" in reasons["junk.txt"]


def test_no_wording_in_offline_results_or_batch(tmp_path):
    texts = [it["text"] for it in ITEMS["items"]]
    texts += [ITEMS["title"], ITEMS["intro"], *ITEMS["question"].values()]
    texts += [q["text"] for q in ITEMS["segmentQuestions"]]
    texts += [o["text"] for q in ITEMS["segmentQuestions"] for o in q["options"]]
    for n, r in enumerate(offline_results(5)):
        (tmp_path / f"r{n}.json").write_text(line(r), encoding="utf-8")
    out = tmp_path / "out" / "batch.jsonl"
    co.main([str(tmp_path), "--study", STUDY, "--design",
             str(ROOT / f"design/studies/{STUDY}.design.json"), "--out", str(out)])
    batch = out.read_text(encoding="utf-8")
    for t in texts:
        assert t not in batch


def _playwright_available():
    if not shutil.which("node"):
        return False
    return subprocess.run(["node", "-e", "require('playwright')"], capture_output=True).returncode == 0


@pytest.mark.skipif(not _playwright_available(), reason="needs node with Playwright")
def test_browser_offline_saved_and_copied_text_has_no_wording(tmp_path):
    """Runs tests/browser/e2e_file.js on an offline build (no network allowed) and
    checks the real saved and copied result: one line, ids only, collectable."""
    import build_html
    (tmp_path / "html").mkdir()
    (tmp_path / "html" / f"{STUDY}-offline.html").write_text(
        build_html.build_html(ITEMS, DESIGN, mode="offline"), encoding="utf-8")
    p = subprocess.run(["node", str(ROOT / "tests/browser/e2e_file.js"), str(tmp_path)],
                       capture_output=True, text=True, timeout=180)
    assert p.returncode == 0, p.stdout + p.stderr
    saved = (tmp_path / "offline-saved.json").read_text(encoding="utf-8")
    copied = (tmp_path / "offline-copied.txt").read_text(encoding="utf-8")
    assert saved == copied and saved.count("\n") == 1 and saved.endswith("\n")
    wording = [it["text"] for it in ITEMS["items"]] + [ITEMS["title"], ITEMS["question"]["prompt"]]
    wording += [o["text"] for q in ITEMS["segmentQuestions"] for o in q["options"]]
    for t in wording:
        assert t not in saved
    r = json.loads(saved)
    assert set(r) == {"studyId", "version", "answers", "segments", "durationSec", "client"}
    assert set(r["client"]) == {"mobile", "offline"}
    # the saved file and the pasted text, as Michael would collect them
    folder = tmp_path / "inbox"
    folder.mkdir()
    (folder / "anna.json").write_text(saved, encoding="utf-8")
    (folder / "anna-teams.txt").write_text(copied.replace('"', "“"), encoding="utf-8")
    valid, invalid, dups, _ = co.collect(folder, STUDY, DESIGN)
    assert (len(valid), len(invalid), len(dups)) == (1, 0, 1)
