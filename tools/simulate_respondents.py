#!/usr/bin/env python3
"""Simulate MaxDiff respondents with known "true" preferences.

Used to prove the analysis before any real respondent sees the survey: if the
notebook recovers the true ranking from simulated answers, the pipeline works.

Each simulated respondent behaves like the survey page will:
  - gets a random design version,
  - sees screens in shuffled order and items in shuffled order,
  - picks best and worst following the sequential best-worst logit model,
  - answers the segment questions.

Output is one JSON object per line (JSONL) in exactly the response format the
survey page writes to Firestore (ids only). See docs/data-formats.md.

Usage:
    python tools/simulate_respondents.py design/studies/restaurant-demo.design.json \
        --n 300 --seed 7 --out analysis/data/restaurant-demo.simulated.jsonl

Writes the responses and a "<out>.truth.json" with the true utilities used.
"""
from __future__ import annotations

import argparse
import json
import math
import random
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path


def sample_choice(rng, items, utils, sign=1.0):
    """Pick one item with probability proportional to exp(sign * utility)."""
    w = [math.exp(sign * utils[i]) for i in items]
    r = rng.random() * sum(w)
    acc = 0.0
    for i, wi in zip(items, w):
        acc += wi
        if r <= acc:
            return i
    return items[-1]


def simulate(config, n, seed=None, true_utils=None, heterogeneity=0.5,
             segment_effects=None, speeder_share=0.05):
    """Return (responses, truth).

    true_utils     dict item -> mean utility; random N(0, 1) if not given
    heterogeneity  sd of each respondent's personal deviation from the mean
    segment_effects  {questionId: {optionId: {itemId: shift}}} added to utilities
    speeder_share  share of respondents who click at random and fast
                   (they should be caught by the quality flags)
    """
    rng = random.Random(seed)
    ids = config["itemIds"]
    if true_utils is None:
        true_utils = {i: rng.gauss(0, 1) for i in ids}
        ref = true_utils[ids[0]]
        true_utils = {i: u - ref for i, u in true_utils.items()}  # first item = 0
    segment_effects = segment_effects or {}
    start = datetime(2026, 11, 1, 9, 0, tzinfo=timezone.utc)
    responses = []
    for r in range(n):
        v = rng.randrange(len(config["versions"]))
        screens = [list(s["items"]) for s in config["versions"][v]["screens"]]
        rng.shuffle(screens)
        segments = {q["id"]: rng.choice(q["options"]) for q in config.get("segmentQuestions", [])}
        utils = {i: true_utils[i] + rng.gauss(0, heterogeneity) for i in ids}
        for qid, opt in segments.items():
            for item, shift in segment_effects.get(qid, {}).get(opt, {}).items():
                utils[item] += shift
        speeder = rng.random() < speeder_share
        answers = []
        for s in screens:
            rng.shuffle(s)
            if speeder:
                best = rng.choice(s)
                worst = rng.choice([x for x in s if x != best])
                ms = int(rng.uniform(600, 1500))
            else:
                best = sample_choice(rng, s, utils, +1)
                worst = sample_choice(rng, [x for x in s if x != best], utils, -1)
                ms = int(max(1500, rng.gauss(6000, 2000)))
            answers.append({"set": s, "best": best, "worst": worst, "ms": ms})
        responses.append({
            "studyId": config["studyId"],
            "version": v,
            "answers": answers,
            "segments": segments,
            "durationSec": round(sum(a["ms"] for a in answers) / 1000 + rng.uniform(10, 30)),
            "client": {"mobile": rng.random() < 0.7, "simulated": True, "speeder": speeder},
            "createdAt": (start + timedelta(minutes=7 * r)).isoformat(timespec="seconds"),
        })
    truth = {
        "trueUtilities": true_utils,
        "heterogeneity": heterogeneity,
        "segmentEffects": segment_effects,
        "speederShare": speeder_share,
        "n": n,
        "seed": seed,
    }
    return responses, truth


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("design_file", type=Path, help="<studyId>.design.json")
    p.add_argument("--n", type=int, default=300, help="respondents (default 300)")
    p.add_argument("--seed", type=int, default=None)
    p.add_argument("--true-utils", type=Path, default=None,
                   help="optional JSON {itemId: utility}; random if omitted")
    p.add_argument("--heterogeneity", type=float, default=0.5)
    p.add_argument("--speeders", type=float, default=0.05, help="share of random fast clickers")
    p.add_argument("--segment-effects", type=Path, default=None,
                   help='optional JSON {"S1": {"O1": {"I11": 1.0}}}')
    p.add_argument("--out", type=Path, required=True, help="output .jsonl")
    a = p.parse_args(argv)

    config = json.loads(a.design_file.read_text(encoding="utf-8"))
    tu = json.loads(a.true_utils.read_text()) if a.true_utils else None
    se = json.loads(a.segment_effects.read_text()) if a.segment_effects else None
    responses, truth = simulate(config, a.n, a.seed, tu, a.heterogeneity, se, a.speeders)

    a.out.parent.mkdir(parents=True, exist_ok=True)
    with a.out.open("w", encoding="utf-8") as f:
        for r in responses:
            f.write(json.dumps(r) + "\n")
    truth_path = a.out.with_suffix(".truth.json")
    truth_path.write_text(json.dumps(truth, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(responses)} responses to {a.out}\nWrote {truth_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
