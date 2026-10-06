# Daily Intelligence Pipeline

매일 실행:
```bash
python3 scripts/run_daily_pipeline.py
```

동작:
1. evidence_registry + action_windows를 읽음
2. Evidence를 fresh / recheck / stale로 계산
3. Action을 upcoming / open / closed로 계산
4. `data/snapshots/YYYY-MM-DD.json` 생성
5. 전날과 비교하여 `data/diff_latest.json` 생성
6. 홈 Daily Changelog에 신규/변경/종료를 표시

외부 리서치 자체는 별도 자동화가 수행하고 이 파이프라인은 수집된 검증 데이터의 상태 변경을 계산한다.
