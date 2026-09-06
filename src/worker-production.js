import app from './worker-v10.js';

const PRODUCTION_VERSION='32.0.1';
function patchHtml(html) {
  let out = html;
  for (const v of ['7.0.1','7.0.2','8.0.0','8.0.1','8.1.0','9.0.0','9.0.1','9.0.2','9.1.0','9.2.0','9.3.0','9.4.0','9.5.0','9.6.0','9.7.0','31.0.0','32.0.0']) out = out.replaceAll(v,PRODUCTION_VERSION);
  out = out.replace("Start Today's Workout", "Start Today Workout");
  out = out.replace('<div id=videoDock class="videoDock normal">', '<div id=videoDock class="videoDock">');
  out = out.replace(
    "$('videoClose').onclick=()=>{$('videoDock').style.display='none';$('videoDock').className='videoDock normal';$('videoFrame').src=''};$('videoMini').onclick=()=>{$('videoDock').style.display='';$('videoDock').className='videoDock mini'};$('videoFull').onclick=()=>{$('videoDock').style.display='';$('videoDock').className='videoDock full'};",
    "$('videoClose').onclick=()=>{$('videoDock').className='videoDock';$('videoFrame').src=''};$('videoMini').onclick=()=>{$('videoDock').className='videoDock mini'};$('videoFull').onclick=()=>{$('videoDock').className='videoDock full'};"
  );
  return out;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const response = await app.fetch(request, env, ctx);
    if (url.pathname !== '/' || request.method !== 'GET') return response;
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;
    const html = await response.text();
    const headers = new Headers(response.headers);
    headers.set('cache-control', 'no-store, no-cache, must-revalidate');
    headers.set('x-dback-build',PRODUCTION_VERSION);
    return new Response(patchHtml(html), { status: response.status, headers });
  }
};
