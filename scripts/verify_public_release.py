#!/usr/bin/env python3
import sys, json, urllib.request, urllib.parse
from datetime import datetime

if len(sys.argv)<2:
    print("usage: verify_public_release.py https://your-site.vercel.app/")
    raise SystemExit(2)

base=sys.argv[1].strip()
if not base.startswith(("http://","https://")):
    base="https://"+base
if not base.endswith("/"): base+="/"

targets={
 "index":"",
 "app.js":"app.js",
 "rc.js":"rc.js",
 "storage.js":"storage.js",
 "rc.css":"rc.css",
 "editorial":"editorial-v8.css",
 "version":"version.json",
 "styles.css":"styles.css",
 "manifest":"manifest.json",
 "service_worker":"sw.js",
 "regions89":"data/all_regions_89.json",
 "evidence":"data/evidence_registry.json",
 "offline":"offline.html"
}

results={}
bodies={}
for name,path in targets.items():
    url=urllib.parse.urljoin(base,path)
    try:
        req=urllib.request.Request(url,headers={"User-Agent":"LOCAL-MONTH-release-verifier/1.0"})
        with urllib.request.urlopen(req,timeout=15) as r:
            body=r.read()
            results[name]={"ok":r.status==200,"status":r.status,"content_type":r.headers.get("Content-Type"),"bytes":len(body),"url":url}
            bodies[name]=body
    except Exception as e:
        results[name]={"ok":False,"error":str(e),"url":url}

semantic={}
try:
    semantic["index_brand"]=b"LOCAL MONTH" in bodies["index"]
except: semantic["index_brand"]=False
try:
    regs=json.loads(bodies["regions89"])
    semantic["regions_count"]=len(regs)
    semantic["regions_89"]=len(regs)==89
except:
    semantic["regions_count"]=None;semantic["regions_89"]=False
try:
    manifest=json.loads(bodies["manifest"])
    semantic["manifest_standalone"]=manifest.get("display")=="standalone"
    semantic["manifest_icons"]=len(manifest.get("icons",[]))>=2
except:
    semantic["manifest_standalone"]=False;semantic["manifest_icons"]=False
try:
    ev=json.loads(bodies["evidence"])
    semantic["evidence_records"]=len(ev)
    semantic["evidence_present"]=len(ev)>0
except:
    semantic["evidence_records"]=0;semantic["evidence_present"]=False

all_http=all(x.get("ok") for x in results.values())
all_semantic=all([
 semantic.get("index_brand"),
 semantic.get("regions_89"),
 semantic.get("manifest_standalone"),
 semantic.get("manifest_icons"),
 semantic.get("evidence_present")
])

report={
 "product":"LOCAL MONTH",
 "release_candidate":json.loads(bodies.get("version",b"{}" )).get("version","unknown"),
 "public_url":base,
 "verified_at":datetime.now().astimezone().isoformat(),
 "http_checks":results,
 "semantic_checks":semantic,
 "public_web_pass":bool(all_http and all_semantic),
 "next_step":"Final review; physical iPhone installation remains unverified" if all_http and all_semantic else "fix candidate"
}
print(json.dumps(report,ensure_ascii=False,indent=2))
with open("PUBLIC_RELEASE_QA.json","w",encoding="utf-8") as f:
    json.dump(report,f,ensure_ascii=False,indent=2)
raise SystemExit(0 if report["public_web_pass"] else 1)
