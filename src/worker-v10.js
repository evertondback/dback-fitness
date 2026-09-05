import base from './worker-v9.js';
import {VERSION,json,handleManageHistory,cors} from './v10-history.js';
import {CSS,CORE_JS} from './v10-ui-core.js';
import {HISTORY_CSS,HISTORY_JS} from './v10-ui-history.js';
import {ANATOMY_SORT_CSS,ANATOMY_SORT_JS} from './v10-ui-anatomy.js';
import {RESPONSIVE_CSS,RESPONSIVE_JS} from './v11-responsive.js';
import {LAYOUT_HOTFIX_CSS} from './v11-layout-hotfix.js';
function patch(html){
 let out=html.replaceAll('9.0.2',VERSION).replaceAll('9.0.1',VERSION).replaceAll('8.1.0',VERSION).replaceAll('8.0.1',VERSION).replaceAll('8.0.0',VERSION).replaceAll('7.0.2',VERSION).replaceAll('7.0.1',VERSION).replace('</style>',CSS+HISTORY_CSS+ANATOMY_SORT_CSS+RESPONSIVE_CSS+LAYOUT_HOTFIX_CSS+'</style>').replace('</body>','<script>'+CORE_JS+'</script><script>'+HISTORY_JS+'</script><script>'+ANATOMY_SORT_JS+'</script><script>'+RESPONSIVE_JS+'</script></body>');
 out=out.replace("const $=s=>document.querySelector(s),$=s=>[...document.querySelectorAll(s)]","const Q=s=>document.querySelector(s),QA=s=>[...document.querySelectorAll(s)]");
 out=out.replace("nav=n=>$('#nav button,#mobileNav button').find","nav=n=>QA('#nav button,#mobileNav button').find");
 out=out.replaceAll("const v=$('#view-anatomy')","const v=Q('#view-anatomy')");
 out=out.replaceAll("const v=$('#view-workout')","const v=Q('#view-workout')");
 out=out.replaceAll("const v=$('#view-plan')","const v=Q('#view-plan')");
 return out;
}
async function patchJson(r){const t=r.headers.get('content-type')||'';if(!t.includes('application/json'))return r;try{const d=await r.json();if(d&&typeof d==='object'&&'version' in d)d.version=VERSION;return json(d,r.status)}catch{return r}}
export default{async fetch(req,env,ctx){const u=new URL(req.url);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors()});try{const managed=await handleManageHistory(req,env,u);if(managed)return managed;const r=await base.fetch(req,env,ctx),t=r.headers.get('content-type')||'';if(req.method==='GET'&&u.pathname==='/'&&t.includes('text/html')){const h=new Headers(r.headers);h.set('cache-control','no-store,no-cache,must-revalidate');return new Response(patch(await r.text()),{status:r.status,headers:h})}if(t.includes('application/json'))return patchJson(r);return r}catch(e){return json({error:e?.message||'Server error'},500)}}};
