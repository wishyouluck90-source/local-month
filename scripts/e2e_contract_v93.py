from pathlib import Path
import json, subprocess, sys
R=Path(__file__).resolve().parents[1]
h=(R/'index.html').read_text(); j=(R/'app.js').read_text(); c=(R/'editorial-v8.css').read_text()
checks={
 'five_nav': all(x in h for x in ['data-panel="home"','data-panel="regions"','data-panel="rankings"','data-panel="monthly"','data-panel="mystay"']),
 'program_desk_dom': 'id="programDesk"' in h and 'id="programResults"' in h and 'id="runProgramMatch"' in h,
 'eligibility_uncertainty': '자격조건 원문 확인 필요' in j,
 'benefit_normalization_warning': '지원금 구조 원문 확인' in j,
 'lifestyle_separate': 'programLifestyleFit' in j,
 'deadlines_loaded': len(json.load(open(R/'data/action_deadlines.json')))>=1,
 '89_regions': len(json.load(open(R/'data/all_regions_89.json')))==89,
 'js_syntax': subprocess.run(['node','--check',str(R/'app.js')],capture_output=True).returncode==0,
 'css_balanced': c.count('{')==c.count('}')
}
print(json.dumps(checks,ensure_ascii=False,indent=2)); sys.exit(0 if all(checks.values()) else 1)
