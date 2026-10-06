#!/usr/bin/env python3
from pathlib import Path
import re, json
root=Path(__file__).resolve().parents[1]
html=(root/"index.html").read_text(encoding="utf-8")
css=(root/"styles.css").read_text(encoding="utf-8")
manifest=json.loads((root/"manifest.json").read_text(encoding="utf-8"))

checks={
  "viewport": 'name="viewport"' in html,
  "apple_mobile_capable": 'apple-mobile-web-app-capable' in html,
  "apple_touch_icon": 'apple-touch-icon' in html,
  "safe_area": 'safe-area-inset-bottom' in css and 'safe-area-inset-top' in css,
  "touch_target_44": 'min-height:44px' in css.replace(" ",""),
  "input_16px": 'input,select,textarea{font-size:16px}' in css.replace(" ",""),
  "horizontal_overflow_guard": 'overflow-x:hidden' in css.replace(" ",""),
  "manifest_standalone": manifest.get("display")=="standalone",
  "manifest_icons": len(manifest.get("icons",[]))>=2,
  "offline_page": (root/"offline.html").exists(),
  "service_worker": (root/"sw.js").exists()
}
print(json.dumps({"ok":all(checks.values()),"checks":checks},ensure_ascii=False,indent=2))
