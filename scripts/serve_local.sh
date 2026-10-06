#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${1:-8000}"
echo "LOCAL MONTH local server"
echo "http://localhost:${PORT}"
python3 -m http.server "$PORT"
