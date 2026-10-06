# LOCAL MONTH 운영 매뉴얼

## 매일
1. 공식 소스 우선으로 신규/변경 정보 수집
2. `data/snapshots/YYYY-MM-DD.json` 저장
3. `scripts/diff_updates.py`로 어제와 비교
4. 신규/변경/마감/종료만 `daily_updates.json`에 반영
5. 공식 근거가 없는 정보는 `미확인`

## 주 1회
- 베타 15개 지역 데이터 신뢰도 점검
- 종료된 행사 제거
- 혜택 유효기간 점검
- 장기숙소/반려견 정책 변경 확인
- Tourism Effort 정책근거 추가

## 월 1회
- 월간 Local Now 초기화
- 다음 달 행사·클래스 선수집
- 랭킹 산식의 근거량 검토
- 백업/복원 테스트
- PWA 설치/오프라인 테스트

## 장애
- 지도 실패: 89개 텍스트 색인 fallback 사용
- 외부 데이터 오류: 마지막 검증 데이터 유지 + 확인 필요
- localStorage 손실: 사용자 JSON 백업 복원
- 잘못된 새 정보: 이전 스냅샷으로 데이터 롤백

## 금지
- 유료 API 자동 활성화
- 출처 없는 점수 생성
- 리뷰 원문 대량 복제
- 플랫폼 약관을 위반하는 크롤링

## GitHub Actions 일일 상태 자동화
- `.github/workflows/daily-status.yml`
- 매일 09:10 KST 실행
- Evidence aging / Action Window 상태 / diff만 자동 계산
- `data/`에 변경이 있을 때만 자동 commit
- 새 웹 사실을 자동 생성하지 않음
