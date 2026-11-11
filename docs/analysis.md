# Batch analysis — `analysis/maxdiff.ipynb`, `models.py`, `export.py`

## Running a batch

1. Open `analysis/maxdiff.ipynb` and set the parameters cell:
   - `STUDY_ID`, `ITEMS_FILE` (local wording; optional, only for labels)
   - `SOURCE = "firestore"` pulls a new batch (needs `CREDENTIALS`, a Firebase service-account key kept outside the repo, and `pip install firebase-admin`), or `SOURCE = "file"` with `RESPONSES_FILE` for an existing batch
   - `EXCLUDE_FLAGGED`, `SEGMENT_QUESTION`
2. Kernel → Restart & Run All.
3. Results: `analysis/output/<study>/` (see docs/data-formats.md §6).

`export.py` can also be run alone: `python analysis/export.py <study> --credentials <key.json>`. The Firestore pull is written but **not yet tested against a live project**; that happens in the Firebase build step.

## Notebook sections

| Section | What it shows |
| --- | --- |
| 1. Data quality | completes, median duration, speeders, straight-liners; flagged respondents are dropped when `EXCLUDE_FLAGGED` |
| 2. Count scores | (best − worst) ÷ shown per item, −1…+1, bootstrap 95% CI |
| 3. Logit | utilities, share of preference with 95% CI, model fit — the default for reporting |
| 4. Segments | share of preference per option of one segment question (options with < 20 respondents skipped) |
| 5. Validation | simulated data only: rank correlation with the true utilities |

## Methods

**Counts.** score_i = (best_i − worst_i) ÷ shown_i. Simple and robust at any sample size. The CI resamples whole respondents 1,000 times.

**Sequential best-worst logit.** On each screen S the respondent first picks best, then worst from the remaining items:

```
P(best = i | S)        = exp(u_i)  / Σ_{j∈S} exp(u_j)
P(worst = w | S \ {i}) = exp(−u_w) / Σ_{j∈S\{i}} exp(−u_j)
```

Utilities u are fitted by maximum likelihood (scipy L-BFGS-B, analytic gradient). One item (the first id) is fixed at 0. Standard errors come from the inverse information matrix.

**Share of preference** = 100 × exp(u_i) ÷ Σ exp(u_j): the chance item i is picked as best if all items were shown together. Sums to 100. CIs come from 4,000 draws of the utilities from their estimated distribution.

**McFadden R²** = 1 − LL ÷ LL(random). Values of 0.1–0.3 are normal for MaxDiff.

**Quality flags.** Speeder: median time per screen under 2 s. Straight-liner: same on-screen position chosen as best (or worst) on every screen; since positions are shuffled, that means the person was not reading.

## How to read results

- Rank by share of preference; items whose CIs overlap are not clearly different.
- A share of 10% is twice as preferred as 5% (ratio scale) — that is the main advantage over rating scales.
- Count scores and logit shares should give nearly the same ranking; a big disagreement points to a data problem.

## Not included yet

Hierarchical Bayes (individual-level utilities via PyMC) is in the backlog; the logit gives group-level results only.

## Tests

`python -m pytest -q` from the repo root: design balance for several sizes, ids-only checks, speeder detection, ranking recovery (rank correlation > 0.95), segment effect detection.
