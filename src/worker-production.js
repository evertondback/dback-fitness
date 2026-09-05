import app from './worker-v10.js';

function patchHtml(html) {
  let out = html;
  out = out.replaceAll('7.0.1','9.0.0').replaceAll('7.0.2','9.0.0').replaceAll('8.0.0','9.0.0').replaceAll('8.0.1','9.0.0').replaceAll('8.1.0','9.0.0');
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
    return new Response(patchHtml(html), { status: response.status, headers });
  }
};
