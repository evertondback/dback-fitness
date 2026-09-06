export const WARMUP33_CSS=`
.db33WarmVideo{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px;padding-top:7px;border-top:1px solid #1d3448}.db33WarmVideo .db33v{min-height:30px;border:1px solid #28506e;border-radius:8px;background:#0a2133;color:#eaf6ff;padding:5px 8px;font-size:9px;font-weight:800;cursor:pointer}.db33WarmVideo .yt{border-color:#7f1d1d;background:#321318;color:#fee2e2}.db33WarmVideo .drive{border-color:#2b7d4b;background:#0e2d1c;color:#dff9e7}.db33WarmVideo .missing{opacity:.55;cursor:not-allowed}.db33WarmHealth{margin-left:7px;font-size:9px;font-weight:800;color:#7ee2a8}.db33WarmHealth.bad{color:#ff9ca5}.db31WarmItem[data-db33-video-ready="1"]{position:relative}.db31WarmItem[data-db33-video-ready="1"]:after{content:'VIDEO READY';position:absolute;right:7px;top:6px;font-size:7px;letter-spacing:.04em;color:#67bfff;opacity:.72}@media(max-width:600px){.db33WarmVideo .db33v{flex:1 1 44%;min-height:34px}.db33WarmItem[data-db33-video-ready="1"]:after{display:none}}
`;

export const WARMUP33_JS=`(()=>{
const V={
 'Toe / Foot Prep':{youtube:'https://www.youtube.com/watch?v=dVDMUuWtX00',drive:'https://drive.google.com/file/d/1sEM-mgrAstVBMFSh41_OMTGgzpBAZm6Y/view'},
 'Toe Spread / Toe Curl':{youtube:'https://www.youtube.com/watch?v=dVDMUuWtX00',drive:'https://drive.google.com/file/d/1sEM-mgrAstVBMFSh41_OMTGgzpBAZm6Y/view'},
 'Ankle CARs':{youtube:'https://www.youtube.com/watch?v=vIDJiMShg4o',drive:'https://drive.google.com/file/d/1ySVhUJqk8RzEmGkJHTMVPYZFyUE6OLWp/view'},
 'Controlled Knee Circles':{youtube:'https://www.youtube.com/watch?v=92owncvIHlY'},
 '90/90 Hip Switches':{youtube:'https://www.youtube.com/watch?v=m51AZSXMvEA'},
 'Hip CARs':{youtube:'https://www.youtube.com/watch?v=PO1of6rKX3Q'},
 'Cat-Cow':{youtube:'https://www.youtube.com/watch?v=2of247Kt0tU'},
 'Thoracic Rotation':{youtube:'https://www.youtube.com/watch?v=l3Ze_9iXL-M'},
 'Neck CARs':{youtube:'https://www.youtube.com/watch?v=BsZmSx34hvQ'},
 'Shoulder CARs':{youtube:'https://www.youtube.com/watch?v=ghXn2-ZYfU4'},
 'Scapular Push-Up':{youtube:'https://www.youtube.com/watch?v=NKekqeudgWs'},
 'Forearm Pronation / Supination':{youtube:'https://www.youtube.com/watch?v=Y-2-lnALVZE'},
 'Wrist Mobility':{youtube:'https://www.youtube.com/watch?v=zSzeOHqj1Sw'},
 'Glute Bridge':{youtube:'https://www.youtube.com/watch?v=wPM8icPu6H8'},
 'Dead Bug':{youtube:'https://www.youtube.com/watch?v=zechBkcIMf0'},
 'Dead Hang':{youtube:'https://www.youtube.com/watch?v=fq9gDvNZQ2c'},
 'Wall Slide':{youtube:'https://www.youtube.com/watch?v=i_0zLUcE-zk'}
};
const EXPECTED=['Toe / Foot Prep','Ankle CARs','Controlled Knee Circles','90/90 Hip Switches','Hip CARs','Cat-Cow','Thoracic Rotation','Neck CARs','Shoulder CARs','Scapular Push-Up','Forearm Pronation / Supination','Wrist Mobility','Glute Bridge','Dead Bug','Dead Hang','Wall Slide'];
const open=u=>{try{if(window.openai?.openExternal)return window.openai.openExternal({href:u})}catch{}window.open(u,'_blank','noopener,noreferrer')};
const search=n=>'https://www.youtube.com/results?search_query='+encodeURIComponent(n+' exercise proper form tutorial');
function nameOf(item){return item.querySelector('b')?.textContent?.trim()||''}
function make(item,name){const src=V[name];if(!src)return false;let bar=item.querySelector('.db33WarmVideo');if(!bar){bar=document.createElement('div');bar.className='db33WarmVideo';item.append(bar)}bar.innerHTML='<button type="button" class="db33v yt" data-yt>YouTube Video</button>'+(src.drive?'<button type="button" class="db33v drive" data-drive>Drive Video</button>':'<button type="button" class="db33v missing" disabled>Drive Missing</button>')+'<button type="button" class="db33v" data-search>Search YouTube</button>';
 bar.querySelector('[data-yt]').onclick=e=>{e.preventDefault();e.stopPropagation();open(src.youtube)};
 bar.querySelector('[data-drive]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(src.drive)});
 bar.querySelector('[data-search]').onclick=e=>{e.preventDefault();e.stopPropagation();open(search(name))};
 item.dataset.db33VideoReady='1';return true}
function badge(details,ready,total,bad){const s=details.querySelector('summary');if(!s)return;let b=s.querySelector('.db33WarmHealth');if(!b){b=document.createElement('span');b.className='db33WarmHealth';s.append(b)}b.textContent=' · Videos '+ready+'/'+total;b.classList.toggle('bad',bad)}
function guard(){document.querySelectorAll('.db31Warm').forEach(details=>{const items=[...details.querySelectorAll('.db31WarmItem')],names=items.map(nameOf),ready=items.reduce((n,item)=>n+(make(item,nameOf(item))?1:0),0),missing=names.filter(n=>!V[n]);badge(details,ready,items.length,items.length!==16||ready!==items.length||missing.length>0);if(items.length&& (items.length!==16||ready!==items.length||missing.length))console.error('[DBACK warm-up video guard]',{items:items.length,ready,missing})})}
async function audit(){try{const r=await fetch('/api/v31/program',{cache:'no-store'}),d=await r.json(),names=(d.warmup||[]).map(x=>x.name),missing=names.filter(n=>!V[n]);window.DBACK_WARMUP_VIDEO_HEALTH={ok:names.length===16&&missing.length===0,count:names.length,missing,checkedAt:new Date().toISOString()};if(missing.length||names.length!==16)console.error('[DBACK warm-up source audit]',window.DBACK_WARMUP_VIDEO_HEALTH)}catch(e){window.DBACK_WARMUP_VIDEO_HEALTH={ok:false,error:e.message,checkedAt:new Date().toISOString()}}}
let t;const schedule=()=>{clearTimeout(t);t=setTimeout(()=>{guard();audit()},120)};
new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true});document.addEventListener('click',schedule,true);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});window.addEventListener('pageshow',schedule);window.addEventListener('focus',schedule);setTimeout(()=>{guard();audit()},350);setInterval(guard,5000);
})();`;
