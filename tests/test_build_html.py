"""Tests for the single-file HTML build and the items checker."""
import copy
import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "design"))

import build_html     # noqa: E402
import check_items    # noqa: E402

ITEMS = json.loads((ROOT / "design/studies/restaurant-demo.items.json").read_text())
DESIGN = json.loads((ROOT / "design/studies/restaurant-demo.design.json").read_text())


def test_demo_items_pass_the_checker():
    assert check_items.check(ITEMS) == []


@pytest.mark.parametrize("mutate,expected", [
    (lambda d: d["items"].append({"id": "I01", "text": "dup id"}), "used twice"),
    (lambda d: d["items"].__setitem__(0, {"id": "A", "text": "x"}), "I01, I02"),
    (lambda d: d["question"].pop("prompt"), "question.prompt"),
    (lambda d: d.__setitem__("studyId", "My Study"), "studyId"),
    (lambda d: d["segmentQuestions"][0]["options"].__setitem__(0, {"id": "O9", "text": ""}), "has no text"),
    (lambda d: d.__setitem__("contact", ""), "contact"),
])
def test_checker_reports_problems(mutate, expected):
    d = copy.deepcopy(ITEMS)
    mutate(d)
    assert any(expected in p for p in check_items.check(d))


def test_single_file_contains_everything_and_nothing_external():
    html = build_html.build_html(ITEMS, DESIGN, mode="test")
    assert "window.MAXDIFF_EMBED" in html and "FirebaseLite" in html
    assert ITEMS["items"][0]["text"] in html          # wording is embedded
    assert 'src="' not in html and "<link" not in html  # no external files
    embed = json.loads(html.split("window.MAXDIFF_EMBED = ", 1)[1].split(";</script>", 1)[0])
    assert embed["mode"] == "test" and embed["emulator"] is False
    assert embed["design"]["versions"] == DESIGN["versions"]
    assert embed["firebaseConfig"]["projectId"] == "madi-experiment"


def test_build_refuses_mismatched_design():
    d = copy.deepcopy(DESIGN)
    d["itemIds"] = d["itemIds"][:-1]
    with pytest.raises(SystemExit):
        build_html.build_html(ITEMS, d)


def _embed(html):
    return json.loads(html.split("window.MAXDIFF_EMBED = ", 1)[1].split(";</script>", 1)[0])


def test_offline_build_has_no_firebase_and_nothing_external():
    html = build_html.build_html(ITEMS, DESIGN, mode="offline")
    assert '"mode": "offline"' in html
    assert '"firebaseConfig": null' in html
    embed = _embed(html)
    assert embed["mode"] == "offline" and embed["firebaseConfig"] is None and embed["emulator"] is False
    assert "FirebaseLite" not in html and "firestore.googleapis.com" not in html
    assert "firebase-lite" not in html and "firebase-config" not in html  # no file or module loads
    assert 'src="' not in html and "<link" not in html
    assert "Offline mode makes no network calls" in html  # Firebase block replaced by the stub


def test_offline_contact_is_embedded_only_when_given():
    assert _embed(build_html.build_html(ITEMS, DESIGN, mode="offline"))["contact"] is None
    with_contact = {**ITEMS, "contact": "  Jane Doe "}
    assert _embed(build_html.build_html(with_contact, DESIGN, mode="offline"))["contact"] == "Jane Doe"
    assert "contact" not in _embed(build_html.build_html(with_contact, DESIGN, mode="live"))


def test_live_and_test_builds_unchanged_by_offline_mode():
    for mode in ("live", "test"):
        html = build_html.build_html(ITEMS, DESIGN, mode=mode)
        assert "var FirebaseLite=" in html and "firebase-block-start" in html


def test_build_cli_default_output_name(tmp_path, monkeypatch):
    monkeypatch.setattr(build_html, "ROOT", tmp_path)
    build_html.main([str(ROOT / "design/studies/restaurant-demo.items.json"), "--mode", "offline"])
    assert (tmp_path / "dist" / "restaurant-demo-offline.html").exists()
