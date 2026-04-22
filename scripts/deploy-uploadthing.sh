#!/usr/bin/env bash
set -euo pipefail

if ! command -v appwrite >/dev/null 2>&1; then
  echo "Appwrite CLI is not installed. Install it first: npm i -g appwrite"
  exit 1
fi

if [[ -z "${APPWRITE_FUNCTION_ID:-}" ]]; then
  echo "Missing APPWRITE_FUNCTION_ID env var."
  echo "Example: export APPWRITE_FUNCTION_ID=YOUR_FUNCTION_ID"
  exit 1
fi

echo "Deploying UploadThing function..."
appwrite functions createDeployment \
  --functionId "$APPWRITE_FUNCTION_ID" \
  --entrypoint "index.js" \
  --code "appwrite/functions/uploadthing"

echo "Done."
