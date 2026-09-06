export const MOBILE35_CSS=`
html.db35Mobile,html.db35Mobile body{max-width:100vw!important;overflow-x:hidden!important}
html.db35Mobile body.db35Active{width:100vw!important;max-width:100vw!important;overflow-x:hidden!important}
html.db35Mobile body.db35Active #view-anatomy{left:0!important;right:0!important;width:100vw!important;max-width:100vw!important;overflow-x:hidden!important;box-sizing:border-box!important}
html.db35Mobile body.db35Active #view-anatomy .db35{width:100%!important;max-width:100vw!important;min-width:0!important;overflow-x:hidden!important}
html.db35Mobile body.db35Active #view-anatomy .db35 *{min-width:0;max-width:100%;box-sizing:border-box}
html.db35Mobile body.db35Active .db35Grid,html.db35Mobile body.db35Active .db35Stage,html.db35Mobile body.db35Active .db35Panel,html.db35Mobile body.db35Active .db35Card{width:100%!important;max-width:100%!important;min-width:0!important}
html.db35Mobile body.db35Active .db35Svg{width:100%!important;max-width:100%!important;overflow:hidden!important}
@media(max-width:720px){html,body{max-width:100vw;overflow-x:hidden}.db35Top{min-width:0}.db35Top>div{min-width:0}.db35Top h2,.db35Top p{overflow-wrap:anywhere}.db35Meta{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
`;
export const MOBILE35_JS=`(()=>{function sync(){const v=document.querySelector('#view-anatomy'),on=!!v&&getComputedStyle(v).display!=='none'&&innerWidth<=720;document.documentElement.classList.toggle('db35Mobile',on);if(on){document.documentElement.style.overflowX='hidden';document.body.style.overflowX='hidden'}else{document.documentElement.style.overflowX='';document.body.style.overflowX=''}}document.addEventListener('click',()=>setTimeout(sync,80),true);addEventListener('resize',sync);new MutationObserver(()=>{clearTimeout(window.__db35mobile);window.__db35mobile=setTimeout(sync,80)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});setTimeout(sync,500)})();`;
