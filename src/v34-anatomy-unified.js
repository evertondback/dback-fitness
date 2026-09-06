import {ANATOMY27_CSS,ANATOMY27_JS} from './v27-anatomy-vector.js';

export const ANATOMY34_CSS = ANATOMY27_CSS + `
/* v34: one SVG coordinate system owns both artwork and hit geometry. */
#view-anatomy>.db27{display:block!important}
#view-anatomy>*:not(.db27){display:none!important}
.db27{max-width:1180px;margin:0 auto;background:linear-gradient(180deg,#081722,#030b12)!important;border-color:#1d3448!important}
.db27Canvas{background:radial-gradient(circle at 50% 26%,#10283a 0,#07131e 52%,#030a11 100%)!important}
.db27Stage{min-height:620px}
.db27Svg{display:block!important;width:100%!important;height:100%!important;max-width:760px;margin:0 auto;overflow:visible;transform-origin:50% 50%!important}
.db27Muscle{pointer-events:auto!important;cursor:pointer!important}
.db27Muscle .mfill{transition:fill .13s ease,stroke .13s ease,filter .13s ease,opacity .13s ease}
.db27Muscle:hover .mfill,.db27Muscle:focus-visible .mfill{stroke:#bde4ff!important;stroke-width:2!important;filter:brightness(1.12)}
.db27Muscle.sel .mfill{fill:#2297ff!important;stroke:#e8f6ff!important;stroke-width:2.4!important;filter:drop-shadow(0 0 8px rgba(34,151,255,.8))}
.db27Callout{backdrop-filter:blur(14px);box-shadow:0 14px 34px #000b,0 0 0 1px #2c9dff33 inset}
.db27Callout button{min-height:40px}
.db27Legend{border-top:1px solid #17364c;background:#04101a}
.db27AlignBadge{position:absolute;left:50%;top:10px;transform:translateX(-50%);z-index:9;padding:5px 9px;border:1px solid #24506d;border-radius:999px;background:#061522dc;color:#8fbedf;font-size:9px;font-weight:800;letter-spacing:.04em;pointer-events:none}
@media(max-width:720px){.db27Stage{height:590px!important;min-height:590px}.db27Svg{max-width:none}.db27Callout{max-width:140px}.db27AlignBadge{top:6px;font-size:8px}}
`;

export const ANATOMY34_JS = ANATOMY27_JS + `
;(()=>{
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  function harden(){
    const host=q('#view-anatomy'),root=q('.db27',host||document); if(!host||!root)return;
    qa('.db30,.db29,.db25,#dbRefAnatomy',host).forEach(x=>x.remove());
    const svg=q('.db27Svg',root);
    if(svg){
      svg.setAttribute('preserveAspectRatio','xMidYMid meet');
      svg.setAttribute('role','img');
      svg.setAttribute('aria-label','Interactive muscular anatomy map');
      if(!svg.querySelector('.db27AlignBadge')){
        const stage=q('.db27Stage',root); if(stage&&!stage.querySelector('.db27AlignBadge')){
          const b=document.createElement('div');b.className='db27AlignBadge';b.textContent='UNIFIED VECTOR MAP';stage.append(b);
        }
      }
    }
    qa('.db27Muscle',root).forEach(g=>{
      g.setAttribute('role','button');g.setAttribute('tabindex','0');
      if(!g.dataset.db34key){g.dataset.db34key='1';g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();g.dispatchEvent(new MouseEvent('click',{bubbles:true}))}})}
    });
  }
  document.addEventListener('click',()=>setTimeout(harden,80),true);
  new MutationObserver(()=>{clearTimeout(window.__db34a);window.__db34a=setTimeout(harden,80)}).observe(document.body,{childList:true,subtree:true});
  setTimeout(harden,500);
})();`;
