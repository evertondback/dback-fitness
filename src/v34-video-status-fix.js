export const VIDEO34_CSS=`
.db32Btn[data-db32-video]{background:#0b2134!important;border-color:#2c5573!important;color:#dcecff!important;white-space:normal;text-align:left;line-height:1.15;padding:7px 10px!important;font-size:10px!important;min-height:36px!important}
.db32Btn[data-db32-video].warn{background:#0b2134!important;border-color:#2c5573!important;color:#dcecff!important}
.db32VideoMeta{display:block;color:#82a9c8;font-size:9px;font-weight:600;margin-top:2px}
@media(max-width:720px){.db32Btn[data-db32-video]{flex:1 1 100%!important}}
`;

export const VIDEO34_JS=`(()=>{
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
async function load(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
function uniqueExercises(program){const map=new Map();for(const d of Object.values(program?.program||{})){for(const e of d?.exercises||[]){const key=norm(e.id||e.name);if(!key)continue;if(!map.has(key))map.set(key,{id:norm(e.id),name:norm(e.name),raw:e})}}return [...map.values()]}
async function paint(){
 const btn=document.querySelector('.db32Btn[data-db32-video]'); if(!btn)return;
 try{
   const [p,v]=await Promise.all([load('/api/v31/program'),load('/api/manage/videos')]);
   const ex=uniqueExercises(p),preferred=(v?.sources||[]).filter(x=>x.status==='preferred').map(x=>norm(x.exercise_id));
   const ready=ex.filter(e=>preferred.some(k=>k&&(k===e.id||k===e.name))).length;
   const total=ex.length,missing=Math.max(0,total-ready);
   btn.classList.toggle('warn',false);
   btn.innerHTML='<b>Video library · '+ready+'/'+total+' ready</b><span class="db32VideoMeta">'+(missing?missing+' unique exercises still need a preferred video':'All current exercises have a preferred video')+'</span>';
   const stats=[...document.querySelectorAll('.db32Stat')];
   const videoStat=stats.find(x=>x.textContent.includes('Preferred videos ready'));
   if(videoStat)videoStat.innerHTML='<b>'+ready+'/'+total+'</b><span>Unique exercise videos ready</span>';
 }catch(e){
   btn.classList.toggle('warn',false);btn.innerHTML='<b>Video library</b><span class="db32VideoMeta">Status unavailable · tap to review</span>';
 }
}
document.addEventListener('click',()=>setTimeout(paint,120),true);
new MutationObserver(()=>{clearTimeout(window.__db34v);window.__db34v=setTimeout(paint,120)}).observe(document.body,{childList:true,subtree:true});
setInterval(paint,30000);setTimeout(paint,800);
})();`;
