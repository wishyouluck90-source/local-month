#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
QA_FILE="${1:-}"
if [ -z "$QA_FILE" ]; then
  echo "iPhone ON-DEVICE QA에서 내보낸 JSON 파일을 이 창에 드래그한 뒤 Enter:"
  read -r QA_FILE
fi
python3 scripts/promote_v8.py "$QA_FILE"

if [ -d .git ]; then
  git add RELEASED_V8.json
  if ! git diff --cached --quiet; then
    git commit -m "Release LOCAL MONTH v8.0"
  fi
  if git remote get-url origin >/dev/null 2>&1; then
    git push origin main
    git tag -f v8.0.0
    git push -f origin v8.0.0
  fi
fi
echo "v8.0 승격 완료"
