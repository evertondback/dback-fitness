export const ANATOMY26_CSS=`
.db25Canvas>img,.db25Canvas>svg:not(.db26Unified){display:none!important}
.db25Canvas .db26Unified{position:absolute;inset:0;width:100%;height:100%;display:block;overflow:visible;filter:drop-shadow(0 16px 28px #000b)}
.db25Canvas .db26Unified>image{pointer-events:none}
.db25Canvas .db26Unified .db25Muscle{fill:rgba(45,157,255,0);stroke:transparent;stroke-width:0;vector-effect:non-scaling-stroke;cursor:pointer;transition:fill .12s ease,stroke .12s ease,filter .12s ease}
.db25Canvas .db26Unified .db25Muscle:hover,.db25Canvas .db26Unified .db25Muscle:focus-visible{fill:rgba(45,157,255,.16);stroke:#73c4ff;stroke-width:1.2}
.db25Canvas .db26Unified .db25Muscle.sel{fill:rgba(34,151,255,.62);stroke:#dff3ff;stroke-width:1.5;filter:drop-shadow(0 0 11px rgba(45,157,255,.95))}
.db25Canvas .db26Unified .db25Muscle.rel{fill:rgba(244,63,94,.22);stroke:#fb7185;stroke-width:1.1}
.db25Stage{display:flex!important;align-items:center!important;justify-content:center!important}
.db25Canvas{inset:0!important;width:100%!important;height:100%!important;transform-origin:50% 50%!important}
.db25Map{background:radial-gradient(circle at 50% 38%,#0b2a40 0,#061521 55%,#020a12 100%)!important}
.db25Callout{backdrop-filter:blur(12px)}
.db26Status{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);z-index:6;font-size:9px;color:#7f9aaf;background:rgba(3,16,26,.72);border:1px solid #173b55;border-radius:999px;padding:4px 8px;pointer-events:none;white-space:nowrap}
.db25DetailHero>img,.db25DetailHero>svg:not(.db26Unified){display:none!important}
.db25DetailHero .db26Unified{position:absolute;inset:0;width:100%;height:100%;display:block}
@media(max-width:720px){.db26Status{bottom:5px}.db25Callout{max-width:128px!important}.db25Stage{height:590px!important}}
`;

export const ANATOMY26_JS=`(()=>{
const NS='http://www.w3.org/2000/svg';
function unify(canvas){
 if(!canvas||canvas.dataset.db26==='1')return false;
 const img=canvas.querySelector(':scope>img');
 const old=canvas.querySelector(':scope>svg');
 if(!img||!old)return false;
 const src=img.currentSrc||img.src;
 if(!src)return false;
 const svg=document.createElementNS(NS,'svg');
 svg.setAttribute('class','db26Unified');
 svg.setAttribute('viewBox','0 0 1000 1400');
 svg.setAttribute('preserveAspectRatio','xMidYMid meet');
 svg.setAttribute('role','img');
 svg.setAttribute('aria-label','Interactive muscular anatomy');
 const image=document.createElementNS(NS,'image');
 image.setAttribute('href',src);
 image.setAttribute('x','0'); image.setAttribute('y','0'); image.setAttribute('width','1000'); image.setAttribute('height','1400');
 image.setAttribute('preserveAspectRatio','xMidYMid meet');
 svg.appendChild(image);
 [...old.childNodes].forEach(n=>svg.appendChild(n));
 old.replaceWith(svg); img.remove();
 canvas.dataset.db26='1';
 const status=document.createElement('div');status.className='db26Status';status.textContent='Unified anatomical coordinate map';canvas.parentElement?.appendChild(status);
 return true;
}
function unifyDetail(root){
 const hero=root?.querySelector('.db25DetailHero'); if(!hero||hero.dataset.db26==='1')return;
 const img=hero.querySelector(':scope>img'),old=hero.querySelector(':scope>svg'); if(!img||!old)return;
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','db26Unified');svg.setAttribute('viewBox','0 0 1000 1400');svg.setAttribute('preserveAspectRatio','xMidYMid slice');
 const image=document.createElementNS(NS,'image');image.setAttribute('href',img.currentSrc||img.src);image.setAttribute('x','0');image.setAttribute('y','0');image.setAttribute('width','1000');image.setAttribute('height','1400');image.setAttribute('preserveAspectRatio','xMidYMid slice');svg.appendChild(image);
 [...old.childNodes].forEach(n=>svg.appendChild(n));old.replaceWith(svg);img.remove();hero.dataset.db26='1';
}
function run(){
 const v=document.querySelector('#view-anatomy');if(!v)return;
 v.querySelectorAll('.db25Canvas').forEach(unify);unifyDetail(v);
 v.querySelectorAll('.db26Unified .db25Muscle').forEach(p=>{p.setAttribute('pointer-events','visiblePainted');p.setAttribute('tabindex','0')});
}
document.addEventListener('click',()=>setTimeout(run,60),true);
new MutationObserver(()=>{clearTimeout(window.__db26);window.__db26=setTimeout(run,50)}).observe(document.body,{subtree:true,childList:true});
addEventListener('resize',run);setTimeout(run,250);setTimeout(run,900);
})();`;
