import {SYSTEM_VERSION} from './system-version.js';

const headers=()=>({'content-type':'application/json;charset=utf-8','cache-control':'no-store','x-dback-build':SYSTEM_VERSION});
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:headers()});
const now=()=>new Date().toISOString();
const uid=()=>crypto.randomUUID();
async function body(req){try{return await req.clone().json()}catch{return{}}}
function db(env){if(!env.DB)throw new Error('D1 binding DB is unavailable.');return env.DB}

async function completeV31(req,env){
 const a=await body(req);if(!a.session_id)return json({error:'Missing session_id.',version:SYSTEM_VERSION},400);
 const D=db(env),s=await D.prepare('SELECT * FROM workout_sessions WHERE id=?').bind(a.session_id).first();
 if(!s)return json({error:'Session not found.',version:SYSTEM_VERSION},404);
 const end=now(),duration=Math.max(0,Math.round((Date.now()-new Date(s.started_at).getTime())/1000));
 await D.prepare("UPDATE workout_sessions SET completed_at=?,duration_seconds=?,session_rpe=?,notes=?,status='complete' WHERE id=?").bind(end,duration,a.session_rpe??null,a.notes??null,a.session_id).run();
 return json({ok:true,version:SYSTEM_VERSION,session:{...s,completed_at:end,duration_seconds:duration,session_rpe:a.session_rpe??null,notes:a.notes??null,status:'complete'}});
}

async function addSession(a,env){
 const D=db(env),f=a.fields||{},id=uid(),date=f.workout_date||new Date().toISOString().slice(0,10),day=f.day_name||new Date(date+'T12:00:00').toLocaleDateString('en-US',{weekday:'long'}),started=now(),completed=f.status==='active'?null:started;
 await D.prepare('INSERT INTO workout_sessions(id,workout_date,day_name,started_at,completed_at,duration_seconds,session_rpe,status,notes) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,date,day,started,completed,f.duration_seconds??null,f.session_rpe??null,f.status||'complete',f.notes||null).run();
 return json({ok:true,version:SYSTEM_VERSION,session_id:id});
}

async function duplicateSession(a,env){
 const D=db(env),s=await D.prepare('SELECT * FROM workout_sessions WHERE id=?').bind(a.session_id).first();if(!s)return json({error:'session not found',version:SYSTEM_VERSION},404);
 const id=uid(),date=a.fields?.workout_date||new Date().toISOString().slice(0,10),ts=now();
 await D.prepare('INSERT INTO workout_sessions(id,workout_date,day_name,started_at,completed_at,duration_seconds,session_rpe,status,notes) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,date,s.day_name,ts,ts,s.duration_seconds,s.session_rpe,'complete',(s.notes||'')+' [duplicated]').run();
 await D.prepare('INSERT INTO set_logs(session_id,exercise_id,set_number,weight_lb,reps,seconds,distance_ft,rir,rpe,discomfort,completed_at) SELECT ?,exercise_id,set_number,weight_lb,reps,seconds,distance_ft,rir,rpe,discomfort,? FROM set_logs WHERE session_id=?').bind(id,ts,a.session_id).run();
 return json({ok:true,version:SYSTEM_VERSION,session_id:id});
}

async function stopCurrent(env){
 const D=db(env),s=await D.prepare("SELECT id,started_at FROM workout_sessions WHERE status='active' ORDER BY started_at DESC LIMIT 1").first();if(!s)return json({ok:true,version:SYSTEM_VERSION,changed:false});
 const ts=now(),duration=Math.max(0,Math.round((Date.now()-new Date(s.started_at).getTime())/1000));
 await D.prepare("UPDATE workout_sessions SET status='abandoned',completed_at=?,duration_seconds=? WHERE id=?").bind(ts,duration,s.id).run();
 return json({ok:true,version:SYSTEM_VERSION,changed:true,session_id:s.id,duration_seconds:duration});
}

export async function handleV37ReconcileApi(req,env,url){
 if(req.method==='POST'&&url.pathname==='/api/v31/session/complete')return completeV31(req,env);
 if(req.method==='POST'&&url.pathname==='/api/manage/history'){
  const a=await body(req);
  if(a.action==='add-session')return addSession(a,env);
  if(a.action==='duplicate-session')return duplicateSession(a,env);
  if(a.action==='stop-current')return stopCurrent(env);
 }
 return null;
}
