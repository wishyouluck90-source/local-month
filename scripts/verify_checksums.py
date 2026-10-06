#!/usr/bin/env python3
from pathlib import Path
import hashlib, sys
root=Path(__file__).resolve().parents[1]
bad=[]
for line in (root/"CHECKSUMS.sha256").read_text(encoding="utf-8").splitlines():
    if not line.strip(): continue
    expected,name=line.split("  ",1)
    p=root/name
    if not p.exists():
        bad.append((name,"missing"));continue
    h=hashlib.sha256(p.read_bytes()).hexdigest()
    if h!=expected:bad.append((name,"mismatch"))
if bad:
    print("FAIL",bad);sys.exit(1)
print("PASS",sum(1 for _ in (root/"CHECKSUMS.sha256").read_text().splitlines() if _.strip()),"files")
