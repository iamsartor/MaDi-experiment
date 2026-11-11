# Data formats

All formats are JSON. Ids are short neutral strings: items `I01…`, segment questions `S1…`, options `O1…`.
Only the **items file** contains wording; every other format contains ids only.

## 1. Items file — `design/studies/<studyId>.items.json` (local, confidential)

```json
{
  "studyId": "restaurant-demo",
  "title": "Choosing a restaurant",
  "intro": "Text shown before the first screen",
  "question": { "prompt": "Which matters most, and which matters least, …?", "best": "Most important …", "worst": "Least important …" },
  "items": [ { "id": "I01", "text": "Taste and quality of the food" } ],
  "segmentQuestions": [
    { "id": "S1", "text": "How often do you eat out?",
      "options": [ { "id": "O1", "text": "Once a week or more" } ] }
  ]
}
```

Keys starting with `_` are comments and ignored. `question.prompt` is shown above each screen; `best`/`worst` are used as accessible button labels.

Optional `"contact": "Jane Doe"` (top level): the person respondents send their result to. Only offline builds use it (embedded by `build_html.py`, shown on the end screen); without it the end screen says "the person who sent you this survey".

The survey link carries a compressed copy of this wording after `#` (built by `design/make_link.py`): `{studyId, title, intro, question, items: {id: text}, segments: {qid: {text, options: {oid: text}}}}`.

## 2. Design file — `design/studies/<studyId>.design.json` (→ Firestore `studies/{studyId}`)

Written by `generate_design.py`.

```json
{
  "studyId": "restaurant-demo",
  "status": "draft",
  "setSize": 4,
  "itemIds": ["I01", "I02", "…"],
  "versions": [
    { "version": 0, "screens": [ { "items": ["I07", "I03", "I12", "I01"] } ] }
  ],
  "segmentQuestions": [ { "id": "S1", "options": ["O1", "O2", "O3"] } ],
  "createdAt": "2026-11-11T09:30:00+00:00"
}
```

- `status`: `draft` → `open` (accepts responses) → `closed`. Set to `open` when going live.
- `versions` is a list of maps with a list of screens because Firestore cannot store arrays directly inside arrays.
- The survey page shuffles screen order and item order within each screen at runtime; the stored order has no meaning.

## 3. Response document — Firestore `responses/{autoId}`, and one line of a batch `.jsonl`

Written by the survey page (and by the simulator, in the same shape).

```json
{
  "studyId": "restaurant-demo",
  "version": 3,
  "answers": [
    { "set": ["I07", "I03", "I12", "I01"], "best": "I01", "worst": "I12", "ms": 5400 }
  ],
  "segments": { "S1": "O2" },
  "durationSec": 140,
  "client": { "mobile": true },
  "createdAt": "<server timestamp>"
}
```

- `set` is the items **in the order shown** on that screen (position matters for the straight-liner check).
- `answers` is in the order the screens were shown.
- `ms` = time on that screen in milliseconds.
- In a batch file each line additionally has `_id` (the Firestore document id). The simulator adds `client.simulated` and `client.speeder`.

### 3a. Offline result file — `<studyId>-result-<6 random chars>.json`

Saved or copied by an offline build (`build_html.py --mode offline`). Exactly the response of §3 as **one line of compact JSON plus a trailing newline** (so files can be concatenated into a `.jsonl`), with no `createdAt` and one extra field: `client.offline: true`.

```
{"studyId":"restaurant-demo","version":3,"answers":[{"set":["I07","I03","I12","I01"],"best":"I01","worst":"I12","ms":5400}],"segments":{"S1":"O2"},"durationSec":140,"client":{"mobile":false,"offline":true}}
```

Ids only, no wording and no name. Pasted copies may arrive pretty-printed or with typographic quotes; `analysis/collect_offline.py` repairs that.

## 4. Batch file — `analysis/data/<studyId>.<YYYYMMDD-HHMM>.jsonl`

One response document per line, written by `analysis/export.py`. A batch = every response of the study at the time of the pull. Files are never overwritten, so each analysis can be repeated.

Offline pilots: `analysis/collect_offline.py` writes `analysis/data/<studyId>.offline.<YYYYMMDD-HHMM>.jsonl`, same shape, only valid and de-duplicated results, `_id` = the source file name (plus `-1`, `-2` … for a `.txt` with several results).

Simulated batches have a sibling `<name>.truth.json` with the true utilities used; the notebook uses it for its validation section.

## 5. Long table (in memory, `models.to_long`)

One row per item per screen:

| column | meaning |
| --- | --- |
| `respondent` | response `_id` |
| `version` | design version |
| `screen` | 0-based screen number as shown |
| `position` | 0-based position on the screen |
| `item` | item id |
| `shown` | always 1 |
| `best`, `worst` | 1 if picked, else 0 |
| `seg_<qid>` | segment answer option id, one column per question |

## 6. Outputs — `analysis/output/<studyId>/`

| file | content |
| --- | --- |
| `quality.csv` | per respondent: screens, median ms, speeder, straight-liner, flagged |
| `scores_counts.csv` | item, shown, best, worst, score (−1…+1), 95% CI, label |
| `scores_logit.csv` | rank, item, utility, utility_se, share (%), 95% CI, label |
| `scores_segment_<qid>.csv` | share of preference per item × segment option |
| `chart_*.png` | ranked charts |

Output files contain wording in the `label` column when the items file is present. Treat them as confidential.
