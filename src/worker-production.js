import app from './worker-browser.js';

function patchHtml(html) {
  const before = "add('ai',reply);for(var i=0;i<(z.actions||[]).length;i++)";
  const after = "add('ai',reply);await loadToday();for(var i=0;i<(z.actions||[]).length;i++)";
  const before2 = "}}}await loadToday();await speak(reply)";
  const after2 = "}}}await speak(reply)";
  return html.replace(before, after).replace(before2, after2);
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
