#!/usr/bin/env python3
"""Release checks for the v9.4 local candidate, with no deployment side effects."""
import json,re,hashlib,subprocess
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).resolve().parents[1]
class Document(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.assets=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='script' and 'src' in a:self.assets.append(a['src'])
  if tag=='link' and a.get('rel')=='stylesheet':self.assets.append(a['href'])
p=Document();p.feed((root/'index.html').read_text());assert len(p.ids)==len(set(p.ids)),'duplicate IDs'
metadata=json.loads((root/'version.json').read_text());v=metadata['version'];baseline_commit=metadata['base_commit']
assert re.fullmatch(r'[0-9a-f]{40}',baseline_commit),'base_commit must be an exact commit SHA'
for asset in p.assets:assert asset.endswith('?v='+v),asset;assert (root/asset.split('?')[0]).is_file()
for name in ['app.js','rc.js','storage.js','sw.js']:subprocess.run(['node','--check',str(root/name)],check=True)
for f in (root/'data').rglob('*.json'):json.loads(f.read_text())
assert len(json.loads((root/'data/all_regions_89.json').read_text()))==89
assert 'local-month-'+v in (root/'sw.js').read_text()
assert 'const APP_VERSION='+repr(v) in (root/'storage.js').read_text()
assert 'getRegistrations' not in (root/'index.html').read_text()
assert 'k.startsWith(\'local-month-\')' in (root/'sw.js').read_text()
for f in (root/'data').rglob('*.json'):
 baseline=subprocess.check_output(['git','show',baseline_commit+':'+str(f.relative_to(root))],cwd=root)
 assert hashlib.sha256(baseline).digest()==hashlib.sha256(f.read_bytes()).digest(),f
names=[]
for f in ['app.js','rc.js','storage.js']:names.extend(re.findall(r'^function (\w+)\(', (root/f).read_text(),re.M))
assert len(names)==len(set(names)),'duplicate function declarations'
print(json.dumps({'static':'PASS','version':v,'regions':89,'source_data':'unchanged from '+baseline_commit,'duplicate_ids':0,'duplicate_functions':0}))
