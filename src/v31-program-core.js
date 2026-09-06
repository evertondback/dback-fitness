export const PROGRAM_VERSION='36.1.0';

const VIDEO={
 squat:'https://www.youtube.com/watch?v=RC5XZ3Bto0k',pull:'https://www.youtube.com/watch?v=OEXosPwzFdc',press:'https://www.youtube.com/watch?v=uUGDRwge4F8',row:'https://www.youtube.com/watch?v=gfUg6qWohTk',rdl:'https://www.youtube.com/watch?v=vnEANU7BqqY',ohp:'https://www.youtube.com/watch?v=d3CRIDSCOhw',suit:'https://www.youtube.com/watch?v=fYgi9mk8t40',side:'https://www.youtube.com/watch?v=NXr4Fw8q60o',goblet:'https://www.youtube.com/watch?v=lRYBbchqxtI',lunge:'https://www.youtube.com/watch?v=J9MpoAQCjos',lat:'https://www.youtube.com/watch?v=Kl3LEzQ5Zqs',curl:'https://www.youtube.com/watch?v=5FAuyZuvJFg',tri:'https://www.youtube.com/watch?v=b_r_LW4HEcM',thruster:'https://www.youtube.com/watch?v=UipBcISeiGU',mountain:'https://www.youtube.com/watch?v=hZb6jTbCLeE',bulgarian:'https://www.youtube.com/watch?v=hiLF_pF3EJM',slrdl:'https://www.youtube.com/watch?v=lI8-igvsnVQ',pushpress:'https://www.youtube.com/watch?v=sElIkjcfyNY',farmer:'https://www.youtube.com/watch?v=4Ly1EMfJk6Y',drag:'https://www.youtube.com/watch?v=i04XHI0AAXg',hollow:'https://www.youtube.com/watch?v=jLxtFNO0r50',pushup:'https://www.youtube.com/watch?v=GHJgsTIW_bQ',bird:'https://www.youtube.com/watch?v=QABW99qPiNM',ytw:'https://www.youtube.com/watch?v=QdGTI4Lshg4',bridge:'https://www.youtube.com/watch?v=wPM8icPu6H8',deadbug:'https://www.youtube.com/watch?v=zechBkcIMf0',hang:'https://www.youtube.com/watch?v=fq9gDvNZQ2c',wall:'https://www.youtube.com/watch?v=i_0zLUcE-zk',cat:'https://www.youtube.com/watch?v=2of247Kt0tU',hip:'https://www.youtube.com/watch?v=m51AZSXMvEA',thor:'https://www.youtube.com/watch?v=l3Ze_9iXL-M',
 calf:'https://www.youtube.com/watch?v=x_QiCZoDl84',tibialis:'https://www.youtube.com/watch?v=4g8ef8w3Bp0',reverseCrunch:'https://www.youtube.com/watch?v=gAyTBB4lm3I',externalRotation:'https://www.youtube.com/watch?v=kWBP_FPVdEI',lateralLunge:'https://www.youtube.com/watch?v=uphscXy6vu0',squatJump:'https://www.youtube.com/watch?v=tZSYZdtbONc'
};

const E=(id,name,sets,reps,rest,rir,video,load='bodyweight',tempo='controlled',category='strength')=>({id,name,sets,reps,restSeconds:rest,rir,video,load,tempo,category});

export const WARMUP31=[
 {name:'Toe / Foot Prep',dose:'2 x 10',category:'feet'},
 {name:'Ankle CARs',dose:'5 / side',category:'ankles'},
 {name:'Controlled Knee Circles',dose:'8 each',category:'knees'},
 {name:'90/90 Hip Switches',dose:'8 / side',category:'hips'},
 {name:'Hip CARs',dose:'5 / side',category:'hips'},
 {name:'Cat-Cow',dose:'8',category:'spine'},
 {name:'Thoracic Rotation',dose:'8 / side',category:'spine'},
 {name:'Neck CARs',dose:'4 / side',category:'neck'},
 {name:'Shoulder CARs',dose:'5 / side',category:'shoulders'},
 {name:'Scapular Push-Up',dose:'8',category:'scapula'},
 {name:'Forearm Pronation / Supination',dose:'10 each',category:'forearms'},
 {name:'Wrist Mobility',dose:'10 each',category:'wrists'},
 {name:'Glute Bridge',dose:'10',category:'glutes'},
 {name:'Dead Bug',dose:'6 / side',category:'core'},
 {name:'Dead Hang',dose:'20-30 sec',category:'grip'},
 {name:'Wall Slide',dose:'8',category:'posture'}
];

export const PROGRAM31={
 Sunday:{focus:'Mobility + Recovery + Light Full Body + Lower-Leg Balance',intensity:'Recovery',targetMinutes:60,exercises:[
  E('bw-squat','Bodyweight Squat',3,'12-15',45,4,VIDEO.squat),E('pushup-su','Push-Up',3,'8-15',45,3,VIDEO.pushup),E('row-su','Light One-Arm Dumbbell Row',3,'10 / side',45,3,VIDEO.row,'dumbbell'),E('bridge-su','Glute Bridge',3,'12',45,4,VIDEO.bridge),E('hang-su','Dead Hang',3,'20-30 sec',30,null,VIDEO.hang),E('ytw-su','Floor Y-T-W',2,'8 each',30,4,VIDEO.ytw),E('bird-su','Bird Dog',2,'8 / side',30,4,VIDEO.bird),E('tibialis-su','Wall Tibialis Raise',2,'15-20',30,3,VIDEO.tibialis,'bodyweight','2-1-2','accessory')
 ]},
 Monday:{focus:'Heavy Strength + Posture',intensity:'Heavy',targetMinutes:60,exercises:[
  E('front-squat','Double-Dumbbell Front Squat',3,'6-8',90,2,VIDEO.squat,'dumbbells','3-1-1'),E('pullup','Pull-Up or Chin-Up',3,'5-8',90,2,VIDEO.pull),E('floor-press','Dumbbell Floor Press',3,'6-10',90,2,VIDEO.press,'dumbbells','3-0-1'),E('row','One-Arm Dumbbell Row',3,'8-10 / side',75,2,VIDEO.row,'dumbbell'),E('rdl','Dumbbell Romanian Deadlift',3,'8-10',90,2,VIDEO.rdl,'dumbbells','3-1-1'),E('half-ohp','Half-Kneeling One-Arm Overhead Press',3,'8 / side',60,2,VIDEO.ohp,'dumbbell'),E('suit-march','Suitcase March',3,'40 sec / side',60,2,VIDEO.suit,'dumbbell'),E('side-plank','Side Plank',3,'30-45 sec / side',45,2,VIDEO.side)
 ]},
 Tuesday:{focus:'Hypertrophy + Conditioning',intensity:'Moderate-Hard',targetMinutes:60,exercises:[
  E('goblet','Goblet Squat',3,'8-12',75,2,VIDEO.goblet,'dumbbell','3-1-1'),E('pushup-tu','Push-Up',3,'8-15',60,2,VIDEO.pushup),E('rev-lunge','Reverse Dumbbell Lunge',3,'8-10 / side',75,2,VIDEO.lunge,'dumbbells'),E('row-tu','Bent-Over Dumbbell Row',3,'8-12',75,2,VIDEO.row,'dumbbells'),E('press-tu','Dumbbell Floor Press',3,'8-12',75,2,VIDEO.press,'dumbbells'),E('lat','Dumbbell Lateral Raise',3,'12-15',45,2,VIDEO.lat,'dumbbells','controlled','accessory'),E('curl','Hammer Curl',3,'10-12',45,2,VIDEO.curl,'dumbbells','controlled','accessory'),E('tri','Dumbbell Triceps Extension',3,'10-12',45,2,VIDEO.tri,'dumbbell','controlled','accessory'),E('thruster','Dumbbell Squat-to-Press',3,'10',45,3,VIDEO.thruster,'dumbbells','controlled','conditioning'),E('mountain','Mountain Climbers',3,'30 sec',30,3,VIDEO.mountain,'bodyweight','fast','conditioning')
 ]},
 Wednesday:{focus:'Unilateral Strength + Balance + Frontal Plane + Direct Abs/Calves',intensity:'Moderate-Hard',targetMinutes:60,exercises:[
  E('bulgarian','Bulgarian Split Squat',3,'8 / side',90,2,VIDEO.bulgarian,'dumbbells','3-1-1'),E('sl-rdl','Single-Leg Romanian Deadlift',3,'8 / side',75,2,VIDEO.slrdl,'dumbbells','3-1-1'),E('lateral-lunge-we','Dumbbell Lateral Lunge',2,'8 / side',60,2,VIDEO.lateralLunge,'dumbbells','controlled','strength'),E('chinup','Chin-Up',3,'5-8',90,2,VIDEO.pull),E('press-we','One-Arm Dumbbell Floor Press',3,'8 / side',75,2,VIDEO.press,'dumbbell'),E('row-we','One-Arm Dumbbell Row',3,'8-10 / side',75,2,VIDEO.row,'dumbbell'),E('reverse-crunch-we','Reverse Crunch',2,'10-15',45,2,VIDEO.reverseCrunch,'bodyweight','2-1-2','core'),E('calf-we','Single-Leg Calf Raise',3,'10-15 / side',45,2,VIDEO.calf,'bodyweight or dumbbell','2-1-2','accessory')
 ]},
 Thursday:{focus:'Recovery + Mobility + Structural Posture + Shoulder/Ankle Resilience',intensity:'Recovery',targetMinutes:60,exercises:[
  E('cat','Cat-Cow',2,'8',30,null,VIDEO.cat,'bodyweight','controlled','mobility'),E('thor','Thoracic Rotation',2,'8 / side',30,null,VIDEO.thor,'bodyweight','controlled','mobility'),E('hip90','90/90 Hip Rotation',2,'8 / side',30,null,VIDEO.hip,'bodyweight','controlled','mobility'),E('wall','Wall Slide',2,'10',30,4,VIDEO.wall,'bodyweight','controlled','posture'),E('bridge-th','Glute Bridge',3,'12',30,4,VIDEO.bridge),E('deadbug-th','Dead Bug',3,'6 / side',30,4,VIDEO.deadbug,'bodyweight','controlled','core'),E('external-rotation-th','Side-Lying Dumbbell External Rotation',2,'12-15 / side',30,3,VIDEO.externalRotation,'light dumbbell','3-1-2','accessory'),E('tibialis-th','Wall Tibialis Raise',2,'15-20',30,3,VIDEO.tibialis,'bodyweight','2-1-2','accessory')
 ]},
 Friday:{focus:'Heavy Strength + Upper/Lower Power',intensity:'Heavy',targetMinutes:60,exercises:[
  E('squat-jump-fr','Bodyweight Squat Jump',3,'5',90,4,VIDEO.squatJump,'bodyweight','explosive','power'),E('pushpress','Dumbbell Push Press',4,'5-6',90,2,VIDEO.pushpress,'dumbbells','explosive','power'),E('rdl-fr','Dumbbell Romanian Deadlift',3,'6-8',90,2,VIDEO.rdl,'dumbbells','3-1-1'),E('squat-fr','Double-Dumbbell Front Squat',3,'6-8',90,2,VIDEO.squat,'dumbbells','3-1-1'),E('pull-fr','Pull-Up',3,'5-8',90,2,VIDEO.pull),E('press-fr','Dumbbell Floor Press',3,'6-10',90,2,VIDEO.press,'dumbbells'),E('row-fr','One-Arm Dumbbell Row',3,'8-10 / side',75,2,VIDEO.row,'dumbbell'),E('farmer','Farmer March',3,'45 sec',60,2,VIDEO.farmer,'dumbbells'),E('drag','Plank Dumbbell Drag',3,'8 / side',45,2,VIDEO.drag,'dumbbell','controlled','core'),E('hollow','Hollow Hold',3,'20-40 sec',45,2,VIDEO.hollow,'bodyweight','controlled','core')
 ]},
 Saturday:{focus:'Full Body + Arms + Direct Abs/Calves + Conditioning',intensity:'Moderate',targetMinutes:60,exercises:[
  E('goblet-sa','Goblet Squat',3,'8-12',75,2,VIDEO.goblet,'dumbbell'),E('press-sa','Dumbbell Floor Press',3,'8-12',75,2,VIDEO.press,'dumbbells'),E('row-sa','One-Arm Dumbbell Row',3,'8-12 / side',75,2,VIDEO.row,'dumbbell'),E('lunge-sa','Reverse Lunge',3,'8-10 / side',60,2,VIDEO.lunge,'dumbbells'),E('rdl-sa','Romanian Deadlift',3,'8-12',75,2,VIDEO.rdl,'dumbbells'),E('curl-sa','Hammer Curl',3,'10-12',45,2,VIDEO.curl,'dumbbells','controlled','accessory'),E('tri-sa','Dumbbell Triceps Extension',3,'10-12',45,2,VIDEO.tri,'dumbbell','controlled','accessory'),E('reverse-crunch-sa','Reverse Crunch',2,'12-15',45,2,VIDEO.reverseCrunch,'bodyweight','2-1-2','core'),E('calf-sa','Single-Leg Calf Raise',3,'12-20 / side',45,2,VIDEO.calf,'bodyweight or dumbbell','2-1-2','accessory')
 ]}
};

export const DAY_ORDER=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export function validateProgram31(){
 const errors=[];
 if(Object.keys(PROGRAM31).length!==7)errors.push('Program must contain seven days.');
 for(const day of DAY_ORDER){
  const d=PROGRAM31[day];
  if(!d)errors.push(`Missing ${day}.`);
  else{
   if(!d.focus)errors.push(`${day}: missing focus.`);
   if(d.targetMinutes!==60)errors.push(`${day}: targetMinutes must be 60.`);
   if(!Array.isArray(d.exercises)||d.exercises.length<6)errors.push(`${day}: insufficient exercises.`);
   for(const e of d.exercises||[]){
    for(const field of ['id','name','sets','reps','restSeconds','video','load','tempo','category'])if(e[field]===undefined||e[field]===null||e[field]==='')errors.push(`${day}/${e.id||e.name||'unknown'}: missing ${field}.`);
    if(!String(e.video||'').startsWith('https://www.youtube.com/watch?'))errors.push(`${day}/${e.id}: invalid instructional video URL.`);
   }
  }
 }
 if(WARMUP31.length<15)errors.push('Warm-up must provide complete head-to-toe coverage.');
 const names=Object.values(PROGRAM31).flatMap(d=>d.exercises.map(e=>e.name));
 for(const required of ['Single-Leg Calf Raise','Wall Tibialis Raise','Reverse Crunch','Dumbbell Lateral Lunge','Side-Lying Dumbbell External Rotation','Bodyweight Squat Jump'])if(!names.includes(required))errors.push(`Missing targeted coverage movement: ${required}.`);
 return {ok:errors.length===0,errors,days:Object.keys(PROGRAM31).length,warmupMovements:WARMUP31.length,totalExercises:Object.values(PROGRAM31).reduce((n,d)=>n+d.exercises.length,0),version:PROGRAM_VERSION};
}
