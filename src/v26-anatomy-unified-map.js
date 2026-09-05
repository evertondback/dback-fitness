export const ANATOMY26_CSS=`
.db25Canvas>img,.db25Canvas>svg:not(.db26Unified){display:none!important}
.db25Canvas .db26Unified{position:absolute;inset:0;width:100%;height:100%;display:block;overflow:visible;filter:drop-shadow(0 18px 30px #000b)}
.db25Canvas .db26Unified .db26Base{fill:#7b2028;stroke:#d96b6f;stroke-width:1.1}
.db25Canvas .db26Unified .db26Bone{fill:#d9c7b2;opacity:.55}
.db25Canvas .db26Unified .db26Line{fill:none;stroke:#f2a0a4;stroke-width:.8;opacity:.38}
.db25Canvas .db26Unified .db25Muscle{fill:url(#db26Muscle);stroke:#f8a0a5;stroke-width:.8;vector-effect:non-scaling-stroke;cursor:pointer;transition:fill .14s ease,stroke .14s ease,filter .14s ease,opacity .14s ease}
.db25Canvas .db26Unified .db25Muscle:hover,.db25Canvas .db26Unified .db25Muscle:focus-visible{fill:url(#db26Hover);stroke:#9fd4ff;stroke-width:1.4;outline:none}
.db25Canvas .db26Unified .db25Muscle.sel{fill:url(#db26Selected);stroke:#e8f6ff;stroke-width:1.7;filter:drop-shadow(0 0 10px rgba(45,157,255,.95))}
.db25Canvas .db26Unified .db25Muscle.rel{fill:url(#db26Related);stroke:#ff8da0;stroke-width:1.2}
.db25Stage{display:flex!important;align-items:center!important;justify-content:center!important}.db25Canvas{inset:0!important;width:100%!important;height:100%!important;transform-origin:50% 50%!important}
.db25Map{background:radial-gradient(circle at 50% 38%,#0b2a40 0,#061521 56%,#020a12 100%)!important}.db25Callout{backdrop-filter:blur(12px)}
.db26Status{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);z-index:6;font-size:9px;color:#8fb0c7;background:rgba(3,16,26,.76);border:1px solid #1d4b68;border-radius:999px;padding:4px 8px;pointer-events:none;white-space:nowrap}
.db25DetailHero>img,.db25DetailHero>svg:not(.db26Unified){display:none!important}.db25DetailHero .db26Unified{position:absolute;inset:0;width:100%;height:100%;display:block}
@media(max-width:720px){
#view-anatomy:has(.db25){position:fixed!important;inset:0!important;z-index:99990!important;width:100vw!important;max-width:none!important;height:100dvh!important;overflow-y:auto!important;overflow-x:hidden!important;margin:0!important;padding:0!important;background:#03101a!important}
#view-anatomy .db25{width:100vw!important;max-width:100vw!important;min-height:100dvh!important;padding:6px 6px 82px!important;margin:0!important}
body:has(#view-anatomy .db25) #nav{display:none!important}
.db25Top{position:sticky!important;top:0!important;z-index:80!important;padding-top:max(6px,env(safe-area-inset-top))!important}
.db25Tabs{position:sticky!important;top:58px!important;z-index:75!important}.db25Seg{margin-top:6px!important}
.db25Map{width:100%!important;max-width:100%!important;border-radius:14px!important}.db25Stage{height:520px!important;width:100%!important}
.db25Rail{width:50px!important;left:4px!important;top:12px!important;gap:4px!important}.db25Rail button{min-height:47px!important;width:50px!important;padding:3px!important;font-size:8px!important;border-radius:10px!important}.db25Rail button span{font-size:15px!important}
.db25Callout{right:5px!important;top:80px!important;max-width:120px!important;padding:7px 8px!important;font-size:10px!important}.db25Callout .db25Primary{font-size:10px!important;padding:5px 7px!important}
.db25Tools{right:4px!important;bottom:24px!important}.db25Tools button{width:42px!important;min-height:42px!important;padding:3px!important;font-size:8px!important}.db25Tools b{font-size:15px!important}
.db26Status{bottom:4px;font-size:8px}.db25Hint{padding:7px 54px 4px!important;font-size:10px!important}.db25Legend{font-size:9px!important;gap:8px!important}
.db25Detail{width:100%!important;max-width:100%!important}.db25DetailHero{height:260px!important}.db25Facts{grid-template-columns:1fr!important}.db25Subtabs button{font-size:9px!important}
}
@media(max-width:390px){.db25Stage{height:500px!important}.db25Title b{font-size:17px!important}.db25Title span{font-size:10px!important}.db25Tabs button,.db25Seg button{font-size:10px!important}.db25Callout{max-width:108px!important}}
`;

export const ANATOMY26_JS=`(()=>{
const NS='http://www.w3.org/2000/svg';
const FRONT={
'pectoralis-major':['M151 151 C166 138 187 136 198 149 L198 213 C180 221 160 214 149 198 Z','M249 151 C234 138 213 136 202 149 L202 213 C220 221 240 214 251 198 Z'],
'anterior-deltoid':['M141 145 C126 143 116 154 114 169 C118 181 128 190 144 188 L153 154 Z','M259 145 C274 143 284 154 286 169 C282 181 272 190 256 188 L247 154 Z'],
'lateral-deltoid':['M132 151 C116 154 107 168 109 187 C114 197 122 201 133 197 L143 162 Z','M268 151 C284 154 293 168 291 187 C286 197 278 201 267 197 L257 162 Z'],
'biceps-brachii':['M116 190 C105 207 104 238 112 257 C121 266 132 260 136 246 L138 196 Z','M284 190 C295 207 296 238 288 257 C279 266 268 260 264 246 L262 196 Z'],
'forearm-flexors':['M108 260 C99 285 94 316 99 338 C106 345 114 342 119 331 L129 264 Z','M292 260 C301 285 306 316 301 338 C294 345 286 342 281 331 L271 264 Z'],
'rectus-abdominis':['M175 218 C183 213 195 213 199 220 L198 332 C188 343 177 338 172 323 Z','M225 218 C217 213 205 213 201 220 L202 332 C212 343 223 338 228 323 Z'],
'obliques':['M149 215 C160 214 170 221 175 233 L171 328 C159 323 150 311 146 291 Z','M251 215 C240 214 230 221 225 233 L229 328 C241 323 250 311 254 291 Z'],
'hip-flexors':['M166 329 C179 322 190 327 197 342 L190 382 C178 379 168 370 162 354 Z','M234 329 C221 322 210 327 203 342 L210 382 C222 379 232 370 238 354 Z'],
'quadriceps':['M153 378 C168 367 184 376 190 397 L184 541 C176 563 161 558 156 539 C147 488 146 414 153 378 Z','M247 378 C232 367 216 376 210 397 L216 541 C224 563 239 558 244 539 C253 488 254 414 247 378 Z'],
'adductors':['M187 380 C195 373 201 379 202 394 L201 526 C195 539 189 528 186 511 Z','M213 380 C205 373 199 379 198 394 L199 526 C205 539 211 528 214 511 Z'],
'tibialis-anterior':['M156 550 C166 543 175 548 177 565 L174 705 C166 720 158 713 155 694 Z','M244 550 C234 543 225 548 223 565 L226 705 C234 720 242 713 245 694 Z'],
'gastrocnemius':['M181 550 C190 548 195 558 194 578 L190 681 C185 696 179 688 178 675 Z','M219 550 C210 548 205 558 206 578 L210 681 C215 696 221 688 222 675 Z']
};
const BACK={
'upper-trapezius':['M156 140 C172 127 189 128 199 145 L190 209 C175 200 164 184 153 163 Z','M244 140 C228 127 211 128 201 145 L210 209 C225 200 236 184 247 163 Z'],
'posterior-deltoid':['M139 150 C123 148 113 161 113 178 C118 190 128 194 142 188 L153 158 Z','M261 150 C277 148 287 161 287 178 C282 190 272 194 258 188 L247 158 Z'],
'latissimus-dorsi':['M153 205 C169 194 187 200 198 216 L193 333 C177 342 160 332 151 315 Z','M247 205 C231 194 213 200 202 216 L207 333 C223 342 240 332 249 315 Z'],
'triceps-brachii':['M116 190 C106 207 105 237 112 259 C120 269 131 262 136 247 L138 198 Z','M284 190 C294 207 295 237 288 259 C280 269 269 262 264 247 L262 198 Z'],
'erector-spinae':['M188 205 C194 200 198 207 198 220 L196 345 C192 360 187 353 186 339 Z','M212 205 C206 200 202 207 202 220 L204 345 C208 360 213 353 214 339 Z'],
'gluteus-maximus':['M160 336 C176 322 192 328 199 346 L196 414 C184 434 166 430 157 412 Z','M240 336 C224 322 208 328 201 346 L204 414 C216 434 234 430 243 412 Z'],
'hamstrings':['M155 420 C170 410 184 420 188 445 L183 548 C176 564 163 557 158 538 Z','M245 420 C230 410 216 420 212 445 L217 548 C224 564 237 557 242 538 Z'],
'gluteus-medius':['M151 327 C160 316 174 315 183 325 L176 352 C165 356 155 349 150 339 Z','M249 327 C240 316 226 315 217 325 L224 352 C235 356 245 349 250 339 Z'],
'gastrocnemius':['M156 554 C170 543 184 551 187 573 L181 683 C174 704 160 696 156 676 Z','M244 554 C230 543 216 551 213 573 L219 683 C226 704 240 696 244 676 Z'],
'soleus':['M177 608 C185 601 192 609 192 624 L188 700 C183 714 177 707 176 696 Z','M223 608 C215 601 208 609 208 624 L212 700 C217 714 223 707 224 696 Z']
};
function defs(){return '<defs><linearGradient id="db26Muscle" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef6b6f"/><stop offset=".48" stop-color="#b72f3a"/><stop offset="1" stop-color="#7d1824"/></linearGradient><linearGradient id="db26Hover"><stop stop-color="#ff8588"/><stop offset="1" stop-color="#c33a43"/></linearGradient><linearGradient id="db26Selected"><stop stop-color="#54b7ff"/><stop offset=".5" stop-color="#188cea"/><stop offset="1" stop-color="#075ea7"/></linearGradient><linearGradient id="db26Related"><stop stop-color="#ff6d83"/><stop offset="1" stop-color="#a9233d"/></linearGradient></defs>'}
function base(view){return defs()+'<g aria-hidden="true"><ellipse class="db26Base" cx="200" cy="66" rx="31" ry="41"/><path class="db26Base" d="M181 101 L219 101 L226 133 Q266 139 284 169 L271 259 L297 336 L285 347 L258 270 L247 339 L244 371 Q257 407 253 541 L246 548 L249 706 L232 706 L219 547 L211 387 L189 387 L181 547 L168 706 L151 706 L154 548 L147 541 Q143 407 156 371 L153 339 L142 270 L115 347 L103 336 L129 259 L116 169 Q134 139 174 133 Z"/><path class="db26Bone" d="M196 105 h8 v250 h-8z"/><path class="db26Line" d="M151 211 Q200 230 249 211 M158 332 Q200 346 242 332 M151 543 Q200 558 249 543 M181 704 Q200 712 219 704"/></g>'}
function shapes(view,old){const dict=view==='back'?BACK:FRONT;const states={};old?.querySelectorAll('[data-muscle]').forEach(p=>{states[p.dataset.muscle]={sel:p.classList.contains('sel'),rel:p.classList.contains('rel'),op:p.style.opacity||'1'}});return Object.entries(dict).flatMap(([k,arr])=>arr.map(d=>{const s=states[k]||{};return '<path class="db25Muscle'+(s.sel?' sel':'')+(s.rel?' rel':'')+'" data-muscle="'+k+'" tabindex="0" role="button" aria-label="'+k.replaceAll('-',' ')+'" style="opacity:'+(s.op||'1')+'" d="'+d+'"/>'})).join('')}
function unified(host,view,mode){let u=host.querySelector(':scope>svg.db26Unified');if(!u){u=document.createElementNS(NS,'svg');u.setAttribute('class','db26Unified');host.appendChild(u)}u.setAttribute('viewBox','75 18 250 715');u.setAttribute('preserveAspectRatio',mode==='slice'?'xMidYMid slice':'xMidYMid meet');u.setAttribute('role','img');u.setAttribute('aria-label',(view==='back'?'Back':'Front')+' interactive muscular anatomy');const old=host.querySelector(':scope>svg:not(.db26Unified)');u.innerHTML=base(view)+shapes(view,old);return u}
function sync(){const v=document.querySelector('#view-anatomy');if(!v)return;v.querySelectorAll('.db25Canvas').forEach(c=>{const img=c.querySelector(':scope>img');const view=(img?.src||'').includes('back')?'back':'front';unified(c,view,'meet');if(!c.parentElement?.querySelector('.db26Status')){const s=document.createElement('div');s.className='db26Status';s.textContent='Native unified SVG anatomy';c.parentElement?.appendChild(s)}});const hero=v.querySelector('.db25DetailHero');if(hero){const img=hero.querySelector(':scope>img');const view=(img?.src||'').includes('back')?'back':'front';unified(hero,view,'slice')}}
document.addEventListener('click',()=>setTimeout(sync,24),true);document.addEventListener('keydown',e=>{const p=e.target.closest?.('.db26Unified [data-muscle]');if(p&&(e.key==='Enter'||e.key===' ')){e.preventDefault();p.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});new MutationObserver(()=>{clearTimeout(window.__db26);window.__db26=setTimeout(sync,28)}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src','class','style']});addEventListener('resize',sync);setTimeout(sync,160);setTimeout(sync,700);
})();`;
