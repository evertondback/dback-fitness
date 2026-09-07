import {HOME_EQUIPMENT_CATALOG,GYM_EQUIPMENT_CATALOG,equipmentNamesForMode} from './v47-equipment-catalog.js';
import {PROGRAM31,DAY_ORDER} from './v31-program-core.js';
import {coachingFor} from './v36-coaching.js';

export const PLATFORM40_VERSION='47.0.0';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const readBody=async req=>{try{return await req.json()}catch{return {}}};
const now=()=>new Date().toISOString();
const ensureDb=env=>{if(!env.DB)throw new Error('D1 binding DB is unavailable.');return env.DB};
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const parse=j=>{try{return JSON.parse(j)}catch{return null}};

const DAY_PURPOSE={
 Sunday:'Restore movement quality, joint capacity, mobility, posture and readiness for the next loading week.',
 Monday:'Build maximal full-body strength with high-quality compound work and posture control.',
 Tuesday:'Accumulate hypertrophy volume and metabolic work without compromising the next hard session.',
 Wednesday:'Develop unilateral strength, balance, anti-rotation and left-right control.',
 Thursday:'Reduce fatigue while restoring mobility, tendon capacity, posture and aerobic recovery.',
 Friday:'Train power, heavy strength and loaded-carry capacity while preserving movement speed.',
 Saturday:'Accumulate high-quality hypertrophy volume and full-body work capacity before recovery.'
};

const PHASES=[
 {name:'Foundation',weeks:[1,2,3],intent:'Establish technique baselines, movement tolerance and repeatable training metrics.',load:0.94,rirDelta:1},
 {name:'Build',weeks:[4,5,6],intent:'Progress volume and load while preserving clean execution and recovery.',load:1,rirDelta:0},
 {name:'Intensify',weeks:[7,8,9],intent:'Emphasize strength and performance while controlling accessory fatigue.',load:1.03,rirDelta:-1},
 {name:'Consolidate',weeks:[10,11],intent:'Hold performance, refine weak points and convert recent gains into repeatable capacity.',load:1,rirDelta:0},
 {name:'Deload + Reassessment',weeks:[12],intent:'Reduce fatigue, reassess benchmarks and prepare the next 12-week cycle.',load:0.82,rirDelta:2}
];

const PURPOSE_BY_CATEGORY={
 strength:'Increase force production and preserve a measurable progression path.',
 hypertrophy:'Accumulate high-quality muscle-building volume with controlled proximity to failure.',
 power:'Preserve rate of force development; stop when speed or control drops.',
 conditioning:'Improve work capacity and cardiovascular/metabolic resilience.',
 core:'Improve trunk stiffness, force transfer and spinal/pelvic control.',
 carry:'Build grip, trunk stability, gait strength and whole-body work capacity.',
 balance:'Improve proprioception, single-leg control and asymmetry management.',
 mobility:'Maintain usable joint range and movement options.',
 posture:'Improve scapular, spinal and pelvic control without forcing rigid posture.',
 recovery:'Reduce fatigue and restore readiness for the next hard session.'
};

async function sha256(value){const bytes=new TextEncoder().encode(value);const hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function makeToken(){const a=new Uint8Array(32);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16).padStart(2,'0')).join('')}

async function ensureSchema(env){
 const db=ensureDb(env);
 const statements=[
  `CREATE TABLE IF NOT EXISTS coach_users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,display_name TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'user',status TEXT NOT NULL DEFAULT 'active',api_token_hash TEXT,sex TEXT,birth_date TEXT,height_cm REAL,weight_kg REAL,timezone TEXT DEFAULT 'America/New_York',units TEXT DEFAULT 'imperial',experience_level TEXT DEFAULT 'intermediate',created_at TEXT NOT NULL,updated_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS coach_profiles(user_id TEXT PRIMARY KEY,goals_json TEXT NOT NULL DEFAULT '[]',equipment_json TEXT NOT NULL DEFAULT '[]',constraints_json TEXT NOT NULL DEFAULT '[]',preferences_json TEXT NOT NULL DEFAULT '{}',schedule_json TEXT NOT NULL DEFAULT '{}',updated_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS coach_metrics(id TEXT PRIMARY KEY,user_id TEXT NOT NULL,recorded_at TEXT NOT NULL,weight_kg REAL,waist_cm REAL,body_fat_pct REAL,resting_hr REAL,hrv_ms REAL,sleep_hours REAL,readiness REAL,steps INTEGER,vo2max REAL,pain_score REAL,notes TEXT)`,
  `CREATE TABLE IF NOT EXISTS coach_plan_state(user_id TEXT PRIMARY KEY,cycle_start TEXT NOT NULL,cycle_number INTEGER NOT NULL DEFAULT 1,week_number INTEGER NOT NULL DEFAULT 1,phase TEXT NOT NULL,updated_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS coach_adaptations(id TEXT PRIMARY KEY,user_id TEXT NOT NULL,created_at TEXT NOT NULL,week_number INTEGER,phase TEXT,event_type TEXT NOT NULL,reason TEXT NOT NULL,evidence_json TEXT NOT NULL DEFAULT '{}',change_json TEXT NOT NULL DEFAULT '{}',safety_class TEXT NOT NULL DEFAULT 'normal')`,
  `CREATE TABLE IF NOT EXISTS coach_admin_settings(setting_key TEXT PRIMARY KEY,value_json TEXT NOT NULL,updated_by TEXT NOT NULL,updated_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS coach_identities(provider TEXT NOT NULL,provider_subject TEXT NOT NULL,user_id TEXT NOT NULL,email TEXT,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,PRIMARY KEY(provider,provider_subject))`,
  `CREATE TABLE IF NOT EXISTS coach_sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL,created_at TEXT NOT NULL,expires_at TEXT NOT NULL,last_seen_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS coach_oauth_states(state_hash TEXT PRIMARY KEY,code_verifier TEXT NOT NULL,created_at TEXT NOT NULL,return_to TEXT NOT NULL DEFAULT '/',intent TEXT NOT NULL DEFAULT 'login')`
 ];
 for(const s of statements)await db.prepare(s).run();
}

function bearer(req){const h=req.headers.get('authorization')||'';return h.startsWith('Bearer ')?h.slice(7).trim():''}
function cookieValue(req,name){const raw=req.headers.get('cookie')||'';for(const part of raw.split(';')){const [k,...rest]=part.trim().split('=');if(k===name)return decodeURIComponent(rest.join('='))}return ''}
async function sessionActor(req,env){const raw=cookieValue(req,'db_session');if(!raw)return null;const hash=await sha256(raw),ts=now();const user=await ensureDb(env).prepare("SELECT u.* FROM coach_sessions s JOIN coach_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status='active'").bind(hash,ts).first();if(user)await ensureDb(env).prepare('UPDATE coach_sessions SET last_seen_at=? WHERE token_hash=?').bind(ts,hash).run();return user}
async function actor(req,env){
 const token=bearer(req);
 if(token){if(env.DBACK_ADMIN_TOKEN&&token===env.DBACK_ADMIN_TOKEN)return {id:'admin',email:'admin',display_name:'Administrator',role:'admin',status:'active'};const hash=await sha256(token);const user=await ensureDb(env).prepare("SELECT * FROM coach_users WHERE api_token_hash=? AND status='active'").bind(hash).first();if(user)return user}
 return sessionActor(req,env);
}
async function requireAdmin(req,env){const a=await actor(req,env);return a?.role==='admin'?a:null}
function googleConfigured(env){return Boolean(env.GOOGLE_CLIENT_ID&&env.GOOGLE_CLIENT_SECRET)}
function safeReturnTo(value){const v=String(value||'/');return v.startsWith('/')&&!v.startsWith('//')?v:'/'}
async function sha256Base64Url(value){const bytes=new TextEncoder().encode(value),hash=await crypto.subtle.digest('SHA-256',bytes);let s='';for(const b of new Uint8Array(hash))s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function googleCallbackUrl(url){return new URL('/api/v40/auth/google/callback',url.origin).toString()}
function authCookie(token,maxAge=2592000){return `db_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`}
async function googleAuthStart(req,env,url){
 if(!googleConfigured(env))return json({error:'Google authentication is not configured.',required:['GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET']},503);
 const state=makeToken(),verifier=makeToken(),challenge=await sha256Base64Url(verifier),stateHash=await sha256(state),ts=now(),returnTo=safeReturnTo(url.searchParams.get('return_to')),intent=url.searchParams.get('intent')==='signup'?'signup':'login';
 await ensureDb(env).prepare('DELETE FROM coach_oauth_states WHERE created_at<?').bind(new Date(Date.now()-15*60*1000).toISOString()).run();
 await ensureDb(env).prepare('INSERT INTO coach_oauth_states(state_hash,code_verifier,created_at,return_to,intent) VALUES(?,?,?,?,?)').bind(stateHash,verifier,ts,returnTo,intent).run();
 const q=new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,redirect_uri:googleCallbackUrl(url),response_type:'code',scope:'openid email profile',state,code_challenge:challenge,code_challenge_method:'S256',access_type:'online',prompt:'select_account'});
 return new Response(null,{status:302,headers:{location:'https://accounts.google.com/o/oauth2/v2/auth?'+q.toString(),'cache-control':'no-store'}});
}
async function ensureGoogleUser(env,info){
 const db=ensureDb(env),ts=now();let identity=await db.prepare("SELECT user_id FROM coach_identities WHERE provider='google' AND provider_subject=?").bind(info.sub).first(),user=identity?await db.prepare('SELECT * FROM coach_users WHERE id=?').bind(identity.user_id).first():null;
 if(!user)user=await db.prepare('SELECT * FROM coach_users WHERE email=?').bind(String(info.email).toLowerCase()).first();
 if(!user){const id=crypto.randomUUID(),name=String(info.name||info.given_name||String(info.email).split('@')[0]||'Member');await db.prepare('INSERT INTO coach_users(id,email,display_name,role,status,api_token_hash,sex,birth_date,height_cm,weight_kg,timezone,units,experience_level,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,String(info.email).toLowerCase(),name,'user','active',null,null,null,null,null,'America/New_York','imperial','beginner',ts,ts).run();await db.prepare('INSERT INTO coach_profiles(user_id,goals_json,equipment_json,constraints_json,preferences_json,schedule_json,updated_at) VALUES(?,?,?,?,?,?,?)').bind(id,'[]','[]','[]',JSON.stringify({avatar:info.picture||null,authProvider:'google'}),'{}',ts).run();await ensurePlanState(env,id);user=await db.prepare('SELECT * FROM coach_users WHERE id=?').bind(id).first()}
 await db.prepare("INSERT INTO coach_identities(provider,provider_subject,user_id,email,created_at,updated_at) VALUES('google',?,?,?,?,?) ON CONFLICT(provider,provider_subject) DO UPDATE SET user_id=excluded.user_id,email=excluded.email,updated_at=excluded.updated_at").bind(info.sub,user.id,String(info.email).toLowerCase(),ts,ts).run();
 return user;
}
async function googleAuthCallback(req,env,url){
 if(!googleConfigured(env))return json({error:'Google authentication is not configured.'},503);
 const state=url.searchParams.get('state')||'',code=url.searchParams.get('code')||'';if(!state||!code)return json({error:'Missing Google authorization response.'},400);
 const stateHash=await sha256(state),db=ensureDb(env),row=await db.prepare('SELECT * FROM coach_oauth_states WHERE state_hash=?').bind(stateHash).first();if(!row||new Date(row.created_at).getTime()<Date.now()-15*60*1000)return json({error:'Google authorization state expired or invalid.'},400);await db.prepare('DELETE FROM coach_oauth_states WHERE state_hash=?').bind(stateHash).run();
 const tokenRes=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,redirect_uri:googleCallbackUrl(url),grant_type:'authorization_code',code_verifier:row.code_verifier})});if(!tokenRes.ok)return json({error:'Google token exchange failed.'},401);const tokens=await tokenRes.json();if(!tokens.access_token)return json({error:'Google access token missing.'},401);
 const infoRes=await fetch('https://openidconnect.googleapis.com/v1/userinfo',{headers:{authorization:'Bearer '+tokens.access_token}});if(!infoRes.ok)return json({error:'Google user profile could not be verified.'},401);const info=await infoRes.json();if(!info.sub||!info.email||info.email_verified!==true)return json({error:'A verified Google email is required.'},401);
 const user=await ensureGoogleUser(env,info),session=makeToken(),hash=await sha256(session),created=now(),expires=new Date(Date.now()+30*86400000).toISOString();await db.prepare('INSERT INTO coach_sessions(token_hash,user_id,created_at,expires_at,last_seen_at) VALUES(?,?,?,?,?)').bind(hash,user.id,created,expires,created).run();await db.prepare('DELETE FROM coach_sessions WHERE expires_at<?').bind(created).run();
 const dest=new URL(safeReturnTo(row.return_to),url.origin);dest.searchParams.set('auth','google');return new Response(null,{status:302,headers:{location:dest.toString(),'set-cookie':authCookie(session),'cache-control':'no-store'}});
}
async function authLogout(req,env,url){const raw=cookieValue(req,'db_session');if(raw)await ensureDb(env).prepare('DELETE FROM coach_sessions WHERE token_hash=?').bind(await sha256(raw)).run();return new Response(null,{status:302,headers:{location:new URL('/',url.origin).toString(),'set-cookie':authCookie('',0),'cache-control':'no-store'}})}

function weekFrom(start){const d0=new Date(start+'T00:00:00Z');const n=Math.max(0,Math.floor((Date.now()-d0.getTime())/(7*86400000)));return (n%12)+1}
function phaseFor(week){return PHASES.find(p=>p.weeks.includes(week))||PHASES[0]}
function exercisePurpose(e){const c=String(e.category||'').toLowerCase();const hit=Object.entries(PURPOSE_BY_CATEGORY).find(([k])=>c.includes(k));return hit?hit[1]:'Train the programmed movement pattern with measurable progression and technically sound execution.'}

async function getProfile(env,userId){
 const db=ensureDb(env);
 const u=await db.prepare('SELECT * FROM coach_users WHERE id=?').bind(userId).first();
 const p=await db.prepare('SELECT * FROM coach_profiles WHERE user_id=?').bind(userId).first();
 return {user:u,profile:p?{goals:parse(p.goals_json)||[],equipment:parse(p.equipment_json)||[],constraints:parse(p.constraints_json)||[],preferences:parse(p.preferences_json)||{},schedule:parse(p.schedule_json)||{}}:{goals:[],equipment:[],constraints:[],preferences:{},schedule:{}}};
}
async function latestMetrics(env,userId){return await ensureDb(env).prepare('SELECT * FROM coach_metrics WHERE user_id=? ORDER BY recorded_at DESC LIMIT 1').bind(userId).first()}
async function ensurePlanState(env,userId){
 const db=ensureDb(env);let s=await db.prepare('SELECT * FROM coach_plan_state WHERE user_id=?').bind(userId).first();if(s)return s;
 const start=new Date().toISOString().slice(0,10),ts=now();await db.prepare('INSERT INTO coach_plan_state(user_id,cycle_start,cycle_number,week_number,phase,updated_at) VALUES(?,?,?,?,?,?)').bind(userId,start,1,1,PHASES[0].name,ts).run();
 return await db.prepare('SELECT * FROM coach_plan_state WHERE user_id=?').bind(userId).first();
}

async function syncPlanState(env,state,userId){
 const week=weekFrom(state.cycle_start),phase=phaseFor(week);
 if(Number(state.week_number)!==week||state.phase!==phase.name){
  await ensureDb(env).prepare('UPDATE coach_plan_state SET week_number=?,phase=?,updated_at=? WHERE user_id=?').bind(week,phase.name,now(),userId).run();
  await ensureDb(env).prepare('INSERT INTO coach_adaptations(id,user_id,created_at,week_number,phase,event_type,reason,evidence_json,change_json,safety_class) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),userId,now(),week,phase.name,'cycle-state-change','12-week cycle advanced to a new week or phase.',JSON.stringify({cycleStart:state.cycle_start}),JSON.stringify({week,phase:phase.name}),'normal').run();
  return {...state,week_number:week,phase:phase.name};
 }
 return state;
}

function readinessAdjustment(metrics){
 let score=metrics?.readiness==null?7:Number(metrics.readiness),reason=[];
 if(metrics?.sleep_hours!=null&&Number(metrics.sleep_hours)<6){score-=1.5;reason.push('sleep below 6 hours')}
 if(metrics?.pain_score!=null&&Number(metrics.pain_score)>=5){score-=2;reason.push('elevated pain score')}
 score=clamp(score,1,10);
 if(score<=4)return {mode:'protect',volume:0.65,load:0.88,rir:2,reason:reason.length?reason.join(', '):'low readiness'};
 if(score<=6)return {mode:'conservative',volume:0.82,load:0.95,rir:1,reason:reason.length?reason.join(', '):'moderate readiness'};
 if(score>=9)return {mode:'progress',volume:1,load:1.02,rir:0,reason:'high readiness'};
 return {mode:'standard',volume:1,load:1,rir:0,reason:'normal readiness'};
}

async function auditReadinessAdjustment(env,userId,state,metrics){
 const adjustment=readinessAdjustment(metrics),db=ensureDb(env);
 const previous=await db.prepare("SELECT change_json FROM coach_adaptations WHERE user_id=? AND event_type='readiness-adjustment' ORDER BY created_at DESC LIMIT 1").bind(userId).first();
 const previousMode=parse(previous?.change_json)?.mode||null;
 if(previousMode===adjustment.mode)return adjustment;
 const phase=phaseFor(weekFrom(state.cycle_start));
 const evidence={recordedAt:metrics?.recorded_at||null,readiness:metrics?.readiness??null,sleepHours:metrics?.sleep_hours??null,painScore:metrics?.pain_score??null};
 const change={mode:adjustment.mode,loadFactor:adjustment.load,volumeFactor:adjustment.volume,rirAdjustment:adjustment.rir};
 await db.prepare('INSERT INTO coach_adaptations(id,user_id,created_at,week_number,phase,event_type,reason,evidence_json,change_json,safety_class) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),userId,now(),weekFrom(state.cycle_start),phase.name,'readiness-adjustment',adjustment.reason,JSON.stringify(evidence),JSON.stringify(change),adjustment.mode==='protect'?'protect':'normal').run();
 return adjustment;
}

function equipmentNames(profile,environment='home'){return equipmentNamesForMode(environment,profile?.profile?.equipment||[])}
function hasAnyEquipment(names,terms){return terms.some(t=>names.some(n=>n.includes(t)))}
function homeAdaptExercise(e,names){
 const name=String(e.name||'').toLowerCase(),load=String(e.load||'').toLowerCase();
 const needsDumbbell=load.includes('dumbbell');
 const needsBar=/pull-up|chin-up|dead hang/.test(name);
 const dumbbells=hasAnyEquipment(names,['dumbbell','adjustable weight']);
 const bar=hasAnyEquipment(names,['pull-up','pullup','chin-up','hang bar','doorway bar']);
 if((!needsDumbbell||dumbbells)&&(!needsBar||bar))return {...e,environment:{mode:'home',compatible:true,substituted:false}};
 const base={...e,environment:{mode:'home',compatible:true,substituted:true,originalName:e.name,reason:needsBar&&!bar?'Home profile does not list a pull-up/hang bar.':'Home profile does not list dumbbells.'}};
 if(needsBar)return {...base,id:e.id+'-home-sub',name:'Floor Y-T-W',sets:Math.min(Number(e.sets)||3,3),reps:'8 each',load:'bodyweight',tempo:'controlled',category:'posture',purpose:'Preserve upper-back and scapular control when vertical-pull equipment is unavailable.'};
 if(/squat|lunge/.test(name))return {...base,id:e.id+'-home-sub',name:name.includes('lunge')?'Reverse Lunge':'Bodyweight Squat',load:'bodyweight',purpose:'Preserve the programmed lower-body pattern without external load.'};
 if(/romanian deadlift|rdl|hip hinge/.test(name))return {...base,id:e.id+'-home-sub',name:'Single-Leg Hip Hinge',load:'bodyweight',purpose:'Preserve hip-hinge mechanics and posterior-chain control without external load.'};
 if(/press|push press|triceps/.test(name))return {...base,id:e.id+'-home-sub',name:'Push-Up',load:'bodyweight',purpose:'Preserve horizontal pressing and trunk stiffness without external load.'};
 if(/row|curl|lateral raise|external rotation/.test(name))return {...base,id:e.id+'-home-sub',name:'Floor Y-T-W',load:'bodyweight',category:'posture',purpose:'Preserve upper-back, shoulder and scapular work when external resistance is unavailable.'};
 if(/march|carry|drag/.test(name))return {...base,id:e.id+'-home-sub',name:'Bear Plank Shoulder Tap',load:'bodyweight',category:'core',purpose:'Preserve loaded-trunk and anti-rotation demands without external load.'};
 return {...base,id:e.id+'-home-sub',name:'Bodyweight Squat',load:'bodyweight',purpose:'Maintain a safe full-body training stimulus when listed equipment is unavailable.'};
}
function environmentExercise(e,profile,environment){
 if(environment!=='home')return {...e,environment:{mode:'gym',compatible:true,substituted:false}};
 return homeAdaptExercise(e,equipmentNames(profile,'home'));
}

function buildPlan(state,profile,metrics,environment='gym',readyOverride=null){
 const week=weekFrom(state.cycle_start),phase=phaseFor(week),ready=readyOverride||readinessAdjustment(metrics),program={};
 const goals=profile.profile.goals||[];const goalContext=goals.length?goals.map(g=>typeof g==='string'?g:(g.name||g.key||'goal')).join(', '):'general strength, muscle, movement quality and healthspan';
 for(const day of DAY_ORDER){const src=PROGRAM31[day];program[day]={...src,purpose:DAY_PURPOSE[day],weekPurpose:`${phase.name}: ${phase.intent}`,adaptationMode:ready.mode,exercises:src.exercises.map((e,i)=>{const adapted=environmentExercise(e,profile,environment),coaching=coachingFor(adapted);return {...adapted,coaching,purpose:coaching.purpose||adapted.purpose||exercisePurpose(adapted),priority:i<3?'primary':'support',adaptive:{loadFactor:Number((phase.load*ready.load).toFixed(2)),volumeFactor:Number(ready.volume.toFixed(2)),rirAdjustment:phase.rirDelta+ready.rir,rule:'Change one meaningful progression variable at a time unless safety or recovery requires regression.'}}})}}
 const activeCatalog=environment==='home'?HOME_EQUIPMENT_CATALOG:GYM_EQUIPMENT_CATALOG;
 return {version:PLATFORM40_VERSION,environment:{mode:environment,profileEquipment:equipmentNames(profile,environment),catalogCount:activeCatalog.length,catalog:activeCatalog},cycle:{cycleNumber:state.cycle_number||1,week,phase:phase.name,phaseIntent:phase.intent,goalContext},readiness:ready,guardrails:{noDiagnosis:true,noAutomaticMedicalClaims:true,painRule:'Sharp, radiating or neurologic symptoms stop the movement and require appropriate clinical evaluation.',progressionRule:'Progress only when technique, recovery and recent performance support it.',sexUse:'Sex selection is stored when relevant to physiology or reference ranges; training changes are driven primarily by goals, performance, recovery, measurements, equipment and constraints rather than stereotypes.'},program};
}

async function createUser(req,env){
 const body=await readBody(req);if(!body.email||!body.display_name)return json({error:'email and display_name are required'},400);
 const db=ensureDb(env),id=crypto.randomUUID(),token=makeToken(),hash=await sha256(token),ts=now();
 await db.prepare('INSERT INTO coach_users(id,email,display_name,role,status,api_token_hash,sex,birth_date,height_cm,weight_kg,timezone,units,experience_level,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,String(body.email).toLowerCase(),body.display_name,body.role==='admin'?'admin':'user','active',hash,body.sex??null,body.birth_date??null,body.height_cm??null,body.weight_kg??null,body.timezone||'America/New_York',body.units||'imperial',body.experience_level||'intermediate',ts,ts).run();
 await db.prepare('INSERT INTO coach_profiles(user_id,goals_json,equipment_json,constraints_json,preferences_json,schedule_json,updated_at) VALUES(?,?,?,?,?,?,?)').bind(id,JSON.stringify(body.goals||[]),JSON.stringify(body.equipment||[]),JSON.stringify(body.constraints||[]),JSON.stringify(body.preferences||{}),JSON.stringify(body.schedule||{}),ts).run();
 await ensurePlanState(env,id);
 return json({ok:true,user:{id,email:String(body.email).toLowerCase(),display_name:body.display_name,role:body.role==='admin'?'admin':'user'},apiToken:token,warning:'Store this token securely. It is shown only at creation time.'},201);
}

async function updateProfile(req,env,a){
 const body=await readBody(req),db=ensureDb(env),ts=now(),allowed=['display_name','sex','birth_date','height_cm','weight_kg','timezone','units','experience_level'],sets=[],vals=[];
 for(const k of allowed)if(k in body){sets.push(`${k}=?`);vals.push(body[k])}
 if(sets.length){vals.push(ts,a.id);await db.prepare(`UPDATE coach_users SET ${sets.join(',')},updated_at=? WHERE id=?`).bind(...vals).run()}
 const p=await db.prepare('SELECT * FROM coach_profiles WHERE user_id=?').bind(a.id).first();
 const next={
  goals:body.goals??(parse(p?.goals_json)||[]),
  equipment:body.equipment??(parse(p?.equipment_json)||[]),
  constraints:body.constraints??(parse(p?.constraints_json)||[]),
  preferences:body.preferences??(parse(p?.preferences_json)||{}),
  schedule:body.schedule??(parse(p?.schedule_json)||{})
 };
 await db.prepare(`INSERT INTO coach_profiles(user_id,goals_json,equipment_json,constraints_json,preferences_json,schedule_json,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET goals_json=excluded.goals_json,equipment_json=excluded.equipment_json,constraints_json=excluded.constraints_json,preferences_json=excluded.preferences_json,schedule_json=excluded.schedule_json,updated_at=excluded.updated_at`).bind(a.id,JSON.stringify(next.goals),JSON.stringify(next.equipment),JSON.stringify(next.constraints),JSON.stringify(next.preferences),JSON.stringify(next.schedule),ts).run();
 return json({ok:true,...await getProfile(env,a.id)});
}


async function updateAdminUser(req,env,admin,userId){
 const db=ensureDb(env),body=await readBody(req),target=await db.prepare('SELECT * FROM coach_users WHERE id=?').bind(userId).first();
 if(!target)return json({error:'User not found.'},404);
 if(admin.id===userId&&(('status' in body&&body.status!=='active')||('role' in body&&body.role!=='admin')))return json({error:'Administrators cannot remove their own active admin access.'},400);
 const allowed=['display_name','email','role','status','experience_level'],sets=[],vals=[];
 for(const k of allowed){if(!(k in body))continue;let v=body[k];if(k==='email')v=String(v||'').trim().toLowerCase();if(k==='role')v=v==='admin'?'admin':'user';if(k==='status')v=v==='inactive'?'inactive':'active';sets.push(`${k}=?`);vals.push(v)}
 if(!sets.length)return json({error:'No supported user fields supplied.'},400);
 vals.push(now(),userId);await db.prepare(`UPDATE coach_users SET ${sets.join(',')},updated_at=? WHERE id=?`).bind(...vals).run();
 const next=await db.prepare("SELECT id,email,display_name,role,status,sex,birth_date,height_cm,weight_kg,timezone,units,experience_level,created_at,updated_at FROM coach_users WHERE id=?").bind(userId).first();
 return json({ok:true,user:next});
}
async function rotateAdminUserToken(env,admin,userId){
 const db=ensureDb(env),target=await db.prepare('SELECT id,email,display_name,role,status FROM coach_users WHERE id=?').bind(userId).first();
 if(!target)return json({error:'User not found.'},404);
 const token=makeToken(),hash=await sha256(token);await db.prepare('UPDATE coach_users SET api_token_hash=?,updated_at=? WHERE id=?').bind(hash,now(),userId).run();
 await db.prepare('INSERT INTO coach_adaptations(id,user_id,created_at,week_number,phase,event_type,reason,evidence_json,change_json,safety_class) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),userId,now(),null,null,'admin-token-rotation','Administrator rotated the user access token.',JSON.stringify({adminId:admin.id}),JSON.stringify({tokenRotated:true}),'normal').run();
 return json({ok:true,user:{id:target.id,email:target.email,display_name:target.display_name,role:target.role,status:target.status},apiToken:token,warning:'Store this token securely. The previous user token is no longer valid.'});
}

async function addMetric(req,env,a){const x=await readBody(req),id=crypto.randomUUID(),ts=x.recorded_at||now();await ensureDb(env).prepare('INSERT INTO coach_metrics(id,user_id,recorded_at,weight_kg,waist_cm,body_fat_pct,resting_hr,hrv_ms,sleep_hours,readiness,steps,vo2max,pain_score,notes) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,a.id,ts,x.weight_kg??null,x.waist_cm??null,x.body_fat_pct??null,x.resting_hr??null,x.hrv_ms??null,x.sleep_hours??null,x.readiness??null,x.steps??null,x.vo2max??null,x.pain_score??null,x.notes??null).run();return json({ok:true,id,recorded_at:ts})}
async function adminSummary(env){const db=ensureDb(env),users=await db.prepare("SELECT id,email,display_name,role,status,sex,birth_date,height_cm,weight_kg,timezone,units,experience_level,created_at,updated_at FROM coach_users ORDER BY created_at DESC").all(),adaptations=await db.prepare('SELECT * FROM coach_adaptations ORDER BY created_at DESC LIMIT 100').all();return json({ok:true,version:PLATFORM40_VERSION,users:users.results||[],recentAdaptations:adaptations.results||[],capabilities:['multi-user profiles','admin user lifecycle management','admin-only user management','per-user metrics','12-week adaptive cycles','daily/weekly/exercise purpose','readiness-based load and volume adjustments','health guardrails','auditable adaptation events']})}

export async function handleV40Api(req,env,url){
 if(!url.pathname.startsWith('/api/v40/'))return null;
 await ensureSchema(env);
 if(url.pathname==='/api/v40/health'&&req.method==='GET')return json({ok:true,version:PLATFORM40_VERSION,d1:Boolean(env.DB),adminAuthConfigured:Boolean(env.DBACK_ADMIN_TOKEN),googleAuthConfigured:googleConfigured(env)});
 if(url.pathname==='/api/v40/manifest'&&req.method==='GET')return json({version:PLATFORM40_VERSION,architecture:'multi-user adaptive coaching platform',roles:['admin','user'],authentication:['google-oauth-pkce','secure-session-cookie','bearer-token-fallback'],cycleWeeks:12,phases:PHASES.map(x=>({name:x.name,weeks:x.weeks,intent:x.intent})),dayPurpose:DAY_PURPOSE});
 if(url.pathname==='/api/v40/auth/google/start'&&req.method==='GET')return googleAuthStart(req,env,url);
 if(url.pathname==='/api/v40/auth/google/callback'&&req.method==='GET')return googleAuthCallback(req,env,url);
 if(url.pathname==='/api/v40/auth/logout'&&(req.method==='GET'||req.method==='POST'))return authLogout(req,env,url);
 if(url.pathname==='/api/v40/auth/status'&&req.method==='GET'){const current=await actor(req,env);return json({ok:true,googleAuthConfigured:googleConfigured(env),authenticated:Boolean(current),user:current?{id:current.id,email:current.email,display_name:current.display_name,role:current.role,status:current.status}:null})}
 if(url.pathname==='/api/v40/admin/summary'&&req.method==='GET'){const a=await requireAdmin(req,env);if(!a)return json({error:'Admin authorization required.'},401);return adminSummary(env)}
 if(url.pathname==='/api/v40/admin/users'&&req.method==='POST'){const a=await requireAdmin(req,env);if(!a)return json({error:'Admin authorization required.'},401);return createUser(req,env)}
 const adminUserToken=url.pathname.match(/^\/api\/v40\/admin\/users\/([^/]+)\/token$/);
 if(adminUserToken&&req.method==='POST'){const a=await requireAdmin(req,env);if(!a)return json({error:'Admin authorization required.'},401);return rotateAdminUserToken(env,a,decodeURIComponent(adminUserToken[1]))}
 const adminUser=url.pathname.match(/^\/api\/v40\/admin\/users\/([^/]+)$/);
 if(adminUser&&req.method==='PATCH'){const a=await requireAdmin(req,env);if(!a)return json({error:'Admin authorization required.'},401);return updateAdminUser(req,env,a,decodeURIComponent(adminUser[1]))}
 const a=await actor(req,env);if(!a)return json({error:'Authorization required.'},401);
 if(url.pathname==='/api/v40/me'&&req.method==='GET')return json({ok:true,actor:{id:a.id,role:a.role,status:a.status},...await getProfile(env,a.id),latestMetrics:await latestMetrics(env,a.id)});
 if(url.pathname==='/api/v40/profile'&&req.method==='PUT')return updateProfile(req,env,a);
 if(url.pathname==='/api/v40/metrics'&&req.method==='POST')return addMetric(req,env,a);
 if(url.pathname==='/api/v40/plan'&&req.method==='GET'){let state=await ensurePlanState(env,a.id);state=await syncPlanState(env,state,a.id);const profile=await getProfile(env,a.id),metrics=await latestMetrics(env,a.id),environment=url.searchParams.get('environment')==='home'?'home':'gym',ready=await auditReadinessAdjustment(env,a.id,state,metrics);return json({ok:true,...buildPlan(state,profile,metrics,environment,ready)})}
 return json({error:'Not found.'},404);
}

export const PLATFORM40_CSS=`.v40TrustStrip{margin:10px 0 16px;padding:12px 14px;border:1px solid #dbe5ef;border-radius:14px;background:#f8fbff;display:flex;gap:12px;flex-wrap:wrap;align-items:center;font-size:12px}.v40TrustStrip b{font-size:13px}.v40TrustPill{padding:6px 9px;border-radius:999px;background:#eef6ff;border:1px solid #d5e7fb;font-weight:700}`;
export const PLATFORM40_JS=`(()=>{function mount(){if(document.getElementById('v40TrustStrip'))return;const host=document.querySelector('#view-workout .viewHead,#view-workout h1,#view-workout h2')?.parentElement||document.querySelector('#view-workout');if(!host)return;const d=document.createElement('div');d.id='v40TrustStrip';d.className='v40TrustStrip';d.innerHTML='<b>DBACK Adaptive Platform v40</b><span class="v40TrustPill">Purpose-driven</span><span class="v40TrustPill">12-week adaptive cycles</span><span class="v40TrustPill">Per-user profiles</span><span class="v40TrustPill">Admin-controlled</span><span class="v40TrustPill">Recovery + safety guardrails</span>';host.prepend(d)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true})})();`;
