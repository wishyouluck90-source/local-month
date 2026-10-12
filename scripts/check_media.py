"""Release gate for licensed, locally served destination photographs."""
from pathlib import Path
import json, hashlib, re
root=Path(__file__).resolve().parents[1]
rows=json.loads((root/'assets/photos/provenance.json').read_text())
assert len(rows)==15 and len({r['region'] for r in rows})==15
assert sum(r['bytes'] for r in rows)<5_000_000
media=(root/'media.js').read_text();credits=(root/'photos.html').read_text();sw=(root/'sw.js').read_text()
v=json.loads((root/'version.json').read_text())['version']
for r in rows:
 p=root/r['file'];assert p.is_file() and p.suffix=='.jpg'
 assert len(p.read_bytes())==r['bytes']
 assert hashlib.sha256(p.read_bytes()).hexdigest()==r['sha256']
 assert r['source_url'].startswith('https://') and r['author'].strip()
 assert r['license'] in {'KOGL Type 1','CC0','CC BY-SA 2.0','CC BY-SA 3.0','CC BY-SA 4.0','CC BY 4.0'}
 assert r['file']+'?v='+v in media and r['file']+'?v='+v in credits and r['file']+'?v='+v in sw
 assert r['region'] in credits
assert 'AI 생성 이미지는 지역 사진으로 사용하지 않습니다' in credits
assert 'photos.html?v='+v in sw
assert 'photos.html?v='+v in media
print(json.dumps({'media':'PASS','actual_region_photos':len(rows),'total_bytes':sum(r['bytes'] for r in rows),'licensed':True,'versioned_offline_assets':True},ensure_ascii=False))
