export const FEATURE_FLAGS=Object.freeze({
 unifiedShell:true,
 nativeWorkout:true,
 legacySurfaceCompat:true,
 nativeHistory:false,
 nativeAnatomy:false,
 managedVideoLibrary:true
});

export const OPERATION_STATUS=Object.freeze([
 'NOT_STARTED','READY','IN_PROGRESS','BLOCKED','WAITING','READY_TO_VERIFY','VERIFIED','CLOSED','CANCELLED'
]);

export const DATA_OWNERSHIP=Object.freeze({
 sourceCode:'GitHub',productionRuntime:'Cloudflare',fitnessData:'DBACK Fitness D1',fitnessMedia:'DBACK Fitness media library/R2',email:'Gmail',calendar:'Google Calendar',contacts:'Google Contacts',constructionRecords:'Procore',orchestration:'EVA'
});
