# RELEASE CHECKLIST — LOCAL MONTH v4.1

## 제품
- [x] 89개 인구감소지역 전체 색인
- [x] 15개 베타 지역 상세
- [x] 일수·테마·예산 기반 추천
- [x] 지역 비교
- [x] 행사/혜택
- [x] 리서치 인박스
- [x] 커뮤니티 로컬 데모
- [x] 앱 내부 알림
- [x] 내 한달살기
- [x] 데이터 백업/복원

## 기술
- [x] 정적 PWA
- [x] manifest
- [x] service worker
- [x] PWA icon
- [x] offline fallback
- [x] 404 fallback
- [x] GitHub Pages workflow
- [x] Vercel static config
- [x] 일일 diff script
- [x] 데이터 정합성 검사
- [x] JavaScript syntax PASS
- [x] 유료 API 의존성 0

## 배포 직전 수동 1회 확인
- [ ] 실제 GitHub 저장소 생성
- [ ] 무료 정적 배포 연결
- [ ] iPhone Safari에서 홈화면 추가
- [ ] 지도 외부 GeoJSON 로딩 확인
- [ ] 백업 다운로드/복원 실제 탭 테스트

## 제품화 이후
- [ ] 서버 계정
- [ ] 기기간 동기화
- [ ] 실시간 댓글
- [ ] 실시간 푸시
- [ ] 허용된 검색/API 기반 자동 리서치
- [ ] 최신 행정경계 지도 데이터

## 추가 검증
- [x] 로컬 HTTP 서버 실행
- [x] 메인 HTML 200
- [x] app.js 200
- [x] 89개 지역 JSON 200
- [x] offline fallback 200
