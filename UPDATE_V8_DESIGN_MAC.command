#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

TEAM="wishyouluck90-3591s-projects"
PROJECT="local-month"

echo "LOCAL MONTH v9.0 — COMPLETE PRODUCT BASELINE"
echo "기존 local-month 프로젝트만 업데이트합니다."
echo "TennisLand는 변경하지 않습니다."
echo ""

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI 설치"
  npm install -g vercel
fi

if ! vercel whoami >/dev/null 2>&1; then
  vercel login
fi

echo "[1/4] local-month 프로젝트 연결"
vercel link --yes --project "$PROJECT" --scope "$TEAM"

echo "[2/4] Production 재배포"
URL="$(vercel --prod --yes --scope "$TEAM" | tail -n 1)"
echo "$URL" > PUBLIC_URL.txt

echo "[3/4] 공개 URL 대기"
for i in $(seq 1 40); do
  CODE="$(curl -L -s -o /dev/null -w "%{http_code}" "$URL" || true)"
  echo "  $i/40 · HTTP $CODE"
  if [ "$CODE" = "200" ]; then break; fi
  sleep 5
done

echo "[4/4] LOCAL MONTH 콘텐츠 확인"
python3 scripts/verify_public_release.py "$URL"

echo ""
echo "v8 Editorial Preview 배포 완료"
echo "$URL"
if command -v open >/dev/null 2>&1; then open "$URL"; fi
