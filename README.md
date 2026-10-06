# LOCAL MONTH

인구감소지역 한달살러를 위한 Total Search & Research OS — Zero-Cost Static PWA Prototype.

## 실행
정적 서버에서 이 폴더를 서빙하세요.
- Python: `python3 -m http.server 8000`
- 또는 GitHub Pages / Vercel / Netlify 무료 정적 배포

## 포함 기능
- 지역 탐색
- Tourism Effort 베타 근거
- 일수/테마 기반 추천
- 지역 비교
- 이번 달 행사
- 혜택
- 리서치 인박스
- 로컬 커뮤니티
- 앱 내부 알림
- 내 한달살기 구조
- PWA manifest + service worker
- localStorage 기반 저장

## 비용 원칙
외부 유료 API 없음. 유료 연결이 필요한 기능은 UI에 개발중으로만 표시.

## v3 추가
- 공개 GeoJSON 기반 실제 대한민국 시군구 지도(네트워크 연결 시)
- 89개 인구감소지역 하이라이트
- 지도 클릭 → 지역 상세 연결
- Daily Changelog 신규/변경/마감/확인필요 UI
- 지도 실패 시 89개 텍스트 색인 fallback

## v4 실사용 안정성
- 89개 통합검색
- JSON 백업/복원
- PWA 아이콘
- 오프라인 fallback
- 접근성 focus/reduced-motion
- 데이터 정합성 검사
