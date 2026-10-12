/* Actual destination photographs only; never used as operating evidence. */
const REGION_MEDIA={
  "하동": {
    "src": "assets/photos/hadong.jpg?v=9.6.0",
    "caption": "섬진강과 하동 전경",
    "credit": "Kim Jiho, Korea Tourism Organization",
    "anchor": "hadong"
  },
  "안동": {
    "src": "assets/photos/andong.jpg?v=9.6.0",
    "caption": "하회마을",
    "credit": "Bernard Gagnon",
    "anchor": "andong"
  },
  "태안": {
    "src": "assets/photos/taean.jpg?v=9.6.0",
    "caption": "태안해안국립공원 가의도",
    "credit": "Jjw",
    "anchor": "taean"
  },
  "화천": {
    "src": "assets/photos/hwacheon.jpg?v=9.6.0",
    "caption": "화천읍 전경",
    "credit": "Academy of Korean Studies",
    "anchor": "hwacheon"
  },
  "보은": {
    "src": "assets/photos/boeun.jpg?v=9.6.0",
    "caption": "법주사",
    "credit": "MeganYoungmee",
    "anchor": "boeun"
  },
  "영월": {
    "src": "assets/photos/yeongwol.jpg?v=9.6.0",
    "caption": "영월 풍경",
    "credit": "Korea.net / Korean Culture and Information Service (Jeon Han)",
    "anchor": "yeongwol"
  },
  "단양": {
    "src": "assets/photos/danyang.jpg?v=9.6.0",
    "caption": "도담삼봉",
    "credit": "Steve46814",
    "anchor": "danyang"
  },
  "고성": {
    "src": "assets/photos/goseong.jpg?v=9.6.0",
    "caption": "경남 고성박물관과 유채꽃",
    "credit": "경상남도 고성군",
    "anchor": "goseong"
  },
  "서천": {
    "src": "assets/photos/seocheon.jpg?v=9.6.0",
    "caption": "신성리 갈대밭",
    "credit": "Shinfull",
    "anchor": "seocheon"
  },
  "함양": {
    "src": "assets/photos/hamyang-official.jpg?v=9.6.0",
    "caption": "상림 사계 · 여름",
    "credit": "경상남도 함양군",
    "anchor": "hamyang"
  },
  "밀양": {
    "src": "assets/photos/miryang-official.jpg?v=9.6.0",
    "caption": "위양지",
    "credit": "한국관광공사",
    "anchor": "miryang"
  },
  "옥천": {
    "src": "assets/photos/okcheon.jpg?v=9.6.0",
    "caption": "옥천성당",
    "credit": "Korea Heritage Service",
    "anchor": "okcheon"
  },
  "산청": {
    "src": "assets/photos/sancheong-scenic.jpg?v=9.6.0",
    "caption": "대원사",
    "credit": "(c)한국불교문화사업단, culturalcorpsofkoreanbuddhism",
    "anchor": "sancheong"
  },
  "영동": {
    "src": "assets/photos/yeongdong-scenic.jpg?v=9.6.0",
    "caption": "월류봉",
    "credit": "Shinfull",
    "anchor": "yeongdong"
  },
  "영천": {
    "src": "assets/photos/yeongcheon-scenic.jpg?v=9.6.0",
    "caption": "은해사 극락보전",
    "credit": "HwangHuang",
    "anchor": "yeongcheon"
  }
};
function regionPhoto(name,kind='card'){const m=REGION_MEDIA[name];if(!m)return '';const mode=['card','detail','compare','hero'].includes(kind)?kind:'card';return `<figure class="region-photo photo-${mode}"><img src="${escapeHTML(m.src)}" alt="${escapeHTML(name+' · '+m.caption+' 자료사진')}" width="960" height="640" loading="${mode==='hero'?'eager':'lazy'}" decoding="async" ${mode==='hero'?'fetchpriority="high"':''}><figcaption><span>${escapeHTML(m.caption)} · 자료사진</span><a href="photos.html?v=9.6.0#${escapeHTML(m.anchor)}" target="_blank" rel="noopener" aria-label="${escapeHTML(name)} 사진 출처 (새 탭)">출처 ↗</a></figcaption></figure>`}
