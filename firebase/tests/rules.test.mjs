// Security-rules tests. Run from firebase/:  npm install && npm test
// (starts the Firestore emulator, runs these tests, stops it; needs Java 11+)
import { test, before, after, beforeEach } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  initializeTestEnvironment, assertSucceeds, assertFails,
} from "@firebase/rules-unit-testing";
import {
  doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, getDocs, collection, serverTimestamp,
} from "firebase/firestore";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const design = JSON.parse(readFileSync(here("../../design/studies/restaurant-demo.design.json"), "utf8"));
let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-maxdiff",
    firestore: { rules: readFileSync(here("../firestore.rules"), "utf8") },
  });
});
after(async () => env.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "studies", "open-study"), { ...design, studyId: "open-study", status: "open" });
    await setDoc(doc(db, "studies", "closed-study"), { ...design, studyId: "closed-study", status: "closed" });
    await setDoc(doc(db, "responses", "existing"), { studyId: "open-study" });
  });
});

const anon = () => env.unauthenticatedContext().firestore();
const screens = design.versions[0].screens.length;

function response(over = {}) {
  return {
    studyId: "open-study",
    version: 0,
    answers: design.versions[0].screens.map((s) => ({ set: s.items, best: s.items[0], worst: s.items[1], ms: 4000 })),
    segments: { S1: "O1" },
    durationSec: 90,
    client: { mobile: true },
    createdAt: serverTimestamp(),
    ...over,
  };
}

test("anyone can read one study config", async () => {
  await assertSucceeds(getDoc(doc(anon(), "studies", "open-study")));
});
test("nobody can list all studies", async () => {
  await assertFails(getDocs(collection(anon(), "studies")));
});
test("browsers cannot write study configs", async () => {
  await assertFails(setDoc(doc(anon(), "studies", "x"), { status: "open" }));
  await assertFails(updateDoc(doc(anon(), "studies", "open-study"), { status: "closed" }));
});

test("a valid response can be created", async () => {
  await assertSucceeds(addDoc(collection(anon(), "responses"), response()));
});
test("responses cannot be read, listed, changed or deleted", async () => {
  const db = anon();
  await assertFails(getDoc(doc(db, "responses", "existing")));
  await assertFails(getDocs(collection(db, "responses")));
  await assertFails(updateDoc(doc(db, "responses", "existing"), { durationSec: 1 }));
  await assertFails(deleteDoc(doc(db, "responses", "existing")));
});
test("rejected: closed study", async () => {
  await assertFails(addDoc(collection(anon(), "responses"), response({ studyId: "closed-study" })));
});
test("rejected: unknown study", async () => {
  await assertFails(addDoc(collection(anon(), "responses"), response({ studyId: "nope" })));
});
test("rejected: wrong number of answers", async () => {
  const r = response();
  r.answers = r.answers.slice(0, screens - 1);
  await assertFails(addDoc(collection(anon(), "responses"), r));
});
test("rejected: version out of range", async () => {
  await assertFails(addDoc(collection(anon(), "responses"), response({ version: design.versions.length })));
});
test("rejected: extra fields (e.g. wording or personal data)", async () => {
  await assertFails(addDoc(collection(anon(), "responses"), response({ email: "a@b.c" })));
  await assertFails(addDoc(collection(anon(), "responses"), response({ itemTexts: { I01: "x" } })));
});
test("rejected: client-chosen timestamp", async () => {
  await assertFails(addDoc(collection(anon(), "responses"), response({ createdAt: new Date(0) })));
});
