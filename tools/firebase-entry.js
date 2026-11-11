// Entry for the self-hosted Firebase bundle used by survey/app.js.
// Firestore Lite: one-shot reads and writes, no realtime listeners (smaller).
export { initializeApp } from "firebase/app";
export {
  getFirestore, connectFirestoreEmulator, doc, getDoc, collection, addDoc, serverTimestamp,
} from "firebase/firestore/lite";
