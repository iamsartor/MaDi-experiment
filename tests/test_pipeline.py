"""End-to-end tests: design -> simulated respondents -> analysis recovers the truth.

Run from the repo root:  python -m pytest -q
"""
import json
import sys
from pathlib import Path

import pytest
from scipy.stats import spearmanr

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / "design"), str(ROOT / "tools"), str(ROOT / "analysis")]

import generate_design as gd          # noqa: E402
import simulate_respondents as sim    # noqa: E402
import models as m                    # noqa: E402

ITEMS = json.loads((ROOT / "design/studies/restaurant-demo.items.json").read_text())
IDS = [it["id"] for it in ITEMS["items"]]
TRUE = json.loads((ROOT / "design/studies/restaurant-demo.true-utils.json").read_text())


@pytest.mark.parametrize("n_items,k", [(8, 3), (12, 4), (16, 4), (16, 5), (30, 5), (10, 4)])
def test_design_is_balanced(n_items, k):
    ids = [f"I{i:02d}" for i in range(1, n_items + 1)]
    versions = gd.generate_design(ids, set_size=k, n_versions=5, tries=50, seed=1)
    rep = gd.balance_report(versions, ids)
    assert rep["item_balance_ok"], rep
    assert rep["no_duplicates_ok"], rep
    assert rep["total_pair_min"] > 0, "every pair should meet at least once across versions"


def test_config_contains_ids_only():
    versions = gd.generate_design(IDS, 4, 3, tries=20, seed=1)
    cfg = gd.build_config(ITEMS, versions, 4)
    text = json.dumps(cfg)
    for it in ITEMS["items"]:
        assert it["text"] not in text, "item wording must never reach the Firestore config"
    for q in ITEMS["segmentQuestions"]:
        assert q["text"] not in text
        for o in q["options"]:
            assert o["text"] not in text
    # Firestore rejects arrays nested directly inside arrays
    for v in cfg["versions"]:
        assert isinstance(v, dict)
        for s in v["screens"]:
            assert isinstance(s, dict) and all(isinstance(i, str) for i in s["items"])


@pytest.fixture(scope="module")
def simulated():
    versions = gd.generate_design(IDS, 4, 10, tries=50, seed=3)
    cfg = gd.build_config(ITEMS, versions, 4)
    responses, truth = sim.simulate(cfg, n=300, seed=11, true_utils=TRUE, speeder_share=0.05)
    for n, r in enumerate(responses):
        r["_id"] = f"r{n}"
    return cfg, responses, truth


def test_responses_contain_ids_only(simulated):
    _, responses, _ = simulated
    text = json.dumps(responses)
    for it in ITEMS["items"]:
        assert it["text"] not in text


def test_quality_flags_catch_speeders(simulated):
    _, responses, _ = simulated
    q = m.quality_flags(responses)
    speeders = {r["_id"] for r in responses if r["client"]["speeder"]}
    flagged = set(q.loc[q["flagged"], "respondent"])
    assert speeders <= flagged
    assert len(flagged - speeders) <= 3  # few false alarms


def test_analysis_recovers_true_ranking(simulated):
    _, responses, truth = simulated
    q = m.quality_flags(responses)
    keep = set(q.loc[~q["flagged"], "respondent"])
    long = m.to_long([r for r in responses if r["_id"] in keep])

    fit = m.fit_mnl(long)
    assert fit["converged"]
    est = fit["utilities"]
    rho = spearmanr([TRUE[i] for i in est.index], est.values).statistic
    assert rho > 0.95, rho

    counts = m.count_scores(long, n_boot=200)
    rho_c = spearmanr([TRUE[i] for i in counts["item"]], counts["score"]).statistic
    assert rho_c > 0.95, rho_c

    shares = m.preference_shares(fit)
    assert abs(shares["share"].sum() - 100) < 1e-6
    assert (shares["share_low"] <= shares["share"]).all()
    assert (shares["share"] <= shares["share_high"]).all()


def test_segments_detect_planted_effect():
    versions = gd.generate_design(IDS, 4, 10, tries=50, seed=3)
    cfg = gd.build_config(ITEMS, versions, 4)
    effects = {"S1": {"O1": {"I11": 1.5}}}
    responses, _ = sim.simulate(cfg, n=450, seed=5, true_utils=TRUE,
                                segment_effects=effects, speeder_share=0)
    for n, r in enumerate(responses):
        r["_id"] = f"r{n}"
    seg, _ = m.segment_scores(m.to_long(responses), "S1")
    assert seg.loc["I11", "O1"] > 1.5 * seg.loc["I11", "O2"]
