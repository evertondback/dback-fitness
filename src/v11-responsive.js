export const RESPONSIVE_CSS=`
:root{--db-compact-gap:8px;--db-touch:40px}
.dbCompactToolbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:6px 0 8px}
.dbCompactToolbar .btn{min-height:36px;padding:7px 10px}
.dbExerciseToggle{min-width:38px!important;padding:6px 9px!important}
.exercise.dbCollapsed>.dbSets,.exercise.dbCollapsed>.setgrid,.exercise.dbCollapsed>.anatomyMini,.exercise.dbCollapsed>.muted:not(.exerciseMeta){display:none!important}
.exercise.dbCollapsed{padding-bottom:8px!important}
.dbAnatomyNav{position:sticky;top:4px;z-index:90;display:flex;gap:6px;align-items:center;margin:4px 0 8px;padding:6px;border:1px solid #29445f;border-radius:12px;background:#07131fee;backdrop-filter:blur(12px)}
.dbAnatomyNav .btn{min-height:36px;padding:7px 10px;flex:0 0 auto}
.dbAnatomyNav .grow{flex:1}
@media(max-width:720px){
 body{font-size:14px}
 main,.container,.shell{padding-left:8px!important;padding-right:8px!important}
 .hero{padding:10px!important;margin-bottom:8px!important;border-radius:14px!important}
 .hero h1,.hero h2{font-size:22px!important;line-height:1.1!important;margin:0 0 4px!important}
 .hero p,.hero .muted{margin:2px 0!important}
 .card{padding:9px!important;margin:7px 0!important;border-radius:13px!important}
 .card h2,.card h3{margin:0 0 6px!important}
 .exercise{padding:9px!important;margin:7px 0!important;border-radius:12px!important}
 .exercise>.row{gap:6px!important;align-items:center!important}
 .exercise>.row .btn{min-height:34px!important;padding:6px 9px!important}
 .dbSets{padding:7px!important;margin:6px 0 0!important;border-radius:11px!important}
 .dbSets>.between{margin-bottom:5px!important;gap:5px!important}
 .dbSets>.between .muted{display:none!important}
 .dbSets>.between .add{min-height:34px!important;padding:6px 9px!important}
 .dbSet{display:grid!important;grid-template-columns:42px minmax(96px,1.3fr) minmax(62px,.8fr) minmax(54px,.7fr)!important;gap:5px!important;align-items:end!important;margin:5px 0!important;padding:6px 0!important;border-top:1px solid #20364b}
 .dbSet:first-child{border-top:0}
 .dbSet .field{min-width:0!important;margin:0!important}
 .dbSet .wide{grid-column:auto!important}
 .dbSet label{font-size:10px!important;line-height:1!important;margin-bottom:3px!important;white-space:nowrap}
 .dbSet input{height:36px!important;min-height:36px!important;font-size:16px!important;padding:4px!important;border-radius:8px!important}
 .dbNum{grid-template-columns:30px minmax(0,1fr) 30px!important;gap:2px!important}
 .dbNum button{height:36px!important;min-height:36px!important;padding:0!important;font-size:17px!important;border-radius:8px!important}
 .dbSet>.lg{grid-column:1/3!important;min-height:34px!important;padding:6px 8px!important}
 .dbSet>.rm{grid-column:3/5!important;min-height:34px!important;padding:6px 8px!important}
 .dbSet>.st{grid-column:1/5!important;font-size:11px!important;line-height:1.2!important;margin-top:-1px!important}
 .dbBar{gap:5px!important;margin:6px 0!important}
 .dbBar .btn,.dbBar select{min-height:36px!important;padding:6px 9px!important;flex:1 1 120px!important}
 .dbBack{display:none!important}
 .dbAnatomyNav{top:2px;margin-bottom:6px;padding:5px}
 #view-anatomy .anatomyLayout,#view-anatomy .bodyGrid{gap:7px!important}
 #view-anatomy .realAnatomyMap img{max-height:58vh!important;object-fit:contain!important}
 .dbFallback img{max-height:58vh!important}
 .dbSession{padding:8px!important;margin:7px 0!important}
 .dbHistorySet{gap:4px!important;padding:6px 0!important}
 #mobileNav{padding:5px 5px calc(5px + env(safe-area-inset-bottom))!important}
 #mobileNav button{min-height:42px!important;padding:5px 4px!important;font-size:11px!important}
}
@media(max-width:390px){
 .dbSet{grid-template-columns:38px minmax(88px,1.25fr) 58px 52px!important}
 .dbSet label{font-size:9px!important}
 .dbNum{grid-template-columns:28px minmax(0,1fr) 28px!important}
 .dbNum button,.dbSet input{height:34px!important;min-height:34px!important}
}
`;
export const RESPONSIVE_JS=`(()=>{
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
function enhanceWorkout(){const v=q('#view-workout');if(!v||getComputedStyle(v).display==='none')return;const training=[...v.querySelectorAll('.card')].find(x=>x.querySelector('h3')?.textContent.trim()==='Training');if(!training)return;
 if(!v.querySelector('.dbCompactToolbar')){const bar=document.createElement('div');bar.className='dbCompactToolbar';bar.innerHTML='<button class="btn ghost cAll">Collapse all</button><button class="btn ghost eAll">Expand all</button>';training.before(bar);bar.querySelector('.cAll').onclick=()=>training.querySelectorAll('.exercise').forEach(x=>x.classList.add('dbCollapsed'));bar.querySelector('.eAll').onclick=()=>training.querySelectorAll('.exercise').forEach(x=>x.classList.remove('dbCollapsed'))}
 training.querySelectorAll('.exercise').forEach((x,i)=>{const r=x.querySelector('.row');if(r&&!r.querySelector('.dbExerciseToggle')){const b=document.createElement('button');b.className='btn ghost dbExerciseToggle';b.type='button';b.textContent='▾';b.title='Collapse exercise';b.setAttribute('aria-label','Collapse or expand exercise');b.onclick=()=>{x.classList.toggle('dbCollapsed');b.textContent=x.classList.contains('dbCollapsed')?'▸':'▾'};r.append(b)}if(innerWidth<=720&&i>0&&!x.dataset.dbInit){x.classList.add('dbCollapsed');const b=x.querySelector('.dbExerciseToggle');if(b)b.textContent='▸';x.dataset.dbInit='1'}})
}
function enhanceNumbers(){qa('input[type=number]').forEach(i=>{if(i.dataset.dbNumReady)return;i.dataset.dbNumReady='1';i.addEventListener('focus',()=>setTimeout(()=>i.select?.(),0))})}
function anatomyNav(){const v=q('#view-anatomy');if(!v||getComputedStyle(v).display==='none')return;let ret=null;try{ret=JSON.parse(sessionStorage.getItem('dbRet')||'null')}catch{}if(!v.querySelector('.dbAnatomyNav')){const n=document.createElement('div');n.className='dbAnatomyNav';n.innerHTML='<button class="btn blue dbReturn">← Back</button><span class="grow"></span><button class="btn ghost dbFront">Front</button><button class="btn ghost dbRear">Back</button>';v.prepend(n);const rb=n.querySelector('.dbReturn');rb.textContent=ret?.e?'← '+ret.e:'← Workout';rb.onclick=()=>{const target=ret?.src==='plan'?'Full Plan':'Workout';[...document.querySelectorAll('#nav button,#mobileNav button')].find(b=>b.textContent.trim()===target)?.click();setTimeout(()=>scrollTo(0,ret?.y||0),180)};const panels=[...v.querySelectorAll('.bodyPanel')];const show=i=>{panels.forEach((p,j)=>p.classList.toggle('atlasActive',j===i));if(panels[i])panels[i].style.display='block';panels.forEach((p,j)=>{if(j!==i)p.style.display='none'})};n.querySelector('.dbFront').onclick=()=>show(0);n.querySelector('.dbRear').onclick=()=>show(Math.min(1,panels.length-1));if(panels.length)show(panels.findIndex(p=>p.classList.contains('atlasActive'))>=0?panels.findIndex(p=>p.classList.contains('atlasActive')):0)}}
function cycle(){enhanceWorkout();enhanceNumbers();anatomyNav()}
document.addEventListener('click',()=>setTimeout(cycle,140),true);new MutationObserver(()=>{clearTimeout(window.__dbResponsiveTimer);window.__dbResponsiveTimer=setTimeout(cycle,90)}).observe(document.body,{subtree:true,childList:true});addEventListener('resize',cycle);setTimeout(cycle,500);
})();`;
