#!/usr/bin/env python3
"""Generate a balanced MaxDiff design from a study's items file.

Reads only the item IDS from the items file. The output design file contains
ids only and is safe to upload to Firestore; no wording ever leaves the items
file.

Usage:
    python design/generate_design.py design/studies/restaurant-demo.items.json
    python design/generate_design.py ITEMS.json --set-size 4 --versions 10 --seed 1

Writes, next to the items file:
    <studyId>.design.json      the Firestore-ready study config (ids only)
    <studyId>.design-report.md the balance report

See docs/design-generator.md for the rules and the algorithm.
"""
from __future__ import annotations

import argparse
import itertools
import json
import math
import random
import statistics
import sys
from datetime import datetime, timezone
from pathlib import Path


# --------------------------------------------------------------------------
# Core algorithm
# --------------------------------------------------------------------------

def default_screens(n_items: int, set_size: int, appearances: int = 3) -> int:
    """Screens per respondent so that each item is shown about `appearances` times."""
    return max(1, math.ceil(appearances * n_items / set_size))


def _build_version(item_ids, set_size, n_screens, global_pairs, rng):
    """Greedy construction of one version (a list of screens).

    Rules, in priority order:
      1. An item never appears twice on one screen.
      2. Item balance: always pick from the least-shown items, so that
         max - min appearances within the version is at most 1.
      3. Pair balance: among those, prefer items that have been seen together
         least often with the items already on the screen (within this version
         first, across all versions second).
    Ties are broken at random.
    """
    counts = {i: 0 for i in item_ids}
    pairs = {}  # within-version pair counts
    screens = []
    for _ in range(n_screens):
        screen = []
        for _slot in range(set_size):
            free = [i for i in item_ids if i not in screen]
            low = min(counts[i] for i in free)
            cands = [i for i in free if counts[i] == low]

            def cost(i):
                local = sum(pairs.get(frozenset((i, j)), 0) for j in screen)
                glob = sum(global_pairs.get(frozenset((i, j)), 0) for j in screen)
                return (local, glob, rng.random())

            pick = min(cands, key=cost)
            screen.append(pick)
            counts[pick] += 1
        for a, b in itertools.combinations(screen, 2):
            key = frozenset((a, b))
            pairs[key] = pairs.get(key, 0) + 1
        screens.append(screen)
    return screens


def score_version(screens, item_ids):
    """Lower is better. Item balance is a hard rule (returns inf if broken)."""
    counts = {i: 0 for i in item_ids}
    pairs = {frozenset(p): 0 for p in itertools.combinations(item_ids, 2)}
    for s in screens:
        if len(set(s)) != len(s):
            return math.inf
        for i in s:
            counts[i] += 1
        for a, b in itertools.combinations(s, 2):
            pairs[frozenset((a, b))] += 1
    if max(counts.values()) - min(counts.values()) > 1:
        return math.inf
    return statistics.pvariance(list(pairs.values()))


def generate_design(item_ids, set_size=4, n_versions=10, n_screens=None,
                    tries=200, seed=None):
    """Return a list of versions; each version is a list of screens (lists of ids)."""
    item_ids = list(item_ids)
    n = len(item_ids)
    if len(set(item_ids)) != n:
        raise ValueError("Item ids must be unique.")
    if not 2 <= set_size < n:
        raise ValueError(f"Set size must be between 2 and {n - 1} for {n} items.")
    n_screens = n_screens or default_screens(n, set_size)
    rng = random.Random(seed)
    global_pairs = {}
    versions = []
    for _ in range(n_versions):
        best, best_score = None, math.inf
        for _t in range(tries):
            order = item_ids[:]
            rng.shuffle(order)  # random tie order gives different candidates
            cand = _build_version(order, set_size, n_screens, global_pairs, rng)
            sc = score_version(cand, item_ids)
            if sc < best_score:
                best, best_score = cand, sc
        if best is None:
            raise RuntimeError("Could not build a balanced version; try other settings.")
        for s in best:
            for a, b in itertools.combinations(s, 2):
                key = frozenset((a, b))
                global_pairs[key] = global_pairs.get(key, 0) + 1
        versions.append(best)
    return versions


# --------------------------------------------------------------------------
# Report
# --------------------------------------------------------------------------

def balance_report(versions, item_ids):
    """Return a dict of balance statistics for the whole design and per version."""
    per_version = []
    total_counts = {i: 0 for i in item_ids}
    total_pairs = {frozenset(p): 0 for p in itertools.combinations(item_ids, 2)}
    for screens in versions:
        counts = {i: 0 for i in item_ids}
        pairs = {frozenset(p): 0 for p in itertools.combinations(item_ids, 2)}
        dupes = 0
        for s in screens:
            if len(set(s)) != len(s):
                dupes += 1
            for i in s:
                counts[i] += 1
                total_counts[i] += 1
            for a, b in itertools.combinations(s, 2):
                pairs[frozenset((a, b))] += 1
                total_pairs[frozenset((a, b))] += 1
        per_version.append({
            "screens": len(screens),
            "item_min": min(counts.values()),
            "item_max": max(counts.values()),
            "pair_min": min(pairs.values()),
            "pair_max": max(pairs.values()),
            "pairs_never_together": sum(1 for v in pairs.values() if v == 0),
            "screens_with_duplicates": dupes,
        })
    pv = list(total_pairs.values())
    return {
        "items": len(item_ids),
        "versions": len(versions),
        "per_version": per_version,
        "total_item_min": min(total_counts.values()),
        "total_item_max": max(total_counts.values()),
        "total_pair_min": min(pv),
        "total_pair_max": max(pv),
        "total_pair_mean": statistics.mean(pv),
        "total_pair_sd": statistics.pstdev(pv),
        "item_balance_ok": all(v["item_max"] - v["item_min"] <= 1 for v in per_version),
        "no_duplicates_ok": all(v["screens_with_duplicates"] == 0 for v in per_version),
    }


def report_markdown(study_id, set_size, rep):
    ok = "PASS" if rep["item_balance_ok"] and rep["no_duplicates_ok"] else "FAIL"
    lines = [
        f"# Design report: {study_id}",
        "",
        f"**Result: {ok}** — {rep['items']} items, set size {set_size}, "
        f"{rep['versions']} versions, {rep['per_version'][0]['screens']} screens per respondent.",
        "",
        "Across all versions combined:",
        "",
        f"- Item appearances: min {rep['total_item_min']}, max {rep['total_item_max']}",
        f"- Pair co-occurrence: min {rep['total_pair_min']}, max {rep['total_pair_max']}, "
        f"mean {rep['total_pair_mean']:.2f}, sd {rep['total_pair_sd']:.2f}",
        "",
        "| Version | Screens | Item min–max | Pair min–max | Pairs never together | Duplicate screens |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for i, v in enumerate(rep["per_version"]):
        lines.append(
            f"| {i} | {v['screens']} | {v['item_min']}–{v['item_max']} | "
            f"{v['pair_min']}–{v['pair_max']} | {v['pairs_never_together']} | "
            f"{v['screens_with_duplicates']} |"
        )
    lines += [
        "",
        "Rules: item min–max may differ by at most 1 per version (hard rule); "
        "no item twice on a screen (hard rule); pairs as even as possible. "
        "Pairs never seen together inside one version are normal when there are "
        "more pairs than slots; the across-version minimum should be above 0.",
    ]
    return "\n".join(lines) + "\n"


# --------------------------------------------------------------------------
# File I/O
# --------------------------------------------------------------------------

def build_config(items_doc, versions, set_size):
    """Firestore-ready study config. Contains ids only, never wording."""
    segs = [
        {"id": q["id"], "options": [o["id"] for o in q["options"]]}
        for q in items_doc.get("segmentQuestions", [])
    ]
    return {
        "studyId": items_doc["studyId"],
        "status": "draft",
        "setSize": set_size,
        "itemIds": [it["id"] for it in items_doc["items"]],
        "versions": [
            {"version": v, "screens": [{"items": s} for s in screens]}
            for v, screens in enumerate(versions)
        ],
        "segmentQuestions": segs,
        "createdAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("items_file", type=Path, help="<studyId>.items.json")
    p.add_argument("--set-size", "-k", type=int, default=4, help="items per screen (default 4)")
    p.add_argument("--versions", type=int, default=10, help="design versions (default 10)")
    p.add_argument("--screens", type=int, default=None,
                   help="screens per respondent (default: ceil(3 x items / set size))")
    p.add_argument("--tries", type=int, default=200, help="candidates per version (default 200)")
    p.add_argument("--seed", type=int, default=None, help="random seed for a reproducible design")
    p.add_argument("--out-dir", type=Path, default=None, help="default: folder of the items file")
    a = p.parse_args(argv)

    items_doc = json.loads(a.items_file.read_text(encoding="utf-8"))
    ids = [it["id"] for it in items_doc["items"]]
    versions = generate_design(ids, a.set_size, a.versions, a.screens, a.tries, a.seed)
    rep = balance_report(versions, ids)

    out_dir = a.out_dir or a.items_file.parent
    out_dir.mkdir(parents=True, exist_ok=True)
    sid = items_doc["studyId"]
    cfg_path = out_dir / f"{sid}.design.json"
    rep_path = out_dir / f"{sid}.design-report.md"
    cfg_path.write_text(json.dumps(build_config(items_doc, versions, a.set_size), indent=2) + "\n",
                        encoding="utf-8")
    md = report_markdown(sid, a.set_size, rep)
    rep_path.write_text(md, encoding="utf-8")
    print(md)
    print(f"Wrote {cfg_path}\nWrote {rep_path}")
    return 0 if rep["item_balance_ok"] and rep["no_duplicates_ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
