import {PROGRAM31,WARMUP31,DAY_ORDER,validateProgram31,PROGRAM_VERSION} from './v31-program-core.js';
import {enrichProgram,WARMUP_COACHING,coachingFor} from './v36-coaching.js';

const TZ='America/New_York';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const weekday=()=>new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'long'}).format(new Date());
const allExercises=()=>Object.values(PROGRAM31).flatMap(d=>d.exercises);
const exerciseById=id=>allExercises().find(e=>e.id===id)||null;
const coachedExercise=e=>({...e,coaching:coachingFor(e)});
const coachedWarmup=()=>WARMUP31.map(x=>({...x,purpose:WARMUP_COACHING[x.name]||`Prepare ${x.category} for the training session with controlled movement.`}));
function ensureDb(env){if(!env.DB)throw new Error('D1 binding DB is unavailable.');return env.DB}
async function readBody(req){try{return await req.json()}catch{return {}}}
async function state(env,id){return await ensureDb(env).prepare('SELECT * FROM exercise_state WHERE exercise_id=?').bind(id).first()}

async function programPayload(env){
 const db=ensureDb(env);
 const active=await db.prepare("SELECT * FROM workout_sessions WHERE status='active' ORDER BY started_at DESC LIMIT 1").first();
 return {version:PROGRAM_VERSION,validation:validateProgram31(),dayOrder:DAY_ORDER,warmup:coachedWarmup(),program:enrichProgram(PROGRAM31),today:weekday(),activeSession:active||null};
}

async function startSession(req,env){
 const db=ensureDb(env),a=await readBody(req),day=a.day||weekday();if(!PROGRAM31[day])return json({error:'Unknown day.'},400);
 const existing=await db.prepare("SELECT * FROM workout_sessions WHERE status='active' ORDER BY started_at DESC LIMIT 1").first();
 if(existing)return json({ok:true,reused:true,session:existing,day,workout:{...PROGRAM31[day],exercises:PROGRAM31[day].exercises.map(coachedExercise)},warmup:coachedWarmup()});
 const id=crypto.randomUUID(),ts=new Date().toISOString();
 await db.prepare('INSERT INTO workout_sessions(id,workout_date,day_name,started_at,readiness,sleep_hours,bodyweight_lb,status) VALUES(?,?,?,?,?,?,?,?)').bind(id,today(),day,ts,a.readiness??null,a.sleep_hours??null,a.bodyweight_lb??null,'active').run();
 return json({ok:true,reused:false,session:{id,workout_date:today(),day_name:day,started_at:ts,status:'active'},day,workout:{...PROGRAM31[day],exercises:PROGRAM31[day].exercises.map(coachedExercise)},warmup:coachedWarmup()});
}

async function logSet(req,env){
 const db=ensureDb(env),a=await readBody(req);for(const k of ['session_id','exercise_id','set_number'])if(a[k]===undefined||a[k]===null||a[k]==='')return json({error:`Missing ${k}.`},400);
 const session=await db.prepare('SELECT * FROM workout_sessions WHERE id=?').bind(a.session_id).first();if(!session)return json({error:'Session not found.'},404);if(session.status!=='active')return json({error:'Session is not active.'},409);
 const e=exerciseById(a.exercise_id);if(!e)return json({error:'Unknown exercise.'},400);
 const ts=new Date().toISOString();
 await db.prepare('INSERT INTO set_logs(session_id,exercise_id,set_number,weight_lb,reps,seconds,distance_ft,rir,rpe,discomfort,completed_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(a.session_id,a.exercise_id,a.set_number,a.weight_lb??null,a.reps??null,a.seconds??null,a.distance_ft??null,a.rir??null,a.rpe??null,a.discomfort??0,ts).run();
 const prev=await state(env,a.exercise_id),w=a.weight_lb??prev?.last_weight_lb??null,r=a.reps??prev?.last_reps??null,s=a.seconds??prev?.last_seconds??null,rir=a.rir??null,match=String(e.reps).match(/(\d+)[^\d]+(\d+)/),hi=match?+match[2]:null;
 let nextWeight=w,nextReps=null;if(w!=null&&r!=null&&hi&&r>=hi&&(rir==null||rir>=1))nextWeight=Math.round((Number(w)+2.5)*2)/2;else if(r!=null&&hi)nextReps=Math.min(hi,Number(r)+1);
 await db.prepare(`INSERT INTO exercise_state(exercise_id,last_weight_lb,last_reps,last_seconds,last_rir,best_weight_lb,best_reps,best_seconds,next_weight_lb,next_reps_target,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(exercise_id) DO UPDATE SET last_weight_lb=excluded.last_weight_lb,last_reps=excluded.last_reps,last_seconds=excluded.last_seconds,last_rir=excluded.last_rir,best_weight_lb=MAX(COALESCE(exercise_state.best_weight_lb,0),COALESCE(excluded.last_weight_lb,0)),best_reps=MAX(COALESCE(exercise_state.best_reps,0),COALESCE(excluded.last_reps,0)),best_seconds=MAX(COALESCE(exercise_state.best_seconds,0),COALESCE(excluded.last_seconds,0)),next_weight_lb=excluded.next_weight_lb,next_reps_target=excluded.next_reps_target,updated_at=excluded.updated_at`).bind(a.exercise_id,w,r,s,rir,w,r,s,nextWeight,nextReps,ts).run();
 return json({ok:true,exercise:coachedExercise(e),state:await state(env,a.exercise_id),recommendation:nextWeight!=null&&w!=null&&nextWeight>w?`Next session: ${nextWeight} lb if form stays clean.`:nextReps?`Next target: ${nextReps} reps at the same load.`:'Keep the current prescription and maintain clean form with 1-2 reps in reserve.'});
}

async function completeSession(req,env){
 const db=ensureDb(env),a=await readBody(req);if(!a.session_id)return json({error:'Missing session_id.'},400);
 const s=await db.prepare('SELECT * FROM workout_sessions WHERE id=?').bind(a.session_id).first();if(!s)return json({error:'Session not found.'},404);
 const end=new Date().toISOString(),duration=Math.max(0,Math.round((Date.now()-new Date(s.started_at).getTime())/60000));
 await db.prepare('UPDATE workout_sessions SET completed_at=?,duration_min=?,session_rpe=?,notes=?,status=? WHERE id=?').bind(end,duration,a.session_rpe??null,a.notes??null,'complete',a.session_id).run();
 return json({ok:true,session:{...s,completed_at:end,duration_min:duration,session_rpe:a.session_rpe??null,notes:a.notes??null,status:'complete'}});
}

async function history(env,url){const db=ensureDb(env),limit=Math.min(100,Math.max(1,Number(url.searchParams.get('limit')||30)));const sessions=await db.prepare('SELECT * FROM workout_sessions ORDER BY started_at DESC LIMIT ?').bind(limit).all();return json({ok:true,sessions:sessions.results||[]})}
async function progress(env,url){const db=ensureDb(env),id=url.searchParams.get('exercise_id');if(!id)return json({error:'Missing exercise_id.'},400);const e=exerciseById(id);if(!e)return json({error:'Unknown exercise.'},404);const st=await state(env,id);const logs=await db.prepare('SELECT * FROM set_logs WHERE exercise_id=? ORDER BY completed_at DESC LIMIT 20').bind(id).all();return json({ok:true,exercise:coachedExercise(e),state:st||null,recentSets:logs.results||[]})}

export async function handleV31Api(req,env,url){
 if(url.pathname==='/api/v31/health'&&req.method==='GET')return json({ok:true,program:validateProgram31(),d1:Boolean(env.DB),version:PROGRAM_VERSION});
 if(url.pathname==='/api/v31/program'&&req.method==='GET')return json(await programPayload(env));
 if(url.pathname==='/api/v31/session/start'&&req.method==='POST')return startSession(req,env);
 if(url.pathname==='/api/v31/session/log'&&req.method==='POST')return logSet(req,env);
 if(url.pathname==='/api/v31/session/complete'&&req.method==='POST')return completeSession(req,env);
 if(url.pathname==='/api/v31/history'&&req.method==='GET')return history(env,url);
 if(url.pathname==='/api/v31/progress'&&req.method==='GET')return progress(env,url);
 return null;
}
