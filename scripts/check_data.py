#!/usr/bin/env python3
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
r=json.loads((root/"data/regions.json").read_text(encoding="utf-8"))
a=json.loads((root/"data/all_regions_89.json").read_text(encoding="utf-8"))
e=json.loads((root/"data/events.json").read_text(encoding="utf-8"))
b=json.loads((root/"data/benefits.json").read_text(encoding="utf-8"))
assert len(a)==89
assert len({(x["province"],x["name"]) for x in a})==89
for ev in e: assert ev["region"]
for x in b: assert x["region"]
print(json.dumps({"ok":True,"regions89":len(a),"beta":len(r),"events":len(e),"benefits":len(b)},ensure_ascii=False))
