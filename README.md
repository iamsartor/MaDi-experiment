# MaxDiff Toolbox

A small, self-hosted toolkit for running MaxDiff (Best-Worst Scaling) studies without a paid survey platform.

**Status (11 Nov 2026):** design generator, respondent simulator, batch analysis notebook, survey page and Firestore rules are built and tested (locally and against the Firestore emulator). Not yet done: a pilot against the live Firebase project. Setup and running a study: [docs/firebase-setup.md](docs/firebase-setup.md).

**Try the demo:** [restaurant demo survey](https://iamsartor.github.io/MaDi-experiment/examples/restaurant-demo.html) (test mode, saves nothing, dummy content).

## How it fits together

```
items file (local, confidential wording)
   │ ids only
   ▼
design/generate_design.py ──► <study>.design.json  (Firestore-ready config, ids only)
                                   │
   survey link ?study=<id>#w=<wording>: page shows wording, writes responses (ids only) to Firestore
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

Respondents get the wording through the survey link itself: `design/make_link.py` packs it after the `#`, a part of the URL that browsers never send to any server. So the wording is in neither GitHub nor Firebase; only people holding the link can read it. Treat the link as confidential.

Responses in Firestore hold ids only (`"best": "I07"`), and the Firestore rules reject any extra fields. The notebook joins wording back from the local items file just for labels. Tests fail if wording ever appears in a config, a response, or the part of the link sent to servers.

`.gitignore` excludes every `*.items.json` except the demo, so real wording does not land in the (public) repo by accident.

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

Step-by-step guide, including a ready-made AI prompt for the items file: **[docs/new-study.md](docs/new-study.md)**. In short:

1. Copy `design/studies/restaurant-demo.items.json` to `design/studies/<your-study>.items.json`, set `studyId` and the wording. Use neutral ids (`I01`, `I02` …) that reveal nothing.
2. Run the design generator on it and check the report says **PASS**.
3. Run the simulator on the new design and the notebook on its output, to see the screens and charts before going live.
4. Upload the design, test the link, open the study, send the link, analyse batches: [docs/firebase-setup.md](docs/firebase-setup.md#running-a-study).

## Folder map

| Path | What |
| --- | --- |
| `design/generate_design.py` | balanced design generator + balance report → [docs/design-generator.md](docs/design-generator.md) |
| `design/build_html.py` | builds ONE self-contained survey HTML file to share in Teams → [docs/new-study.md](docs/new-study.md) |
| `design/check_items.py` | checks an items file (e.g. one an AI wrote) |
| `design/make_link.py` | builds the survey link with the wording after `#` → [docs/survey.md](docs/survey.md) |
| `design/upload_study.py` | uploads a design to Firestore, changes study status |
| `design/studies/` | per-study items files (local), design files, demo truth files |
| `tools/simulate_respondents.py` | fake respondents with known utilities → [docs/simulator.md](docs/simulator.md) |
| `analysis/models.py` | scoring, logit model, segments, charts → [docs/analysis.md](docs/analysis.md) |
| `analysis/export.py` | pulls one batch of responses from Firestore |
| `analysis/collect_offline.py` | collects results sent back from offline files (saved or pasted) into one batch → [docs/new-study.md](docs/new-study.md#offline-pilot-no-firebase) |
| `analysis/maxdiff.ipynb` | the batch analysis notebook |
| `analysis/data/` | response batches (`.jsonl`) |
| `analysis/output/<study>/` | scores CSVs and charts |
| `survey/` | the survey page (GitHub Pages) → [docs/survey.md](docs/survey.md) |
| `firebase/` | Firestore rules, rules tests → [docs/firebase-setup.md](docs/firebase-setup.md) |
| `tools/build_firebase_bundle.sh` | rebuilds the self-hosted Firebase SDK bundle |
| `tests/` | Python tests; `tests/browser/` Playwright survey test |
| [docs/data-formats.md](docs/data-formats.md) | every file and document format |

Architecture and decisions: the Claude Doc "MaxDiff Survey Tool – Architecture".

## Backlog

- Firebase App Check against scripted spam
- Panel completion redirect and `?src=` tracking
- Live results view
- Save partial responses to measure drop-off
- Even version assignment instead of random
- Hierarchical Bayes (individual-level utilities)
