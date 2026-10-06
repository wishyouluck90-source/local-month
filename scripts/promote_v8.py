#!/usr/bin/env python3
import json, sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

ROOT=Path(__file__).resolve().parents[1]
KST=timezone(timedelta(hours=9))
qa_path=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/"LOCAL_MONTH_device_QA.json"

if not qa_path.exists():
    print(f"QA 파일이 없습니다: {qa_path}")
    sys.exit(2)

data=json.loads(qa_path.read_text(encoding="utf-8"))
checks=data.get("checks",[])
required={"safari-load","standalone","search","recommend","compare","backup","storage"}
present={x.get("id") for x in checks}
failed=[x for x in checks if not x.get("passed")]

if required-present:
    print("FAIL: 필수 QA 항목 누락", sorted(required-present))
    sys.exit(3)
if failed:
    print("FAIL:", [(x.get("id"),x.get("label")) for x in failed])
    sys.exit(4)

release={
  "product":"LOCAL MONTH",
  "version":"8.0.0",
  "status":"first-public-release",
  "promoted_at":datetime.now(KST).isoformat(),
  "source_release":"v7.7 release candidate",
  "device_qa":"7/7 PASS",
  "standalone":data.get("standalone"),
  "rollback_to":"v7.7 release candidate"
}
(ROOT/"RELEASED_V8.json").write_text(json.dumps(release,ensure_ascii=False,indent=2),encoding="utf-8")
print("PASS: iPhone QA 7/7")
