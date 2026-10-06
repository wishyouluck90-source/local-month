const CACHE="local-month-v9-0-0";
const ASSETS=["./","./index.html","./styles.css","./app.js","./manifest.json","./offline.html","./icons/icon-192.png","./icons/icon-512.png","./data/regions.json","./data/events.json","./data/benefits.json","./data/all_regions_89.json","./data/freshness.json","./data/evidence_registry.json","./data/evidence_summary.json","./data/action_deadlines.json","./data/evidence_coverage.json","./data/evidence_strength_index.json","./data/ranking_activation_gates.json" ,"./data/benefit_matrix.json","./data/hadong_fieldbook.json","./data/current_benefit_status.json" ,"./data/action_windows.json","./data/uncertainty_policy.json","./data/hadong_pet_life.json","./data/evidence_aging_policy.json","./data/hadong_pretrip_checklist.json" ,"./data/diff_latest.json","./data/notification_policy.json","./version.json","./PRIVACY_DATA.md","./data/hadong_current_2026_10_06.json","./data/dossier_expansion_queue.json","./data/benefit_status_corrections.json","./data/namhae_dossier_draft.json","./data/living_population_layer.json","./data/dossier_standard.json","./data/flagship_dossiers.json","./data/goheung_dossier.json","./data/gurye_dossier.json","./data/review_pulse_model.json","./data/region_dossier_schema.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return resp;
    }).catch(()=>e.request.mode==="navigate"?caches.match("./offline.html"):caches.match(e.request)))
  );
});