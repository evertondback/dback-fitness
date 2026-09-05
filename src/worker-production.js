import app from './worker-browser.js';

function patchHtml(html) {
  const before = "add('ai',reply);for(var i=0;i<(z.actions||[]).length;i++)";
  const after = "add('ai',reply);await loadToday();for(var i=0;i<(z.actions||[]).length;i++)";
  const before2 = "}}}await loadToday();await speak(reply)";
  const after2 = "}}}await speak(reply)";
  const anchor = "add('ai',reply);await loadToday();for(var i=0;i<(z.actions||[]).length;i++)";
  const fallback = "add('ai',reply);await loadToday();var localVideoOpened=false;var lower=t.toLowerCase();if(lower.indexOf('video')>=0&&W){if(lower.indexOf('first exercise')>=0&&W.exercises&&W.exercises[0]){toggleVideo('e0',W.exercises[0].video);localVideoOpened=true}else{for(var vi=0;vi<(W.exercises||[]).length;vi++){var n=(W.exercises[vi].name||'').toLowerCase();if(n&&lower.indexOf(n)>=0){toggleVideo('e'+vi,W.exercises[vi].video);localVideoOpened=true;break}}if(!localVideoOpened){for(var wi=0;wi<(W.warmup||[]).length;wi++){var wn=(W.warmup[wi].name||'').toLowerCase();if(wn&&lower.indexOf(wn)>=0){toggleVideo('w'+wi,W.warmup[wi].video);localVideoOpened=true;break}}}}}for(var i=0;i<(z.actions||[]).length;i++)";
  let out = html.replace(before, after).replace(before2, after2);
  out = out.replace(anchor, fallback);
  out = out.replace("if(a.type==='video'&&a.exercise&&a.exercise.video)", "if(!localVideoOpened&&a.type==='video'&&a.exercise&&a.exercise.video)");
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
