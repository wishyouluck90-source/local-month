#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
REPO_NAME="${1:-local-month}"
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI(gh)가 필요합니다: https://cli.github.com/"
  exit 1
fi
gh auth status >/dev/null
./scripts/validate_release.sh
if [ ! -d .git ]; then
  git init
  git branch -M main
fi
git add .
if ! git diff --cached --quiet; then
  git commit -m "Release LOCAL MONTH zero-cost PWA"
fi
OWNER="$(gh api user -q .login)"
if ! gh repo view "$OWNER/$REPO_NAME" >/dev/null 2>&1; then
  gh repo create "$REPO_NAME" --public --source=. --remote=origin
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO_NAME.git"
fi
git push -u origin main
echo ""
echo "Push complete."
echo "GitHub Actions Pages workflow will deploy automatically after Pages is configured to GitHub Actions."
echo "Repository: https://github.com/$OWNER/$REPO_NAME"
