#!/usr/bin/env bash
set -euo pipefail
REPO_NAME="${1:-local-month}"
OWNER="$(gh api user -q .login)"
URL="https://${OWNER}.github.io/${REPO_NAME}/"
echo "Checking ${URL}"
for i in $(seq 1 30); do
  CODE="$(curl -L -s -o /dev/null -w "%{http_code}" "$URL" || true)"
  if [ "$CODE" = "200" ]; then
    echo "PASS: ${URL}"
    exit 0
  fi
  echo "wait ${i}/30 · HTTP ${CODE}"
  sleep 10
done
echo "아직 공개되지 않았습니다. GitHub Actions를 확인하세요."
exit 1
