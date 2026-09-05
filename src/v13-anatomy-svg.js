export const ANATOMY_SVG_CSS=`
.realAnatomyMap{position:relative!important;overflow:hidden!important;background:#07111f!important}
.realAnatomyMap>img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain!important;opacity:.58!important;filter:grayscale(.15) contrast(1.08) brightness(.82)!important;pointer-events:none!important}
.realAnatomyMap .mapHotspot,.realAnatomyMap .mapJoint{display:none!important}
.dbMuscleSvg{position:absolute;inset:0;width:100%;height:100%;z-index:5;overflow:visible}
.dbMuscleSvg .muscleRegion{fill:rgba(148,163,184,.08);stroke:rgba(226,232,240,.28);stroke-width:1.3;vector-effect:non-scaling-stroke;cursor:pointer;transition:fill .15s ease,stroke .15s ease,filter .15s ease}
.dbMuscleSvg .muscleRegion:hover,.dbMuscleSvg .muscleRegion:focus{fill:rgba(239,68,68,.22);stroke:#fb7185;outline:none}
.dbMuscleSvg .muscleRegion.selected{fill:rgba(255,45,77,.62);stroke:#fecdd3;filter:drop-shadow(0 0 7px rgba(255,45,77,.72))}
.dbAtlasViewToggle{display:flex;gap:6px;margin:8px 0 10px}.dbAtlasViewToggle button{flex:1;min-height:42px;border:1px solid #36516d;background:#0b1c2e;color:#b8c8d9;border-radius:11px;font-weight:800}.dbAtlasViewToggle button.active{background:#183653;color:#fff;border-color:#5f8ab4}
.dbSelectedMuscles{display:flex;gap:5px;overflow-x:auto;padding:4px 0 2px;scrollbar-width:none}.dbSelectedMuscles::-webkit-scrollbar{display:none}.dbSelectedMuscles button{flex:0 0 auto;border:1px solid #7f1d1d;background:#3b1118;color:#ffe4e6;border-radius:999px;padding:5px 8px;font-size:10px}
@media(max-width:720px){.realAnatomyMap{aspect-ratio:400/560!important;max-height:none!important}.dbMuscleSvg .muscleRegion{stroke-width:1.1}.smartLabelRail{display:none!important}}
`;

const FRONT_PATHS={
 'pectoralis-major':['M132 126 C154 112 184 113 197 136 L197 186 C177 201 146 198 125 174 Z','M268 126 C246 112 216 113 203 136 L203 186 C223 201 254 198 275 174 Z'],
 'anterior-deltoid':['M112 128 C119 103 139 91 158 95 C151 113 143 129 126 143 Z','M288 128 C281 103 261 91 242 95 C249 113 257 129 274 143 Z'],
 'lateral-deltoid':['M103 134 C96 121 98 102 113 89 C124 85 135 88 144 96 C129 109 120 126 117 145 Z','M297 134 C304 121 302 102 287 89 C276 85 265 88 256 96 C271 109 280 126 283 145 Z'],
 'biceps-brachii':['M95 152 C83 161 79 184 85 202 C90 213 98 218 106 211 C115 197 120 177 115 157 Z','M305 152 C317 161 321 184 315 202 C310 213 302 218 294 211 C285 197 280 177 285 157 Z'],
 'forearm-flexors':['M83 206 C70 227 61 252 61 274 C67 282 75 282 81 274 C91 252 101 229 104 209 Z','M317 206 C330 227 339 252 339 274 C333 282 325 282 319 274 C309 252 299 229 296 209 Z'],
 'rectus-abdominis':['M171 194 C185 188 215 188 229 194 L226 286 C216 311 184 311 174 286 Z'],
 'obliques':['M136 191 C150 190 163 194 171 203 L167 280 C152 276 141 264 137 246 Z','M264 191 C250 190 237 194 229 203 L233 280 C248 276 259 264 263 246 Z'],
 'hip-flexors':['M159 287 C173 278 185 281 193 295 L185 327 C174 325 163 316 157 304 Z','M241 287 C227 278 215 281 207 295 L215 327 C226 325 237 316 243 304 Z'],
 'quadriceps':['M147 315 C163 309 178 321 181 344 L176 431 C167 451 150 451 141 433 C133 398 134 349 147 315 Z','M253 315 C237 309 222 321 219 344 L224 431 C233 451 250 451 259 433 C267 398 266 349 253 315 Z'],
 'adductors':['M181 323 C189 316 197 319 199 332 L198 418 C190 428 182 418 179 404 Z','M219 323 C211 316 203 319 201 332 L202 418 C210 428 218 418 221 404 Z'],
 'tibialis-anterior':['M142 442 C151 434 163 437 166 452 L161 516 C153 525 145 519 141 507 Z','M258 442 C249 434 237 437 234 452 L239 516 C247 525 255 519 259 507 Z'],
 'gastrocnemius':['M164 438 C171 437 177 445 178 458 L175 498 C169 507 163 503 161 493 Z','M236 438 C229 437 223 445 222 458 L225 498 C231 507 237 503 239 493 Z']
};

const BACK_PATHS={
 'upper-trapezius':['M145 104 C165 91 185 90 198 110 L189 154 C170 148 154 135 142 119 Z','M255 104 C235 91 215 90 202 110 L211 154 C230 148 246 135 258 119 Z'],
 'posterior-deltoid':['M111 128 C101 116 103 99 116 88 C133 88 146 98 153 112 C139 120 127 132 119 146 Z','M289 128 C299 116 297 99 284 88 C267 88 254 98 247 112 C261 120 273 132 281 146 Z'],
 'latissimus-dorsi':['M137 154 C155 148 175 151 190 165 L186 271 C168 275 148 269 137 252 Z','M263 154 C245 148 225 151 210 165 L214 271 C232 275 252 269 263 252 Z'],
 'triceps-brachii':['M96 147 C86 163 83 187 89 209 C96 220 105 216 111 203 C117 184 119 164 112 150 Z','M304 147 C314 163 317 187 311 209 C304 220 295 216 289 203 C283 184 281 164 288 150 Z'],
 'erector-spinae':['M185 157 C192 153 198 157 198 171 L196 286 C191 297 184 291 182 281 Z','M215 157 C208 153 202 157 202 171 L204 286 C209 297 216 291 218 281 Z'],
 'gluteus-maximus':['M151 282 C169 271 187 276 196 295 L194 338 C181 356 158 353 147 336 Z','M249 282 C231 271 213 276 204 295 L206 338 C219 356 242 353 253 336 Z'],
 'hamstrings':['M146 344 C161 337 178 344 183 362 L176 431 C168 447 151 446 143 430 C135 397 136 365 146 344 Z','M254 344 C239 337 222 344 217 362 L224 431 C232 447 249 446 257 430 C265 397 264 365 254 344 Z'],
 'gastrocnemius':['M142 438 C154 430 169 438 172 455 L166 508 C158 522 144 517 139 503 Z','M258 438 C246 430 231 438 228 455 L234 508 C242 522 256 517 261 503 Z'],
 'soleus':['M166 453 C174 449 180 458 179 472 L176 514 C170 522 164 516 162 504 Z','M234 453 C226 449 220 458 221 472 L224 514 C230 522 236 516 238 504 Z'],
 'forearm-flexors':['M82 207 C70 228 61 251 61 274 C66 281 75 281 81 273 C92 251 99 229 103 209 Z','M318 207 C330 228 339 251 339 274 C334 281 325 281 319 273 C308 251 301 229 297 209 Z']
};

export const ANATOMY_SVG_JS=`(()=>{
const NS='http://www.w3.org/2000/svg';
const FP=${JSON.stringify(FRONT_PATHS)};
const BP=${JSON.stringify(BACK_PATHS)};
let currentView=localStorage.getItem('dback_atlas_view')||'front';
const humanize=id=>String(id||'').split('-').map(x=>x?x[0].toUpperCase()+x.slice(1):x).join(' ');
function selectedSet(){try{return new Set(JSON.parse(localStorage.getItem('dback_anat_muscles')||'[]'))}catch{return new Set()}}
function setView(v){currentView=v;localStorage.setItem('dback_atlas_view',v);document.querySelectorAll('#view-anatomy .bodyPanel').forEach((p,i)=>{const pv=p.dataset.atlasView||(i===0?'front':'back');p.dataset.atlasView=pv;p.classList.toggle('atlasActive',pv===v);p.style.display=pv===v?'block':'none'});document.querySelectorAll('.dbAtlasViewToggle button').forEach(b=>b.classList.toggle('active',b.dataset.v===v));}
function toggleMuscle(panel,id){const map=panel.querySelector('.realAnatomyMap');const legacy=map?.querySelector('.mapHotspot[data-muscle="'+CSS.escape(id)+'"]');if(legacy){legacy.click();setTimeout(upgrade,60);return}const s=selectedSet();s.has(id)?s.delete(id):s.add(id);localStorage.setItem('dback_anat_muscles',JSON.stringify([...s]));setTimeout(upgrade,20)}
function makePath(svg,panel,id,d){const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('class','muscleRegion'+(selectedSet().has(id)?' selected':''));p.setAttribute('data-muscle',id);p.setAttribute('tabindex','0');p.setAttribute('aria-label',humanize(id));p.addEventListener('click',()=>toggleMuscle(panel,id));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleMuscle(panel,id)}});svg.appendChild(p)}
function buildMap(panel,view){const map=panel.querySelector('.realAnatomyMap');if(!map)return;map.querySelector('.dbMuscleSvg')?.remove();const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 400 560');svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.setAttribute('class','dbMuscleSvg');svg.setAttribute('role','group');svg.setAttribute('aria-label',view+' selectable muscle map');const data=view==='front'?FP:BP;Object.entries(data).forEach(([id,paths])=>paths.forEach(d=>makePath(svg,panel,id,d)));map.appendChild(svg)}
function selectedRail(panel,view){panel.querySelector('.dbSelectedMuscles')?.remove();const allowed=new Set(Object.keys(view==='front'?FP:BP)),ids=[...selectedSet()].filter(id=>allowed.has(id));const r=document.createElement('div');r.className='dbSelectedMuscles';if(!ids.length)r.innerHTML='<span class="muted">Tap directly on a muscle to select it.</span>';else ids.forEach(id=>{const b=document.createElement('button');b.type='button';b.textContent=humanize(id)+' ×';b.onclick=()=>toggleMuscle(panel,id);r.appendChild(b)});panel.querySelector('.realAnatomyMap')?.after(r)}
function toolbar(){const root=document.getElementById('view-anatomy');if(!root)return;let t=root.querySelector('.dbAtlasViewToggle');if(!t){t=document.createElement('div');t.className='dbAtlasViewToggle';t.innerHTML='<button type="button" data-v="front">FRONT</button><button type="button" data-v="back">BACK</button>';const anchor=root.querySelector('.atlasToolbar')||root.querySelector('.bodyGrid');anchor?.before(t);t.querySelectorAll('button').forEach(b=>b.onclick=()=>setView(b.dataset.v))}setView(currentView)}
function upgrade(){const root=document.getElementById('view-anatomy');if(!root)return;const panels=[...root.querySelectorAll('.bodyPanel')];if(!panels.length)return;panels.forEach((p,i)=>{const v=p.dataset.atlasView||(i===0?'front':'back');p.dataset.atlasView=v;buildMap(p,v);selectedRail(p,v)});toolbar();setView(currentView)}
document.addEventListener('click',e=>{const tx=e.target.closest('button')?.textContent?.trim();if(tx==='Anatomy Lab'||tx==='Anatomy')setTimeout(upgrade,180)},true);new MutationObserver(()=>{clearTimeout(window.__dbAnat13);window.__dbAnat13=setTimeout(upgrade,100)}).observe(document.body,{subtree:true,childList:true});setTimeout(upgrade,700);
})();`;
