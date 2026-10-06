# 무료 배포 가이드

## 1) GitHub Pages
1. 새 GitHub 저장소 생성
2. 이 폴더의 모든 파일을 `main` 브랜치에 업로드
3. GitHub → Settings → Pages → Build and deployment에서 **GitHub Actions** 선택
4. `.github/workflows/pages.yml`이 자동 배포
5. 비용: 0원

## 2) Vercel Hobby
1. 저장소를 Vercel에 연결
2. Framework Preset: `Other`
3. Build Command: 비워둠
4. Output Directory: `.`
5. 비용: Hobby 범위 내 0원
6. `vercel.json` 포함

## 데이터 업데이트
앱 코드를 다시 빌드할 필요 없이 아래 JSON만 교체 가능:
- `data/regions.json`
- `data/events.json`
- `data/benefits.json`
- `data/all_regions_89.json`
- `data/daily_updates.json`
- `data/sources.json`

## 자동 업데이트 파이프라인
매일 외부 조사 결과를 snapshot JSON으로 저장하고:
```bash
python scripts/diff_updates.py data/snapshots/2026-10-05.json data/snapshots/2026-10-06.json > data/diff_latest.json
```
로 변경분 생성.

현재 원칙:
- 유료 API 없음
- 서버 DB 없음
- 로그인 없음
- 외부 결제 없음
