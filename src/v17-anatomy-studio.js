export const ANATOMY_STUDIO_CSS=`
body.dbAnatomyMode{overflow:hidden!important;background:#030b13!important}
body.dbAnatomyMode #view-anatomy{position:fixed!important;inset:0!important;z-index:99999!important;display:block!important;overflow-y:auto!important;overflow-x:hidden!important;background:#030b13!important;padding:0!important;margin:0!important;max-width:none!important;width:100vw!important;height:100svh!important;-webkit-overflow-scrolling:touch}
body.dbAnatomyMode #view-anatomy>*:not(#dbRefAnatomy){display:none!important}
body.dbAnatomyMode #dbRefAnatomy{display:block!important;width:min(100%,430px)!important;max-width:430px!important;min-height:100svh!important;margin:0 auto!important;padding:calc(env(safe-area-inset-top,0px) + 10px) 10px calc(env(safe-area-inset-bottom,0px) + 76px)!important;background:linear-gradient(180deg,#061521 0%,#020912 100%)!important;overflow-x:hidden!important;box-shadow:0 0 60px #0008!important;box-sizing:border-box!important}
body.dbAnatomyMode #dbRefAnatomy *{box-sizing:border-box;max-width:100%}
body.dbAnatomyMode .rTop{position:sticky;top:0;z-index:60;background:linear-gradient(180deg,#061521 78%,rgba(6,21,33,0));padding:4px 0 10px!important;backdrop-filter:blur(12px)}
body.dbAnatomyMode .rTitle b{font-size:20px!important;letter-spacing:.01em}body.dbAnatomyMode .rTitle span{font-size:12px!important;color:#33a6ff!important}
body.dbAnatomyMode .rIconBtn{width:40px!important;height:40px!important;border-radius:50%!important;background:#092033!important;border-color:#235276!important;box-shadow:inset 0 0 0 1px #0e2d46}
body.dbAnatomyMode .rTabs{height:49px!important;border-radius:16px!important;margin:2px 0 10px!important;padding:3px!important;background:#06131f!important;border-color:#21435e!important;position:sticky;top:54px;z-index:55;backdrop-filter:blur(12px)}
body.dbAnatomyMode .rTabs button{font-size:12px!important;min-height:41px!important;border-radius:13px!important}
body.dbAnatomyMode .rTabs button.on{background:linear-gradient(180deg,#36a2ff,#1685ed)!important;box-shadow:0 5px 18px rgba(26,137,239,.32)!important}
body.dbAnatomyMode .rSeg{margin:8px auto 8px!important;height:45px!important;max-width:350px!important;border-radius:15px!important;background:#071522!important;border-color:#234761!important}
body.dbAnatomyMode .rSeg button{min-height:37px!important;font-size:12px!important}
body.dbAnatomyMode .rMapShell{position:relative!important;border:0!important;border-radius:0!important;background:radial-gradient(circle at 50% 36%,#0a2233 0,#05131f 58%,#020911 100%)!important;overflow:hidden!important;margin:0 -10px!important}
body.dbAnatomyMode .rMapLayout{display:block!important;position:relative!important;min-height:590px!important}
body.dbAnatomyMode .rRegionRail{position:absolute!important;left:7px!important;top:24px!important;bottom:auto!important;z-index:25!important;width:59px!important;padding:0!important;border:0!important;background:transparent!important;display:flex!important;flex-direction:column!important;gap:7px!important;justify-content:flex-start!important}
body.dbAnatomyMode .rRegionRail button{width:59px!important;min-height:59px!important;padding:5px 2px!important;border-radius:14px!important;background:rgba(4,17,29,.82)!important;border:1px solid #21445f!important;font-size:9px!important;line-height:1.05!important;backdrop-filter:blur(8px)!important}
body.dbAnatomyMode .rRegionRail button span{font-size:20px!important;margin-bottom:4px!important}
body.dbAnatomyMode .rRegionRail button.on{border-color:#2ea2ff!important;background:rgba(8,36,59,.94)!important;box-shadow:0 0 0 1px rgba(46,162,255,.35) inset,0 0 14px rgba(46,162,255,.12)!important}
body.dbAnatomyMode .rStageWrap{width:100%!important;min-width:0!important}
body.dbAnatomyMode .rStage{height:590px!important;width:100%!important;overflow:hidden!important;touch-action:none!important;background:transparent!important}
body.dbAnatomyMode .rCanvas{inset:0!important;transform-origin:50% 48%!important}
body.dbAnatomyMode .rCanvas img{object-fit:contain!important;object-position:center center!important;padding:6px 17px 0 55px!important;filter:saturate(1.08) contrast(1.06) brightness(.98) drop-shadow(0 16px 22px #000a)!important}
body.dbAnatomyMode .rCanvas svg{inset:0!important;width:100%!important;height:100%!important;pointer-events:auto!important}
body.dbAnatomyMode .rMuscle{stroke:rgba(255,255,255,.12)!important;stroke-width:.6!important;fill:rgba(35,149,255,.015)!important}
body.dbAnatomyMode .rMuscle.sel{fill:rgba(31,148,255,.76)!important;stroke:#d8efff!important;stroke-width:1.25!important;filter:drop-shadow(0 0 9px rgba(35,153,255,.82))!important}
body.dbAnatomyMode .rMuscle.rel{fill:rgba(244,63,94,.28)!important;stroke:#fb7185!important}
body.dbAnatomyMode .rCallout{top:118px!important;right:12px!important;max-width:150px!important;border-radius:13px!important;background:rgba(5,20,33,.94)!important;border-color:#2ea2ff!important;padding:9px 10px!important;box-shadow:0 12px 28px #0009!important;backdrop-filter:blur(10px)!important}
body.dbAnatomyMode .rCallout b{font-size:12px!important}body.dbAnatomyMode .rCallout:before{width:28px!important}
body.dbAnatomyMode .rTools{right:8px!important;bottom:12px!important;gap:5px!important}
body.dbAnatomyMode .rTools button{width:48px!important;min-height:48px!important;border-radius:13px!important;background:rgba(4,18,30,.88)!important;border-color:#214760!important;font-size:9px!important;backdrop-filter:blur(8px)!important}
body.dbAnatomyMode .rTools button b{font-size:18px!important;margin-bottom:2px!important}
body.dbAnatomyMode .rHint{padding:8px 12px 5px!important;border-top:1px solid #16364f!important;font-size:11px!important;color:#a9bdcc!important;background:#03101a!important}
body.dbAnatomyMode .rLegend{background:#03101a!important;padding:4px 8px 10px!important;font-size:10px!important}
body.dbAnatomyMode .rDetail.open{display:block!important;min-height:calc(100svh - 20px)!important;background:#05131f!important}
body.dbAnatomyMode .rDetailHero{height:340px!important;border:0!important;border-radius:0!important;margin:0 -10px!important;background:#06131f!important}
body.dbAnatomyMode .rDetailHero img{object-fit:cover!important;object-position:center 17%!important;filter:saturate(1.1) contrast(1.05) brightness(.96)!important}
body.dbAnatomyMode .rDetailCard{margin:-28px 0 0!important;border-radius:18px 18px 0 0!important;background:linear-gradient(180deg,rgba(5,20,33,.985),#04101b)!important;border:1px solid #244761!important;border-bottom:0!important;padding:16px 14px 18px!important;box-shadow:0 -8px 30px rgba(0,0,0,.38)!important}
body.dbAnatomyMode .rDetailHead h2{font-size:22px!important}.rBadge{font-size:10px!important}
body.dbAnatomyMode .rDesc{font-size:13px!important;line-height:1.46!important;color:#c5d7e5!important}
body.dbAnatomyMode .rSubTabs{position:sticky!important;top:0!important;z-index:70!important;margin:0 0 12px!important;height:47px!important;border-radius:15px!important;background:#06131f!important;backdrop-filter:blur(12px)!important}
body.dbAnatomyMode .rSubTabs button{font-size:10px!important;min-height:39px!important}
body.dbAnatomyMode .rFact3{gap:7px!important}.rFact3 div{padding:10px 6px!important;border-radius:12px!important;background:#061725!important}.rFact3 b{font-size:9px!important}.rFact3 span{font-size:10px!important;line-height:1.25!important}
body.dbAnatomyMode .rPrimaryBtn{min-height:50px!important;border-radius:12px!important;font-size:13px!important;box-shadow:0 8px 20px rgba(27,141,245,.25)!important}
body.dbAnatomyMode .rActionRow{min-height:50px!important;border-radius:12px!important;background:#061725!important}
body.dbAnatomyMode .rSearchRow{position:sticky!important;top:104px!important;z-index:48!important;background:#06111d!important;padding:6px 0!important;margin:0!important}
body.dbAnatomyMode .rSearchRow input,body.dbAnatomyMode .rSearchRow select{min-height:43px!important;border-radius:12px!important}
body.dbAnatomyMode .rListItem{min-height:52px!important;border-radius:12px!important;background:#061725!important}
.rStudioBottom{position:fixed;left:50%;transform:translateX(-50%);bottom:0;z-index:100001;width:min(100vw,430px);padding:7px 8px calc(env(safe-area-inset-bottom,0px) + 7px);display:grid;grid-template-columns:repeat(5,1fr);gap:3px;background:rgba(3,13,22,.95);border-top:1px solid #16344b;backdrop-filter:blur(18px)}
.rStudioBottom button{border:0;background:transparent;color:#8fa8bd;min-height:50px;border-radius:11px;font-size:9px;font-weight:700}.rStudioBottom button span{display:block;font-size:19px;margin-bottom:3px}.rStudioBottom button.on{color:#2ea2ff;background:#08233a}
@media(min-width:721px){body.dbAnatomyMode #dbRefAnatomy{border-left:1px solid #18364c!important;border-right:1px solid #18364c!important}.rStudioBottom{border-left:1px solid #18364c;border-right:1px solid #18364c}}
@media(max-width:390px){body.dbAnatomyMode #dbRefAnatomy{padding-left:6px!important;padding-right:6px!important}.rMapShell{margin-left:-6px!important;margin-right:-6px!important}.rRegionRail{left:5px!important}.rRegionRail button{width:54px!important;min-height:54px!important}.rStage{height:560px!important}.rCanvas img{padding-left:48px!important;padding-right:12px!important}.rTools{right:5px!important}.rCallout{right:8px!important;max-width:135px!important}}
`;

export const ANATOMY_STUDIO_JS=`(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let anatomyMode=false;
function visible(el){if(!el)return false;const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'}
function nativeNav(label){const candidates=$$('#nav button,#mobileNav button,button');const b=candidates.find(x=>x.textContent.trim().toLowerCase().includes(label.toLowerCase()));if(b){b.click();return true}return false}
function bottom(){let n=$('.rStudioBottom');if(!n){n=document.createElement('div');n.className='rStudioBottom';n.innerHTML='<button data-go="Home"><span>⌂</span>Home</button><button data-go="Workout"><span>🏋</span>Workout</button><button class="on" data-go="Anatomy Lab"><span>♟</span>Anatomy</button><button data-go="Progress"><span>▥</span>Progress</button><button data-go="More"><span>•••</span>More</button>';document.body.appendChild(n);$$('button',n).forEach(b=>b.onclick=()=>{const g=b.dataset.go;if(g==='More'){nativeNav('Profile')||nativeNav('History');return}if(g==='Anatomy Lab')return;leave();nativeNav(g)})}n.style.display=anatomyMode?'grid':'none'}
function enter(){if(anatomyMode)return;anatomyMode=true;document.body.classList.add('dbAnatomyMode');document.documentElement.style.overflowX='hidden';bottom()}
function leave(){anatomyMode=false;document.body.classList.remove('dbAnatomyMode');document.documentElement.style.overflowX='';bottom()}
function sync(){const v=$('#view-anatomy'),ref=$('#dbRefAnatomy');if(v&&ref&&visible(v))enter();else if(anatomyMode)leave();}
function harden(){const ref=$('#dbRefAnatomy');if(!ref)return;ref.setAttribute('role','application');ref.setAttribute('aria-label','DBACK Interactive Muscle Anatomy');$$('.rTools button',ref).forEach((b,i)=>{if(!b.getAttribute('aria-label'))b.setAttribute('aria-label',i===0?'Rotate anatomy':i===1?'Zoom anatomy':'Reset anatomy')});$$('.rMuscle',ref).forEach(p=>{p.setAttribute('role','button');p.setAttribute('tabindex','0');if(!p.dataset.keywired){p.dataset.keywired='1';p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();p.dispatchEvent(new MouseEvent('click',{bubbles:true}))}})}})}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const tx=t.textContent.trim();if(tx==='Anatomy Lab'||tx==='Anatomy')setTimeout(()=>{sync();harden()},80);if(anatomyMode&&['Home','Workout','Progress','History','Profile'].includes(tx))setTimeout(sync,40)},true);
new MutationObserver(()=>{clearTimeout(window.__dbStudio17);window.__dbStudio17=setTimeout(()=>{sync();harden()},70)}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});
window.addEventListener('resize',()=>{if(anatomyMode){document.documentElement.style.overflowX='hidden'}});
setTimeout(()=>{sync();harden()},850);
})();`;
