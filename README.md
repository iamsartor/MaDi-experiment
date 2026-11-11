# MaxDiff Toolbox

A small, self-hosted toolkit for running MaxDiff (Best-Worst Scaling) studies without a paid survey platform.

**Status (11 Nov 2026):** offline core done and tested: design generator, respondent simulator, batch analysis notebook. Not built yet: the survey page and the Firebase setup (`survey/`, `firebase/` are empty placeholders).

## How it fits together

```
items file (local, confidential wording)
   │ ids only
   ▼
design/generate_design.py ──► <study>.design.json  (Firestore-ready config, ids only)
                                   │
                    survey page (next step) shows wording, writes responses (ids only) to Firestore
                                   │
analysis/export.py  ◄── pulls one batch of responses ──┘
   │
   ▼
analysis/maxdiff.ipynb ──► scores CSV + charts, wording joined back in locally
```

`tools/simulate_respondents.py` stands in for real respondents, so the whole chain can be tested before anything goes online.

## The confidentiality rule

Item and question **wording never goes to Firebase**. Every study has two files:

| File | Contains | Goes where |
| --- | --- | --- |
| `design/studies/<study>.items.json` | wording of title, intro, question, items, segment questions | stays on your machine; later also served with the survey page |
| `design/studies/<study>.design.json` | item ids, set size, design versions, segment option ids | uploaded to Firestore |

Responses in Firestore hold ids only (`"best": "I07"`). The notebook joins wording back from the local items file just for labels. A test (`tests/test_pipeline.py`) fails if wording ever appears in a config or response.

`.gitignore` excludes every `*.items.json` except the demo, so real wording does not land in a git repo by accident. Until encryption is built (backlog), the items file served with the survey page would be readable by anyone who has its URL.

## Quickstart

Requires Python 3.10+.

```bash
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 1. Design: balanced screens for the demo study (16 restaurant items, 4 per screen)
python design/generate_design.py design/studies/restaurant-demo.items.json --seed 42

# 2. Fake respondents with known preferences
python tools/simulate_respondents.py design/studies/restaurant-demo.design.json \
    --n 300 --seed 7 \
    --true-utils design/studies/restaurant-demo.true-utils.json \
    --segment-effects design/studies/restaurant-demo.segment-effects.json \
    --out analysis/data/restaurant-demo.simulated.jsonl

# 3. Analysis: open and run all cells
cd analysis && jupyter notebook maxdiff.ipynb

# Tests
python -m pytest -q
```

## New study

1. Copy `design/studies/restaurant-demo.items.json` to `design/studies/<your-study>.items.json`, set `studyId` and the wording. Use neutral ids (`I01`, `I02` …) that reveal nothing.
2. Run the design generator on it and check the report says **PASS**.
3. Run the simulator on the new design and the notebook on its output, to see the screens and charts before going live.
4. (Next build steps) upload the design to Firestore, publish the survey link, then pull batches with `analysis/export.py` or straight from the notebook (`SOURCE = "firestore"`).

## Folder map

| Path | What |
| --- | --- |
| `design/generate_design.py` | balanced design generator + balance report → [docs/design-generator.md](docs/design-generator.md) |
| `design/studies/` | per-study items files (local), design files, demo truth files |
| `tools/simulate_respondents.py` | fake respondents with known utilities → [docs/simulator.md](docs/simulator.md) |
| `analysis/models.py` | scoring, logit model, segments, charts → [docs/analysis.md](docs/analysis.md) |
| `analysis/export.py` | pulls one batch of responses from Firestore |
| `analysis/maxdiff.ipynb` | the batch analysis notebook |
| `analysis/data/` | response batches (`.jsonl`) |
| `analysis/output/<study>/` | scores CSVs and charts |
| `tests/` | end-to-end tests |
| `survey/`, `firebase/` | next build step |
| [docs/data-formats.md](docs/data-formats.md) | every file and document format |

Architecture and decisions: the Claude Doc "MaxDiff Survey Tool – Architecture".

## Backlog

- Survey page and Firebase setup (next)
- Encrypt the items file served with the survey (key in the link after `#`)
- Panel completion redirect and `?src=` tracking
- Live results view
- Save partial responses to measure drop-off
- Even version assignment instead of random
- Hierarchical Bayes (individual-level utilities)
