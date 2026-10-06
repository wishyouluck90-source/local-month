#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
OWNER="wishyouluck90-source"
REPO="local-month"
FULL="$OWNER/$REPO"

echo "LOCAL MONTH — GitHub Continuous Ops 연결"
echo "대상: $FULL"
echo "기존 TennisLand 저장소는 변경하지 않습니다."

if ! command -v gh >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    brew install gh
  else
    echo "GitHub CLI 설치가 필요합니다."
    exit 1
  fi
fi

if ! gh auth status >/dev/null 2>&1; then
  gh auth login --web --git-protocol https
fi

if gh repo view "$FULL" >/dev/null 2>&1; then
  echo "이미 $FULL 저장소가 있습니다. 안전을 위해 덮어쓰지 않습니다."
  exit 3
fi

cat > .gitignore <<'EOF'
.vercel/
.DS_Store
*.log
PUBLIC_URL.txt
LOCAL_MONTH_device_QA.json
EOF

cat > GITOPS_STATUS.json <<'EOF'
{
  "product": "LOCAL MONTH",
  "baseline": "9.0.0",
  "mode": "git-backed continuous operations",
  "paid_api_dependencies": 0,
  "data_policy": "verified public evidence only; no guessed values"
}
EOF

if [ ! -d .git ]; then
  git init -b main
fi
git add .
git commit -m "chore: establish LOCAL MONTH v9 production baseline"

gh repo create "$FULL" --public --source=. --remote=origin --push --description "LOCAL MONTH — month-long stay research for Korea's population-decline regions"

gh repo view "$FULL" --json nameWithOwner,url,defaultBranchRef,visibility
echo "GITHUB_BOOTSTRAP_COMPLETE"
echo "https://github.com/$FULL"
