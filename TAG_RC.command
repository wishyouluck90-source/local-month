#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -d .git ]; then
  echo "Git 저장소가 아직 없습니다."
  exit 1
fi
git tag -f v7.7-rc
git push -f origin v7.7-rc
echo "v7.7-rc tag 완료"
