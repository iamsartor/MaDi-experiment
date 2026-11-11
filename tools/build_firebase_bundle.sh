#!/usr/bin/env bash
# Rebuilds survey/vendor/firebase-lite.js from the npm "firebase" package.
# The survey serves this file itself, so it does not depend on a third-party CDN.
# Usage: tools/build_firebase_bundle.sh [firebase-version]
set -euo pipefail
VERSION="${1:-11.10.0}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
cp "$ROOT/tools/firebase-entry.js" "$TMP/entry.js"
cd "$TMP"
npm init -y >/dev/null
npm install --silent "firebase@$VERSION" esbuild@0.24
npx esbuild entry.js --bundle --format=esm --minify --target=es2020 \
  --banner:js="/* Firebase JS SDK $VERSION (app + firestore/lite), Apache-2.0. Built by tools/build_firebase_bundle.sh */" \
  --outfile="$ROOT/survey/vendor/firebase-lite.js"
# Same SDK as a classic script (window.FirebaseLite), inlined by design/build_html.py
npx esbuild entry.js --bundle --format=iife --global-name=FirebaseLite --minify --target=es2020 \
  --banner:js="/* Firebase JS SDK $VERSION (app + firestore/lite), Apache-2.0. Built by tools/build_firebase_bundle.sh */" \
  --outfile="$ROOT/survey/vendor/firebase-lite.iife.js"
rm -rf "$TMP"
echo "Wrote survey/vendor/firebase-lite.js and firebase-lite.iife.js (firebase $VERSION)"
