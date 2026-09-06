export const NAV31_GUARD_JS=`(()=>{
const Q=s=>document.querySelector(s);
let lastPulse=0;
function visible(el){if(!el)return false;const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'}
function pulse(host){
 if(!host||host.querySelector('.db31')||!visible(host))return;
 const now=Date.now();if(now-lastPulse<120)return;lastPulse=now;
 const n=document.createElement('span');n.hidden=true;n.setAttribute('aria-hidden','true');n.dataset.db31Pulse=String(now);document.body.appendChild(n);n.remove();
}
function stabilize(){pulse(Q('#view-workout'));pulse(Q('#view-plan'))}
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('#nav button,#mobileNav button');if(!b)return;
 const label=b.textContent.trim();if(label!=='Workout'&&label!=='Full Plan')return;
 [60,180,420,900,1700,3200].forEach(ms=>setTimeout(stabilize,ms));
},true);
new MutationObserver(()=>{clearTimeout(window.__db31GuardTimer);window.__db31GuardTimer=setTimeout(stabilize,140)}).observe(document.body,{subtree:true,childList:true});
setInterval(stabilize,850);
setTimeout(stabilize,400);
})();`;
