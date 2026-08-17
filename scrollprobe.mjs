import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.setViewport({width:1440,height:900});
await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
await sleep(2000);
await p.evaluate(()=>window.lenis && window.lenis.scrollTo(0,{immediate:true}));
await sleep(400);

// sample scrollY every frame while one wheel tick is applied
await p.evaluate(()=>{ window.__s=[]; const t0=performance.now();
  (function f(){ window.__s.push([Math.round(performance.now()-t0), Math.round(window.scrollY)]); if(performance.now()-t0<2500) requestAnimationFrame(f); })(); });
await p.mouse.move(700,450);
await p.mouse.wheel({deltaY: 400});
await sleep(2600);

const s = await p.evaluate(()=>window.__s);
const end = s[s.length-1][1];
const start = s[0][1];
// time to reach 95% of final
let t95=null; for(const [t,y] of s){ if(Math.abs(y-start) >= Math.abs(end-start)*0.95){ t95=t; break; } }
// frame gaps (jank) and non-monotonic steps (jitter)
let maxGap=0, back=0, prev=s[0];
for(const cur of s.slice(1)){ maxGap=Math.max(maxGap,cur[0]-prev[0]); if((cur[1]-prev[1])*(end-start)<0) back++; prev=cur; }
console.log(JSON.stringify({ deltaRequested:400, travelled:end-start, settle95ms:t95, maxFrameGapMs:maxGap, backwardSteps:back, samples:s.length }));

// anchor navigation
await p.evaluate(()=>window.lenis.scrollTo(0,{immediate:true})); await sleep(400);
await p.evaluate(()=>document.querySelector('a[href="#matsedill"]').click());
await sleep(2200);
const anchor = await p.evaluate(()=>{
  const el=document.querySelector('#matsedill');
  return { landedTop: Math.round(el.getBoundingClientRect().top), scrollY: Math.round(window.scrollY) };
});
console.log('anchor #matsedill:', JSON.stringify(anchor));
await b.close();
