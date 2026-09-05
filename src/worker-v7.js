import base from './worker-v6-hotfix.js';

const VERSION='7.0.0';
const FRONT='https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscular_system.svg';
const BACK='https://commons.wikimedia.org/wiki/Special:Redirect/file/Muscular_system-back.svg';

const PROFESSIONAL_CSS=`
.realAnatomyMap{position:relative;width:100%;aspect-ratio:5/7;max-height:680px;margin:8px auto 0;border-radius:18px;overflow:hidden;background:radial-gradient(circle at 50% 40%,#17283a 0,#0a1624 58%,#07111f 100%);border:1px solid #314b68;box-shadow:inset 0 0 50px #0007,0 14px 40px #0005}
.realAnatomyMap img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:center;filter:drop-shadow(0 12px 18px #0008)}
.mapHotspot{position:absolute;transform:translate(-50%,-50%);border:1px solid transparent;background:rgba(239,68,68,.03);border-radius:50%;cursor:pointer;z-index:4;transition:background .15s,border-color .15s,box-shadow .15s,transform .15s;min-width:18px;min-height:18px}
.mapHotspot:hover,.mapHotspot:focus-visible{background:rgba(239,68,68,.20);border-color:rgba(248,113,113,.75);box-shadow:0 0 0 3px rgba(239,68,68,.14);outline:none;transform:translate(-50%,-50%) scale(1.05)}
.mapHotspot.selected{background:rgba(255,45,77,.34);border-color:#ff6078;box-shadow:0 0 0 2px rgba(255,96,120,.18),0 0 20px rgba(255,45,77,.40)}
.mapJoint{width:22px!important;height:22px!important;border-radius:50%;background:rgba(245,158,11,.22);border-color:rgba(245,158,11,.85);box-shadow:0 0 0 2px rgba(245,158,11,.10)}
.mapJoint:hover,.mapJoint:focus-visible{background:rgba(245,158,11,.38);border-color:#fbbf24}
.mapJoint.selected{background:rgba(34,197,94,.45);border-color:#4ade80;box-shadow:0 0 0 3px rgba(34,197,94,.18),0 0 22px rgba(34,197,94,.35)}
.mapLegend{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;margin:8px 0 0;font-size:11px;color:#94a3b8}.mapLegend span{display:inline-flex;gap:5px;align-items:center}.mapLegend i{width:9px;height:9px;border-radius:50%;display:inline-block}.mapLegend .m{background:#ff304d}.mapLegend .j{background:#f59e0b}.mapLegend .s{background:#22c55e}
.atlasCredit{margin:8px 2px 0;text-align:center;color:#64748b;font-size:10px;line-height:1.35}.atlasCredit a{color:#94a3b8}
.bodyPanel{background:linear-gradient(180deg,#0a1726,#07111f)!important;padding:12px!important}.bodyPanel>b{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#cbd5e1}.human{display:none!important}
@media(max-width:520px){.realAnatomyMap{max-height:none}.bodyGrid{grid-template-columns:1fr!important}}
`;

const BODY_FUNC=`function bodySvg(view){
 const mp=ANAT.maps[view],img=view==='front'?'${FRONT}':'${BACK}';
 const muscleButtons=mp.muscles.map(x=>{const id=x[0],m=anatById(id)||{name:id};const left=(x[1]/2).toFixed(2),top=(x[2]/3.6).toFixed(2),w=Math.max(7,x[3]).toFixed(2),h=Math.max(5,x[4]/1.8).toFixed(2);return '<button type="button" class="mapHotspot '+(anatMuscles.has(id)?'selected':'')+'" data-muscle="'+id+'" aria-label="'+esc(m.name)+'" title="'+esc(m.name)+'" style="left:'+left+'%;top:'+top+'%;width:'+w+'%;height:'+h+'%"></button>'}).join('');
 const jointButtons=mp.joints.map(x=>{const id=x[0],j=anatJointById(id)||{name:id};return '<button type="button" class="mapHotspot mapJoint '+(anatJoints.has(id)?'selected':'')+'" data-joint="'+id+'" aria-label="'+esc(j.name)+'" title="'+esc(j.name)+'" style="left:'+(x[1]/2).toFixed(2)+'%;top:'+(x[2]/3.6).toFixed(2)+'%"></button>'}).join('');
 return '<div class="realAnatomyMap" role="img" aria-label="Professional '+view+' muscular anatomy map"><img src="'+img+'" alt="'+view+' view of the human muscular system" loading="eager" decoding="async">'+muscleButtons+jointButtons+'</div><div class=mapLegend><span><i class=m></i>Muscle target</span><span><i class=j></i>Joint</span><span><i class=s></i>Selected joint</span></div><div class=atlasCredit>Anatomical artwork: OpenStax-derived Wikimedia Commons muscular-system illustration, CC BY-SA. Interactive training overlays by DBACK AI Coach.</div>'
}
`;

function patchHtml(html){
 let out=html.replaceAll('v6.0.0',VERSION).replaceAll('Scientific Training Anatomy · DBACK v6','Professional Musculoskeletal Atlas · DBACK v7');
 const a=out.indexOf('function bodySvg(view){');
 const b=out.indexOf('function selectionSummary(){',a);
 if(a>=0&&b>a)out=out.slice(0,a)+BODY_FUNC+out.slice(b);
 out=out.replace('</style>',PROFESSIONAL_CSS+'</style>');
 out=out.replace('Interactive Body Map</h3><div class=muted>Red = selected muscle · green joint = selected joint','Interactive Muscular Anatomy</h3><div class=muted>Tap a real anatomical region to select a muscle group or joint. Use the index for precise deep structures');
 return out;
}

async function patchJson(response){
 const type=response.headers.get('content-type')||'';
 if(!type.includes('application/json'))return response;
 try{const data=await response.json();if(data&&typeof data==='object'&&'version' in data)data.version=VERSION;const headers=new Headers(response.headers);headers.set('cache-control','no-store');return new Response(JSON.stringify(data),{status:response.status,headers})}catch{return response}
}

export default{
 async fetch(request,env,ctx){
  const url=new URL(request.url);
  const response=await base.fetch(request,env,ctx);
  if(request.method==='GET'&&url.pathname==='/'){
   const type=response.headers.get('content-type')||'';
   if(type.includes('text/html')){const html=await response.text();const headers=new Headers(response.headers);headers.set('cache-control','no-store, no-cache, must-revalidate');return new Response(patchHtml(html),{status:response.status,headers})}
  }
  if(request.method==='GET'&&(url.pathname==='/health'||url.pathname==='/api/anatomy'))return patchJson(response);
  return response;
 }
};
