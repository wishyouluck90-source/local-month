#!/usr/bin/env python3
import json, subprocess, sys
from pathlib import Path
from datetime import date, timedelta
ROOT=Path(__file__).resolve().parents[1]

target=sys.argv[1] if len(sys.argv)>1 else None
cmd=["python3",str(ROOT/"scripts"/"build_daily_snapshot.py")]
if target: cmd.append(target)
cp=subprocess.run(cmd,capture_output=True,text=True,check=True)
current=Path(cp.stdout.strip())
current_date=date.fromisoformat(current.stem)
previous=ROOT/"data"/"snapshots"/f"{current_date-timedelta(days=1)}.json"

if previous.exists():
    diff=subprocess.run(["python3",str(ROOT/"scripts"/"diff_updates.py"),str(previous),str(current)],capture_output=True,text=True,check=True)
    (ROOT/"data"/"diff_latest.json").write_text(diff.stdout,encoding="utf-8")
else:
    cur=json.loads(current.read_text(encoding="utf-8"))
    initial={"previous":None,"current":cur["date"],"new":cur["items"],"changed":[],"removed_or_ended":[]}
    (ROOT/"data"/"diff_latest.json").write_text(json.dumps(initial,ensure_ascii=False,indent=2),encoding="utf-8")
print(ROOT/"data"/"diff_latest.json")
