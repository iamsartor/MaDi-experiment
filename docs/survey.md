# Survey page — `survey/`

A static, mobile-first page served by GitHub Pages. No build step and no third-party CDN: the Firebase SDK is a self-hosted bundle in `survey/vendor/`.

| File | What |
| --- | --- |
| `index.html` | page shell |
| `app.js` | all logic (loading, shuffling, screens, saving) |
| `styles.css` | layout, light and dark mode |
| `firebase-config.js` | public Firebase web config (not a secret) |
| `vendor/firebase-lite.js` | Firebase app + Firestore Lite, built by `tools/build_firebase_bundle.sh` |
| `studies/<id>.design.json` | optional local design copies for `mode=local` (ids only) |

## The link

```
https://iamsartor.github.io/MaDi-experiment/survey/?study=<studyId>[&mode=test|local]#w=<wording>
```

Build it with:

```bash
python design/make_link.py design/studies/<study>.items.json             # live link for respondents
python design/make_link.py design/studies/<study>.items.json --mode test # try it without saving
```

- `study` — the Firestore document `studies/<studyId>` (ids only).
- `#w=` — the wording (title, intro, question prompt, items, segment questions), compressed with deflate and base64url-encoded. **The part after `#` is never sent to any server**, so the wording reaches neither GitHub nor Firebase. Anyone holding the link can read it, which is unavoidable: respondents see the wording anyway. Treat the link as confidential and don't post it publicly.
- A demo link is about 850 characters; 30 items stay under 2,000, which works in email, Teams and messengers. Do not run it through a link shortener: the shortener would store the wording.

### Modes

| `mode` | Config from | Saves answers | Use |
| --- | --- | --- | --- |
| *(none)* = live | Firestore | yes, if study status is `open` | respondents |
| `test` | Firestore | no; shows the response JSON at the end | check a live study before opening it |
| `local` | `survey/studies/<id>.design.json` | no | design checks without Firebase |

## What a respondent sees

1. Intro: title, intro text, number of screens, privacy note.
2. Segment questions (if any), one card each.
3. Choice screens: the question prompt, then each item as a row with **Least** on the left and **Most** on the right. Next is enabled once one Most and one different Least are picked. Picking Most on the item marked Least moves the mark.
4. Thank-you screen. A localStorage flag shows "Already completed" on a second visit (soft protection only; a private window bypasses it).

Each respondent gets a random design version; screen order and item order within each screen are shuffled.

## What is saved

One document in `responses/` per completed survey, written once at the end. Ids, picks, time per screen, segment option ids, total duration, `client.mobile`, server timestamp. Format: docs/data-formats.md §3. The Firestore rules reject anything else (see docs/firebase-setup.md).

## Testing

- Python: `python -m pytest -q` (link builder, upload guard, analysis).
- Rules: `cd firebase && npm install && npm test` (Firestore emulator, needs Java 11+).
- Browser: start the emulator (`npx firebase emulators:start --only firestore`), upload the demo with `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 python design/upload_study.py design/studies/restaurant-demo.design.json --open --project madi-experiment`, serve the repo (`python -m http.server 8000`), build links with `--base http://127.0.0.1:8000/survey/` into `link_local.txt` / `link_live.txt`, then `node tests/browser/e2e_survey.js <that folder>`. On localhost, `&emulator=1` points the page at the emulator.

## Updating the Firebase bundle

`tools/build_firebase_bundle.sh 11.10.0` rebuilds `survey/vendor/firebase-lite.js` from npm (needs Node). Commit the result.
