import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const vp of [{width:390,height:844},{width:360,height:780},{width:430,height:932}]) {
  const p=await b.newPage();
  await p.setViewport({...vp, isMobile:true, hasTouch:true, deviceScaleFactor:2});
  await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
  await sleep(1800);
  const geo=await p.evaluate(()=>{const r=document.querySelector('.pc-pin').getBoundingClientRect();return{top:Math.round(r.top+scrollY),h:Math.round(r.height)};});
  await p.evaluate((y)=>(window.lenis?window.lenis.scrollTo(y,{immediate:true}):window.scrollTo(0,y)), geo.top+Math.round(geo.h*0.10));
  await sleep(900);
  const m=await p.evaluate(()=>{
    const ol=document.querySelector('.pc-pin__titles');
    const stage=document.querySelector('.pc-pin__stage');
    const panels=[...document.querySelectorAll('.pc-pin__panel')];
    return {
      titlesOverflowX: ol.scrollWidth - ol.clientWidth,
      titlesRight: Math.round(ol.getBoundingClientRect().right),
      viewportW: innerWidth,
      panelOverflow: panels.map(el=>el.scrollHeight-el.clientHeight),
      bodyOverflowX: document.documentElement.scrollWidth - innerWidth,
    };
  });
  console.log(`${vp.width}x${vp.height}`, JSON.stringify(m));
  if (vp.width===390) await p.screenshot({path:'_shot-mobile-pin.png'});
  await p.close();
}
await b.close();
