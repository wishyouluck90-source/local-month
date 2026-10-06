
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

let deferredInstallPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{
 e.preventDefault();deferredInstallPrompt=e;
 const b=$("#nativeInstall");if(b)b.disabled=false;
});
window.addEventListener("appinstalled",()=>{toast("LOCAL MONTH가 설치됐어요.");deferredInstallPrompt=null;});
function openInstallGuide(){$("#installDrawer").classList.add("open");}
async function runNativeInstall(){
 if(!deferredInstallPrompt)return toast("이 브라우저에서는 수동 설치가 필요합니다.");
 deferredInstallPrompt.prompt();
 try{await deferredInstallPrompt.userChoice;}catch(e){}
 deferredInstallPrompt=null;$("#nativeInstall").disabled=true;
}

const state=readState();
const save=()=>localStorage.setItem("lm_state",JSON.stringify(state));
migrateLocalData();
const toast=t=>{const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800)}
let AGING={},UNCERTAINTY={},ACTION_WINDOWS=[],LATEST_DIFF={},PRETRIP={},HADONG={},BENEFIT_MATRIX=[];
let REGIONS=[],EVENTS=[],BENEFITS=[],ALL89=[],DAILY=[],SOURCES={},FRESHNESS={},EVIDENCE=[],EVIDENCE_SUMMARY={},DEADLINES=[],EVIDENCE_COVERAGE={},STRENGTH=[],GATES={};
const coreFiles=["regions","events","benefits","all_regions_89","daily_updates","sources","freshness","evidence_registry","evidence_summary","action_deadlines","evidence_coverage","evidence_strength_index","ranking_activation_gates","evidence_aging_policy","uncertainty_policy","action_windows","diff_latest","hadong_pretrip_checklist","hadong_fieldbook","benefit_matrix"];
Promise.all(coreFiles.map(async name=>{const response=await fetch(`data/${name}.json`);if(!response.ok)throw new Error(name);return response.json()})).then(async data=>{
 if(!window.rcLoaded)await new Promise(resolve=>window.addEventListener("rc-loaded",resolve,{once:true}));
 [REGIONS,EVENTS,BENEFITS,ALL89,DAILY,SOURCES,FRESHNESS,EVIDENCE,EVIDENCE_SUMMARY,DEADLINES,EVIDENCE_COVERAGE,STRENGTH,GATES,AGING,UNCERTAINTY,ACTION_WINDOWS,LATEST_DIFF,PRETRIP,HADONG,BENEFIT_MATRIX]=data;
 init();initRC();window.localMonthReady=true;
}).catch(error=>{console.error("LOCAL MONTH initialization",error);document.querySelector("#loadStatus").hidden=false;});


const FINAL_INTERNAL_LABELS=["SCORE TRANSPARENCY","DATA TRUST RANK","RANKING GATES","EVIDENCE REGISTRY","SYSTEM HEALTH","MOBILE READINESS","ON-DEVICE QA","ZERO-COST ROADMAP","SOURCE REGISTRY","EVIDENCE COVERAGE"];
function finalProductCleanup(){
 document.querySelectorAll(".section").forEach(sec=>{
   const label=(sec.querySelector(".eyebrow")?.textContent||"").trim();
   if(FINAL_INTERNAL_LABELS.includes(label)) sec.classList.add("internal-only");
 });
}

function applyEditorialVisibility(){
 const internalLabels=["SCORE TRANSPARENCY","DATA TRUST RANK","RANKING GATES","EVIDENCE REGISTRY","SYSTEM HEALTH","MOBILE READINESS","ON-DEVICE QA","ZERO-COST ROADMAP","SOURCE REGISTRY"];
 document.querySelectorAll(".section").forEach(sec=>{
   const label=sec.querySelector(".eyebrow")?.textContent?.trim()||"";
   if(internalLabels.includes(label))sec.classList.add("internal-only");
 });
}

function init(){renderProgramDesk();renderHomeRanks("effort");renderRegions();renderAll89();renderEvents();renderBenefits();renderCompare();renderInbox();renderComments();renderNotifications();renderDaily();renderKoreaMap();renderEvidence();renderDeadlines();renderEvidenceCoverage();renderStrengthRank();renderGateCards();finalProductCleanup();applyEditorialVisibility();wire();}
function wire(){
  $$(".nav button").forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));
  $("#searchBtn").onclick=()=>{const q=$("#searchInput").value.trim();switchPanel("regions");const detailed=REGIONS.filter(r=>r.name.includes(q));renderRegions("전체",q);if(!detailed.length&&q){const hits=searchAll89(q),box=$("#all89Grid");box.style.display="grid";box.innerHTML=hits.length?hits.map(r=>`<div class="region"><div class="region-top"><div><div class="small">${r.province} · 인구감소지역</div><div class="region-name">${r.display_name}</div></div><span class="badge">색인</span></div><p class="small" style="margin-top:8px">상세 데이터 수집 예정</p></div>`).join(""):'<div class="note">일치하는 인구감소지역을 찾지 못했습니다.</div>'}};
  $("#refreshBtn").onclick=()=>{localStorage.setItem("lm_last_refresh",new Date().toISOString());$("#refreshText").textContent="데모 갱신 · "+new Date().toLocaleString("ko-KR")+" · 실제 자동 수집은 외부 프로세스";toast("업데이트 시각을 갱신했어요.")};
  $("#notifBtn").onclick=()=>$("#drawer").classList.add("open");$("#drawerClose").onclick=()=>$("#drawer").classList.remove("open");
  $("#backupBtn").onclick=()=>$("#backupDrawer").classList.add("open");$("#backupClose").onclick=()=>$("#backupDrawer").classList.remove("open");
  $("#exportData").onclick=exportLocalData;$("#importData").onclick=()=>$("#restoreFile").click();$("#restoreFile").onchange=restoreLocalData;
  $("#aboutBtn").onclick=()=>$("#aboutDrawer").classList.add("open");$("#aboutClose").onclick=()=>$("#aboutDrawer").classList.remove("open");
  $("#resetLocalData").onclick=resetLocalMonthData;
  $("#installBtn").onclick=openInstallGuide;$("#installClose").onclick=()=>$("#installDrawer").classList.remove("open");
  $("#nativeInstall").onclick=runNativeInstall;
  $("#markRead").onclick=()=>{state.notifications.forEach(n=>n.read=true);save();renderNotifications()};
  if($("#runProgramMatch")) $("#runProgramMatch").onclick=()=>{renderProgramDesk();toast("현재 근거 기준으로 다시 맞췄어요.")};
  $("#addResearch").onclick=addResearch; $("#addComment").onclick=addComment; $("#runReco").onclick=runReco;
  $("#compareClear").onclick=()=>{state.compare=[];save();renderRegions();renderCompare();toast("비교 목록을 비웠어요.")};$("#toggleAll89").onclick=()=>{const e=$("#all89Grid"),o=e.style.display!=="none";e.style.display=o?"none":"grid";$("#toggleAll89").textContent=o?"89개 보기":"접기"};
  $$(".theme").forEach(b=>b.onclick=()=>toggleTheme(b));
  loadPrefs();
  $("#savePrefs").onclick=savePrefs;
  $("#savePlan").onclick=saveCurrentPlan;
  $("#exportPlan").onclick=exportCurrentPlanICS;
  $("#exportPlanJson").onclick=exportCurrentPlanJSON;
  $$("[data-evidence]").forEach(b=>b.onclick=()=>{$$("[data-evidence]").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderEvidence(b.dataset.evidence)});
  $("#exportDeadlines").onclick=exportDeadlinesICS;
  $("#addHadongExpense").onclick=addHadongExpense;
  $("#exportHadong").onclick=exportHadongData;
  $("#hadongCheckin").onclick=hadongWeeklyCheckin;
  renderHadongLog();
  $("#runHealthCheck").onclick=renderHealth;
  $("#exportHealth").onclick=exportHealth;
  renderHealth();
  $("#runDeviceAutoChecks").onclick=autoDeviceChecks;
  $("#exportDeviceQa").onclick=exportDeviceQa;
  autoDeviceChecks();
}
const score=(r,k)=>typeof r.scores[k]==="number"?r.scores[k]:-1, show=v=>typeof v==="number"?v:"—";
function renderHomeRanks(key){const top=[...REGIONS].sort((a,b)=>score(b,key)-score(a,key)).slice(0,5);$("#homeRanks").innerHTML=top.map((r,i)=>`<div class="rank"><div class="rankno">${i+1}</div><div class="rankmain"><strong>${r.name}</strong><small>${r.strengths.join(" · ")} · 신뢰도 ${r.confidence}</small></div><div class="score">${show(r.scores[key])}</div></div>`).join("")}


function allLocalMonthData(){
 const data={};
 for(let i=0;i<localStorage.length;i++){
   const k=localStorage.key(i);
   if(k&&k.startsWith("lm_")) data[k]=localStorage.getItem(k);
 }
 return data;
}
function exportLocalData(){
 const payload={
   product:"LOCAL MONTH",
   version:APP_VERSION,
   schema_version:2,
   exported_at:new Date().toISOString(),
   storage:allLocalMonthData()
 };
 downloadText(`LOCAL_MONTH_backup_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(payload,null,2),"application/json");
 toast("LOCAL MONTH 전체 데이터를 백업했어요.");
}
function resetLocalMonthData(){
 if(!confirm("LOCAL MONTH의 이 기기 저장 데이터를 모두 초기화할까요? 먼저 백업하는 것을 권장합니다."))return;
 const keys=[];
 for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("lm_"))keys.push(k);}
 keys.forEach(k=>localStorage.removeItem(k));
 toast("LOCAL MONTH 로컬 데이터를 초기화했어요.");
 setTimeout(()=>location.reload(),600);
}
function migrateLocalData(){
 const current=Number(localStorage.getItem("lm_schema_version")||1);
 if(current<2){
   if(!localStorage.getItem("lm_prefs")) localStorage.setItem("lm_prefs",JSON.stringify({days:"30",budget:"balanced",pet:"no",settlement:"no"}));
   localStorage.setItem("lm_schema_version","2");
 }
}
function searchAll89(q){
 q=(q||"").trim();if(!q)return [];
 return ALL89.filter(r=>r.name.includes(q)||r.display_name.includes(q)||r.province.includes(q));
}



function renderPipelineStatus(){
 const el=$("#pipelineStatus");if(!el)return;
 if(!LATEST_DIFF||!LATEST_DIFF.current){el.textContent="아직 비교 스냅샷 없음";return;}
 const n=(LATEST_DIFF.new||[]).length,c=(LATEST_DIFF.changed||[]).length,r=(LATEST_DIFF.removed_or_ended||[]).length;
 el.textContent=`${LATEST_DIFF.current} · 신규 ${n} · 변경 ${c} · 종료/삭제 ${r}`;
}

function renderDaily(){
 const d=DAILY[DAILY.length-1]||{new:[],changed:[],expiring:[],needs_confirmation:[]};
 const groups=[["신규",d.new||[]],["변경",d.changed||[]],["마감 임박",d.expiring||[]],["확인 필요",d.needs_confirmation||[]]];
 $("#dailyCards").innerHTML=groups.map(([title,items])=>`<div class="card"><div class="eyebrow">${title}</div><h3>${items.length}건</h3><p>${items.length?items.slice(0,4).join("<br>"):"오늘 기록 없음"}</p></div>`).join("");
}

function provincePrefix(prov){
 return {"부산":"21","대구":"22","인천":"23","경기":"31","강원":"32","충북":"33","충남":"34","전북":"35","전남":"36","경북":"37","경남":"38"}[prov]||"";
}
function declineKeySet(){
 const set=new Set();
 ALL89.forEach(r=>{
   let prefix=provincePrefix(r.province);
   if(r.name==="군위군") prefix="37"; // 2013 경계에서는 경북 소속
   set.add(prefix+":"+r.name);
 });
 return set;
}
function projectPoint(lon,lat){
 const minLon=124.4,maxLon=131.9,minLat=33.0,maxLat=38.7;
 const x=(lon-minLon)/(maxLon-minLon)*480+20;
 const y=(maxLat-lat)/(maxLat-minLat)*650+20;
 return [x,y];
}
function ringPath(ring){
 return ring.map((p,i)=>{const [x,y]=projectPoint(p[0],p[1]);return `${i?"L":"M"}${x.toFixed(1)},${y.toFixed(1)}`}).join("")+"Z";
}
function geometryPath(g){
 if(!g) return "";
 if(g.type==="Polygon") return g.coordinates.map(ringPath).join("");
 if(g.type==="MultiPolygon") return g.coordinates.flatMap(poly=>poly.map(ringPath)).join("");
 return "";
}
let selectedMapRegion=null;
async function renderKoreaMap(){
 const svg=$("#koreaSvg"),loading=$("#mapLoading");
 try{
  const res=await fetch("https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_municipalities_geo_simple.json");
  if(!res.ok) throw new Error("boundary fetch");
  const gj=await res.json(), wanted=declineKeySet();
  svg.innerHTML="";
  gj.features.forEach(f=>{
    const code=(f.properties.code||"").slice(0,2),name=f.properties.name||"";
    const decline=wanted.has(code+":"+name);
    const p=document.createElementNS("http://www.w3.org/2000/svg","path");
    p.setAttribute("d",geometryPath(f.geometry));
    p.setAttribute("class",decline?"decline":"normal");
    const match=ALL89.find(r=>r.name===name&&(r.name==="군위군"?"37":provincePrefix(r.province))===code);
    const disp=match?match.province+" "+match.name:name;
    if(decline && resolveRegion(disp)) p.classList.add("beta");
    if(decline){
      p.setAttribute("tabindex","0");p.setAttribute("aria-label",name);
      const select=()=>selectMapRegion(disp,p);
      p.addEventListener("click",select);
      p.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select()}});
    }
    svg.appendChild(p);
  });
  loading.style.display="none";
  $("#mapStatus").textContent="진한 녹색: 상세 베타 지역 · 연녹색: 인구감소지역 · 공개 KOSTAT 2013 경계 기반";
 }catch(e){
  loading.textContent="지도 경계 연결 실패 · 89개 지역 목록은 아래 지역 탭에서 계속 사용할 수 있습니다.";
  $("#mapStatus").textContent="외부 공개 지도 연결은 네트워크 환경에 따라 제한될 수 있음";
 }
}
function selectMapRegion(name,path){
 $$("#koreaSvg path").forEach(p=>p.classList.remove("selected"));path.classList.add("selected");
 selectedMapRegion=name;
 const r=resolveRegion(name);
 $("#mapSelectedTitle").textContent=name;
 $("#mapSelectedMeta").textContent=r?`${r.province} · ${r.strengths.join(" · ")} · ${r.status}`:"인구감소지역 · 상세 데이터 수집 예정";
 $("#mapGoRegion").disabled=false;
 $("#mapGoRegion").onclick=()=>openRegion(name);
}


function renderBenefitMatrix(){
 const t=$("#benefitMatrix"); if(!t)return;
 const arr=[...BENEFIT_MATRIX].sort((a,b)=>b.opportunity_score-a.opportunity_score);
 t.innerHTML=`<thead><tr><th>지역</th><th>상태</th><th>신청</th><th>여행기간</th><th>일반/청년</th><th>최소소비</th><th>조건</th><th>기회점수</th></tr></thead><tbody>${arr.map(x=>`<tr><td><strong>${x.region}</strong></td><td>${x.status}</td><td>${x.apply}</td><td>${x.travel_period}</td><td>${x.refund_rate}% / ${x.youth_rate}%</td><td>${x.min_spend?Math.round(x.min_spend/10000)+"만원":"확인 필요"}</td><td>${x.visit_rule}</td><td><strong>${x.opportunity_score}</strong></td></tr>`).join("")}</tbody>`;
}







const DEVICE_QA_ITEMS=[
 {id:"safari-load",label:"공개 URL Safari 정상 로딩",type:"manual"},
 {id:"standalone",label:"홈화면 추가 후 standalone 실행",type:"auto"},
 {id:"search",label:"지역 검색 동작",type:"manual"},
 {id:"recommend",label:"AI Stay Match 추천 실행",type:"manual"},
 {id:"compare",label:"지역 3곳 비교",type:"manual"},
 {id:"backup",label:"JSON 백업 다운로드",type:"manual"},
 {id:"storage",label:"localStorage 사용 가능",type:"auto"}
];
function deviceQaState(){return readValidated("lm_device_qa",{});}
function saveDeviceQaState(s){localStorage.setItem("lm_device_qa",JSON.stringify(s));}
function autoDeviceChecks(){
 const s=deviceQaState();
 const standalone=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
 try{localStorage.setItem("lm_device_qa_probe","1");localStorage.removeItem("lm_device_qa_probe");s.storage=true;}catch(e){s.storage=false;}
 s.standalone=standalone;
 saveDeviceQaState(s);
 renderDeviceQa();
}
function renderDeviceQa(){
 const box=$("#deviceQaList");if(!box)return;
 const s=deviceQaState();
 box.innerHTML=DEVICE_QA_ITEMS.map(x=>{
   const ok=!!s[x.id];
   return `<div class="rank"><div class="rankmain"><strong>${x.label}</strong><small>${x.type==="auto"?"자동검사":"사용자 확인"}</small></div><button class="btn deviceQaToggle" data-id="${x.id}" data-type="${x.type}">${ok?"완료 ✓":"체크"}</button></div>`;
 }).join("");
 const pass=DEVICE_QA_ITEMS.filter(x=>!!s[x.id]).length;
 $("#deviceQaPass").textContent=pass;
 $("#deviceQaTotal").textContent=DEVICE_QA_ITEMS.length;
 $("#deviceQaPercent").textContent=Math.round(pass/DEVICE_QA_ITEMS.length*100)+"%";
 $$(".deviceQaToggle").forEach(b=>b.onclick=()=>{
   if(b.dataset.type==="auto"){autoDeviceChecks();return;}
   const st=deviceQaState();st[b.dataset.id]=!st[b.dataset.id];saveDeviceQaState(st);renderDeviceQa();
 });
}
function exportDeviceQa(){
 const s=deviceQaState();
 const payload={
  product:"LOCAL MONTH",
  release:"v7.6",
  tested_at:new Date().toISOString(),
  user_agent:navigator.userAgent,
  standalone:window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true,
  checks:DEVICE_QA_ITEMS.map(x=>({id:x.id,label:x.label,passed:!!s[x.id]}))
 };
 downloadText(`LOCAL_MONTH_device_QA_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(payload,null,2),"application/json");
}

function computeMobileHealth(){
 const meta=(name)=>document.querySelector(`meta[name="${name}"]`)?.content||"";
 const minTouch=44;
 const nav=$("#mobileHealthCards");
 const checks=[
   {name:"Standalone 메타",ok:meta("apple-mobile-web-app-capable")==="yes",detail:"iOS 홈화면 추가"},
   {name:"Safe Area",ok:getComputedStyle(document.body).paddingBottom.includes("env")||CSS.supports?.("padding-bottom: env(safe-area-inset-bottom)"),detail:"홈 인디케이터 대응"},
   {name:"입력 자동줌 방지",ok:[...document.querySelectorAll("input,select,textarea")].every(el=>parseFloat(getComputedStyle(el).fontSize)>=16),detail:"16px 이상"},
   {name:"터치 타깃",ok:[...document.querySelectorAll("button")].every(el=>Math.max(el.getBoundingClientRect().height,parseFloat(getComputedStyle(el).minHeight)||0)>=minTouch-1),detail:"44px 기준"},
   {name:"가로 오버플로",ok:document.documentElement.scrollWidth<=window.innerWidth+2,detail:`${document.documentElement.scrollWidth}px / ${window.innerWidth}px`},
   {name:"서비스워커",ok:"serviceWorker" in navigator,detail:"PWA 가능 브라우저"}
 ];
 return checks;
}
function renderMobileHealth(){
 const box=$("#mobileHealthCards");if(!box)return;
 const checks=computeMobileHealth();
 box.innerHTML=checks.map(x=>`<div class="card"><div class="eyebrow">${x.ok?"PASS":"CHECK"}</div><h3>${x.name}</h3><p>${x.detail}</p><span class="badge ${x.ok?"ok":"dev"}">${x.ok?"정상":"확인 필요"}</span></div>`).join("");
}

function computeHealth(){
 const checks=[
   {name:"89개 지역 데이터",ok:Array.isArray(ALL89)&&ALL89.length===89,detail:`${ALL89.length||0}/89`},
   {name:"베타 지역",ok:Array.isArray(REGIONS)&&REGIONS.length>=15,detail:`${REGIONS.length||0}개`},
   {name:"Evidence Registry",ok:Array.isArray(EVIDENCE)&&EVIDENCE.length>=20,detail:`${EVIDENCE.length||0}건`},
   {name:"Action Window",ok:Array.isArray(ACTION_WINDOWS)&&ACTION_WINDOWS.length>=1,detail:`${ACTION_WINDOWS.length||0}건`},
   {name:"Daily Diff",ok:!!(LATEST_DIFF&&LATEST_DIFF.current),detail:LATEST_DIFF?.current||"없음"},
   {name:"AI Stay Match",ok:typeof recoScore==="function"&&typeof runReco==="function",detail:"로컬 추천엔진"},
   {name:"백업/복원",ok:typeof exportLocalData==="function"&&typeof restoreLocalData==="function",detail:"localStorage"},
   {name:"오프라인/PWA",ok:"serviceWorker" in navigator,detail:"지원 브라우저 기준"}
 ];
 return {checked_at:new Date().toISOString(),checks,pass:checks.filter(x=>x.ok).length,total:checks.length};
}
function renderHealth(){
 const box=$("#healthCards");if(!box)return;
 const h=computeHealth();
 box.innerHTML=h.checks.map(x=>`<div class="card"><div class="eyebrow">${x.ok?"PASS":"CHECK"}</div><h3>${x.name}</h3><p>${x.detail}</p><span class="badge ${x.ok?"ok":"dev"}">${x.ok?"정상":"확인 필요"}</span></div>`).join("");
}
function exportHealth(){
 const h=computeHealth();
 downloadText(`LOCAL_MONTH_health_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(h,null,2),"application/json");
}

function hadongState(){
  return readValidated("lm_hadong",{expenses:[],checkins:[]});
}
function saveHadongState(x){localStorage.setItem("lm_hadong",JSON.stringify(x));}
function addHadongExpense(){
  const amount=prompt("오늘 지출 금액(원)"); if(!amount)return;
  if(!Number.isFinite(+amount)||+amount<0)return toast("0 이상의 금액을 입력해 주세요.");
  const category=prompt("카테고리: 숙박/체험/보험/식비/교통/기타","체험")||"기타";
  const note=prompt("간단한 메모","");
  const st=hadongState(); st.expenses.unshift({date:new Date().toISOString().slice(0,10),amount:+amount||0,category,note});
  saveHadongState(st);renderHadongLog();toast("하동 지출을 기록했어요.");
}
function hadongWeeklyCheckin(){
  const score=prompt("이번 주 생활 적합도 1~5","4"); if(!score)return;
  if(!Number.isInteger(+score)||+score<1||+score>5)return toast("1부터 5까지 정수를 입력해 주세요.");
  const note=prompt("가장 좋았던 점/불편했던 점","");
  const st=hadongState();st.checkins.unshift({date:new Date().toISOString().slice(0,10),score:+score,note});
  saveHadongState(st);renderHadongLog();toast("주간 체크인을 기록했어요.");
}
function renderHadongLog(){
  const box=$("#hadongLog");if(!box)return;
  const st=hadongState();
  const total=st.expenses.reduce((s,x)=>s+(+x.amount||0),0);
  const support=st.expenses.filter(x=>["숙박","체험","보험"].includes(x.category)).reduce((s,x)=>s+(+x.amount||0),0);
  box.innerHTML=`<div class="metrics"><div class="metric"><strong>${total.toLocaleString()}원</strong><span>누적 지출</span></div><div class="metric"><strong>${support.toLocaleString()}원</strong><span>지원후보 지출</span></div><div class="metric"><strong>${st.checkins.length}</strong><span>주간 체크인</span></div></div>`+
  (st.expenses.length?st.expenses.slice(0,5).map(x=>`<div class="rank"><div class="rankmain"><strong>${escapeHTML(x.category)} · ${x.amount.toLocaleString()}원</strong><small>${x.date} · ${escapeHTML(x.note||"")}</small></div></div>`).join(""):'<div class="small" style="margin-top:12px">아직 지출 기록이 없습니다.</div>');
}
function exportHadongData(){
  const payload={product:"LOCAL MONTH",region:"하동",fieldbook:HADONG,user_data:hadongState(),exported_at:new Date().toISOString()};
  downloadText("LOCAL_MONTH_HADONG_fieldbook.json",JSON.stringify(payload,null,2),"application/json");
}

function renderDeadlines(){
 const now=new Date();
 $("#deadlineList").innerHTML=DEADLINES.map(d=>{
   const dt=new Date(d.start),diff=dt-now;
   const days=Math.ceil(diff/86400000);
   const state=diff<0?"지남":days===0?"오늘":`${days}일 남음`;
   return `<div class="rank"><div class="rankmain"><strong>${d.region} · ${d.title}</strong><small>${new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(dt)}</small></div><span class="badge ${d.priority==="high"?"dev":""}">${state}</span></div>`;
 }).join("");
}
function exportDeadlinesICS(){
 const items=DEADLINES.map(d=>{
   const dt=new Date(d.start);
   const stamp=dt.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z/,"Z");
   return `BEGIN:VEVENT\nDTSTART:${stamp}\nSUMMARY:${escICS(d.region+" · "+d.title)}\nDESCRIPTION:${escICS("LOCAL MONTH Action Deadline")}\nEND:VEVENT`;
 });
 downloadText("LOCAL_MONTH_action_deadlines.ics",`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//LOCAL MONTH//Deadlines//KO\n${items.join("\n")}\nEND:VCALENDAR`,"text/calendar");
}



function renderStrengthRank(){
 const box=$("#strengthRank");if(!box)return;
 box.innerHTML=STRENGTH.slice(0,10).map((x,i)=>`<div class="rank"><div class="rankno">${i+1}</div><div class="rankmain"><strong>${x.region}</strong><small>공식 ${x.official_records}건 · 근거분야 ${x.category_breadth}개 · 최종확인 ${x.last_verified||"미확인"}</small></div><div class="score">${x.score}</div></div>`).join("");
}
function renderGateCards(){
 const box=$("#gateCards");if(!box||!GATES.rules)return;
 const selected=["하동","안동","밀양","산청","태안"];
 box.innerHTML=Object.entries(GATES.rules).map(([key,rule])=>{
   const ready=selected.filter(r=>GATES.regions?.[r]?.[key]?.ready);
   return `<div class="card"><div class="eyebrow">${rule.label}</div><h3>${ready.length?ready.join(" · "):"아직 개방 전"}</h3><p>${rule.note}</p><span class="badge ${ready.length?"ok":"dev"}">${ready.length?ready.length+"곳 기준 충족":"근거 수집중"}</span></div>`;
 }).join("");
}

function renderEvidenceCoverage(){
 const el=$("#evidenceCoverage"); if(!el)return;
 el.textContent=`${EVIDENCE_COVERAGE.covered_regions||0}/${EVIDENCE_COVERAGE.beta_regions||0}개 지역 · ${EVIDENCE_COVERAGE.coverage_percent||0}% · 공식 근거 ${EVIDENCE_COVERAGE.official_evidence_records||0}건`;
}


function pretripState(){
 const saved=readValidated("lm_pretrip",{});
 return PRETRIP.items.map(x=>({...x,status:saved[x.id]||x.status}));
}
function renderPretrip(){
 const box=$("#pretripList");if(!box||!PRETRIP.items)return;
 const arr=pretripState();
 box.innerHTML=arr.map(x=>`<div class="rank"><div class="rankmain"><strong>${x.label}</strong><small>${x.critical?"핵심":"일반"} · ${x.status}</small></div><button class="btn pretripToggle" data-id="${x.id}" data-status="${x.status}">${x.status==="done"?"완료":"체크"}</button></div>`).join("");
 const done=arr.filter(x=>x.status==="done"||x.status==="ready").length;
 const critical=arr.filter(x=>x.critical&&!["done","ready"].includes(x.status)).length;
 $("#pretripDone").textContent=done;$("#pretripCritical").textContent=critical;$("#pretripPercent").textContent=Math.round(done/arr.length*100)+"%";
 $$(".pretripToggle").forEach(b=>b.onclick=()=>{const s=readValidated("lm_pretrip",{});s[b.dataset.id]=b.dataset.status==="done"?"todo":"done";localStorage.setItem("lm_pretrip",JSON.stringify(s));renderPretrip()});
}

function renderEvidence(filter="전체"){
 let arr=EVIDENCE;
 if(filter!=="전체"){
   if(filter==="보은·옥천·영동") arr=arr.filter(x=>x.region.includes("보은")||x.region.includes("옥천")||x.region.includes("영동"));
   else arr=arr.filter(x=>x.region.includes(filter));
 }
 $("#evidenceList").innerHTML=arr.length?arr.map(x=>{const age=evidenceAgeState(x.verified_at);return `<div class="rank"><div class="rankmain"><strong>${x.region} · ${x.claim}</strong><small>${x.source_tier} · ${x.source_title} · 확인 ${x.verified_at} · 신뢰도 ${x.confidence}</small></div><span class="badge ${age.cls}">${age.label}</span><a class="btn" href="${x.source_url}" target="_blank" rel="noopener">출처</a></div>`}).join(""):'<div class="small">등록된 근거가 없습니다.</div>';
}

function addResearch(){const url=$("#rUrl").value.trim(),region=$("#rRegion").value.trim();if(!url||!region)return toast("URL과 지역을 입력해 주세요.");state.research.unshift({url,region,type:$("#rType").value,note:$("#rNote").value.trim()});save();$("#rUrl").value=$("#rRegion").value=$("#rNote").value="";renderInbox()}
function renderInbox(){ $("#researchList").innerHTML=state.research.length?state.research.map((x,i)=>`<div class="rank"><div class="rankmain"><strong>${escapeHTML(x.region)} · ${escapeHTML(x.type)}</strong><small>${escapeHTML(x.note||"메모 없음")} · ${escapeHTML(x.url)}</small></div><button class="btn delResearch" data-i="${i}">삭제</button></div>`).join(""):'<div class="small">저장된 리서치 자료가 없습니다.</div>'; $$(".delResearch").forEach(b=>b.onclick=()=>{state.research.splice(+b.dataset.i,1);save();renderInbox()})}
function addComment(){const t=$("#commentInput").value.trim();if(!t)return;state.comments.unshift({text:t,helpful:0});$("#commentInput").value="";save();renderComments()}
function renderComments(){ $("#commentList").innerHTML=state.comments.map((c,i)=>`<div class="rank"><div class="rankmain"><strong>한달살러 ${i+1}</strong><small>${escapeHTML(c.text)}</small></div><button class="btn helpful" data-i="${i}">도움 ${c.helpful||0}</button></div>`).join("");$$(".helpful").forEach(b=>b.onclick=()=>{state.comments[+b.dataset.i].helpful++;save();renderComments()})}

function ingestDiffNotifications(){
  if(!LATEST_DIFF || !LATEST_DIFF.current) return;
  const seen=readValidated("lm_seen_diff_ids",[]);
  const seenSet=new Set(seen);
  const additions=[];
  const pushItem=(kind,item)=>{
    if(!item || !item.id) return;
    const key=`${LATEST_DIFF.current}:${kind}:${item.id}`;
    if(seenSet.has(key)) return;
    let text="";
    if(kind==="new") text=`신규 · ${item.region||""} ${item.title||item.id}`.trim();
    if(kind==="changed") {
      const after=item.after||{};
      text=`변경 · ${after.region||""} ${after.title||after.id||item.id}`.trim();
    }
    if(kind==="removed") text=`종료/삭제 · ${item.region||""} ${item.title||item.id}`.trim();
    additions.push({text,read:false,source:"daily_diff",diff_key:key});
    seenSet.add(key);
  };
  (LATEST_DIFF.new||[]).forEach(x=>pushItem("new",x));
  (LATEST_DIFF.changed||[]).forEach(x=>pushItem("changed",x));
  (LATEST_DIFF.removed_or_ended||[]).forEach(x=>pushItem("removed",x));
  if(additions.length){
    state.notifications=[...additions,...state.notifications].slice(0,80);
    save();
    localStorage.setItem("lm_seen_diff_ids",JSON.stringify([...seenSet].slice(-500)));
  }
}

function renderNotifications(){const unread=state.notifications.filter(n=>!n.read).length;$("#notifCount").textContent=unread;$("#notifList").innerHTML=state.notifications.map((n,i)=>`<div class="rank"><div class="rankmain"><strong>${n.read?"읽음":"새 알림"}${n.source==="daily_diff"?" · 자동업데이트":""}</strong><small>${escapeHTML(n.text)}</small></div><button class="btn oneRead" data-i="${i}">${n.read?"✓":"읽기"}</button></div>`).join("");$$(".oneRead").forEach(b=>b.onclick=()=>{state.notifications[+b.dataset.i].read=true;save();renderNotifications()})}
let selectedThemes=["culture"];
function toggleTheme(b){const t=b.dataset.theme;if(b.classList.contains("active")){if(selectedThemes.length===1)return;selectedThemes=selectedThemes.filter(x=>x!==t);b.classList.remove("active")}else{if(selectedThemes.length>=3)return toast("테마는 최대 3개");selectedThemes.push(t);b.classList.add("active")}}
function themeLabel(t){return {culture:"문화예술",nomad:"노마드",nature:"자연",pet:"반려견",wellness:"웰니스",benefit:"혜택",settlement:"이주탐색",community:"사람·관계"}[t]}


function recommendationMetric(r,key){
 if(key==='price')return categoryReady(r.name,'price')&&r.cost&&!/수집|미확인|확인 필요|미정/.test(r.cost)?Math.max(score(r,key),0):0;
 const theme={fun:'wellness',effort:'wellness'}[key]||key;
 return Math.max(score(r,key),0)*evidenceFactor(r.name,theme);
}
function recoScore(r,days,budget){const m={wellness:'fun'},metric=k=>recommendationMetric(r,k);const ts=selectedThemes.reduce((s,t)=>s+metric(m[t]||t),0)/Math.max(selectedThemes.length,1);const budgetScore=budget==='save'?metric('price'):budget==='experience'?metric('effort'):(metric('price')+metric('effort'))/2;const keys=days<=7?['culture','fun','nature']:days<=14?['effort','community','culture']:days<=21?['nomad','settlement','community']:['nomad','settlement','price','effort'];return ts*.55+budgetScore*.2+keys.reduce((s,k)=>s+metric(k),0)/keys.length*.25}

function plan(days){return days<=7?[["Day 1–2","생활권 적응"],["Day 3–4","대표 문화·자연"],["Day 5–6","로컬 체험"],["Day 7","생활 평가"]]:days<=14?[["1–3일","생활 기반"],["4–6일","문화 탐색"],["7–9일","자연과 쉼"],["10–14일","관계·주거"]]:days<=21?[["1주차","정착"],["2주차","깊이 보기"],["3주차","미래 테스트"]]:[["1주차","생활권 만들기"],["2주차","지역의 문화"],["3주차","관계 만들기"],["4주차","다음 거점 판단"]]}

let currentRecommendation=null;
function savePrefs(){
 const prefs={days:$("#prefDays").value,budget:$("#prefBudget").value,pet:$("#prefPet").value,settlement:$("#prefSettlement").value};
 localStorage.setItem("lm_prefs",JSON.stringify(prefs));
 $("#stayDays").value=prefs.days;$("#budget").value=prefs.budget;toast("기본 취향을 저장했어요.");
}
function loadPrefs(){
 try{
  const p=readValidated("lm_prefs",null);if(!p)return;
  $("#prefDays").value=p.days||"30";$("#prefBudget").value=p.budget||"balanced";$("#prefPet").value=p.pet||"no";$("#prefSettlement").value=p.settlement||"no";
  $("#stayDays").value=p.days||"30";$("#budget").value=p.budget||"balanced";
  if(p.pet==="yes"&&!selectedThemes.includes("pet")){selectedThemes.push("pet");const b=$('.theme[data-theme="pet"]');if(b)b.classList.add("active");}
  if(p.settlement==="yes"&&!selectedThemes.includes("settlement")){if(selectedThemes.length<3){selectedThemes.push("settlement");const b=$('.theme[data-theme="settlement"]');if(b)b.classList.add("active");}}
 }catch(e){}
}
function explainScore(r,days,budget){
 const labels={culture:"문화예술",nomad:"노마드",nature:"자연",pet:"반려견",wellness:"웰니스",benefit:"혜택",settlement:"이주탐색",community:"사람·관계"};
 const map={culture:"culture",nomad:"nomad",nature:"nature",pet:"pet",wellness:"fun",benefit:"benefit",settlement:"settlement",community:"community"};
 const parts=selectedThemes.map(t=>({label:labels[t],value:Math.max(score(r,map[t]),0),factor:evidenceFactor(r.name,t)})).sort((a,b)=>b.value*b.factor-a.value*a.factor);
 const f=FRESHNESS[r.name]||{}, es=EVIDENCE_SUMMARY[r.name]||{};
 return {parts,freshness:f.last_verified||es.latest||"미확인",confidence:f.confidence||r.confidence,evidence_count:es.count||f.evidence_count||0,official_count:(es.Aplus||0)+(es.A||0),penalized:parts.filter(x=>x.factor<1).map(x=>x.label)};
}
function downloadText(filename,text,type){
 const blob=new Blob([text],{type:type||"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function exportCurrentPlanJSON(){
 if(!currentRecommendation)return toast("먼저 추천을 실행하세요.");
 downloadText(`LOCAL_MONTH_plan_${currentRecommendation.top.region}.json`,JSON.stringify(currentRecommendation,null,2),"application/json");
}
function escICS(s){return String(s).replace(/([,;])/g,"\\$1").replace(/\n/g,"\\n")}


/* v9.3 Program Decision Desk — improves on program-list-only discovery */
function programRegion(r){return REGIONS.find(x=>x.name===r)||null}
function programLifestyleFit(region,prefs){
 const r=programRegion(region); if(!r)return {label:"생활 데이터 수집중",score:null,notes:["지역 상세근거 추가 필요"]};
 let vals=[],notes=[];
 if(typeof r.scores.nomad==="number")vals.push(r.scores.nomad);
 if(prefs.pet==="yes"&&typeof r.scores.pet==="number"){vals.push(r.scores.pet);notes.push(`반려견 지표 ${r.scores.pet}`)}
 if(prefs.car==="no"){notes.push("차량 없는 생활은 교통 근거 별도 확인 필요")}
 const sc=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):null;
 return {label:sc===null?"판단 보류":sc>=80?"생활 적합도 높음":sc>=65?"생활 적합도 보통":"생활 조건 확인 필요",score:sc,notes};
}
