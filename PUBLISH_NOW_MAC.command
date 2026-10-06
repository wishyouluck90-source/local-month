#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

REPO_NAME="${1:-local-month}"

echo "LOCAL MONTH v7.5 공개 배포"
echo "Repository: ${REPO_NAME}"
echo ""

if ! command -v git >/dev/null 2>&1; then
  echo "git이 없습니다. Xcode Command Line Tools 설치가 필요합니다."
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI(gh)가 없습니다."
  if command -v brew >/dev/null 2>&1; then
    echo "Homebrew로 GitHub CLI를 설치합니다."
    brew install gh
  else
    echo "먼저 GitHub CLI를 설치한 뒤 다시 실행하세요: https://cli.github.com/"
    exit 2
  fi
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub 로그인 화면을 엽니다."
  gh auth login
fi

echo "[1/7] 릴리스 검사"
bash scripts/validate_release.sh

echo "[2/7] Git 저장소 준비"
if [ ! -d .git ]; then
  git init
  git branch -M main
fi

git add .
if ! git diff --cached --quiet; then
  git commit -m "Release LOCAL MONTH v7.5"
fi

OWNER="$(gh api user -q .login)"

echo "[3/7] 전용 GitHub 저장소 준비"
if ! gh repo view "$OWNER/$REPO_NAME" >/dev/null 2>&1; then
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --description "LOCAL MONTH — 인구감소지역 한달살기 Research OS"
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO_NAME.git"
fi

echo "[4/7] main push"
git push -u origin main

echo "[5/7] GitHub Pages 설정"
gh api --method POST "repos/$OWNER/$REPO_NAME/pages" -f build_type=workflow >/dev/null 2>&1 || true

URL="https://${OWNER}.github.io/${REPO_NAME}/"
ACTIONS_URL="https://github.com/${OWNER}/${REPO_NAME}/actions"

echo "[6/7] 공개 URL 대기"
PASS=0
for i in $(seq 1 60); do
  CODE="$(curl -L -s -o /dev/null -w "%{http_code}" "$URL" || true)"
  echo "  ${i}/60 · HTTP ${CODE}"
  if [ "$CODE" = "200" ]; then
    PASS=1
    break
  fi
  sleep 10
done

echo "[7/7] 결과"
if [ "$PASS" = "1" ]; then
  echo ""
  echo "배포 완료: $URL"
  echo "Actions: $ACTIONS_URL"
  if command -v open >/dev/null 2>&1; then
    open "$URL"
  fi
else
  echo ""
  echo "아직 HTTP 200이 확인되지 않았습니다."
  echo "Actions 상태를 확인하세요: $ACTIONS_URL"
  if command -v open >/dev/null 2>&1; then
    open "$ACTIONS_URL"
  fi
  exit 3
fi
