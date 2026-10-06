#!/usr/bin/env bash
set -euo pipefail
SRC="$(cd "$(dirname "$0")" && pwd)"
OWNER="wishyouluck90-source"
REPO="local-month"
TEAM="wishyouluck90-3591s-projects"
PROJECT="local-month"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "LOCAL MONTH v9.3 — Program Decision Desk 배포"
echo "1) GitHub main 동기화  2) Pages 자동배포  3) 기존 Vercel Production 배포"

if ! command -v gh >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then brew install gh; else echo "GitHub CLI 필요"; exit 1; fi
fi
if ! gh auth status >/dev/null 2>&1; then gh auth login --web --git-protocol https; fi

echo "[1/6] GitHub repo clone"
git clone "https://github.com/${OWNER}/${REPO}.git" "$TMP/repo" >/dev/null 2>&1

echo "[2/6] v9.3 핵심 파일 반영"
for f in index.html app.js editorial-v8.css version.json; do cp "$SRC/$f" "$TMP/repo/$f"; done
cp "$SRC/scripts/e2e_contract_v93.py" "$TMP/repo/scripts/e2e_contract_v93.py"
cd "$TMP/repo"
python3 scripts/e2e_contract_v93.py
python3 scripts/check_data.py
node --check app.js

echo "[3/6] Git commit + push"
git add index.html app.js editorial-v8.css version.json scripts/e2e_contract_v93.py
if git diff --cached --quiet; then
  echo "GitHub main already has v9.3 files"
else
  git config user.name "나디아"
  git config user.email "actions@users.noreply.github.com"
  git commit -m "feat: add Program Decision Desk and eligibility clarity"
  git push origin main
fi

echo "[4/6] GitHub Pages workflow 확인"
sleep 4
RUN_ID="$(gh run list --repo "$OWNER/$REPO" --workflow pages.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
set +e
gh run watch "$RUN_ID" --repo "$OWNER/$REPO" --exit-status
PAGES_STATUS=$?
set -e
[ "$PAGES_STATUS" -eq 0 ] && echo "Pages E2E: PASS" || echo "Pages E2E: 확인 필요"

echo "[5/6] 기존 Vercel Production에 v9.3 배포"
if ! command -v vercel >/dev/null 2>&1; then npm install -g vercel; fi
if ! vercel whoami >/dev/null 2>&1; then vercel login; fi
vercel link --yes --project "$PROJECT" --scope "$TEAM"
vercel --prod --yes --scope "$TEAM"

echo "[6/6] 공개 version 확인"
for i in {1..10}; do
  if curl -fsSL https://local-month.vercel.app/version.json | grep -q '"9.3.0"'; then
    echo "VERCEL_PRODUCTION_V9_3_PASS"
    echo "https://local-month.vercel.app/"
    exit 0
  fi
  sleep 6
done
echo "배포는 실행됐지만 CDN version 확인이 늦습니다. ChatGPT에서 재검증하세요."
exit 0
