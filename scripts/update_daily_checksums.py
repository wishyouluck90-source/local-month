#!/usr/bin/env python3
"""Refresh only derived daily data hashes; preserve all release/source hashes."""
from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parents[1]

def refresh(root):
 manifest=root/'CHECKSUMS.sha256'
 rows=[line.split('  ',1) for line in manifest.read_text().splitlines()]
 derived={'data/diff_latest.json'}|{str(p.relative_to(root)) for p in (root/'data/snapshots').glob('*.json')}
 existing={name for _,name in rows}
 rows += [['',name] for name in sorted(derived-existing)]
 result=[]
 for digest,name in rows:
  if name in derived:digest=hashlib.sha256((root/name).read_bytes()).hexdigest()
  result.append(digest+'  '+name+'\n')
 manifest.write_text(''.join(result))

if __name__=='__main__':
 refresh(ROOT)
 print('Updated derived daily data checksums; release/source hashes preserved')
