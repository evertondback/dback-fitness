import base from './worker-v8-1.js';

const VERSION='8.1.0';

const A=(primary=[],secondary=[],stabilizers=[],joints=[],pattern='Movement',plane='Sagittal',mechanic='compound',compoundScore=5)=>({primary,secondary,stabilizers,joints,pattern,plane,mechanic,compoundScore,source:'verified-exact-map'});

// Exact-name anatomy map. Deliberately avoids substring inference (for example, "Toe Curl" must never match an arm "Curl").
const EXACT={
 'toe spread / toe curl':A(['foot-intrinsics'],[],['tibialis-anterior','peroneals'],['mtp'],'Toe flexion / extension and intrinsic foot control','Sagittal / transverse','motor-control',1),
 'ankle cars':A(['tibialis-anterior','peroneals'],['gastrocnemius','soleus'],['foot-intrinsics'],['ankle','subtalar'],'Controlled ankle articular rotation','Multiplanar','mobility',1),
 'controlled knee circles':A(['quadriceps','hamstrings'],['gastrocnemius'],['gluteus-medius','foot-intrinsics'],['knee','hip','ankle'],'Controlled knee circumduction / joint preparation','Multiplanar','mobility',1),
 '90/90 hip switches':A(['gluteus-medius','adductors','hip-flexors'],['gluteus-maximus'],['transverse-abdominis','obliques'],['hip'],'Hip internal / external rotation','Transverse','mobility',2),
 '90/90 hip rotation':A(['gluteus-medius','adductors','hip-flexors'],['gluteus-maximus'],['transverse-abdominis','obliques'],['hip'],'Hip internal / external rotation','Transverse','mobility',2),
 'hip cars':A(['gluteus-medius','hip-flexors','adductors'],['gluteus-maximus'],['transverse-abdominis','obliques'],['hip'],'Controlled hip articular rotation','Multiplanar','mobility',2),
 'cat-cow':A(['erector-spinae','rectus-abdominis'],['obliques'],['multifidus','transverse-abdominis'],['thoracic-spine','lumbar-spine'],'Spinal flexion / extension','Sagittal','mobility',1),
 'thoracic rotation':A(['obliques','multifidus'],['erector-spinae'],['transverse-abdominis'],['thoracic-spine'],'Thoracic rotation','Transverse','mobility',1),
 'neck cars':A(['neck-flexors'],['upper-trapezius'],[],['cervical-spine'],'Controlled cervical rotation / flexion / extension','Multiplanar','mobility',1),
 'shoulder cars':A(['rotator-cuff'],['anterior-deltoid','lateral-deltoid','posterior-deltoid'],['serratus-anterior','upper-trapezius','lower-trapezius'],['shoulder','scapulothoracic'],'Controlled shoulder articular rotation','Multiplanar','mobility',2),
 'scapular push-up':A(['serratus-anterior'],['pectoralis-minor'],['lower-trapezius','rotator-cuff','transverse-abdominis'],['scapulothoracic','shoulder'],'Scapular protraction / retraction','Transverse','scapular-control',3),
 'forearm pronation / supination':A(['forearm-flexors','forearm-extensors'],['biceps-brachii'],[],['radioulnar','elbow'],'Forearm pronation / supination','Transverse','isolation',1),
 'wrist mobility':A(['forearm-flexors','forearm-extensors'],[],[],['wrist'],'Wrist flexion / extension / deviation','Multiplanar','mobility',1),
 'glute bridge':A(['gluteus-maximus'],['hamstrings'],['transverse-abdominis','erector-spinae'],['hip','lumbar-spine'],'Hip extension','Sagittal','compound',5),
 'dead bug':A(['transverse-abdominis','rectus-abdominis','obliques'],['hip-flexors'],['multifidus'],['lumbar-spine','hip','shoulder'],'Anti-extension core control','Sagittal','core-control',3),
 'dead hang':A(['forearm-flexors','latissimus-dorsi'],['lower-trapezius'],['rotator-cuff','serratus-anterior'],['shoulder','scapulothoracic','wrist'],'Vertical hanging / grip isometric','Sagittal','isometric',4),
 'dead hang / wall slide':A(['serratus-anterior','lower-trapezius','rotator-cuff'],['latissimus-dorsi','forearm-flexors'],['transverse-abdominis'],['shoulder','scapulothoracic','wrist'],'Shoulder mobility / scapular upward rotation / hanging','Multiplanar','mobility',3),
 'wall slide':A(['serratus-anterior','lower-trapezius'],['rotator-cuff','upper-trapezius'],['transverse-abdominis'],['shoulder','scapulothoracic'],'Scapular upward rotation with shoulder elevation','Frontal / scapular plane','scapular-control',3),

 'bodyweight squat':A(['quadriceps','gluteus-maximus'],['adductors','hamstrings'],['gluteus-medius','erector-spinae','transverse-abdominis'],['hip','knee','ankle'],'Squat','Sagittal','compound',9),
 'goblet squat':A(['quadriceps','gluteus-maximus'],['adductors','hamstrings'],['gluteus-medius','erector-spinae','transverse-abdominis'],['hip','knee','ankle'],'Squat','Sagittal','compound',9),
 'double-dumbbell front squat':A(['quadriceps','gluteus-maximus'],['adductors','hamstrings'],['erector-spinae','transverse-abdominis','gluteus-medius'],['hip','knee','ankle'],'Front-loaded squat','Sagittal','compound',10),
 'bulgarian split squat':A(['quadriceps','gluteus-maximus'],['adductors','hamstrings'],['gluteus-medius','transverse-abdominis'],['hip','knee','ankle'],'Split squat','Sagittal','compound',9),
 'reverse lunge':A(['quadriceps','gluteus-maximus'],['hamstrings','adductors'],['gluteus-medius','transverse-abdominis'],['hip','knee','ankle'],'Lunge','Sagittal','compound',8),
 'reverse dumbbell lunge':A(['quadriceps','gluteus-maximus'],['hamstrings','adductors'],['gluteus-medius','transverse-abdominis','forearm-flexors'],['hip','knee','ankle'],'Loaded reverse lunge','Sagittal','compound',9),
 'romanian deadlift':A(['hamstrings','gluteus-maximus'],['adductors'],['erector-spinae','multifidus','transverse-abdominis','forearm-flexors'],['hip','lumbar-spine'],'Hip hinge','Sagittal','compound',9),
 'dumbbell romanian deadlift':A(['hamstrings','gluteus-maximus'],['adductors'],['erector-spinae','multifidus','transverse-abdominis','forearm-flexors'],['hip','lumbar-spine'],'Loaded hip hinge','Sagittal','compound',9),
 'single-leg romanian deadlift':A(['hamstrings','gluteus-maximus'],['adductors'],['gluteus-medius','erector-spinae','transverse-abdominis','foot-intrinsics'],['hip','ankle','lumbar-spine'],'Single-leg hip hinge','Sagittal','compound',9),

 'push-up':A(['pectoralis-major'],['triceps-brachii','anterior-deltoid'],['serratus-anterior','rotator-cuff','transverse-abdominis','gluteus-maximus'],['shoulder','elbow','scapulothoracic'],'Horizontal press','Transverse / sagittal','compound',8),
 'dumbbell floor press':A(['pectoralis-major'],['triceps-brachii','anterior-deltoid'],['rotator-cuff','serratus-anterior'],['shoulder','elbow'],'Horizontal press','Transverse','compound',7),
 'one-arm dumbbell floor press':A(['pectoralis-major'],['triceps-brachii','anterior-deltoid'],['obliques','transverse-abdominis','rotator-cuff'],['shoulder','elbow','lumbar-spine'],'Unilateral horizontal press / anti-rotation','Transverse','compound',8),
 'dumbbell lateral raise':A(['lateral-deltoid'],['rotator-cuff'],['upper-trapezius','lower-trapezius','serratus-anterior'],['shoulder','scapulothoracic'],'Shoulder abduction','Frontal / scapular plane','isolation',3),
 'half-kneeling one-arm overhead press':A(['anterior-deltoid','lateral-deltoid'],['triceps-brachii'],['rotator-cuff','serratus-anterior','upper-trapezius','lower-trapezius','obliques','transverse-abdominis'],['shoulder','elbow','scapulothoracic','lumbar-spine'],'Unilateral overhead press / anti-lateral-flexion','Frontal / sagittal','compound',7),
 'dumbbell push press':A(['anterior-deltoid','lateral-deltoid','quadriceps','gluteus-maximus'],['triceps-brachii','gastrocnemius'],['rotator-cuff','serratus-anterior','transverse-abdominis','erector-spinae'],['shoulder','elbow','hip','knee','ankle'],'Dip-and-drive overhead press','Sagittal / frontal','compound',10),

 'bent-over dumbbell row':A(['latissimus-dorsi','mid-trapezius','rhomboids'],['posterior-deltoid','biceps-brachii','brachialis'],['erector-spinae','transverse-abdominis','forearm-flexors','rotator-cuff'],['shoulder','scapulothoracic','elbow','lumbar-spine'],'Horizontal pull','Sagittal / transverse','compound',9),
 'one-arm dumbbell row':A(['latissimus-dorsi','mid-trapezius','rhomboids'],['posterior-deltoid','biceps-brachii','brachialis'],['erector-spinae','obliques','transverse-abdominis','forearm-flexors'],['shoulder','scapulothoracic','elbow','lumbar-spine'],'Unilateral horizontal pull','Sagittal / transverse','compound',9),
 'light one-arm dumbbell row':A(['latissimus-dorsi','mid-trapezius','rhomboids'],['posterior-deltoid','biceps-brachii','brachialis'],['erector-spinae','obliques','transverse-abdominis','forearm-flexors'],['shoulder','scapulothoracic','elbow'],'Light unilateral horizontal pull','Sagittal / transverse','compound',7),
 'pull-up':A(['latissimus-dorsi'],['biceps-brachii','brachialis','teres-major'],['lower-trapezius','rhomboids','rotator-cuff','forearm-flexors','transverse-abdominis'],['shoulder','scapulothoracic','elbow'],'Vertical pull','Frontal / sagittal','compound',9),
 'chin-up':A(['latissimus-dorsi','biceps-brachii'],['brachialis','teres-major'],['lower-trapezius','rhomboids','rotator-cuff','forearm-flexors'],['shoulder','scapulothoracic','elbow','radioulnar'],'Supinated vertical pull','Sagittal','compound',9),
 'pull-up or chin-up':A(['latissimus-dorsi'],['biceps-brachii','brachialis','teres-major'],['lower-trapezius','rhomboids','rotator-cuff','forearm-flexors'],['shoulder','scapulothoracic','elbow'],'Vertical pull','Sagittal / frontal','compound',9),

 'hammer curl':A(['brachialis','biceps-brachii'],['forearm-flexors'],[],['elbow','radioulnar'],'Neutral-grip elbow flexion','Sagittal','isolation',2),
 'dumbbell triceps extension':A(['triceps-brachii'],[],['rotator-cuff','transverse-abdominis'],['elbow','shoulder'],'Elbow extension','Sagittal','isolation',2),

 'farmer march':A(['forearm-flexors','transverse-abdominis','obliques'],['upper-trapezius','hip-flexors'],['gluteus-medius','quadratus-lumborum','erector-spinae','foot-intrinsics'],['hip','ankle','wrist','lumbar-spine'],'Loaded carry / marching stabilization','Sagittal','compound',7),
 'suitcase march':A(['obliques','quadratus-lumborum','forearm-flexors'],['transverse-abdominis','hip-flexors'],['gluteus-medius','erector-spinae','foot-intrinsics'],['hip','ankle','wrist','lumbar-spine'],'Unilateral carry / anti-lateral-flexion march','Sagittal','compound',7),
 'side plank':A(['obliques','quadratus-lumborum'],['gluteus-medius','transverse-abdominis'],['lateral-deltoid','serratus-anterior','rotator-cuff'],['lumbar-spine','shoulder','scapulothoracic'],'Anti-lateral-flexion isometric','Frontal','isometric',4),
 'hollow hold':A(['rectus-abdominis','transverse-abdominis','obliques'],['hip-flexors'],[],['lumbar-spine','hip'],'Anti-extension isometric','Sagittal','isometric',3),
 'plank dumbbell drag':A(['obliques','transverse-abdominis','rectus-abdominis'],['anterior-deltoid','serratus-anterior'],['gluteus-maximus','rotator-cuff'],['lumbar-spine','shoulder','scapulothoracic'],'Anti-rotation plank with load transfer','Transverse','compound',6),
 'bird dog':A(['multifidus','erector-spinae','transverse-abdominis'],['gluteus-maximus','obliques'],['gluteus-medius','posterior-deltoid'],['lumbar-spine','hip','shoulder'],'Contralateral trunk stabilization','Sagittal / transverse','core-control',4),
 'mountain climbers':A(['hip-flexors','rectus-abdominis','transverse-abdominis'],['quadriceps','anterior-deltoid'],['serratus-anterior','obliques','rotator-cuff'],['hip','knee','shoulder','scapulothoracic'],'Alternating knee drive in plank','Sagittal','conditioning',7)
};

function key(name){return String(name||'').trim().toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ')}
function exactAnatomy(name){return EXACT[key(name)]||null}

function repair(node){
 if(Array.isArray(node))return node.map(repair);
 if(!node||typeof node!=='object')return node;
 const out={...node};
 if(typeof out.name==='string'){
  const mapped=exactAnatomy(out.name);
  if(mapped)out.anatomy=mapped;
  else if(out.anatomy){
   // Unknown/custom movements must not inherit heuristic muscle claims.
   out.anatomy={primary:[],secondary:[],stabilizers:[],joints:[],pattern:'Custom / not yet verified',plane:'Varies',mechanic:'custom',compoundScore:0,source:'unverified-custom'};
  }
 }
 for(const [k,v] of Object.entries(out)){
  if(k!=='anatomy'&&(Array.isArray(v)||(v&&typeof v==='object')))out[k]=repair(v);
 }
 if('version' in out)out.version=VERSION;
 return out;
}

async function repairJson(response){
 const type=response.headers.get('content-type')||'';
 if(!type.includes('application/json'))return response;
 try{
  const data=repair(await response.json());
  const headers=new Headers(response.headers);headers.set('cache-control','no-store');
  return new Response(JSON.stringify(data),{status:response.status,headers});
 }catch{return response}
}

function patchHtml(html){
 return html.replaceAll('8.0.1',VERSION).replaceAll('8.0.0',VERSION).replaceAll('7.0.2',VERSION).replaceAll('7.0.1',VERSION);
}

export default{
 async fetch(request,env,ctx){
  const url=new URL(request.url);
  const response=await base.fetch(request,env,ctx);
  const type=response.headers.get('content-type')||'';
  if(request.method==='GET'&&url.pathname==='/'&&type.includes('text/html')){
   const headers=new Headers(response.headers);headers.set('cache-control','no-store,no-cache,must-revalidate');
   return new Response(patchHtml(await response.text()),{status:response.status,headers});
  }
  if(type.includes('application/json'))return repairJson(response);
  return response;
 }
};
