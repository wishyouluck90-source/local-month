# ROLLBACK PLAN — LOCAL MONTH

v8.0 승격 후 아래 중 하나면 v7.7 RC로 롤백:
- 공개 핵심 자산 200 실패
- iPhone Safari 핵심 네비게이션 실패
- 검색/추천/비교 중 하나 실행 불가
- 백업 또는 localStorage 실패
- 서비스워커 캐시 문제

데이터 구조 변경 전에는 JSON 백업을 우선합니다.
