#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
OWNER="wishyouluck90-source"; REPO="local-month"; FULL="$OWNER/$REPO"
echo "LOCAL MONTH v9.3.1 — Production QA patch"
if ! command -v gh >/dev/null 2>&1; then echo "GitHub CLI가 필요합니다."; exit 1; fi
gh auth status
gh auth setup-git
python3 scripts/check_data.py
node --check app.js
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
git clone "https://github.com/$FULL.git" "$TMP/repo"
rsync -a --delete --exclude '.git' ./ "$TMP/repo/"
cd "$TMP/repo"
git config user.name "나디아"
git config user.email "actions@users.noreply.github.com"
git add .
if git diff --cached --quiet; then echo "No changes"; else
  git commit -m "fix: LOCAL MONTH v9.3.1 production QA consistency"
  git push origin main
fi
echo "Waiting for GitHub Pages..."
sleep 5
RUN_ID="$(gh run list --repo "$FULL" --workflow pages.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$RUN_ID" --repo "$FULL" --exit-status
if command -v vercel >/dev/null 2>&1; then
  vercel link --yes --project local-month --scope wishyouluck90-3591s-projects
  vercel deploy --prod --yes --scope wishyouluck90-3591s-projects
fi
echo "V9_3_1_QA_PATCH_COMPLETE"
