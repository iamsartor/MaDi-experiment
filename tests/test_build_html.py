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
