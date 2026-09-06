import {coachingFor as baseCoaching,WARMUP_COACHING} from './v35-exercise-coaching.js';

const EXTRA={
 'Wall Tibialis Raise':{
  purpose:'Directly strengthen ankle dorsiflexion so the front of the lower leg is trained instead of relying only on calf-dominant work.',
  muscles:'Tibialis anterior and toe extensors',
  cues:'Lean against a wall with heels planted; lift the forefoot toward the shins; pause briefly; lower slowly through the full controllable range.',
  watchFor:'Do not bounce, lift the heels or shorten the range just to move faster.'
 },
 'Reverse Crunch':{
  purpose:'Add direct abdominal shortening work to complement the program’s anti-extension, anti-rotation and bracing exercises.',
  muscles:'Rectus abdominis, deep abdominals; hip flexors assist',
  cues:'Start with hips and knees flexed; exhale and curl the pelvis toward the ribs; lift with the abs rather than swinging the legs; lower slowly.',
  watchFor:'Do not create momentum by kicking the legs or arch the lower back at the bottom.'
 },
 'Dumbbell Lateral Lunge':{
  purpose:'Train frontal-plane leg strength and give the adductors and lateral hip musculature a deliberate weekly loading exposure.',
  muscles:'Adductors, glutes, quads, hamstrings, glute medius and core',
  cues:'Step wide; sit the working hip back; keep the working foot planted; let the opposite leg lengthen; push the floor away to return.',
  watchFor:'Do not collapse the working knee inward or force depth beyond controllable hip range.'
 },
 'Single-Leg Calf Raise':{
  purpose:'Provide direct calf strength and hypertrophy work that compound leg exercises do not adequately replace.',
  muscles:'Gastrocnemius, soleus and intrinsic foot stabilizers',
  cues:'Use one hand for balance; keep the knee nearly straight; rise as high as possible through the big-toe side of the foot; pause; lower slowly into a comfortable stretch.',
  watchFor:'Do not bounce, roll the ankle outward or turn the set into a balance challenge.'
 },
 'Side-Lying Dumbbell External Rotation':{
  purpose:'Add direct rotator-cuff external-rotation strength to support shoulder control during pressing, pulling and overhead work.',
  muscles:'Infraspinatus, teres minor and posterior shoulder stabilizers',
  cues:'Lie on your side; keep the top elbow bent about 90 degrees and gently pinned to the torso; rotate the forearm upward; lower slowly.',
  watchFor:'Use a very light dumbbell. Do not let the elbow drift away from the side or roll the torso backward.'
 },
 'Bodyweight Squat Jump':{
  purpose:'Add a second low-volume power exposure so the program trains rapid force production in the lower body as well as overhead power.',
  muscles:'Quads, glutes, hamstrings, calves and core',
  cues:'Use a shallow athletic squat; jump explosively; land quietly with knees tracking over toes; reset fully before every rep.',
  watchFor:'Stop the set when jump height or landing quality drops. Do not chase fatigue with plyometrics.'
 }
};

export function coachingFor(e){
 const x=EXTRA[e.name];
 if(!x)return baseCoaching(e);
 return {...x,focus:`${x.purpose} Target: ${x.muscles}.`};
}

export function enrichProgram(program){
 return Object.fromEntries(Object.entries(program).map(([day,d])=>[day,{...d,exercises:d.exercises.map(e=>({...e,coaching:coachingFor(e)}))}]));
}

export {WARMUP_COACHING};
