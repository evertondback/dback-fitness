export const VIDEO35_CSS=`
.db32Btn[data-db32-video]{background:#0b2134!important;border-color:#2c5573!important;color:#dcecff!important;white-space:normal!important;text-align:left!important;font-size:10px!important;line-height:1.15!important;min-height:36px!important;padding:7px 10px!important}
.db32Btn[data-db32-video].warn{background:#0b2134!important;border-color:#2c5573!important;color:#dcecff!important}
.db35VideoSub{display:block;color:#81a8c8;font-size:9px;font-weight:600;margin-top:2px}
`;
export const VIDEO35_JS=`(()=>{
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
async function get(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
function unique(program){const out=[];const seen=new Set();for(const d of Object.values(program?.program||{})){for(const e of d?.exercises||[]){const k=norm(e.id||e.name);if(!k||seen.has(k))continue;seen.add(k);out.push({id:norm(e.id),name:norm(e.name)})}}return out}
async function fix(){const buttons=[...document.querySelectorAll('button')].filter(b=>b.matches('[data-db32-video]')||b.textContent.includes('videos need sourcing'));if(!buttons.length)return;try{const [p,v]=await Promise.all([get('/api/v31/program'),get('/api/manage/videos')]);const ex=unique(p),pref=(v?.sources||[]).filter(x=>x.status==='preferred').map(x=>norm(x.exercise_id));const ready=ex.filter(e=>pref.some(k=>k&&(k===e.id||k===e.name))).length,total=ex.length,missing=Math.max(0,total-ready);for(const b of buttons){b.classList.remove('warn');b.setAttribute('data-db32-video','');b.innerHTML='<b>Video library · '+ready+'/'+total+' ready</b><span class="db35VideoSub">'+(missing?missing+' unique exercises missing a preferred video':'Complete for current program')+'</span>'}const stat=[...document.querySelectorAll('.db32Stat')].find(x=>x.textContent.includes('Preferred videos ready')||x.textContent.includes('Unique exercise videos ready'));if(stat)stat.innerHTML='<b>'+ready+'/'+total+'</b><span>Unique exercise videos ready</span>'}catch{for(const b of buttons){b.classList.remove('warn');b.innerHTML='<b>Video library</b><span class="db35VideoSub">Tap to review saved sources</span>'}}
}
document.addEventListener('click',()=>setTimeout(fix,80),true);new MutationObserver(()=>{clearTimeout(window.__db35video);window.__db35video=setTimeout(fix,80)}).observe(document.body,{childList:true,subtree:true,characterData:true});setInterval(fix,15000);setTimeout(fix,500);window.__DBACK_VIDEO35__=true;
})();`;
