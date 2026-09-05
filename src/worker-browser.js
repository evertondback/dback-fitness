const COACH_UI = 'ui://dback/coach-v7.html';
const VIDEO_UI = 'ui://dback/video-v4.html';
const Y = 'https://www.youtube.com/watch?v=';
const TZ = 'America/New_York';
const COACH_MODE = 'natural-human';
let DB, PROGRAM;

const WARMUP = [
  ['Toe Spread / Toe Curl','10 slow reps','dVDMUuWtX00'],
  ['Ankle CARs','5/side','vIDJiMShg4o'],
  ['Controlled Knee Circles','8 each direction','92owncvIHlY'],
  ['90/90 Hip Switches','8/side','m51AZSXMvEA'],
  ['Hip CARs','5/side','PO1of6rKX3Q'],
  ['Cat-Cow','8 slow reps','2of247Kt0tU'],
  ['Thoracic Rotation','8/side','l3Ze_9iXL-M'],
  ['Neck CARs','4/side','BsZmSx34hvQ'],
  ['Shoulder CARs','5/side','ghXn2-ZYfU4'],
  ['Scapular Push-Up','8 reps','NKekqeudgWs'],
  ['Forearm Pronation / Supination','10 each','Y-2-lnALVZE'],
  ['Wrist Mobility','10 each','zSzeOHqj1Sw'],
  ['Glute Bridge','10 reps','wPM8icPu6H8'],
  ['Dead Bug','6/side','zechBkcIMf0'],
  ['Dead Hang / Wall Slide','20-30 sec / 8 reps','fq9gDvNZQ2c']
];

const AI_INSTRUCTIONS = `You are DBACK AI Coach in Natural Human Coach Mode. Act like an attentive human personal trainer. Keep active-workout replies short, conversational, and action-oriented. Give one clear next action at a time. Use workout history and progression as the source of truth. If the user says next, done, got 8, used 40 pounds, show video, too easy, or too hard, infer the active workout context and continue. Never claim to see form unless an image or video is actually provided. If the user reports sharp pain, chest pain, fainting, severe shortness of breath, or other concerning symptoms, stop the exercise and advise appropriate medical evaluation. Use the available workout tools when needed instead of merely describing actions.`;

const day = () => new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'long'}).format(new Date());
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const headers = () => ({
  'access-control-allow-origin':'*',
  'access-control-allow-methods':'GET,POST,DELETE,OPTIONS',
  'access-control-allow-headers':'content-type,accept,mcp-session-id,mcp-protocol-version,last-event-id,authorization',
  'access-control-expose-headers':'mcp-session-id,mcp-protocol-version',
  'cache-control':'no-store',
  'vary':'Origin, Accept'
});

async function program(){
  if(PROGRAM) return PROGRAM;
  const r = await DB.prepare("SELECT value FROM app_config WHERE key='program'").first();
  if(!r?.value) throw Error('Workout program is not initialized');
  PROGRAM = JSON.parse(r.value);
  return PROGRAM;
}

async function workout(d=day()){
  const all = await program();
  const p = all[d] || all.Monday;
  const exercises = [];
  for(const a of p.slice(1)){
    const id = slug(a[0]);
    const state = await DB.prepare('SELECT * FROM exercise_state WHERE exercise_id=?').bind(id).first();
    exercises.push({id,name:a[0],sets:a[1],reps:a[2],rest:a[3],rir:a[4],video:Y+a[5],state:state||null});
  }
  const active = await DB.prepare("SELECT * FROM workout_sessions WHERE status='active' ORDER BY started_at DESC LIMIT 1").first();
  return {type:'workout',day:d,focus:p[0],targetMinutes:60,warmup:WARMUP.map(x=>({name:x[0],target:x[1],video:Y+x[2]})),exercises,activeSession:active||null,coachMode:COACH_MODE};
}

async function findExercise(name){
  const all = await program();
  const q = String(name||'').trim().toLowerCase();
  for(const [d,p] of Object.entries(all)){
    for(const a of p.slice(1)){
      const n = String(a[0]);
      if(n.toLowerCase()===q || n.toLowerCase().includes(q) || q.includes(n.toLowerCase())){
        return {day:d,id:slug(n),name:n,sets:a[1],reps:a[2],rest:a[3],rir:a[4],video:Y+a[5]};
      }
    }
  }
  const w = WARMUP.find(x => x[0].toLowerCase().includes(q) || q.includes(x[0].toLowerCase()));
  if(w) return {day:'Warm-Up',id:slug(w[0]),name:w[0],sets:1,reps:w[1],rest:0,rir:null,video:Y+w[2]};
  throw Error(`Exercise not found: ${name}`);
}

async function start(a={}){
  const id = crypto.randomUUID();
  const d = a.day || day();
  const ts = new Date().toISOString();
  await DB.prepare('INSERT INTO workout_sessions(id,workout_date,day_name,started_at,readiness,sleep_hours,bodyweight_lb,status) VALUES(?,?,?,?,?,?,?,?)')
    .bind(id,ts.slice(0,10),d,ts,a.readiness??null,a.sleep_hours??null,a.bodyweight_lb??null,'active').run();
  return {...await workout(d),activeSession:{id,day_name:d,started_at:ts,status:'active'}};
}

async function log(a){
  const ts = new Date().toISOString();
  await DB.prepare('INSERT INTO set_logs(session_id,exercise_id,set_number,weight_lb,reps,seconds,rir,rpe,discomfort,completed_at) VALUES(?,?,?,?,?,?,?,?,?,?)')
    .bind(a.session_id,a.exercise_id,a.set_number,a.weight_lb??null,a.reps??null,a.seconds??null,a.rir??null,a.rpe??null,a.discomfort??0,ts).run();
  const p = await DB.prepare('SELECT * FROM exercise_state WHERE exercise_id=?').bind(a.exercise_id).first();
  const w = a.weight_lb ?? p?.last_weight_lb ?? null;
  const r = a.reps ?? p?.last_reps ?? null;
  let nw = w;
  if(w!=null && r!=null && (a.rir==null || a.rir>=1)) nw = Math.round((w+2.5)*2)/2;
  await DB.prepare(`INSERT INTO exercise_state(exercise_id,last_weight_lb,last_reps,last_seconds,last_rir,best_weight_lb,best_reps,best_seconds,next_weight_lb,updated_at)
    VALUES(?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(exercise_id) DO UPDATE SET
      last_weight_lb=excluded.last_weight_lb,last_reps=excluded.last_reps,last_seconds=excluded.last_seconds,last_rir=excluded.last_rir,
      best_weight_lb=MAX(COALESCE(exercise_state.best_weight_lb,0),COALESCE(excluded.last_weight_lb,0)),
      best_reps=MAX(COALESCE(exercise_state.best_reps,0),COALESCE(excluded.last_reps,0)),
      best_seconds=MAX(COALESCE(exercise_state.best_seconds,0),COALESCE(excluded.last_seconds,0)),
      next_weight_lb=excluded.next_weight_lb,updated_at=excluded.updated_at`)
    .bind(a.exercise_id,w,r,a.seconds??null,a.rir??null,w,r,a.seconds??null,nw,ts).run();
  return {type:'set_logged',recommendation:nw>w?`Next session target: ${nw} lb if form stays clean.`:'Keep current load and progress reps/time.'};
}

async function finish(a){
  const x = await DB.prepare('SELECT * FROM workout_sessions WHERE id=?').bind(a.session_id).first();
  if(!x) throw Error('Workout session not found');
  const end = new Date().toISOString();
  const dur = Math.max(0,Math.floor((Date.parse(end)-Date.parse(x.started_at))/1000));
  await DB.prepare("UPDATE workout_sessions SET completed_at=?,duration_seconds=?,session_rpe=?,notes=?,status='complete' WHERE id=?")
    .bind(end,dur,a.session_rpe??null,a.notes??null,a.session_id).run();
  const s = await DB.prepare('SELECT COUNT(*) count,SUM(COALESCE(weight_lb,0)*COALESCE(reps,0)) volume FROM set_logs WHERE session_id=?').bind(a.session_id).first();
  return {type:'summary',duration_seconds:dur,sets:+(s?.count||0),volume_lb_reps:+(s?.volume||0)};
}

const defs = [
  ['open_coach','Open DBACK AI Coach','Use this when the user wants to open the interactive DBACK AI workout coach.',{},COACH_UI,true],
  ['get_today_workout','Get today workout','Use this when the user asks what to train today.',{day:{type:'string'}},COACH_UI,true],
  ['start_workout','Start tracked workout','Use this when the user is ready to begin a tracked workout.',{day:{type:'string'},readiness:{type:'integer',minimum:1,maximum:10},sleep_hours:{type:'number'},bodyweight_lb:{type:'number'}},COACH_UI,false],
  ['get_exercise_video','Show exercise instruction video','Use this when the user asks to show, watch, or play the instructional video for an exercise.',{exercise_name:{type:'string'}},VIDEO_UI,true],
  ['log_set','Log completed set','Use this when the user completes a set and wants it recorded.',{session_id:{type:'string'},exercise_id:{type:'string'},set_number:{type:'integer',minimum:1},weight_lb:{type:'number'},reps:{type:'integer'},seconds:{type:'integer'},rir:{type:'number'},rpe:{type:'number'},discomfort:{type:'integer'}},null,false],
  ['complete_workout','Complete workout','Use this when the user finishes a workout.',{session_id:{type:'string'},session_rpe:{type:'number'},notes:{type:'string'}},null,false],
  ['get_history','Get workout history','Use this when the user asks for recent workout history.',{limit:{type:'integer',minimum:1,maximum:30}},null,true]
];

const tools = defs.map(x=>{
  const meta = x[4] ? {ui:{resourceUri:x[4]},'openai/outputTemplate':x[4]} : {};
  return {name:x[0],title:x[1],description:x[2],inputSchema:{type:'object',properties:x[3],required:x[0]==='get_exercise_video'?['exercise_name']:x[0]==='log_set'?['session_id','exercise_id','set_number']:x[0]==='complete_workout'?['session_id']:[]},annotations:{readOnlyHint:x[5],destructiveHint:false,openWorldHint:false},_meta:meta};
});

const out = (x,t='DBACK AI Coach updated.') => ({structuredContent:x,content:[{type:'text',text:t}]});
async function call(n,a={}){
  if(n==='open_coach'||n==='get_today_workout') return out(await workout(a.day||day()));
  if(n==='start_workout') return out(await start(a),'Workout started. I’ll coach you one exercise and one set at a time.');
  if(n==='get_exercise_video'){ const e=await findExercise(a.exercise_name); return out({type:'video',exercise:e},`${e.name} instructional video is shown below.`); }
  if(n==='log_set'){ const r=await log(a); return out(r,'Set logged. '+r.recommendation); }
  if(n==='complete_workout') return out(await finish(a),'Workout complete. I’ll use today’s performance to guide the next session.');
  if(n==='get_history') return out({type:'history',sessions:(await DB.prepare('SELECT * FROM workout_sessions ORDER BY started_at DESC LIMIT ?').bind(Math.min(a.limit||10,30)).all()).results||[]});
  throw Error('Unknown tool');
}

function coachHtml(){
  return `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1"><style>body{margin:0;background:#0b1220;color:#f8fafc;font:14px -apple-system,Segoe UI,sans-serif}.a{max-width:820px;margin:auto;padding:16px}.h,.c{background:#111827;border:1px solid #263247;border-radius:15px;padding:14px;margin:10px 0}.h{background:#172554}.m{color:#94a3b8;font-size:12px}h1,h3{margin:5px 0}.g{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:9px 0}input,button{border:0;border-radius:9px;padding:10px;font-weight:700}input{width:100%;box-sizing:border-box;background:#0f172a;color:white;border:1px solid #334155}button{background:white;color:#111827}.video{background:#2563eb;color:white}.r{display:flex;gap:7px;flex-wrap:wrap}.p{display:none;position:relative;width:100%;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000;margin-top:10px}.p iframe{position:absolute;inset:0;width:100%;height:100%;border:0}@media(max-width:600px){.g{grid-template-columns:repeat(2,1fr)}}</style><div class=a><b>DBACK AI COACH</b><div class=m>Natural Human Coach Mode</div><div id=r></div></div><script>let raw=window.openai?.toolOutput||{},d=raw.structuredContent||raw||{},s=d.activeSession;function y(u){try{return new URL(u).searchParams.get('v')||''}catch{return''}}function V(i,u){let p=document.getElementById('v'+i),f=document.getElementById('f'+i);if(p.style.display==='block'){p.style.display='none';f.src='';return}let id=y(u);if(!id)return;p.style.display='block';f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?rel=0&playsinline=1'}async function C(n,a){let z=await window.openai.callTool(n,a||{}),x=z?.structuredContent||z;if(x){if(n==='log_set'){alert(x.recommendation||'Set logged');return x}d=x;s=x.activeSession||s;R()}return x}async function S(){s=(await C('start_workout',{day:d.day,readiness:8})).activeSession}async function L(id,i){if(!s?.id)await S();let q=k=>document.getElementById(k+i).value,a={session_id:s.id,exercise_id:id,set_number:+q('s')||1};if(q('w'))a.weight_lb=+q('w');if(q('p'))a.reps=+q('p');if(q('i'))a.rir=+q('i');await C('log_set',a)}async function F(){if(s?.id){await C('complete_workout',{session_id:s.id,session_rpe:8});alert('Workout complete')}}function R(){let r=document.getElementById('r');r.innerHTML='<div class=h><div class=m>'+(d.day||'Today')+'</div><h1>'+(d.focus||'Workout')+'</h1><div class=m>60 min · '+(s?.id?'tracking active':'ready')+' · '+((d.warmup||[]).length||15)+' warm-up movements</div><div class=r style="margin-top:10px"><button onclick=S()>Start</button><button onclick=F()>Finish</button></div></div>'+(d.exercises||[]).map((e,i)=>'<div class=c><div class=m>'+e.sets+' × '+e.reps+' · rest '+e.rest+'s · RIR '+e.rir+'</div><h3>'+e.name+'</h3><div class=m>Previous '+(e.state?.last_weight_lb??'—')+' lb × '+(e.state?.last_reps??'—')+' · next '+(e.state?.next_weight_lb??'—')+'</div><div class=g><input id=s'+i+' value=1 type=number><input id=w'+i+' placeholder=lb type=number step=2.5><input id=p'+i+' placeholder=reps type=number><input id=i'+i+' placeholder=RIR type=number></div><div class=r><button onclick="L(\''+e.id+'\','+i+')">Complete Set</button><button class=video onclick="V('+i+',\''+e.video+'\')">Play Video Here</button></div><div class=p id=v'+i+'><iframe id=f'+i+' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div>').join('')}R()</script>`;
}

function videoHtml(){
  return `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1"><style>body{margin:0;background:#0b1220;color:#f8fafc;font:14px -apple-system,Segoe UI,sans-serif}.a{max-width:760px;margin:auto;padding:14px}.c{background:#111827;border:1px solid #263247;border-radius:15px;padding:14px}.m{color:#94a3b8;font-size:12px}h2{margin:5px 0 10px}.p{position:relative;width:100%;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000}.p iframe{position:absolute;inset:0;width:100%;height:100%;border:0}</style><div class=a><div class=c id=r>Loading video…</div></div><script>function render(){const raw=window.openai?.toolOutput||{},d=raw.structuredContent||raw||{},e=d.exercise||{};if(!e.name)return;let v='';try{v=new URL(e.video||'').searchParams.get('v')||''}catch{}let src=v?'https://www.youtube-nocookie.com/embed/'+encodeURIComponent(v)+'?rel=0&playsinline=1':'';document.getElementById('r').innerHTML='<div class=m>Professional instructional video</div><h2>'+e.name+'</h2><div class=m>'+e.sets+' × '+e.reps+' · rest '+e.rest+'s · RIR '+e.rir+'</div>'+(src?'<div class=p style="margin-top:12px"><iframe src="'+src+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>':'<p>Video unavailable.</p>')}render();window.addEventListener('message',render)</script>`;
}

async function aiCoach(env,message,previousResponseId){
  if(!env.OPENAI_API_KEY) return {error:'OPENAI_API_KEY is not configured on the Worker yet.'};
  const fnTools = [
    {type:'function',name:'get_today_workout',description:'Get today workout and current exercise prescriptions.',parameters:{type:'object',properties:{day:{type:'string'}},additionalProperties:false}},
    {type:'function',name:'start_workout',description:'Start a tracked workout session.',parameters:{type:'object',properties:{day:{type:'string'},readiness:{type:'integer'},sleep_hours:{type:'number'},bodyweight_lb:{type:'number'}},additionalProperties:false}},
    {type:'function',name:'log_set',description:'Log a completed workout set.',parameters:{type:'object',required:['session_id','exercise_id','set_number'],properties:{session_id:{type:'string'},exercise_id:{type:'string'},set_number:{type:'integer'},weight_lb:{type:'number'},reps:{type:'integer'},seconds:{type:'integer'},rir:{type:'number'},rpe:{type:'number'},discomfort:{type:'integer'}},additionalProperties:false}},
    {type:'function',name:'complete_workout',description:'Complete the active workout session.',parameters:{type:'object',required:['session_id'],properties:{session_id:{type:'string'},session_rpe:{type:'number'},notes:{type:'string'}},additionalProperties:false}},
    {type:'function',name:'show_video',description:'Return an exercise and its inline instructional video information.',parameters:{type:'object',required:['exercise_name'],properties:{exercise_name:{type:'string'}},additionalProperties:false}}
  ];
  const callOpenAI = async body => {
    const resp = await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{authorization:'Bearer '+env.OPENAI_API_KEY,'content-type':'application/json'},body:JSON.stringify(body)});
    const data = await resp.json();
    if(!resp.ok) throw Error(data?.error?.message||'OpenAI API request failed');
    return data;
  };
  let body = {model:env.OPENAI_MODEL||'gpt-5.5',instructions:AI_INSTRUCTIONS,input:String(message||''),tools:fnTools,tool_choice:'auto',store:true,max_output_tokens:500};
  if(previousResponseId) body.previous_response_id = previousResponseId;
  let data;
  try{ data = await callOpenAI(body); }catch(e){ return {error:e.message}; }
  const actions=[];
  for(let round=0;round<4;round++){
    const calls = (data.output||[]).filter(x=>x.type==='function_call');
    if(!calls.length) break;
    const outputs=[];
    for(const c of calls){
      let a={}; try{ a=JSON.parse(c.arguments||'{}'); }catch{}
      let result;
      if(c.name==='get_today_workout') result=await workout(a.day||day());
      else if(c.name==='start_workout') result=await start(a);
      else if(c.name==='log_set') result=await log(a);
      else if(c.name==='complete_workout') result=await finish(a);
      else if(c.name==='show_video'){ result=await findExercise(a.exercise_name); actions.push({type:'video',exercise:result}); }
      else result={error:'Unknown tool'};
      outputs.push({type:'function_call_output',call_id:c.call_id,output:JSON.stringify(result)});
    }
    try{ data = await callOpenAI({model:env.OPENAI_MODEL||'gpt-5.5',instructions:AI_INSTRUCTIONS,previous_response_id:data.id,input:outputs,tools:fnTools,tool_choice:'auto',store:true,max_output_tokens:500}); }
    catch(e){ return {error:e.message}; }
  }
  const text = (data.output||[]).flatMap(x=>x.type==='message'?(x.content||[]):[]).filter(x=>x.type==='output_text').map(x=>x.text).join('\n').trim();
  return {id:data.id,text:text||'Ready.',actions};
}

function browserHtml(){
  return `<!doctype html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>DBACK AI Coach</title><style>body{margin:0;background:#07111f;color:#f8fafc;font:15px -apple-system,Segoe UI,sans-serif}.app{max-width:980px;margin:auto;padding:18px}.top{display:flex;justify-content:space-between;align-items:center}.badge{font-size:12px;color:#93c5fd}.hero,.card,.chat{background:#111827;border:1px solid #24324a;border-radius:18px;padding:16px;margin:12px 0}.hero{background:linear-gradient(135deg,#172554,#0f172a)}h1,h2,h3{margin:4px 0 10px}.muted{color:#94a3b8;font-size:12px}.row{display:flex;gap:8px;flex-wrap:wrap}button{border:0;border-radius:11px;padding:11px 14px;font-weight:750;background:#f8fafc;color:#111827}.blue{background:#2563eb;color:#fff}.green{background:#16a34a;color:#fff}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0}input{width:100%;box-sizing:border-box;border:1px solid #334155;border-radius:9px;background:#0f172a;color:#fff;padding:10px}.vid{display:none;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden;margin-top:10px}.vid iframe{width:100%;height:100%;border:0}.messages{max-height:330px;overflow:auto}.msg{padding:10px 12px;border-radius:12px;margin:8px 0;white-space:pre-wrap}.me{background:#1e3a5f}.ai{background:#172033}.ask{display:flex;gap:8px}.ask input{flex:1}.warm{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}@media(max-width:650px){.grid{grid-template-columns:repeat(2,1fr)}.warm{grid-template-columns:1fr}}</style></head><body><div class=app><div class=top><div><b>DBACK AI COACH</b><div class=badge>Standalone Browser · Natural Human Coach Mode</div></div><button onclick=loadToday()>Refresh</button></div><div id=main></div><div class=chat><h3>AI Coach</h3><div id=messages class=messages><div class='msg ai'>I’m ready. Tell me “start my workout,” “next,” “show video,” or log your set naturally.</div></div><div class=ask><input id=prompt placeholder="Talk to your coach…" onkeydown="if(event.key==='Enter')sendAI()"><button class=blue onclick=sendAI()>Send</button></div><div id=aistatus class=muted></div></div></div><script>let W=null,S=null,prev=localStorage.getItem('dback_response_id')||'';function esc(x){return String(x??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}function y(u){try{return new URL(u).searchParams.get('v')||''}catch{return''}}function video(i,u){let p=document.getElementById('vid'+i),f=document.getElementById('frame'+i);if(p.style.display==='block'){p.style.display='none';f.src='';return}let id=y(u);if(!id)return;p.style.display='block';f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?rel=0&playsinline=1'}async function api(path,opt){let r=await fetch(path,opt),j=await r.json();if(!r.ok)throw Error(j.error||'Request failed');return j}async function loadToday(){W=await api('/api/today');S=W.activeSession||S;render()}async function start(){let a=await api('/api/start',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({day:W.day,readiness:8})});S=a.activeSession;W=a;render()}async function logset(id,i){if(!S?.id)await start();let g=k=>document.getElementById(k+i).value,b={session_id:S.id,exercise_id:id,set_number:+g('s')||1};if(g('w'))b.weight_lb=+g('w');if(g('r'))b.reps=+g('r');if(g('i'))b.rir=+g('i');let z=await api('/api/log-set',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});add('ai','Set logged. '+z.recommendation)}async function finish(){if(!S?.id)return;let z=await api('/api/complete',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({session_id:S.id,session_rpe:8})});add('ai','Workout complete: '+Math.round(z.duration_seconds/60)+' min, '+z.sets+' sets.');S=null}function render(){let m=document.getElementById('main');m.innerHTML='<div class=hero><div class=muted>'+esc(W.day)+'</div><h1>'+esc(W.focus)+'</h1><div class=muted>60-minute target · '+(S?.id?'tracking active':'ready')+'</div><div class=row style="margin-top:12px"><button class=green onclick=start()>Start Workout</button><button onclick=finish()>Finish</button></div></div><div class=card><h3>Joint + Alignment Warm-Up</h3><div class=warm>'+W.warmup.map((x,i)=>'<div><b>'+(i+1)+'. '+esc(x.name)+'</b><div class=muted>'+esc(x.target)+'</div><button class=blue style="margin-top:5px" onclick="video(\'w'+i+'\',\''+x.video+'\')">Video</button><div class=vid id="vidw'+i+'"><iframe id="framew'+i+'" allowfullscreen></iframe></div></div>').join('')+'</div></div>'+W.exercises.map((e,i)=>'<div class=card><div class=muted>'+e.sets+' × '+esc(e.reps)+' · '+e.rest+'s rest · RIR '+esc(e.rir)+'</div><h3>'+esc(e.name)+'</h3><div class=muted>Previous '+esc(e.state?.last_weight_lb??'—')+' lb × '+esc(e.state?.last_reps??'—')+' · Next '+esc(e.state?.next_weight_lb??'—')+'</div><div class=grid><input id=s'+i+' value=1 type=number><input id=w'+i+' placeholder=lb type=number step=2.5><input id=r'+i+' placeholder=reps type=number><input id=i'+i+' placeholder=RIR type=number></div><div class=row><button onclick="logset(\''+e.id+'\','+i+')">Complete Set</button><button class=blue onclick="video('+i+',\''+e.video+'\')">Play Video</button></div><div class=vid id=vid'+i+'><iframe id=frame'+i+' allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>').join('')}function add(cls,t){let d=document.getElementById('messages'),x=document.createElement('div');x.className='msg '+cls;x.textContent=t;d.appendChild(x);d.scrollTop=d.scrollHeight}async function sendAI(){let p=document.getElementById('prompt'),t=p.value.trim();if(!t)return;p.value='';add('me',t);document.getElementById('aistatus').textContent='Coach is thinking…';try{let z=await api('/api/coach',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:t,previous_response_id:prev||null})});if(z.id){prev=z.id;localStorage.setItem('dback_response_id',prev)}add('ai',z.text||'Ready.');for(const a of z.actions||[]){if(a.type==='video'&&a.exercise?.video){let e=(W?.exercises||[]).find(x=>x.name===a.exercise.name);if(e){let i=W.exercises.indexOf(e);video(i,e.video)}else add('ai','Video: '+a.exercise.video)}}await loadToday()}catch(e){add('ai','AI coach is not configured yet: '+e.message)}finally{document.getElementById('aistatus').textContent=''}}loadToday()</script></body></html>`;
}

const rpc=(id,result,status=200)=>new Response(JSON.stringify({jsonrpc:'2.0',id,result}),{status,headers:{...headers(),'content-type':'application/json','mcp-protocol-version':'2025-06-18'}});
const err=(id,code,message,status=400)=>new Response(JSON.stringify({jsonrpc:'2.0',id:id??null,error:{code,message}}),{status,headers:{...headers(),'content-type':'application/json'}});

async function mcp(r){
  let q; try{q=await r.json()}catch{return err(null,-32700,'Parse error')}
  if(!q||q.jsonrpc!=='2.0'||typeof q.method!=='string') return err(q?.id,-32600,'Invalid Request');
  const {id,method,params}=q;
  if(method==='initialize') return rpc(id,{protocolVersion:['2025-11-25','2025-06-18','2025-03-26'].includes(params?.protocolVersion)?params.protocolVersion:'2025-06-18',capabilities:{tools:{listChanged:false},resources:{subscribe:false,listChanged:false}},serverInfo:{name:'DBACK AI Coach',version:'1.6.0'},instructions:AI_INSTRUCTIONS});
  if(id==null) return new Response(null,{status:202,headers:headers()});
  if(method==='ping') return rpc(id,{});
  if(method==='tools/list') return rpc(id,{tools});
  if(method==='prompts/list') return rpc(id,{prompts:[]});
  if(method==='resources/templates/list') return rpc(id,{resourceTemplates:[]});
  if(method==='resources/list') return rpc(id,{resources:[{uri:COACH_UI,name:'DBACK AI Coach',mimeType:'text/html;profile=mcp-app'},{uri:VIDEO_UI,name:'DBACK Exercise Video',mimeType:'text/html;profile=mcp-app'}]});
  if(method==='resources/read'&&params?.uri===COACH_UI) return rpc(id,{contents:[{uri:COACH_UI,mimeType:'text/html;profile=mcp-app',text:coachHtml(),_meta:{'openai/widgetDescription':'Interactive DBACK workout coach with Natural Human Coach Mode, inline exercise videos, set tracking, progression, and history.',ui:{prefersBorder:true,csp:{connectDomains:[],resourceDomains:[],frameDomains:['https://www.youtube-nocookie.com','https://www.youtube.com']}},'openai/widgetCSP':{connect_domains:[],resource_domains:[],frame_domains:['https://www.youtube-nocookie.com','https://www.youtube.com']}}}]});
  if(method==='resources/read'&&params?.uri===VIDEO_UI) return rpc(id,{contents:[{uri:VIDEO_UI,mimeType:'text/html;profile=mcp-app',text:videoHtml(),_meta:{'openai/widgetDescription':'Inline DBACK exercise instructional video player.',ui:{prefersBorder:true,csp:{connectDomains:[],resourceDomains:[],frameDomains:['https://www.youtube-nocookie.com','https://www.youtube.com']}},'openai/widgetCSP':{connect_domains:[],resource_domains:[],frame_domains:['https://www.youtube-nocookie.com','https://www.youtube.com']}}}]});
  if(method==='tools/call'){
    try{return rpc(id,await call(params?.name,params?.arguments||{}))}
    catch(e){return rpc(id,{isError:true,content:[{type:'text',text:e?.message||'Tool failed'}]})}
  }
  return err(id,-32601,'Method not found',404);
}

export default {
  async fetch(r,env){
    DB=env.DB;
    const u=new URL(r.url);
    if(r.method==='OPTIONS') return new Response(null,{status:204,headers:headers()});
    if(u.pathname==='/mcp'){
      if(r.method==='POST') return mcp(r);
      return new Response('DBACK AI Coach MCP endpoint is online. Use an MCP client with POST.',{status:405,headers:{...headers(),allow:'POST, OPTIONS'}});
    }
    if(u.pathname==='/health') return Response.json({ok:true,service:'DBACK AI Coach',version:'1.6.0',coachMode:COACH_MODE,database:!!env.DB,openaiConfigured:!!env.OPENAI_API_KEY,mcp:'/mcp'},{headers:headers()});
    if(u.pathname==='/api/today'&&r.method==='GET') return Response.json(await workout(u.searchParams.get('day')||day()),{headers:headers()});
    if(u.pathname==='/api/start'&&r.method==='POST') return Response.json(await start(await r.json()),{headers:headers()});
    if(u.pathname==='/api/log-set'&&r.method==='POST') return Response.json(await log(await r.json()),{headers:headers()});
    if(u.pathname==='/api/complete'&&r.method==='POST') return Response.json(await finish(await r.json()),{headers:headers()});
    if(u.pathname==='/api/coach'&&r.method==='POST'){
      const b=await r.json();
      const z=await aiCoach(env,b.message,b.previous_response_id);
      return Response.json(z,{status:z.error?503:200,headers:headers()});
    }
    if(u.pathname==='/') return new Response(browserHtml(),{headers:{...headers(),'content-type':'text/html;charset=utf-8'}});
    return new Response('Not found',{status:404,headers:headers()});
  }
};