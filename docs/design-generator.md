# Design generator — `design/generate_design.py`

Turns a list of item ids into balanced screens. The design is what decides data quality, so the generator checks its own work and prints a report.

## Usage

```bash
python design/generate_design.py design/studies/<study>.items.json [options]
```

| Option | Default | Meaning |
| --- | --- | --- |
| `--set-size`, `-k` | 4 | items per screen (3–5 is typical; 3 for very short lists) |
| `--versions` | 10 | different designs; each respondent gets one at random |
| `--screens` | ceil(3 × items ÷ k) | screens per respondent (each item shown ~3×) |
| `--tries` | 200 | candidates built per version; best one kept |
| `--seed` | random | set it to get the same design again |
| `--out-dir` | items file folder | where to write the outputs |

Outputs `<study>.design.json` (Firestore config, ids only) and `<study>.design-report.md`. The exit code is non-zero if a hard rule fails.

## Rules

| Rule | Type | How it is enforced |
| --- | --- | --- |
| No item twice on a screen | hard | candidates exclude items already on the screen |
| Item balance: max − min appearances ≤ 1 per version | hard | each slot picks from the least-shown items |
| Pair balance: pairs shown together as evenly as possible | soft | among least-shown items, pick the one least often paired with the screen so far (this version first, all versions second) |
| Screen and item position | runtime | the survey page shuffles both |

## Algorithm

For each version: build `--tries` candidates greedily (random tie-breaks), score each by the variance of pair co-occurrence counts, keep the best. Pair counts carried across versions make the combined design more even than any single version.

## Reading the report

- **Result PASS/FAIL**: the hard rules.
- **Item min–max** per version: should differ by at most 1.
- **Pairs never together** inside one version is normal: 16 items have 120 pairs but 12 screens of 4 give only 72 pair slots. What matters is the line *across all versions*: pair minimum above 0 and a small spread (demo: min 5, max 7).

## Sizing guide

| Items | k | Screens per respondent |
| --- | --- | --- |
| 8 | 3 | 8 |
| 12 | 4 | 9 |
| 16 | 4 | 12 |
| 20 | 5 | 12 |
| 30 | 5 | 18 |

Rough sample size: at least 100 completes for stable overall scores; around 50 per segment you want to compare.
