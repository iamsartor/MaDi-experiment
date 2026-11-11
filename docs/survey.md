# Survey page — `survey/`

A static, mobile-first page served by GitHub Pages. No build step and no third-party CDN: the Firebase SDK is a self-hosted bundle in `survey/vendor/`.

| File | What |
| --- | --- |
| `index.html` | page shell |
| `app.js` | all logic (loading, shuffling, screens, saving) |
| `styles.css` | layout, light and dark mode |
| `firebase-config.js` | public Firebase web config (not a secret) |
| `vendor/firebase-lite.js` | Firebase app + Firestore Lite (ES module), built by `tools/build_firebase_bundle.sh` |
| `vendor/firebase-lite.iife.js` | the same as a classic script, inlined into single-file builds |
| `studies/<id>.design.json` | optional local design copies for `mode=local` (ids only) |

## Ways to share a study

| | Single HTML file (recommended inside a company) | Link | Single file, offline |
| --- | --- | --- | --- |
| Build | `python design/build_html.py <items.json>` → `dist/<study>.html` | `python design/make_link.py <items.json>` | `python design/build_html.py <items.json> --mode offline` → `dist/<study>-offline.html` |
| Share | send the file, e.g. in Teams | send the link | send the file, e.g. in Teams |
| Respondent opens | downloads the file, opens it in the browser | clicks the link (GitHub Pages) | downloads the file, opens it in the browser |
| Wording lives | inside the file | inside the link after `#` | inside the file |
| Network | only the final save to Firestore | GitHub Pages + Firestore | none at all |
| Data comes back | Firestore | Firestore | the respondent saves or copies the result and sends it back by Teams; `analysis/collect_offline.py` collects it |
| Phones | clumsy (downloading files) | fine | clumsy |
| Good for | studies of any size | studies of any size, panels | small internal pilots (about 4 to 20 people), no Firebase needed |

The single file embeds `window.MAXDIFF_EMBED` (design ids, wording, Firebase config, mode) and the Firebase SDK as a classic script (`vendor/firebase-lite.iife.js`), followed by the same `app.js`. It works from `file://`, needs nothing else, and is about 170 KB. `--mode test` builds a file that saves nothing. `--mode offline` builds a file of about 30 KB without the Firebase SDK (see below). A file always uses the design it was built with: after regenerating a design, rebuild and re-send. If the study is not open, saving fails with "Survey not open".

Network notes for company use: the browser must reach `firestore.googleapis.com`. Do not restrict the Firebase API key to a website (HTTP referrer), because a file opened from disk has none.

## Offline files

An offline build (`--mode offline`) embeds `firebaseConfig: null`, leaves out the Firebase SDK and has the Firebase code removed from `app.js` by `build_html.py` (the block between the `firebase-block-start` / `firebase-block-end` markers), so it cannot make a network request. Offline mode is accepted only from the embedded file, never from a URL parameter.

- Intro privacy line: "Your result contains no name or email. You send it to us yourself, so we will see who sent it. We only look at results in aggregate." No yellow test badge.
- End screen ("Almost done: please send us your result"): **Save result** downloads `<studyId>-result-<6 random chars>.json`; **Copy result** copies the same text (clipboard API, else `document.execCommand("copy")`, else the hint "Select the text below and press Ctrl+C"). The text is also shown in a read-only box. It is one line of compact JSON plus a newline, ids only (docs/data-formats.md §3a).
- The instruction names the optional `contact` from the items file ("send the file to Jane Doe in Teams"); without it, "to the person who sent you this survey".
- The result is also kept in the browser's localStorage (`maxdiff-done:<studyId>`). Opening the file again shows "You already completed this survey" with Save and Copy, so people who forgot to send it can still do so.

Collecting: put the received `.json` files and any pasted text (saved as `.txt`) into one folder and run `analysis/collect_offline.py` (docs/new-study.md, "Offline pilot").

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
| `offline` | embedded design (single-file build only, `build_html.py --mode offline`; not possible as a URL parameter) | no; the respondent saves or copies the result and sends it back | small internal pilots without Firebase |

## What a respondent sees

1. Intro: title, intro text, number of screens, privacy note.
2. Segment questions (if any), one card each.
3. Choice screens: the question prompt, then each item as a row with **Least** on the left and **Most** on the right. Next is enabled once one Most and one different Least are picked. Picking Most on the item marked Least moves the mark.
4. Thank-you screen. A localStorage flag shows "Already completed" on a second visit (soft protection only; a private window bypasses it).

Each respondent gets a random design version; screen order and item order within each screen are shuffled.

## What is saved

One document in `responses/` per completed survey, written once at the end. Ids, picks, time per screen, segment option ids, total duration, `client.mobile`, server timestamp. Format: docs/data-formats.md §3. The Firestore rules reject anything else (see docs/firebase-setup.md).

## Testing

- Python: `python -m pytest -q` (link builder, upload guard, single-file builds, offline collector, analysis). If `node` with Playwright is installed, this also runs the offline file in a browser (`tests/browser/e2e_file.js`) and checks there are zero network requests.
- Single files: build `restaurant-demo-test.html` and/or `restaurant-demo-offline.html` into `<dir>/html/`, then `node tests/browser/e2e_file.js <dir>`.
- Rules: `cd firebase && npm install && npm test` (Firestore emulator, needs Java 11+).
- Browser: start the emulator (`npx firebase emulators:start --only firestore`), upload the demo with `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 python design/upload_study.py design/studies/restaurant-demo.design.json --open --project madi-experiment`, serve the repo (`python -m http.server 8000`), build links with `--base http://127.0.0.1:8000/survey/` into `link_local.txt` / `link_live.txt`, then `node tests/browser/e2e_survey.js <that folder>`. On localhost, `&emulator=1` points the page at the emulator.

## Updating the Firebase bundle

`tools/build_firebase_bundle.sh 11.10.0` rebuilds `survey/vendor/firebase-lite.js` from npm (needs Node). Commit the result.
