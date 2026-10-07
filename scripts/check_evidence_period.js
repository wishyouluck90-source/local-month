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
