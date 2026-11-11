# New study, step by step

From an item list to a survey file you can share in Teams. You need Python with `pip install -r requirements.txt`, and for live studies the service-account key (docs/firebase-setup.md).

## 1. Create the items file with an AI

Copy the prompt below into Claude (or any AI chat), paste your items where it says, and attach `design/studies/restaurant-demo.items.json` as the example. Save the answer as `design/studies/<studyId>.items.json`.

```text
Create a MaxDiff items file in exactly the JSON format of the attached example
(restaurant-demo.items.json). Rules:
- studyId: "<short-name>" (lowercase letters, digits, dashes)
- title, intro: short, friendly, in <language>; the intro says that each screen
  shows a few options and the respondent picks the one that matters MOST and the
  one that matters LEAST
- question.prompt: one sentence asking which matters most and which least
  for <topic>; question.best / question.worst: short labels for the two choices
- items: one entry per item below, ids I01, I02, … in the given order; keep my
  wording, only fix typos; each item short, one idea, similar length and form
- segmentQuestions: <describe them, e.g. "S1: Your role? Options: Sales,
  Marketing, R&D, Other"> with ids S1, S2 … and option ids O1, O2 …; or an
  empty list
- Output only the JSON, nothing else. Do not add any other fields.

My items:
<paste your list here, one per line>
```

Item tips: 8 to 30 items; short, one idea each, same grammatical form; none that obviously wins.

## 2. Check it

```bash
python design/check_items.py design/studies/<studyId>.items.json
```

Fix what it reports (or ask the AI to fix it) until it says OK.

## 3. Design, try, go live

```bash
# balanced design (ids only); check the report says PASS
python design/generate_design.py design/studies/<studyId>.items.json --seed 1

# try-out file: works offline, saves nothing, shows the stored record at the end
python design/build_html.py design/studies/<studyId>.items.json --mode test

# live: upload the design, open the study, build the file to share
python design/upload_study.py design/studies/<studyId>.design.json --open --credentials ~/keys/madi-experiment-sa.json
python design/build_html.py design/studies/<studyId>.items.json
```

The files land in `dist/` (`<studyId>-test.html`, `<studyId>.html`). Share the live file in Teams. It contains the wording, so share it only internally.

Rules of thumb:
- After `generate_design.py` runs again, rebuild and re-send the HTML and re-upload the design; old files must not be used.
- Close the study when done: `python design/upload_study.py --study <studyId> --status closed --credentials …`. Files opened after that show "Survey not open".
- Instead of the file you can also share a link (`design/make_link.py`, see docs/survey.md).

## Offline pilot (no Firebase)

For a small internal pilot (about 4 to 20 colleagues) you need no Firebase, no key and no upload. Respondents send their result back to you in Teams.

1. Optional: add `"contact": "<your name>"` to the items file, so the end screen says "send the file to <your name> in Teams".
2. Build and send the file:
   ```bash
   python design/generate_design.py design/studies/<studyId>.items.json --seed 1   # if not done yet
   python design/build_html.py design/studies/<studyId>.items.json --mode offline
   ```
   Send `dist/<studyId>-offline.html` in Teams. It works from disk with no network.
3. Respondents click **Save result** and send you the `.json` file, or click **Copy result** and paste the text into a Teams message. Put every file you receive into one folder; save pasted text as a `.txt` file in the same folder (several results in one `.txt`, one per line, are fine).
4. Collect:
   ```bash
   python analysis/collect_offline.py <folder> --study <studyId> --design design/studies/<studyId>.design.json
   ```
   It lists invalid results with the reason, drops duplicates (same person sent file and text) and writes `analysis/data/<studyId>.offline.<YYYYMMDD-HHMM>.jsonl`.
5. Analyse: in the notebook set `SOURCE = "file"` and `RESPONSES_FILE` to that `.jsonl` (path relative to `analysis/`), then Run All.

The design must stay the same during the pilot: results from a file built with an older design are rejected by the collector.

## 4. Analyse

Open `analysis/maxdiff.ipynb`, set `STUDY_ID`, `ITEMS_FILE`, `SOURCE = "firestore"` and `CREDENTIALS`, then Run All. Repeat whenever you want a fresh batch.

## Changing the look or texts of the survey page

The page itself is `survey/index.html`, `survey/app.js`, `survey/styles.css`. To change it, give an AI those files plus this request; afterwards run `python -m pytest -q` and rebuild the HTML with `build_html.py`. Do not change what `app.js` saves (the response fields), because the Firestore rules accept exactly those fields.
