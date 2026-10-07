const CACHE="local-month-9.4.2";
const ASSETS=["./", "./index.html", "./styles.css?v=9.4.2", "./editorial-v8.css?v=9.4.2", "./rc.css?v=9.4.2", "./storage.js?v=9.4.2", "./app.js?v=9.4.2", "./rc.js?v=9.4.2", "./manifest.json", "./offline.html", "./version.json", "./icons/icon-192.png", "./icons/icon-512.png", "./data/DAILY_UPDATE_CONTRACT.json", "./data/REGION_DETAIL_TEMPLATE.json", "./data/UPDATE_QUEUE.json", "./data/action_deadlines.json", "./data/action_windows.json", "./data/all_regions_89.json", "./data/benefit_matrix.json", "./data/benefit_status_corrections.json", "./data/benefits.json", "./data/current_benefit_status.json", "./data/daily_updates.json", "./data/diff_latest.json", "./data/dossier_expansion_queue.json", "./data/dossier_standard.json", "./data/events.json", "./data/evidence_aging_policy.json", "./data/evidence_coverage.json", "./data/evidence_registry.json", "./data/evidence_strength_index.json", "./data/evidence_summary.json", "./data/flagship_dossiers.json", "./data/freshness.json", "./data/goheung_dossier.json", "./data/gurye_dossier.json", "./data/hadong_current_2026_10_06.json", "./data/hadong_fieldbook.json", "./data/hadong_pet_life.json", "./data/hadong_pretrip_checklist.json", "./data/hadong_research_layers.json", "./data/living_population_layer.json", "./data/namhae_dossier_draft.json", "./data/notification_policy.json", "./data/ranking_activation_gates.json", "./data/region_dossier_schema.json", "./data/regions.json", "./data/review_pulse_model.json", "./data/settlement_signals.json", "./data/sources.json", "./data/uncertainty_policy.json"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('local-month-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 const release=CACHE.slice('local-month-'.length),shellAssets=new Set(ASSETS.filter(x=>!x.includes('/data/')).map(x=>new URL(x,self.registration.scope).href));
 event.respondWith((async()=>{
 let cache;try{cache=await caches.open(CACHE)}catch{}
 const cached=async request=>{try{return await cache?.match(request)}catch{return undefined}};
 // Versioned assets stay paired with the HTML captured by this worker.
 if((url.searchParams.get('v')===release||url.pathname.endsWith('/version.json'))&&shellAssets.has(url.href)){const hit=await cached(event.request);if(hit)return hit}
 let response;
 try{
  response=await fetch(event.request);
  if(response.ok){
   if(event.request.mode==='navigate'){
    const html=await response.clone().text();
    if(!html.includes('storage.js?v='+release+'"')){const prior=await cached('./index.html');if(prior)return prior;return response}
   }
   try{await cache?.put(event.request,response.clone())}catch{} // Cache quota must not discard a good network response.
   return response;
  }
  if(response.status<500)return response;
 }catch{}
 const hit=await cached(event.request);if(hit)return hit;
 if(event.request.mode==='navigate'){const fallback=await cached('./index.html')||await cached('./offline.html');if(fallback)return fallback}
 return response||new Response('Offline',{status:503});
 })());
});
