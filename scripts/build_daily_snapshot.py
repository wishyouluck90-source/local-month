#!/usr/bin/env python3
import json, sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

ROOT=Path(__file__).resolve().parents[1]
KST=timezone(timedelta(hours=9))

def load(name):
    return json.loads((ROOT/"data"/name).read_text(encoding="utf-8"))

def evidence_age(verified, now):
    d=datetime.fromisoformat(verified+"T00:00:00+09:00")
    days=(now-d).days
    if days<=14:return "fresh"
    if days<=30:return "recheck"
    return "stale"

def action_state(w, now):
    op=datetime.fromisoformat(w["open_at"]); cl=datetime.fromisoformat(w["close_at"])
    if now<op:return "upcoming"
    if now<=cl:return "open"
    return "closed"

now=datetime.now(KST)
if len(sys.argv)>1:
    now=datetime.fromisoformat(sys.argv[1])
    if now.tzinfo is None: now=now.replace(tzinfo=KST)

evidence=load("evidence_registry.json")
windows=load("action_windows.json")

items=[]
for e in evidence:
    items.append({
      "id":"evidence:"+e["id"],
      "region":e["region"],
      "category":"evidence",
      "state":evidence_age(e["verified_at"],now),
      "title":e["claim"],
      "source_tier":e["source_tier"],
      "verified_at":e["verified_at"]
    })
for w in windows:
    items.append({
      "id":"action:"+w["region"]+":"+w["title"],
      "region":w["region"],
      "category":"action",
      "state":action_state(w,now),
      "title":w["title"],
      "open_at":w["open_at"],
      "close_at":w["close_at"]
    })

out={"date":now.date().isoformat(),"generated_at":now.isoformat(),"items":items}
dest=ROOT/"data"/"snapshots"/f'{now.date().isoformat()}.json'
dest.parent.mkdir(parents=True,exist_ok=True)
dest.write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding="utf-8")
print(dest)
