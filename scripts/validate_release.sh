#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "[1/4] JavaScript syntax"
node --check app.js
echo "[2/4] Data integrity"
python3 scripts/check_data.py
echo "[3/4] Required files"
for f in index.html app.js styles.css manifest.json sw.js offline.html data/regions.json data/all_regions_89.json data/events.json data/benefits.json; do
  test -f "$f" || { echo "Missing: $f"; exit 1; }
done
echo "[4/4] No paid API secrets"
if grep -R -E 'sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{30,}' . --exclude-dir=.git --exclude='*.md' --exclude='validate_release.sh' >/dev/null 2>&1; then
  echo "Potential real credential pattern found. Review before publishing."
  exit 1
fi
echo "PASS — LOCAL MONTH release checks complete"
