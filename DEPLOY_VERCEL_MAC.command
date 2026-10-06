#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

TEAM_SLUG="wishyouluck90-3591s-projects"
PROJECT_NAME="local-month"

echo "LOCAL MONTH v8 Editorial Preview — Vercel 재배포"
echo "기존 TennisLand 프로젝트는 변경하지 않습니다."
echo ""

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    echo "[1/7] Node.js 설치"
    brew install node
  else
    echo "Node.js가 필요합니다. https://nodejs.org/ 에서 설치 후 다시 실행하세요."
    exit 1
  fi
else
  echo "[1/7] Node.js 확인 완료"
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "[2/7] Vercel CLI 설치"
  npm install -g vercel
else
  echo "[2/7] Vercel CLI 확인 완료"
fi

echo "[3/7] 릴리스 검사"
bash scripts/validate_release.sh

echo "[4/7] Vercel 로그인 확인"
if ! vercel whoami >/dev/null 2>&1; then
  vercel login
fi

echo "[5/7] LOCAL MONTH 전용 프로젝트 연결"
# 새 local-month 프로젝트만 연결. 기존 다른 프로젝트 이름은 사용하지 않음.
vercel link --yes --project "$PROJECT_NAME" --scope "$TEAM_SLUG"

echo "[6/7] Production 배포"
DEPLOY_URL="$(vercel --prod --yes --scope "$TEAM_SLUG" | tail -n 1)"
echo "Deploy URL: $DEPLOY_URL"

echo "[7/7] 공개 URL 확인"
PASS=0
for i in $(seq 1 30); do
  CODE="$(curl -L -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL" || true)"
  echo "  ${i}/30 · HTTP ${CODE}"
  if [ "$CODE" = "200" ]; then
    PASS=1
    break
  fi
  sleep 5
done

if [ "$PASS" = "1" ]; then
  echo ""
  echo "배포 완료: $DEPLOY_URL"
  printf "%s\n" "$DEPLOY_URL" > PUBLIC_URL.txt
  echo "공개 릴리스 검증을 실행합니다."
  python3 scripts/verify_public_release.py "$DEPLOY_URL"
  if command -v open >/dev/null 2>&1; then
    open "$DEPLOY_URL"
  fi
else
  echo "배포는 생성됐지만 아직 HTTP 200 확인이 안 됐습니다."
  exit 3
fi
