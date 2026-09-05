export const EQUIPMENT_LIBRARY_CSS=`
.dbEquipBar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:7px 0;padding:7px;border:1px solid #29445f;border-radius:12px;background:#081724}
.dbEquipBar .btn{min-height:34px;padding:6px 9px}
.dbEquipTag{display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:4px 7px;border-radius:999px;border:1px solid #35506d;background:#0a1d2f;color:#d9e9f8;margin:2px 3px 2px 0}
.dbDriveBtn{border-color:#2b7d4b!important;background:#0e2d1c!important;color:#dff9e7!important}
.dbLibraryState{font-size:11px;color:#8da8c2;margin-top:5px}
@media(max-width:720px){.dbEquipBar{padding:5px;margin:5px 0}.dbEquipBar .btn{flex:1 1 46%;font-size:12px}.dbEquipTag{font-size:10px;padding:3px 6px}}
`;

export const EQUIPMENT_LIBRARY_JS=`(()=>{
const LIB={
 'goblet squat':'https://drive.google.com/file/d/1I_wXBNDpmF_DDttASsitVnSJpDqBPaOi/view',
 'romanian deadlift':'https://drive.google.com/file/d/1WABF3PSA6itoot4iYyGSqaemvYR-orIH/view',
 'dumbbell romanian deadlift':'https://drive.google.com/file/d/1WABF3PSA6itoot4iYyGSqaemvYR-orIH/view',
 'glute bridge march':'https://drive.google.com/file/d/1r8yLuQ3ESmkLyZflYl-nwCWk-XGBDxjv/view',
 'push-up':'https://drive.google.com/file/d/1JyMoHg0-XhQGH1MpyRbrI5JtX160NteB/view',
 'plank dumbbell drag':'https://drive.google.com/file/d/1kB_qhIJttXtHGs-AnxRs0lfQVXtOBWej/view',
 'standing dumbbell press':'https://drive.google.com/file/d/1gZpjyIU3K3OKmfFCcqcx1IL7IAtUMxus/view',
 'single-leg calf raise':'https://drive.google.com/file/d/1ahyLIO6fRIht64vUz9FjmenwILd3Sfrf/view',
 'pull-up':'https://drive.google.com/file/d/1cRLKGb0exO1BfcSp_mYpJU9AizfuNJN_/view',
 'pull-up or chin-up':'https://drive.google.com/file/d/1cRLKGb0exO1BfcSp_mYpJU9AizfuNJN_/view',
 'chin-up':'https://drive.google.com/file/d/1bWgnmz2Zjr_acoTzxnjQo-DqKfFG7WTr/view'
};
const q=s=>document.querySelector(s),key=s=>String(s||'').trim().toLowerCase();
function eq(name){const n=key(name),a=[];if(/pull-up|chin-up|dead hang/.test(n))a.push('Pull-Up Bar');if(/dumbbell|goblet|farmer|suitcase|romanian deadlift|lateral raise|hammer curl|triceps extension|floor press|row|push press/.test(n))a.push('Dumbbells');if(/floor|plank|dead bug|bird dog|glute bridge|hollow|push-up|mountain climber|y raise|t raise|cat-cow|child/.test(n)||n.includes('90/90'))a.push('Floor Mat');if(!a.length||/bodyweight|push-up|squat|lunge|calf|stance|hang/.test(n))a.push('Bodyweight');return [...new Set(a)]}
function openDrive(url){try{if(window.openai?.openExternal)return window.openai.openExternal({href:url})}catch{}window.open(url,'_blank','noopener,noreferrer')}
function enhanceExercise(x){if(x.dataset.dbEquipReady)return;x.dataset.dbEquipReady='1';const title=x.querySelector('b')?.textContent?.trim()||x.querySelector('h3')?.textContent?.trim()||'';if(!title)return;const r=x.querySelector('.row')||x;const tags=document.createElement('div');tags.className='dbLibraryState';tags.innerHTML=eq(title).map(t=>'<span class="dbEquipTag">'+t+'</span>').join('');x.append(tags);const url=LIB[key(title)];if(url){const b=document.createElement('button');b.className='btn ghost dbDriveBtn';b.type='button';b.textContent='Drive Video';b.onclick=()=>openDrive(url);r.append(b);[...x.querySelectorAll('button')].forEach(z=>{const t=z.textContent.trim();if((t==='Video'||t==='Change Video')&&z!==b)z.style.display='none'});const s=document.createElement('div');s.className='dbLibraryState';s.textContent='Primary video source: Google Drive library';x.append(s)}else{const s=document.createElement('div');s.className='dbLibraryState';s.textContent='Drive video: pending canonical library match';x.append(s)}}
function equipmentFilter(){const v=q('#view-plan');if(!v||getComputedStyle(v).display==='none')return;const card=[...v.querySelectorAll('.card')].find(c=>c.querySelector('.exercise'));if(!card)return;if(!v.querySelector('.dbEquipBar')){const b=document.createElement('div');b.className='dbEquipBar';b.innerHTML='<b style="flex:1 1 100%">Equipment</b><button class="btn blue" data-eq="all">All</button><button class="btn ghost" data-eq="pull">Pull-Up Bar</button><button class="btn ghost" data-eq="db">Dumbbells</button><button class="btn ghost" data-eq="mat">Floor Mat</button><button class="btn ghost" data-eq="bw">Bodyweight</button>';const anchor=v.querySelector('.dbSort')||v.querySelector('.hero');if(anchor)anchor.after(b);b.onclick=e=>{const bt=e.target.closest('button[data-eq]');if(!bt)return;b.querySelectorAll('button').forEach(z=>{z.classList.toggle('blue',z===bt);z.classList.toggle('ghost',z!==bt)});const mode=bt.dataset.eq;card.querySelectorAll('.exercise').forEach(x=>{const n=x.querySelector('b')?.textContent||'',es=eq(n),ok=mode==='all'||(mode==='pull'&&es.includes('Pull-Up Bar'))||(mode==='db'&&es.includes('Dumbbells'))||(mode==='mat'&&es.includes('Floor Mat'))||(mode==='bw'&&es.includes('Bodyweight'));x.style.display=ok?'':'none'})}}
card.querySelectorAll('.exercise').forEach(enhanceExercise)}
function homeEquipment(){const v=q('#view-home');if(!v||getComputedStyle(v).display==='none'||v.querySelector('.dbHomeEquip'))return;const d=document.createElement('div');d.className='card dbHomeEquip';d.innerHTML='<h3>Home Equipment</h3><div><span class="dbEquipTag">Adjustable Dumbbells</span><span class="dbEquipTag">Pull-Up Bar</span><span class="dbEquipTag">Floor Mat</span><span class="dbEquipTag">Bodyweight</span></div><div class="muted">Programming should use all available equipment across the week.</div>';const h=v.querySelector('.hero');if(h)h.after(d)}
function cycle(){homeEquipment();equipmentFilter();const w=q('#view-workout');if(w&&getComputedStyle(w).display!=='none')w.querySelectorAll('.exercise').forEach(enhanceExercise);const p=q('#view-plan');if(p&&getComputedStyle(p).display!=='none')p.querySelectorAll('.exercise').forEach(enhanceExercise)}
document.addEventListener('click',()=>setTimeout(cycle,120),true);new MutationObserver(()=>{clearTimeout(window.__dbLibT);window.__dbLibT=setTimeout(cycle,100)}).observe(document.body,{subtree:true,childList:true});setTimeout(cycle,700);
})();`;
