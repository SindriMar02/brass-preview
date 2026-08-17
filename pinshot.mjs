import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-color-profile=srgb']});
const p=await b.newPage();
await p.setViewport({width:1440,height:900});
await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
await sleep(2000);
const geo=await p.evaluate(()=>{
  const pin=document.querySelector('.pc-pin');
  const r=pin.getBoundingClientRect();
  return {top:Math.round(r.top+scrollY),height:Math.round(r.height),doc:document.body.scrollHeight};
});
console.log('pin geometry', JSON.stringify(geo));
const stops=[0.10,0.38,0.64];
for (let i=0;i<stops.length;i++){
  await p.evaluate((y)=>(window.lenis? window.lenis.scrollTo(y,{immediate:true}) : window.scrollTo(0,y)), Math.round(geo.top+geo.height*stops[i]));
  await sleep(1100);
  const st=await p.evaluate(()=>({
    active:document.querySelector('[data-stage]').getAttribute('data-active'),
    count:document.querySelector('[data-count]').textContent,
    litTitle:[...document.querySelectorAll('.pc-pin__title')].map(t=>getComputedStyle(t).opacity),
    visiblePanel:[...document.querySelectorAll('.pc-pin__panel')].map(t=>getComputedStyle(t).opacity),
  }));
  console.log('stop'+i, JSON.stringify(st));
  await p.screenshot({path:`_shot-pin-${i}.png`});
}
await b.close();
