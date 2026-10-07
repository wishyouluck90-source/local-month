const APP_VERSION='9.4.1';
function readJSON(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return value===null?fallback:value}catch{return fallback}}
function readState(){const value=readJSON('lm_state',{}),out={};for(const key of ['saved','compare','research','comments','notifications','events'])out[key]=Array.isArray(value?.[key])?value[key]:[];out.saved=out.saved.filter(x=>typeof x==='string');out.compare=out.compare.filter(x=>typeof x==='string').slice(0,3);out.research=out.research.filter(x=>x&&typeof x.url==='string'&&typeof x.region==='string');out.comments=out.comments.filter(x=>x&&typeof x.text==='string').map(x=>({...x,helpful:Number.isFinite(x.helpful)?x.helpful:0}));out.notifications=out.notifications.filter(x=>x&&typeof x.text==='string');out.events=out.events.filter(x=>typeof x==='string');return out}
function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function safeURL(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?escapeHTML(u.href):''}catch{return ''}}

function validStoredValue(key,value){
 const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const strings=x=>Array.isArray(x)&&x.every(v=>typeof v==='string');
 const optional=(x,k,check)=>x[k]===undefined||check(x[k]);
 const note=x=>x===null||typeof x==='string';
 const date=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x));
 if(key==='lm_seen_diff_ids')return strings(value);
 if(key==='lm_saved_plans')return Array.isArray(value)&&value.every(p=>object(p)&&object(p.top)&&typeof p.top.region==='string'&&Array.isArray(p.plan)&&p.plan.every(row=>strings(row))&&optional(p,'themes',strings)&&optional(p,'days',x=>[7,14,21,30].includes(Number(x))));
 if(!object(value))return false;
 if(key==='lm_state')return ['saved','compare','events'].every(k=>optional(value,k,strings))&&['research','comments','notifications'].every(k=>optional(value,k,a=>Array.isArray(a)&&a.every(x=>object(x)&&(k==='research'?typeof x.url==='string'&&typeof x.region==='string':typeof x.text==='string'))));
 if(key==='lm_hadong')return Array.isArray(value.expenses)&&Array.isArray(value.checkins)&&value.expenses.every(x=>object(x)&&date(x.date)&&Number.isFinite(x.amount)&&x.amount>=0&&typeof x.category==='string'&&optional(x,'note',note))&&value.checkins.every(x=>object(x)&&date(x.date)&&Number.isInteger(x.score)&&x.score>=1&&x.score<=5&&optional(x,'note',note));
 if(key==='lm_pretrip')return Object.values(value).every(x=>['todo','done','ready','partial'].includes(x));
 if(key==='lm_device_qa')return Object.values(value).every(x=>typeof x==='boolean');
 if(key==='lm_prefs')return optional(value,'days',x=>['7','14','21','30'].includes(String(x)))&&optional(value,'budget',x=>['save','balanced','experience'].includes(x))&&['pet','settlement'].every(k=>optional(value,k,x=>['yes','no'].includes(x)));
 return true;
}
function readValidated(key,fallback){const value=readJSON(key,fallback);return validStoredValue(key,value)?value:fallback}
// Restore only included keys. Roll back writes if quota/storage failure occurs.
function applyBackup(incoming){const before=Object.fromEntries(Object.keys(incoming).map(k=>[k,localStorage.getItem(k)])),written=[];try{for(const [k,v]of Object.entries(incoming)){localStorage.setItem(k,v);written.push(k)}}catch(error){for(const k of written.reverse()){if(before[k]===null)localStorage.removeItem(k);else localStorage.setItem(k,before[k])}throw error}}
