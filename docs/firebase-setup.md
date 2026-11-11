# Firebase setup and running a study

Project: `madi-experiment` (Firebase console). Firestore in **europe-west3 (Frankfurt)**, Spark (free) plan.

## One-time setup

1. **Firestore database** — Firestore → Create database → Standard edition → location `europe-west3` → production mode.
2. **Web app** — Project overview → `</>` → register; its config is in `survey/firebase-config.js`.
3. **Security rules** — Firestore → Rules → replace everything with the contents of `firebase/firestore.rules` → Publish.
   (With the Firebase CLI instead: `npx firebase deploy --only firestore:rules` from the repo root.)
4. **Service-account key** (for uploads and analysis, on your own computer only) — Project settings → Service accounts → Generate new private key. Save it outside the repo, e.g. `~/keys/madi-experiment-sa.json`. Anyone with this file has full access to the database.
5. **GitHub Pages** — repo Settings → Pages → Deploy from branch `main`, folder `/ (root)`. The survey is then at `https://iamsartor.github.io/MaDi-experiment/survey/`.
6. **Python** on your computer: `pip install -r requirements.txt`.

## What the rules allow

| Collection | Browser (anyone with the link) | Admin SDK (your key) |
| --- | --- | --- |
| `studies/{id}` | read one document by id; no listing, no writes | everything |
| `responses/{id}` | create only, and only if valid; no reading, listing, changing, deleting | everything |

A response is accepted only if: its study exists and has status `open`; its fields are exactly the expected ones (so no wording or personal data can be added); `version` exists in the design; it has one answer per screen of that version; `createdAt` is the server time. Covered by `firebase/tests/rules.test.mjs`.

## Running a study

```bash
# 1. wording (local) -> design (ids only)
python design/generate_design.py design/studies/<study>.items.json --seed 1

# 2. upload as draft, try it in test mode
python design/upload_study.py design/studies/<study>.design.json --credentials ~/keys/madi-experiment-sa.json
python design/make_link.py design/studies/<study>.items.json --mode test

# 3. open it and send the live link
python design/upload_study.py --study <study> --status open --credentials ~/keys/madi-experiment-sa.json
python design/make_link.py design/studies/<study>.items.json

# 4. analyse in batches whenever you like (notebook SOURCE = "firestore", or:)
python analysis/export.py <study> --credentials ~/keys/madi-experiment-sa.json

# 5. close it
python design/upload_study.py --study <study> --status closed --credentials ~/keys/madi-experiment-sa.json
```

Test mode needs the study uploaded (any status). Responses are only accepted while the status is `open`.

## Privacy checklist (GDPR)

- Firestore location in the EU (europe-west3).
- No wording in Firebase; no names, emails or IP addresses stored with responses.
- Delete a study's responses when the analysis is finished (Firestore console, or ask Claude for a small delete script).
- Firebase itself processes IP addresses in transit (Google as processor). Mention it in the privacy note if your use requires it.

## Free-plan limits (Spark)

50,000 document reads and 20,000 writes per day, 1 GiB storage. One response = 1 write; one survey start = 1 read. Far above what MaxDiff studies need.

## Backlog for this part

App Check against scripted spam; even version assignment; partial responses; panel redirect.
