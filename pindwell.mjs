import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.setViewport({width:1440,height:900});
await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
await sleep(1500);
const geo=await p.evaluate(()=>{const r=document.querySelector('.pc-pin').getBoundingClientRect();return{top:Math.round(r.top+scrollY),h:Math.round(r.height)};});
const seen={};
for(let y=geo.top; y<geo.top+geo.h; y+=60){
  await p.evaluate((v)=>window.scrollTo(0,v), y);
  await sleep(45);
  const st=await p.evaluate(()=>{
    const s=document.querySelector('[data-stage]');
    const r=s.getBoundingClientRect();
    return {a:s.getAttribute('data-active'), pinned: Math.abs(r.top)<2};
  });
  if(st.pinned) seen[st.a]=(seen[st.a]||0)+60;
}
console.log('pinned scroll per course (px):', JSON.stringify(seen));
await b.close();
