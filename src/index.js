const MUSCLEWIKI_ORIGIN = 'https://api.musclewiki.com';

const DAYS = {
  Monday: [
    ['Barbell Bench Press','Chest','3 x 8-12'],['Incline Dumbbell Bench Press','Chest','3 x 8-12'],['Chest Fly','Chest','3 x 12-15'],
    ['Rope Triceps Pushdown','Triceps','3 x 10-15'],['Overhead Triceps Extension','Triceps','3 x 10-15'],['Bench Dips','Triceps','3 x 8-12'],
    ['Dumbbell Lateral Raise','Shoulders','3 x 12-20'],['Dumbbell Front Raise','Shoulders','3 x 10-15'],['Standing Calf Raise','Calves','3 x 12-20'],
    ['Cable Glute Kickback','Glutes','3 x 12-15 / side'],['Treadmill Running','Cardio','20 min']
  ],
  Tuesday: [
    ['Barbell Bent Over Row','Back','3 x 8-12'],['Seated Cable Row','Back','3 x 8-12'],['Cable Pullover','Back','3 x 10-15'],
    ['Dumbbell Biceps Curl','Biceps','3 x 8-12'],['Dumbbell Hammer Curl','Biceps','3 x 8-12'],['Dumbbell Concentration Curl','Biceps','3 x 10-15 / side'],
    ['Dumbbell Shrug','Traps','3 x 10-15'],['Barbell Shrug','Traps','3 x 8-12'],['Seated Calf Raise','Calves','3 x 12-20'],
    ['Treadmill Running','Cardio','20 min']
  ],
  Wednesday: [
    ['Shoulder Press','Shoulders','3 x 8-12'],['Dumbbell Lateral Raise','Shoulders','3 x 12-20'],['Leg Press','Legs','3 x 8-12'],
    ['Leg Extension','Quads','3 x 10-15'],['Seated Leg Curl','Hamstrings','3 x 10-15'],['Hip Abduction','Glutes','3 x 12-20'],
    ['Hip Adduction','Adductors','3 x 12-20'],['Standing Calf Raise','Calves','3 x 12-20'],['Treadmill Running','Cardio','20 min']
  ],
  Thursday: [
    ['Push Up','Chest','3 sets'],['Pull Ups','Back','3 sets'],['Bench Dips','Triceps','3 sets'],['Dumbbell Biceps Curl','Biceps','3 x 8-12'],
    ['Bodyweight Squat','Legs','3 x 12-20'],['Dumbbell Sumo Squat','Glutes','3 x 10-15'],['Standing Calf Raise','Calves','3 x 12-20'],
    ['Dumbbell Lateral Raise','Shoulders','3 x 12-20'],['Treadmill Running','Cardio','20 min']
  ],
  Friday: [
    ['Cable Chest Fly','Chest','3 x 10-15'],['Dumbbell Row','Back','3 x 8-12 / side'],['Cable Triceps Pushdown','Triceps','3 x 10-15'],
    ['Cable Biceps Curl','Biceps','3 x 10-15'],['Dumbbell Lateral Raise','Shoulders','3 x 12-20'],['Leg Press','Legs','3 x 8-12'],
    ['Seated Calf Raise','Calves','3 x 12-20'],['Cable Glute Kickback','Glutes','3 x 12-15 / side'],['Treadmill Running','Cardio','20 min']
  ]
};

function esc(s='') { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function page(body, status=200, type='text/html; charset=utf-8') { return new Response(body,{status,headers:{'content-type':type,'cache-control':'no-store'}}); }

async function mwFetch(env, path, init={}) {
  if (!env.MUSCLEWIKI_API_KEY) throw new Error('MUSCLEWIKI_API_KEY is not configured.');
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${env.MUSCLEWIKI_API_KEY}`);
  headers.set('X-API-Key', env.MUSCLEWIKI_API_KEY);
  return fetch(`${MUSCLEWIKI_ORIGIN}${path}`, {...init, headers});
}

async function searchExercise(env, q) {
  const candidates = [
    `/exercises/?search=${encodeURIComponent(q)}&limit=8`,
    `/exercises?search=${encodeURIComponent(q)}&limit=8`,
    `/api/exercises/?search=${encodeURIComponent(q)}&limit=8`
  ];
  for (const path of candidates) {
    const r = await mwFetch(env,path);
    if (!r.ok) continue;
    const data = await r.json();
    const arr = Array.isArray(data) ? data : (data.results || data.exercises || []);
    if (arr.length) return arr[0];
  }
  return null;
}

function proxied(url) { return `/mw/media?url=${encodeURIComponent(url)}`; }

function normalizeExercise(ex, fallback) {
  if (!ex) return {name:fallback,steps:[],videos:[]};
  const videos = (ex.videos || []).filter(v=>v && v.url).map(v=>({...v,proxy:proxied(v.url),image:v.og_image?proxied(v.og_image):null}));
  return {name:ex.name || fallback,steps:ex.steps || ex.instructions || [],videos};
}

function shell() { return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>DBACK Fitness x MuscleWiki</title><style>
*{box-sizing:border-box}body{margin:0;background:#f4f6f8;color:#111827;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.top{position:sticky;top:0;z-index:9;background:#111827;color:white;padding:16px}.brand{max-width:1000px;margin:auto;display:flex;justify-content:space-between;align-items:center}.brand b{font-size:20px}.brand small{opacity:.72}.wrap{max-width:1000px;margin:auto;padding:18px}.days{display:flex;gap:8px;overflow:auto;padding-bottom:14px}.days button{border:0;border-radius:999px;padding:10px 16px;background:white;font-weight:700;box-shadow:0 1px 4px #0001}.days button.on{background:#111827;color:white}.hero{padding:8px 2px 18px}.hero h1{font-size:30px;margin:8px 0}.hero p{color:#6b7280;margin:0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}.card{background:white;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 16px #0000000a}.head{padding:16px}.meta{display:flex;justify-content:space-between;gap:10px;color:#6b7280;font-size:12px;text-transform:uppercase;font-weight:800;letter-spacing:.08em}.head h2{font-size:22px;margin:8px 0 0}.media{background:#0b0f14;aspect-ratio:16/10;display:flex;align-items:center;justify-content:center}.media video,.media img{width:100%;height:100%;object-fit:contain}.body{padding:16px}.steps{margin:0;padding-left:20px;color:#374151}.steps li{margin:7px 0;line-height:1.35}.angles{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}.angles button{border:1px solid #d1d5db;background:white;padding:8px 10px;border-radius:10px;font-weight:700}.warn{background:#fff7ed;color:#9a3412;border:1px solid #fed7aa;padding:12px;border-radius:12px}.loading{padding:50px;text-align:center;color:#6b7280}@media(max-width:600px){.wrap{padding:12px}.grid{grid-template-columns:1fr}.hero h1{font-size:26px}}
</style></head><body><div class="top"><div class="brand"><div><b>DBACK FITNESS</b><br><small>Powered by live MuscleWiki media</small></div><div>MW</div></div></div><main class="wrap"><div class="days" id="days"></div><section class="hero"><h1 id="title"></h1><p>Actual MuscleWiki images, MP4 demonstrations and instructions are loaded through the secure DBACK backend.</p></section><div id="app" class="loading">Loading MuscleWiki…</div></main><script>
const dayNames=${JSON.stringify(Object.keys(DAYS))};let current='Monday';
function dayButtons(){days.innerHTML=dayNames.map(d=>`<button class="${'${d===current?\'on\':\'\'}'}" onclick="loadDay('${'${d}'}')">${'${d}'}</button>`).join('')}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function media(vs,i){if(!vs.length)return '<div class="warn">No MuscleWiki media was returned for this exercise.</div>';let v=vs[i]||vs[0];return `<video controls playsinline preload="metadata" poster="${'${v.image||\'\'}'}"><source src="${'${v.proxy}'}" type="video/mp4"></video>`}
function card(x,idx){let angles=x.exercise.videos||[];return `<article class="card"><div class="head"><div class="meta"><span>${'${esc(x.muscle)}'}</span><span>${'${esc(x.target)}'}</span></div><h2>${'${esc(x.exercise.name||x.requested)}'}</h2></div><div class="media" id="m${'${idx}'}">${'${media(angles,0)}'}</div><div class="body">${'${x.error?`<div class="warn">${esc(x.error)}</div>`:\'\'}'}<ol class="steps">${'${(x.exercise.steps||[]).map(s=>`<li>${esc(s)}</li>`).join(\'\')}'}</ol>${'${angles.length>1?`<div class="angles">${angles.map((v,j)=>`<button onclick=\'swap(${idx},${JSON.stringify(angles)},${j})\'>${esc(v.angle||`View ${j+1}`)}</button>`).join(\'\')}</div>`:\'\'}'}</div></article>`}
function swap(i,vs,j){document.getElementById('m'+i).innerHTML=media(vs,j)}
async function loadDay(d){current=d;dayButtons();title.textContent=d+' Workout';app.className='loading';app.textContent='Loading authenticated MuscleWiki exercises…';try{let r=await fetch('/api/day?day='+encodeURIComponent(d));let data=await r.json();if(!r.ok)throw new Error(data.error||'Request failed');app.className='grid';app.innerHTML=data.exercises.map(card).join('')}catch(e){app.className='warn';app.textContent=e.message}}
dayButtons();loadDay(current);
</script></body></html>`; }

export default { async fetch(request, env) {
  const u = new URL(request.url);
  try {
    if (u.pathname === '/') return page(shell());
    if (u.pathname === '/health') return Response.json({ok:true,musclewiki_key_configured:Boolean(env.MUSCLEWIKI_API_KEY)});
    if (u.pathname === '/api/day') {
      const day=u.searchParams.get('day')||'Monday'; const plan=DAYS[day]; if(!plan)return Response.json({error:'Unknown day'},{status:400});
      const exercises=[];
      for (const [name,muscle,target] of plan) {
        try { const ex=normalizeExercise(await searchExercise(env,name),name); exercises.push({requested:name,muscle,target,exercise:ex}); }
        catch(e){ exercises.push({requested:name,muscle,target,exercise:{name,steps:[],videos:[]},error:e.message}); }
      }
      return Response.json({day,exercises});
    }
    if (u.pathname === '/mw/media') {
      const raw=u.searchParams.get('url'); if(!raw)return new Response('Missing url',{status:400});
      const target=new URL(raw); if(target.protocol!=='https:' || target.hostname!=='api.musclewiki.com')return new Response('Blocked media host',{status:403});
      const headers=new Headers(); const range=request.headers.get('range'); if(range)headers.set('range',range);
      const upstream=await mwFetch(env,target.pathname+target.search,{headers});
      const out=new Headers(); for(const h of ['content-type','content-length','content-range','accept-ranges','etag','last-modified']){const v=upstream.headers.get(h);if(v)out.set(h,v)}
      out.set('cache-control','private, max-age=3600'); return new Response(upstream.body,{status:upstream.status,headers:out});
    }
    return new Response('Not found',{status:404});
  } catch(e) { return Response.json({error:e.message},{status:500}); }
}};
