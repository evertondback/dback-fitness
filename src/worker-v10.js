import base from './worker-v9.js';
import {json,handleManageHistory,cors} from './v10-history.js';
import {SYSTEM_VERSION} from './system-version.js';
import {handleV37ReconcileApi} from './v37-reconcile-api.js';
import {CSS,CORE_JS} from './v10-ui-core.js';
import {HISTORY_CSS,HISTORY_JS} from './v10-ui-history.js';
import {RESPONSIVE_CSS,RESPONSIVE_JS} from './v11-responsive.js';
import {LAYOUT_HOTFIX_CSS} from './v11-layout-hotfix.js';
import {EQUIPMENT_LIBRARY_CSS,EQUIPMENT_LIBRARY_JS} from './v12-equipment-library.js';
import {LIBRARY_INDEX_CSS,LIBRARY_INDEX_JS} from './v14-library-index.js';
import {VIDEO_SOURCE_CSS,VIDEO_SOURCE_JS} from './v22-video-source-manager.js';
import {VIDEO_LIBRARY_CSS,VIDEO_LIBRARY_JS,handleVideoLibrary} from './v23-video-library-manager.js';
import {COLLAPSE_CSS,COLLAPSE_JS} from './v24-collapse-manager.js';
import {ANATOMY35_CSS,ANATOMY35_JS} from './v35-anatomy-hard-reset.js';
import {MOBILE35_CSS,MOBILE35_JS} from './v35-mobile-overflow-fix.js';
import {COMPLETION31_CSS,COMPLETION31_JS} from './v31-completion-ui.js';
import {TIMER37_CSS,TIMER37_JS} from './v37-timer-tracker.js';
import {NAV31_GUARD_JS} from './v31-navigation-guard.js';
import {handleV31Api} from './v31-api.js';
import {OPS32_CSS,OPS32_JS} from './v32-operations-center.js';
import {WARMUP33_CSS,WARMUP33_JS} from './v33-warmup-video-guard.js';
import {COMMAND36_CSS,COMMAND36_JS} from './v36-universal-command-center.js';

function patch(html){
 let out=html;
 for(const v of ['7.0.1','7.0.2','8.0.0','8.0.1','8.1.0','9.0.0','9.0.1','9.0.2','9.1.0','9.2.0','9.3.0','9.4.0','9.5.0','9.6.0','9.7.0','31.0.0','32.0.0','32.0.1','33.0.0','34.0.0','35.0.0','35.0.1','35.0.2','35.0.3','36.0.0','36.1.0'])out=out.replaceAll(v,SYSTEM_VERSION);
 out=out.replace('</style>',CSS+HISTORY_CSS+RESPONSIVE_CSS+LAYOUT_HOTFIX_CSS+EQUIPMENT_LIBRARY_CSS+LIBRARY_INDEX_CSS+VIDEO_SOURCE_CSS+VIDEO_LIBRARY_CSS+COLLAPSE_CSS+ANATOMY35_CSS+MOBILE35_CSS+COMPLETION31_CSS+TIMER37_CSS+OPS32_CSS+WARMUP33_CSS+COMMAND36_CSS+'</style>').replace('</body>','<script>'+CORE_JS+'</script><script>'+HISTORY_JS+'</script><script>'+RESPONSIVE_JS+'</script><script>'+EQUIPMENT_LIBRARY_JS+'</script><script>'+LIBRARY_INDEX_JS+'</script><script>'+VIDEO_SOURCE_JS+'</script><script>'+VIDEO_LIBRARY_JS+'</script><script>'+COLLAPSE_JS+'</script><script>'+ANATOMY35_JS+'</script><script>'+MOBILE35_JS+'</script><script>'+COMPLETION31_JS+'</script><script>'+TIMER37_JS+'</script><script>'+NAV31_GUARD_JS+'</script><script>'+OPS32_JS+'</script><script>'+WARMUP33_JS+'</script><script>'+COMMAND36_JS+'</script></body>');
 out=out.replace("const $=s=>document.querySelector(s),$=s=>[...document.querySelectorAll(s)]","const Q=s=>document.querySelector(s),QA=s=>[...document.querySelectorAll(s)]");
 out=out.replace("nav=n=>$('#nav button,#mobileNav button').find","nav=n=>QA('#nav button,#mobileNav button').find");
 out=out.replaceAll("const v=$('#view-anatomy')","const v=Q('#view-anatomy')");
 out=out.replaceAll("const v=$('#view-workout')","const v=Q('#view-workout')");
 out=out.replaceAll("const v=$('#view-plan')","const v=Q('#view-plan')");
 out=out.replace("'+v.missing+' videos need sourcing","Video library · '+v.ready+'/'+v.total+' ready");
 out=out.replace("async function loadToday(){W=await api('/api/today');session=W.activeSession||null;renderWorkout();startTimers()}","async function loadToday(){W=await api('/api/today');session=W.activeSession||null;startTimers()}");
 out=out.replace("async function loadPlan(){PLAN=await api('/api/plan');LIB=LIB||await api('/api/library');selectedPlanDay=selectedPlanDay||W?.day||'Monday';renderPlan()}","async function loadPlan(){PLAN=await api('/api/plan');LIB=LIB||await api('/api/library');selectedPlanDay=selectedPlanDay||W?.day||'Monday'}");
 return out;
}

async function stamp(r){
 if(!r)return r;
 const h=new Headers(r.headers);h.set('x-dback-build',SYSTEM_VERSION);h.set('cache-control','no-store');
 const t=h.get('content-type')||'';
 if(!t.includes('application/json'))return new Response(r.body,{status:r.status,statusText:r.statusText,headers:h});
 try{
  const d=await r.json();
  if(d&&typeof d==='object'){
   if('version' in d)d.version=SYSTEM_VERSION;
   if(d.validation&&typeof d.validation==='object'&&'version' in d.validation)d.validation.version=SYSTEM_VERSION;
   if(d.program&&typeof d.program==='object'&&'version' in d.program)d.program.version=SYSTEM_VERSION;
  }
  h.set('content-type','application/json;charset=utf-8');
  return new Response(JSON.stringify(d),{status:r.status,statusText:r.statusText,headers:h});
 }catch{return new Response(null,{status:r.status,statusText:r.statusText,headers:h})}
}

export default{async fetch(req,env,ctx){
 const u=new URL(req.url);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors()});
 try{
  const reconciled=await handleV37ReconcileApi(req,env,u);if(reconciled)return stamp(reconciled);
  const v31=await handleV31Api(req,env,u);if(v31)return stamp(v31);
  const videos=await handleVideoLibrary(req,env,u);if(videos)return stamp(videos);
  const managed=await handleManageHistory(req,env,u);if(managed)return stamp(managed);
  const r=await base.fetch(req,env,ctx),t=r.headers.get('content-type')||'';
  if(req.method==='GET'&&u.pathname==='/'&&t.includes('text/html')){const h=new Headers(r.headers);h.set('cache-control','no-store,no-cache,must-revalidate');h.set('x-dback-build',SYSTEM_VERSION);return new Response(patch(await r.text()),{status:r.status,headers:h})}
  return stamp(r);
 }catch(e){return stamp(json({error:e?.message||'Server error',version:SYSTEM_VERSION},500))}
}};
