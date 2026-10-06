#!/usr/bin/env python3
import json, sys
from pathlib import Path

def load(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))

if len(sys.argv)!=3:
    raise SystemExit("usage: diff_updates.py PREVIOUS.json CURRENT.json")
prev,cur=map(load,sys.argv[1:])
p={x["id"]:x for x in prev.get("items",[])}
c={x["id"]:x for x in cur.get("items",[])}

new=[c[k] for k in c.keys()-p.keys()]
removed=[p[k] for k in p.keys()-c.keys()]
changed=[]
for k in c.keys() & p.keys():
    if c[k]!=p[k]:
        changed.append({"before":p[k],"after":c[k]})

out={
  "previous":prev.get("date"),
  "current":cur.get("date"),
  "new":new,
  "changed":changed,
  "removed_or_ended":removed
}
print(json.dumps(out,ensure_ascii=False,indent=2))
