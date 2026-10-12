const fs=require('fs'),vm=require('vm'),assert=require('assert');
const rc=fs.readFileSync('rc.js','utf8');
let now=Date.parse('2026-10-25T23:59:59.999+09:00');
class Clock extends Date { static now(){return now;} }
const ctx={Date:Clock,Intl,isCorrectedBenefit:()=>false,evidenceAgeState:()=>({label:'최신'})};
vm.createContext(ctx);
vm.runInContext(rc.slice(rc.indexOf('function evidenceWithinPeriod'),rc.indexOf('\n',rc.indexOf('function liveEvidence'))),ctx);
const record={source_tier:'A',status:'active',verified_at:'2026-10-20',valid_until:'2026-10-25'};
assert(ctx.liveEvidence(record),'last millisecond in KST remains within the published period');
now+=1;
assert(!ctx.liveEvidence(record),'fresh verification must not override an ended program');
for(const end of ['2026-02-30','2026-13-01','not-a-date',42])assert(!ctx.liveEvidence({...record,valid_until:end}));
assert(ctx.liveEvidence({...record,valid_until:undefined}),'undated infrastructure keeps the existing freshness guard');
assert(!ctx.liveEvidence({...record,valid_until:undefined,status:'unconfirmed'}));
console.log('PASS: published end date overrides freshness, KST boundary, malformed dates, and unconfirmed exclusion');

const sancheong=JSON.parse(fs.readFileSync('data/evidence_registry.json','utf8')).find(r=>r.id==='sancheong-free-entry');
assert.equal(sancheong.valid_until,'2026-10-11');
now=Date.parse('2026-10-11T23:59:59.999+09:00');assert(ctx.liveEvidence(sancheong));
now+=1;assert(!ctx.liveEvidence(sancheong),'Sancheong free entry ends even while its verification is fresh');
console.log('PASS: actual Sancheong record excludes free-entry evidence from October 12 KST');

const registry=JSON.parse(fs.readFileSync('data/evidence_registry.json','utf8'));
for(const [id,end] of [['miryang-pet-center-2026','2026-08-15'],['miryang-pet-payback-2026','2026-09-30'],['miryang-dog-sports-day-2026','2026-10-24']]){const r=registry.find(r=>r.id===id);assert.equal(r.valid_until,end);now=Date.parse(end+'T23:59:59.999+09:00');assert(ctx.liveEvidence(r));now+=1;assert(!ctx.liveEvidence(r));}
now=Date.parse('2026-10-20T12:00:00+09:00');assert(!ctx.liveEvidence(registry.find(r=>r.id==='miryang-pet-payback-2026')));assert(!ctx.liveEvidence(registry.find(r=>r.id==='miryang-pet-center-2026')));
console.log('PASS: actual Miryang pool/payback/sports KST boundaries; expired offers excluded on launch day');
