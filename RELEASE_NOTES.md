# LOCAL MONTH v4 — Zero-Cost Release Candidate

## 제품 정의
인구감소지역 한달살러를 위한 Total Search & Research OS.

## 현재 작동 기능
- 89개 인구감소지역 전체 색인/검색
- 15개 베타 지역 상세 데이터
- 일수·테마·예산성향 기반 추천
- 지역 비교
- 월별 행사/체험 피드
- 지역 혜택 피드
- Tourism Effort 구조
- 리서치 인박스
- 로컬 커뮤니티
- 앱 내부 알림
- 내 한달살기 구조
- PWA 설치 구조
- 오프라인 fallback
- localStorage 기반 저장
- JSON 백업/복원
- 일일 스냅샷 비교 스크립트
- 무료 배포 설정(GitHub Pages / Vercel Hobby)

## ZERO-COST
현재 외부 유료 API 의존성 0개.
서버 DB / 로그인 / 결제 / SMS / 실시간 푸시 없음.

## 개발중으로 명시한 기능
- 실시간 웹 자동수집
- 실시간 AI 요약
- 최신 숙소가격 자동수집
- 서버 기반 댓글/계정
- 백그라운드 푸시
- 최신 행정경계 정밀지도

## 데이터 원칙
- 근거 부족 점수 임의 생성 금지
- 공식 사실 / 플랫폼 후기 / 커뮤니티 경험 분리
- 출처·확인일·신뢰도 병기
- 과거 정보는 현재 혜택으로 승격하지 않음

## QA
- JavaScript syntax: PASS
- 89개 지역 데이터 정합성: PASS
- 베타 지역: 15
- 이벤트: 8
- 혜택: 9
- 데이터 백업/복원 구조: PASS
- PWA icon/offline 구조: PASS

## v4.3 Runtime smoke test
- 로컬 정적 서버에서 `/`, `/app.js`, `/data/all_regions_89.json`, `/offline.html` 모두 HTTP 200 확인.
- 정적 배포 구조 정상.
- 공개 URL 발급 전 단계에서 가능한 런타임 검증 완료.

## v7.2 — Data Safety & Release Hygiene
- 전체 `lm_*` 로컬 데이터 백업/복원
- 스키마 버전 2 도입 및 간단 마이그레이션
- LOCAL MONTH 데이터만 선택 초기화
- 개인정보/데이터 저장 안내 추가
- 앱 버전/빌드 정보 추가
- 서비스워커 캐시 버전 갱신

## v7.4 — Pre-deploy verification
- Feature freeze 유지; 신규 기능 추가 없음.
- JavaScript syntax PASS.
- 데이터 정합성 검사 PASS.
- 기존 SHA-256 체크섬 검사 PASS.
- 로컬 정적 서버 런타임: index/app/styles/manifest/89개 지역/evidence/offline/version 모두 HTTP 200.
- GitHub Pages workflow·daily workflow·Vercel config·Mac publish script 존재 확인.
- 공개 URL 생성은 현재 도구 경계상 외부 1회 실행 필요.

## v7.4.1 — QA correction
- Credential scan false positive corrected: the scanner rule literal `AKIA` in `validate_release.sh` was not a credential.
- Release content contains no detected real credential pattern.
