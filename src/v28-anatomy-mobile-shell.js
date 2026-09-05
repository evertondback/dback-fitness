export const ANATOMY28_CSS=`
@media(max-width:720px){
body.db28AnatomyActive{overflow:hidden!important;width:100vw!important;max-width:100vw!important}
body.db28AnatomyActive #nav,body.db28AnatomyActive aside,body.db28AnatomyActive .sidebar,body.db28AnatomyActive [class*="sidebar"]{display:none!important}
body.db28AnatomyActive #view-anatomy{position:fixed!important;inset:0!important;z-index:2147483000!important;width:100vw!important;max-width:100vw!important;min-width:0!important;height:100dvh!important;max-height:100dvh!important;margin:0!important;padding:0!important;overflow-y:auto!important;overflow-x:hidden!important;background:#03101a!important;box-sizing:border-box!important}
body.db28AnatomyActive #view-anatomy>.db27{width:100%!important;max-width:100%!important;min-width:0!important;min-height:100dvh!important;margin:0!important;padding:calc(env(safe-area-inset-top,0px) + 6px) 6px calc(env(safe-area-inset-bottom,0px) + 76px)!important;box-sizing:border-box!important}
body.db28AnatomyActive .db27Head{position:sticky!important;top:0!important;z-index:90!important;background:#061522ee!important;backdrop-filter:blur(14px)!important;padding:4px 0!important}
body.db28AnatomyActive .db27Tabs{position:sticky!important;top:54px!important;z-index:85!important;background:#071826ee!important;backdrop-filter:blur(12px)!important}
body.db28AnatomyActive .db27Seg{width:min(330px,100%)!important;margin:7px auto!important}
body.db28AnatomyActive .db27Map{width:100%!important;max-width:100%!important;min-width:0!important;min-height:540px!important;border-radius:14px!important}
body.db28AnatomyActive .db27Stage{width:100%!important;max-width:100%!important;height:540px!important;min-width:0!important;overflow:hidden!important}
body.db28AnatomyActive .db27Svg{width:100%!important;max-width:100%!important;height:100%!important;display:block!important}
body.db28AnatomyActive .db27Rail{left:4px!important;top:10px!important;width:50px!important;gap:4px!important}
body.db28AnatomyActive .db27Rail button{width:50px!important;min-width:50px!important;min-height:47px!important;padding:3px!important;border-radius:10px!important;font-size:8px!important;line-height:1.05!important}
body.db28AnatomyActive .db27Rail button span{font-size:15px!important;margin-bottom:2px!important}
body.db28AnatomyActive .db27Callout{right:5px!important;top:74px!important;width:116px!important;max-width:116px!important;padding:7px!important;font-size:9px!important}
body.db28AnatomyActive .db27Callout b{font-size:10px!important}body.db28AnatomyActive .db27Callout small{font-size:8px!important}
body.db28AnatomyActive .db27Callout button{min-height:32px!important;padding:5px!important;font-size:9px!important}
body.db28AnatomyActive .db27Tools{right:4px!important;bottom:6px!important;gap:4px!important}
body.db28AnatomyActive .db27Tools button{width:41px!important;min-width:41px!important;min-height:41px!important;padding:3px!important;font-size:8px!important}
body.db28AnatomyActive .db27Legend{font-size:9px!important;gap:8px!important;padding:5px!important}
body.db28AnatomyActive .db27Facts{grid-template-columns:1fr!important}
body.db28AnatomyActive .db27Search{display:grid!important;grid-template-columns:1fr!important}
body.db28AnatomyActive .db27Search input,body.db28AnatomyActive .db27Search select{width:100%!important;min-width:0!important}
body.db28AnatomyActive #mobileNav{z-index:2147483001!important}
}
@media(max-width:390px){body.db28AnatomyActive .db27Stage{height:510px!important}body.db28AnatomyActive .db27Map{min-height:510px!important}body.db28AnatomyActive .db27Head h2{font-size:16px!important}body.db28AnatomyActive .db27Head small{font-size:9px!important}body.db28AnatomyActive .db27Tabs button,body.db28AnatomyActive .db27Seg button{font-size:10px!important}}
`;
export const ANATOMY28_JS=`(()=>{function sync(){const v=document.querySelector('#view-anatomy');const active=!!(v&&v.querySelector('.db27')&&getComputedStyle(v).display!=='none'&&getComputedStyle(v).visibility!=='hidden');document.body.classList.toggle('db28AnatomyActive',active);if(active){document.documentElement.style.overflowX='hidden'}else{document.documentElement.style.overflowX=''}}document.addEventListener('click',()=>setTimeout(sync,50),true);new MutationObserver(()=>{clearTimeout(window.__db28);window.__db28=setTimeout(sync,60)}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});addEventListener('resize',sync);setTimeout(sync,500)})();`;
