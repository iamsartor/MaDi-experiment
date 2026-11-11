"""MaxDiff analysis functions used by maxdiff.ipynb.

Everything starts from the response documents (ids only). Item wording is
joined in at the very end, from the local items file, for labels only.

Main functions, in the order the notebook uses them:
    load_items(path)              wording lookup from <studyId>.items.json
    load_responses(path)          responses from a .jsonl batch file
    quality_flags(responses)      speeders and straight-liners
    to_long(responses)            long table: one row per item per screen
    count_scores(long)            level 1: (best - worst) / shown, bootstrap CI
    fit_mnl(long)                 level 2: sequential best-worst logit (MLE)
    preference_shares(fit)        utilities -> share of preference with CI
    segment_scores(long, q)       counts and shares per segment option
    plot_ranked(df, ...)          ranked horizontal bar chart with CIs

See docs/analysis.md for the method and how to read the outputs.
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.optimize import minimize
from scipy.special import logsumexp


# --------------------------------------------------------------------------
# Loading
# --------------------------------------------------------------------------

def load_items(path):
    """Return {"items": {id: text}, "segments": {qid: {"text":..., "options": {oid: text}}}, ...}.

    Returns id-only labels if the file does not exist, so the analysis still
    runs on a machine that does not hold the confidential wording.
    """
    path = Path(path) if path else None
    if not path or not path.exists():
        return {"items": {}, "segments": {}, "question": {}, "title": ""}
    doc = json.loads(path.read_text(encoding="utf-8"))
    return {
        "title": doc.get("title", ""),
        "question": doc.get("question", {}),
        "items": {it["id"]: it["text"] for it in doc["items"]},
        "segments": {
            q["id"]: {"text": q.get("text", q["id"]),
                      "options": {o["id"]: o.get("text", o["id"]) for o in q["options"]}}
            for q in doc.get("segmentQuestions", [])
        },
    }


def load_responses(path):
    """Read a JSONL batch (one response document per line)."""
    out = []
    with Path(path).open(encoding="utf-8") as f:
        for n, line in enumerate(f):
            line = line.strip()
            if line:
                r = json.loads(line)
                r.setdefault("_id", f"r{n:05d}")
                out.append(r)
    return out


def label(item_id, labels):
    text = labels.get("items", {}).get(item_id) if labels else None
    return f"{item_id} {text}" if text else item_id


# --------------------------------------------------------------------------
# Data quality
# --------------------------------------------------------------------------

def quality_flags(responses, min_median_ms=2000):
    """One row per respondent with quality flags.

    speeder        median time per screen below `min_median_ms`
    straightliner  picked the same on-screen position as "best" on every screen
                   (positions are shuffled, so this signals no real reading)
    flagged        either of the above
    """
    rows = []
    for r in responses:
        ans = r["answers"]
        ms = [a.get("ms", np.nan) for a in ans]
        best_pos = [a["set"].index(a["best"]) for a in ans]
        worst_pos = [a["set"].index(a["worst"]) for a in ans]
        straight = len(ans) >= 4 and (len(set(best_pos)) == 1 or len(set(worst_pos)) == 1)
        med = float(np.nanmedian(ms)) if ans else np.nan
        rows.append({
            "respondent": r["_id"],
            "screens": len(ans),
            "median_ms": med,
            "duration_sec": r.get("durationSec"),
            "speeder": bool(med < min_median_ms),
            "straightliner": bool(straight),
        })
    df = pd.DataFrame(rows)
    df["flagged"] = df["speeder"] | df["straightliner"]
    return df


# --------------------------------------------------------------------------
# Long table
# --------------------------------------------------------------------------

def to_long(responses):
    """Long table: respondent, version, screen, position, item, shown, best, worst, seg_<qid>..."""
    rows = []
    for r in responses:
        segs = {f"seg_{k}": v for k, v in (r.get("segments") or {}).items()}
        for s, a in enumerate(r["answers"]):
            if a["best"] == a["worst"]:
                continue  # invalid screen; the survey page should prevent this
            for pos, item in enumerate(a["set"]):
                rows.append({
                    "respondent": r["_id"], "version": r.get("version"),
                    "screen": s, "position": pos, "item": item, "shown": 1,
                    "best": int(item == a["best"]), "worst": int(item == a["worst"]),
                    **segs,
                })
    return pd.DataFrame(rows)


# --------------------------------------------------------------------------
# Level 1: counts
# --------------------------------------------------------------------------

def count_scores(long, n_boot=1000, seed=0, ci=0.95):
    """Best-minus-worst score per item, from -1 (always worst) to +1 (always best).

    The confidence interval resamples whole respondents (bootstrap).
    """
    per = long.groupby(["respondent", "item"])[["shown", "best", "worst"]].sum()
    shown = per["shown"].unstack(fill_value=0)
    bw = (per["best"] - per["worst"]).unstack(fill_value=0)
    items = list(shown.columns)
    S, B = shown.to_numpy(float), bw.to_numpy(float)
    point = B.sum(0) / S.sum(0)
    rng = np.random.default_rng(seed)
    n = S.shape[0]
    boots = np.empty((n_boot, len(items)))
    for b in range(n_boot):
        idx = rng.integers(0, n, n)
        boots[b] = B[idx].sum(0) / np.maximum(S[idx].sum(0), 1)
    lo, hi = np.quantile(boots, [(1 - ci) / 2, 1 - (1 - ci) / 2], axis=0)
    tot = long.groupby("item")[["shown", "best", "worst"]].sum().reindex(items)
    out = pd.DataFrame({
        "item": items, "shown": tot["shown"].values, "best": tot["best"].values,
        "worst": tot["worst"].values, "score": point, "ci_low": lo, "ci_high": hi,
    })
    return out.sort_values("score", ascending=False).reset_index(drop=True)


# --------------------------------------------------------------------------
# Level 2: sequential best-worst multinomial logit
# --------------------------------------------------------------------------

def _tasks(long, items):
    """Arrays for the logit: S (tasks x k item indices), b, w (positions of best/worst)."""
    pos = {it: i for i, it in enumerate(items)}
    g = long.sort_values(["respondent", "screen", "position"]).groupby(["respondent", "screen"], sort=False)
    sizes = g.size()
    if sizes.nunique() != 1:
        raise ValueError("All screens must show the same number of items.")
    k = int(sizes.iloc[0])
    item_idx = long.sort_values(["respondent", "screen", "position"])["item"].map(pos).to_numpy()
    srt = long.sort_values(["respondent", "screen", "position"])
    S = item_idx.reshape(-1, k)
    b = srt["best"].to_numpy().reshape(-1, k).argmax(1)
    w = srt["worst"].to_numpy().reshape(-1, k).argmax(1)
    return S, b, w


def _nll_grad(u, S, b, w):
    T, k = S.shape
    rows = np.arange(T)
    U = u[S]
    # best: P(best = j) = exp(U_j) / sum exp(U)
    lse_b = logsumexp(U, axis=1)
    p = np.exp(U - lse_b[:, None])
    # worst among the remaining items: P(worst = j) = exp(-U_j) / sum_{rest} exp(-U)
    negU = -U.copy()
    negU[rows, b] = -np.inf
    lse_w = logsumexp(negU, axis=1)
    q = np.exp(negU - lse_w[:, None])
    nll = np.sum(lse_b - U[rows, b]) + np.sum(lse_w + U[rows, w])
    g = np.zeros_like(u)
    np.add.at(g, S, p - q)
    np.add.at(g, S[rows, b], -1.0)
    np.add.at(g, S[rows, w], 1.0)
    return nll, g, p, q


def fit_mnl(long, reference=None):
    """Fit item utilities by maximum likelihood.

    One item (`reference`, default: the first item id in sort order) is fixed
    at utility 0; all other utilities are relative to it. Standard errors come
    from the inverse of the information matrix.

    Returns dict: items, utilities (Series), se (Series), cov (ndarray), loglik,
    loglik_null, tasks, respondents, converged.
    """
    items = sorted(long["item"].unique())
    reference = reference or items[0]
    r = items.index(reference)
    free = [i for i in range(len(items)) if i != r]
    S, b, w = _tasks(long, items)

    def f(x):
        u = np.zeros(len(items))
        u[free] = x
        nll, g, _, _ = _nll_grad(u, S, b, w)
        return nll, g[free]

    res = minimize(f, np.zeros(len(free)), jac=True, method="L-BFGS-B")
    u = np.zeros(len(items))
    u[free] = res.x
    _, _, p, q = _nll_grad(u, S, b, w)

    # Information matrix: sum over choices of diag(p) - p p^T, for best and worst
    n = len(items)
    H = np.zeros((n, n))
    k = S.shape[1]
    for probs in (p, q):
        for a in range(k):
            np.add.at(H, (S[:, a], S[:, a]), probs[:, a])
            for c in range(k):
                np.add.at(H, (S[:, a], S[:, c]), -probs[:, a] * probs[:, c])
    Hf = H[np.ix_(free, free)]
    cov = np.zeros((n, n))
    cov[np.ix_(free, free)] = np.linalg.inv(Hf)
    se = np.sqrt(np.diag(cov))

    T = S.shape[0]
    ll_null = -T * (np.log(k) + np.log(k - 1))
    return {
        "items": items, "reference": reference,
        "utilities": pd.Series(u, index=items), "se": pd.Series(se, index=items),
        "cov": cov, "loglik": -res.fun, "loglik_null": ll_null,
        "tasks": T, "respondents": long["respondent"].nunique(),
        "converged": bool(res.success),
    }


def preference_shares(fit, n_draws=4000, seed=0, ci=0.95):
    """Share of preference (sums to 100) with CIs from draws of the utility estimates."""
    u, cov, items = fit["utilities"].to_numpy(), fit["cov"], fit["items"]
    share = 100 * np.exp(u) / np.exp(u).sum()
    rng = np.random.default_rng(seed)
    draws = rng.multivariate_normal(u, cov, size=n_draws, check_valid="ignore")
    sd = 100 * np.exp(draws) / np.exp(draws).sum(1, keepdims=True)
    lo, hi = np.quantile(sd, [(1 - ci) / 2, 1 - (1 - ci) / 2], axis=0)
    out = pd.DataFrame({
        "item": items, "utility": u, "utility_se": fit["se"].to_numpy(),
        "share": share, "share_low": lo, "share_high": hi,
    })
    out = out.sort_values("share", ascending=False).reset_index(drop=True)
    out.insert(0, "rank", np.arange(1, len(out) + 1))
    return out


# --------------------------------------------------------------------------
# Segments
# --------------------------------------------------------------------------

def segment_scores(long, question_id, min_respondents=20):
    """Share of preference per option of one segment question (wide table: item x option).

    Options with fewer than `min_respondents` respondents are skipped.
    """
    col = f"seg_{question_id}"
    if col not in long:
        raise KeyError(f"No segment column {col}")
    out = {}
    counts = {}
    for opt, sub in long.groupby(col):
        nresp = sub["respondent"].nunique()
        counts[opt] = nresp
        if nresp < min_respondents:
            continue
        out[opt] = preference_shares(fit_mnl(sub)).set_index("item")["share"]
    df = pd.DataFrame(out)
    return df, counts


# --------------------------------------------------------------------------
# Charts
# --------------------------------------------------------------------------

def plot_ranked(df, value, low, high, labels=None, title="", xlabel="", ax=None):
    """Ranked horizontal bar chart with CI whiskers; highest value on top."""
    import matplotlib.pyplot as plt

    d = df.sort_values(value, ascending=True)
    names = [label(i, labels) for i in d["item"]]
    if ax is None:
        _, ax = plt.subplots(figsize=(8, 0.38 * len(d) + 1.2))
    err = np.vstack([d[value] - d[low], d[high] - d[value]])
    ax.barh(names, d[value], color="#3b6ea5", alpha=0.85)
    ax.errorbar(d[value], names, xerr=err, fmt="none", ecolor="#333", capsize=3, lw=1)
    ax.set_title(title, loc="left")
    ax.set_xlabel(xlabel)
    ax.spines[["top", "right"]].set_visible(False)
    ax.axvline(0, color="#999", lw=0.8)
    plt.tight_layout()
    return ax
