#!/usr/bin/env bash
set -Eeuo pipefail
SRC="$(cd "$(dirname "$0")" && pwd)"
OWNER="wishyouluck90-source"; REPO="local-month"
TEAM="wishyouluck90-3591s-projects"; PROJECT="local-month"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
trap 'echo; echo "FAILED_STEP: line $LINENO"; echo "위 오류 메시지를 그대로 ChatGPT에 보내주세요."' ERR

echo "=================================================="
echo " LOCAL MONTH v9.3 FINAL DEPLOY"
echo "=================================================="

command -v git >/dev/null || { echo "git 없음"; exit 1; }
if ! command -v gh >/dev/null 2>&1; then
  command -v brew >/dev/null || { echo "Homebrew/GitHub CLI 필요"; exit 1; }
  brew install gh
fi
if ! gh auth status; then gh auth login --web --git-protocol https; fi
# Critical: install gh as git credential helper for github.com
gh auth setup-git

echo "[1/7] GitHub 접근 확인"
gh repo view "$OWNER/$REPO" --json nameWithOwner,url,defaultBranchRef

echo "[2/7] main clone"
git clone "https://github.com/${OWNER}/${REPO}.git" "$TMP/repo"

echo "[3/7] v9.3 반영 + 로컬 E2E"
for f in index.html app.js editorial-v8.css version.json; do
  test -f "$SRC/$f" || { echo "missing source: $f"; exit 2; }
  cp "$SRC/$f" "$TMP/repo/$f"
done
cp "$SRC/scripts/e2e_contract_v93.py" "$TMP/repo/scripts/e2e_contract_v93.py"
cd "$TMP/repo"
python3 scripts/e2e_contract_v93.py
python3 scripts/check_data.py
node --check app.js
grep -q '"9.3.0"' version.json

echo "[4/7] commit + push"
git add index.html app.js editorial-v8.css version.json scripts/e2e_contract_v93.py
if git diff --cached --quiet; then
  echo "main already contains v9.3 content"
else
  git config user.name "나디아"
  git config user.email "actions@users.noreply.github.com"
  git commit -m "feat: LOCAL MONTH v9.3 Program Decision Desk"
  git push origin HEAD:main
fi
REMOTE_VER="$(gh api "repos/$OWNER/$REPO/contents/version.json?ref=main" --jq .content | tr -d '\n' | base64 --decode)"
echo "$REMOTE_VER" | grep -q '"9.3.0"'
echo "GITHUB_MAIN_V9_3_PASS"

echo "[5/7] GitHub Pages E2E"
sleep 5
RUN_ID="$(gh run list --repo "$OWNER/$REPO" --workflow pages.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
echo "Run ID: $RUN_ID"
gh run watch "$RUN_ID" --repo "$OWNER/$REPO" --exit-status
echo "GITHUB_PAGES_V9_3_PASS"

echo "[6/7] GitHub Pages public version"
for i in {1..12}; do
  if curl -fsSL "https://${OWNER}.github.io/${REPO}/version.json" | grep -q '"9.3.0"'; then
    echo "PAGES_PUBLIC_V9_3_PASS"; break
  fi
  [ "$i" -eq 12 ] && { echo "Pages CDN version timeout"; exit 3; }
  sleep 5
done

echo "[7/7] Vercel Production"
if ! command -v vercel >/dev/null 2>&1; then npm install -g vercel; fi
if ! vercel whoami >/dev/null 2>&1; then vercel login; fi
vercel link --yes --project "$PROJECT" --scope "$TEAM"
vercel --prod --yes --scope "$TEAM"
for i in {1..12}; do
  if curl -fsSL https://local-month.vercel.app/version.json | grep -q '"9.3.0"'; then
    echo "VERCEL_PRODUCTION_V9_3_PASS"
    echo "FINAL_V9_3_DEPLOY_COMPLETE"
    echo "https://local-month.vercel.app/"
    exit 0
  fi
  sleep 5
done
echo "Vercel deploy completed but public CDN version is delayed. GitHub Pages v9.3 is already live."
exit 4
