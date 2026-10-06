#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
URL="${1:-}"

if [ -z "$URL" ] && [ -f PUBLIC_URL.txt ]; then
  URL="$(cat PUBLIC_URL.txt)"
fi
if [ -z "$URL" ]; then
  echo "공개 URL을 입력하세요:"
  read -r URL
fi

python3 scripts/verify_public_release.py "$URL"
echo ""
echo "공개 웹 검증 PASS."
echo "이제 iPhone Safari에서 URL을 열고 앱의 ON-DEVICE QA 7개를 완료하세요."
if command -v open >/dev/null 2>&1; then
  open "$URL"
fi
