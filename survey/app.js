// MaxDiff survey page.
//
// Link format:  survey/?study=<studyId>[&mode=test|local]#w=<wording>
//   study   id of the Firestore document studies/<studyId> (ids only)
//   mode    live (default) = load config from Firestore, save the response
//           test           = load config from Firestore, do NOT save, show the result
//           local          = load config from survey/studies/<studyId>.design.json, do NOT save
//   #w=     the study wording (title, intro, question, item texts), compressed.
//           Built by design/make_link.py. The part after "#" is never sent to any
//           server, so the wording reaches neither GitHub nor Firebase.
//
// Single-file variant: design/build_html.py inlines this script into one HTML
// file together with window.MAXDIFF_EMBED = {design, wording, firebaseConfig,
// mode, emulator, contact} and the Firebase bundle. Then nothing is read from
// the URL or the network except the final write to Firestore.
//
// Offline variant (single file only, EMBED.mode = "offline"): no Firebase bundle,
// firebaseConfig null, no network call at all. At the end the respondent saves or
// copies the result (one line of JSON, ids only) and sends it back, e.g. in Teams.
// build_html.py removes the Firebase block below (between the firebase-block
// markers) from offline builds.
//
// What is written to Firestore (live mode only), or into the offline result:
// item ids, picks, timings, segment option ids. Never any wording.
// See docs/data-formats.md.

const EMBED = window.MAXDIFF_EMBED || null;
const app = document.getElementById("app");
const params = new URLSearchParams(location.search);
const studyId = EMBED ? EMBED.design.studyId : (params.get("study") || "").trim();
const requestedMode = EMBED ? EMBED.mode : params.get("mode");
// "offline" is accepted only from an embedded build, never from the URL.
const mode = ["test", "local"].includes(requestedMode) ? requestedMode
  : (EMBED && requestedMode === "offline") ? "offline" : "live";
const saves = mode === "live";
const offline = mode === "offline";
const doneKey = `maxdiff-done:${studyId}`;

// ---------------------------------------------------------------- helpers

function el(tag, attrs = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) n.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    n.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return n;
}

function show(...nodes) {
  app.replaceChildren(...nodes.flat().filter((n) => n != null && n !== false));
  window.scrollTo(0, 0);
}

function shuffle(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function storageGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function storageSet(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }

function fail(message) {
  show(el("h1", {}, "Survey unavailable"), el("p", { class: "error" }, message));
}

// ---------------------------------------------------------------- loading

async function decodeWording() {
  if (EMBED) return EMBED.wording;
  const m = location.hash.match(/[#&]w=([A-Za-z0-9_-]+)/);
  if (!m) throw new Error("This link is incomplete. Please use the full link you received.");
  const b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const w = JSON.parse(await new Response(stream).text());
  if (w.studyId !== studyId) throw new Error("This link does not match the survey.");
  return w;
}

let db = null;
let fs = null;
// firebase-block-start
async function firestore() {
  if (offline) throw new Error("Offline mode makes no network calls.");
  if (!db) {
    // Self-hosted Firebase bundle (see tools/build_firebase_bundle.sh), loaded only when needed.
    // In a single-file build it is already inlined as window.FirebaseLite.
    fs = window.FirebaseLite || (await import("./vendor/firebase-lite.js"));
    const config = EMBED ? EMBED.firebaseConfig : (await import("./firebase-config.js")).firebaseConfig;
    db = fs.getFirestore(fs.initializeApp(config));
    // Developer testing against the local emulator: only on localhost with &emulator=1,
    // or in a single-file build made with --emulator.
    const onLocalhost = ["localhost", "127.0.0.1"].includes(location.hostname) && params.get("emulator") === "1";
    if (onLocalhost || (EMBED && EMBED.emulator)) {
      fs.connectFirestoreEmulator(db, "127.0.0.1", 8080);
    }
  }
  return { db, fs };
}
// firebase-block-end

async function loadConfig() {
  if (EMBED) return EMBED.design;
  if (mode === "local") {
    const res = await fetch(`studies/${encodeURIComponent(studyId)}.design.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`No local design file for "${studyId}".`);
    return res.json();
  }
  const { db, fs } = await firestore();
  const snap = await fs.getDoc(fs.doc(db, "studies", studyId));
  if (!snap.exists()) throw new Error("This survey does not exist.");
  return snap.data();
}

// ---------------------------------------------------------------- state

const state = {
  cfg: null,
  w: null,
  version: 0,
  screens: [],
  index: 0,
  answers: [],
  segments: {},
  startedAt: 0,
  screenStart: 0,
};

// ---------------------------------------------------------------- views

function testBadge() {
  return mode === "live" || offline ? null : el("div", { class: "badge" }, `${mode.toUpperCase()} MODE · answers are not saved`);
}

function viewIntro() {
  const { w } = state;
  show(
    testBadge(),
    el("h1", {}, w.title || "Survey"),
    el("p", {}, w.intro || ""),
    el("p", { class: "muted small" }, offline
      ? `${state.screens.length} short screens. Your result contains no name or email. You send it to us yourself, so we will see who sent it. We only look at results in aggregate.`
      : `${state.screens.length} short screens. Your answers are anonymous: we do not store your name, email or IP address with them.`),
    el("button", { class: "btn", onclick: () => (hasSegments() ? viewSegments() : startChoices()) }, "Start"),
  );
}

function hasSegments() {
  return (state.cfg.segmentQuestions || []).length > 0;
}

function viewSegments() {
  const qs = state.cfg.segmentQuestions;
  const next = el("button", { class: "btn", disabled: true, onclick: startChoices }, "Continue");
  const check = () => { next.disabled = qs.some((q) => !state.segments[q.id]); };
  const cards = qs.map((q) => {
    const wq = (state.w.segments || {})[q.id] || { text: q.id, options: {} };
    return el("fieldset", { class: "card" },
      el("legend", { class: "question" }, wq.text),
      q.options.map((o) =>
        el("label", { class: "opt" },
          el("input", {
            type: "radio", name: q.id, value: o,
            onchange: () => { state.segments[q.id] = o; check(); },
          }),
          el("span", {}, (wq.options || {})[o] || o),
        )),
    );
  });
  show(testBadge(), el("h2", {}, "First, a little about you"), ...cards, next);
}

function startChoices() {
  state.index = 0;
  state.startedAt = state.startedAt || Date.now();
  viewChoice();
}

function viewChoice() {
  const { w, screens, index } = state;
  const items = screens[index];
  let best = null;
  let worst = null;
  const rows = {};
  const next = el("button", { class: "btn", disabled: true }, index === screens.length - 1 ? "Finish" : "Next");

  const refresh = () => {
    for (const id of items) {
      const r = rows[id];
      r.row.classList.toggle("is-best", id === best);
      r.row.classList.toggle("is-worst", id === worst);
      r.b.setAttribute("aria-pressed", String(id === best));
      r.wst.setAttribute("aria-pressed", String(id === worst));
    }
    next.disabled = !(best && worst && best !== worst);
  };

  for (const id of items) {
    const text = (w.items || {})[id] || id;
    const wst = el("button", { class: "pick worst", type: "button", "aria-pressed": "false", "aria-label": `${w.question?.worst || "Least"}: ${text}` },
      "Least");
    const b = el("button", { class: "pick best", type: "button", "aria-pressed": "false", "aria-label": `${w.question?.best || "Most"}: ${text}` },
      "Most");
    wst.addEventListener("click", () => { worst = worst === id ? null : id; if (best === id) best = null; refresh(); });
    b.addEventListener("click", () => { best = best === id ? null : id; if (worst === id) worst = null; refresh(); });
    const row = el("div", { class: "item", "data-item": id }, wst, el("div", { class: "item-text" }, text), b);
    rows[id] = { row, b, wst };
  }

  next.addEventListener("click", () => {
    if (next.disabled) return;
    state.answers.push({ set: items, best, worst, ms: Date.now() - state.screenStart });
    state.index += 1;
    if (state.index < screens.length) viewChoice();
    else submit();
  });

  const pct = Math.round((index / screens.length) * 100);
  show(
    testBadge(),
    el("div", { class: "progress", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": pct },
      el("div", { style: `width:${pct}%` })),
    el("div", { class: "progress-label" }, `Screen ${index + 1} of ${screens.length}`),
    el("p", { class: "question" }, w.question?.prompt || "Pick the most important and the least important."),
    items.map((id) => rows[id].row),
    next,
  );
  state.screenStart = Date.now();
}

async function submit() {
  show(el("p", { class: "muted" }, "Saving your answers…"));
  const response = {
    studyId,
    version: state.version,
    answers: state.answers,
    segments: state.segments,
    durationSec: Math.round((Date.now() - state.startedAt) / 1000),
    client: { mobile: matchMedia("(pointer: coarse)").matches },
  };
  if (offline) response.client.offline = true;
  window.__maxdiffResponse = response; // for automated tests
  if (offline) {
    const text = JSON.stringify(response) + "\n";
    viewOfflineResult(text, "Almost done: please send us your result");
    storageSet(doneKey, text);
    return;
  }
  if (!saves) {
    show(
      testBadge(),
      el("h1", {}, "Done (not saved)"),
      el("p", { class: "muted" }, "In live mode this is what would be stored. It contains ids only."),
      el("pre", { id: "response-json" }, JSON.stringify(response, null, 2)),
    );
    return;
  }
  try {
    const { db, fs } = await firestore();
    await fs.addDoc(fs.collection(db, "responses"), { ...response, createdAt: fs.serverTimestamp() });
    storageSet(doneKey, new Date().toISOString());
    show(el("h1", {}, "Thank you!"), el("p", {}, "Your answers have been saved. You can close this page now."));
  } catch (e) {
    console.error(e);
    const retry = el("button", { class: "btn", onclick: submit }, "Try again");
    if (e && e.code === "permission-denied") {
      return show(el("h1", {}, "Survey not open"), el("p", { class: "error" },
        "This survey is closed or not open yet, so your answers could not be saved."));
    }
    show(el("h1", {}, "Could not save"), el("p", { class: "error" },
      "Your answers could not be saved. Please check your connection and try again. " +
      "If it keeps failing, your network may block the survey service."), retry);
  }
}

// ---------------------------------------------------------------- offline end screen

function randomSuffix(n = 6) {
  const abc = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(bytes, (b) => abc[b % abc.length]).join("");
}

// The result text is one line of compact JSON plus "\n", ids only.
function viewOfflineResult(text, heading) {
  const contact = (EMBED && typeof EMBED.contact === "string" && EMBED.contact.trim())
    || "the person who sent you this survey";
  const filename = `${studyId}-result-${randomSuffix()}.json`;
  const box = el("textarea", {
    id: "result-text", class: "result", readonly: true, rows: 6,
    spellcheck: "false", "aria-label": "Your result",
  });
  box.value = text;
  const status = el("p", { id: "result-status", class: "status", role: "status" });
  let timer = null;
  const say = (msg, ms) => {
    clearTimeout(timer);
    status.textContent = msg;
    if (ms) timer = setTimeout(() => { status.textContent = ""; }, ms);
  };

  const save = () => {
    try {
      const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      const a = el("a", { href: url, download: filename, style: "display:none" });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      say(`Saved as ${filename} (usually in your Downloads folder).`);
    } catch (e) {
      console.error(e);
      say("Saving did not work here. Please click Copy result instead.");
    }
  };

  const copyFallback = () => {
    box.focus();
    box.select();
    box.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    if (ok) say("Copied ✓", 2000);
    else say("Select the text below and press Ctrl+C");
  };
  const copy = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("no clipboard API");
      await navigator.clipboard.writeText(text);
      say("Copied ✓", 2000);
    } catch {
      copyFallback();
    }
  };

  show(
    el("h1", {}, heading),
    el("p", {}, `Click Save result and send the file to ${contact} in Teams. ` +
      "If saving does not work, click Copy result and paste it into a Teams message."),
    el("div", { class: "actions" },
      el("button", { class: "btn", type: "button", id: "save-result", onclick: save }, "Save result"),
      el("button", { class: "btn secondary", type: "button", id: "copy-result", onclick: copy }, "Copy result"),
    ),
    status,
    box,
    el("p", { class: "muted small" }, "The result contains only codes (like I07), no text and no name."),
  );
}

function storedOfflineResult() {
  const text = storageGet(doneKey);
  if (!text) return null;
  try {
    const r = JSON.parse(text);
    return r && r.studyId === studyId && Array.isArray(r.answers) ? text : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- start

async function main() {
  if (!studyId) return fail("This link is incomplete (no survey id).");
  if (offline) {
    const stored = storedOfflineResult();
    if (stored) {
      if (EMBED.wording && EMBED.wording.title) document.title = EMBED.wording.title;
      return viewOfflineResult(stored, "You already completed this survey");
    }
  }
  if (saves && storageGet(doneKey)) {
    return show(el("h1", {}, "Already completed"), el("p", {}, "Thank you, you have already taken part in this survey."));
  }
  try {
    state.w = await decodeWording();
  } catch (e) {
    return fail(e.message || "This link is incomplete.");
  }
  try {
    state.cfg = await loadConfig();
  } catch (e) {
    console.error(e);
    return fail(e.message || "The survey could not be loaded.");
  }
  // Embedded files carry a copy of the design; whether the study is open is
  // checked by the Firestore rules when the answers are saved.
  if (mode === "live" && !EMBED && state.cfg.status !== "open") {
    return fail("This survey is not open at the moment.");
  }
  if (state.w.title) document.title = state.w.title;
  const versions = state.cfg.versions || [];
  if (!versions.length) return fail("This survey has no design.");
  state.version = Math.floor(Math.random() * versions.length);
  // Screen order and item order within each screen are shuffled per respondent.
  state.screens = shuffle(versions[state.version].screens.map((s) => shuffle(s.items)));
  viewIntro();
}

main();
