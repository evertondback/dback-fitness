import app from './worker-v6.js';

const HOTFIX_STYLE = `
<style id="dback-anatomy-map-hotfix">
.bodyPanel{background:radial-gradient(circle at 50% 28%,#10253a 0,#081525 68%);overflow:hidden}
.human{display:block;width:100%;height:auto;min-height:440px;max-height:590px;margin:4px auto 0;filter:drop-shadow(0 14px 28px rgba(0,0,0,.28))}
.bodySurface{fill:#d8e3ef;stroke:#7f9ab5;stroke-width:1.25}
.bodySurfaceDark{fill:#b9c9da;stroke:#6f879f;stroke-width:1.1}
.bodyMidline{fill:none;stroke:#7890a9;stroke-width:.65;stroke-dasharray:2.4 2.4;opacity:.65}
.muscleHotspot{fill:#8f2935;stroke:#f2a6ad;stroke-width:1.05;opacity:.88;cursor:pointer;transition:fill .15s,opacity .15s,stroke-width .15s}
.muscleHotspot:hover,.muscleHotspot:focus{fill:#c83f4f;stroke:#fff;stroke-width:1.45;opacity:1;outline:none}
.muscleHotspot.selected{fill:#ff304d;stroke:#fff;stroke-width:1.6;opacity:1}
.jointHotspot{fill:#f7b32b;stroke:#fff;stroke-width:1.35;cursor:pointer;opacity:.98}
.jointHotspot.selected{fill:#22d36b;stroke:#fff;stroke-width:1.8}
.mapLabel{fill:#dceaff;font-size:7px;font-weight:800;letter-spacing:.3px;text-anchor:middle;paint-order:stroke;stroke:#07111f;stroke-width:2.2px;stroke-linejoin:round}
.mapHint{fill:#91a9c2;font-size:6.2px;text-anchor:middle}
@media(max-width:800px){.human{min-height:390px}}
@media(max-width:520px){.human{min-height:500px}.bodyPanel{padding:12px 8px}}
</style>`;

const ENHANCED_BODY_SVG = String.raw`
function bodySvg(view){
 const mp=ANAT.maps[view];
 const front=view==='front';
 const base='<g aria-hidden="true">'
  +'<ellipse class=bodySurface cx=100 cy=27 rx=17 ry=20/>'
  +'<path class=bodySurface d="M91 45 C84 49 75 53 70 63 C66 71 65 95 68 111 C70 124 72 142 75 159 C78 171 83 177 88 181 L112 181 C117 177 122 171 125 159 C128 142 130 124 132 111 C135 95 134 71 130 63 C125 53 116 49 109 45 Z"/>'
  +'<path class=bodySurfaceDark d="M88 176 C82 184 78 194 76 211 L71 275 C70 291 68 316 70 334 C71 343 76 349 83 348 C89 347 92 339 92 328 L95 260 L98 195 Z"/>'
  +'<path class=bodySurfaceDark d="M112 176 C118 184 122 194 124 211 L129 275 C130 291 132 316 130 334 C129 343 124 349 117 348 C111 347 108 339 108 328 L105 260 L102 195 Z"/>'
  +'<path class=bodySurface d="M69 65 C60 68 53 76 50 89 L42 138 C40 153 38 168 38 178 C38 184 42 188 47 188 C52 188 55 184 56 178 L63 133 L72 88 Z"/>'
  +'<path class=bodySurface d="M131 65 C140 68 147 76 150 89 L158 138 C160 153 162 168 162 178 C162 184 158 188 153 188 C148 188 145 184 144 178 L137 133 L128 88 Z"/>'
  +'<path class=bodySurface d="M70 333 C61 337 56 343 57 350 C59 355 70 356 86 354 C92 353 94 349 91 344 C88 339 82 336 70 333 Z"/>'
  +'<path class=bodySurface d="M130 333 C139 337 144 343 143 350 C141 355 130 356 114 354 C108 353 106 349 109 344 C112 339 118 336 130 333 Z"/>'
  +'<path class=bodyMidline d="M100 47 L100 181 M100 190 L100 334"/>'
  +(front?'<path class=bodyMidline d="M75 92 Q100 106 125 92 M80 165 Q100 174 120 165"/>':'<path class=bodyMidline d="M74 86 Q100 67 126 86 M77 153 Q100 139 123 153"/>')
  +'</g>';
 const muscles=mp.muscles.map(x=>'<ellipse tabindex="0" role="button" aria-label="'+esc((anatById(x[0])||{}).name||x[0])+'" class="muscleHotspot '+(anatMuscles.has(x[0])?'selected':'')+'" data-muscle="'+x[0]+'" cx="'+x[1]+'" cy="'+x[2]+'" rx="'+x[3]+'" ry="'+x[4]+'"><title>'+esc((anatById(x[0])||{}).name||x[0])+'</title></ellipse>').join('');
 const joints=mp.joints.map(x=>'<circle tabindex="0" role="button" aria-label="'+esc((anatJointById(x[0])||{}).name||x[0])+'" class="jointHotspot '+(anatJoints.has(x[0])?'selected':'')+'" data-joint="'+x[0]+'" cx="'+x[1]+'" cy="'+x[2]+'" r="4.4"><title>'+esc((anatJointById(x[0])||{}).name||x[0])+'</title></circle>').join('');
 const labels=front?'<text class=mapLabel x=100 y=58>FRONT</text><text class=mapHint x=100 y=358>Tap a red muscle or gold joint</text>':'<text class=mapLabel x=100 y=58>BACK</text><text class=mapHint x=100 y=358>Tap a red muscle or gold joint</text>';
 return '<svg class=human viewBox="0 0 200 365" preserveAspectRatio="xMidYMid meet" role=img aria-label="Interactive '+view+' body muscle map">'+base+muscles+joints+labels+'</svg>';
}
`;

function patchHtml(html){
 let out=html;
 if(!out.includes('id="dback-anatomy-map-hotfix"')) out=out.replace('</head>',HOTFIX_STYLE+'</head>');
 out=out.replace('function bodySvg(view){','function bodySvgLegacy(view){');
 if(!out.includes('Interactive '+"'"+'+view+'+"'"+' body muscle map')) out=out.replace('function selectionSummary(){',ENHANCED_BODY_SVG+'\nfunction selectionSummary(){');
 return out;
}

export default {
 async fetch(request,env,ctx){
  const response=await app.fetch(request,env,ctx);
  const url=new URL(request.url);
  if(url.pathname!=='/'||request.method!=='GET') return response;
  const type=response.headers.get('content-type')||'';
  if(!type.includes('text/html')) return response;
  const html=await response.text();
  const headers=new Headers(response.headers);
  headers.set('cache-control','no-store, no-cache, must-revalidate');
  return new Response(patchHtml(html),{status:response.status,headers});
 }
};
