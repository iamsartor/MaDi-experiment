"""Tests for the survey link builder and the upload guard (no network needed)."""
import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "design"))

import make_link      # noqa: E402
import upload_study   # noqa: E402

ITEMS = json.loads((ROOT / "design/studies/restaurant-demo.items.json").read_text())


def test_link_roundtrip_and_shape():
    link = make_link.build_link(ITEMS, base="https://example.org/survey/")
    assert link.startswith("https://example.org/survey/?study=restaurant-demo#w=")
    query, token = link.split("#w=")
    # wording only after "#": the part a browser sends to servers has none
    for it in ITEMS["items"]:
        assert it["text"] not in query
    assert make_link.decode(token) == make_link.wording_payload(ITEMS)
    assert len(link) < 2000


def test_link_modes():
    assert "&mode=test" in make_link.build_link(ITEMS, mode="test")
    assert "&mode=" not in make_link.build_link(ITEMS, mode="live")


def test_upload_refuses_wording_fields():
    cfg = json.loads((ROOT / "design/studies/restaurant-demo.design.json").read_text())
    upload_study.check_ids_only(cfg)  # passes
    with pytest.raises(SystemExit):
        upload_study.check_ids_only({**cfg, "items": ITEMS["items"]})
