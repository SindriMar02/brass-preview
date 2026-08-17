import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const lerp of [0.085, 0.11, 0.14, 0.18, 0.22]) {
  const p=await b.newPage();
  await p.setViewport({width:1440,height:900});
  await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
  await sleep(1600);
  await p.evaluate((l)=>{ window.lenis.destroy(); window.lenis=new Lenis({lerp:l, wheelMultiplier:1, syncTouch:false});
    (function raf(t){ window.lenis.raf(t); requestAnimationFrame(raf); })(0);
    window.lenis.scrollTo(0,{immediate:true});
  }, lerp);
  await sleep(500);
  await p.evaluate(()=>{ window.__s=[]; const t0=performance.now();
    (function f(){ window.__s.push([performance.now()-t0, window.scrollY]); if(performance.now()-t0<2000) requestAnimationFrame(f); })(); });
  await p.mouse.move(700,450);
  await p.mouse.wheel({deltaY:400});
  await sleep(2100);
  const s=await p.evaluate(()=>window.__s);
  const end=s[s.length-1][1], start=s[0][1];
  let t95=null,t50=null;
  for(const [t,y] of s){ if(t50===null && Math.abs(y-start)>=Math.abs(end-start)*0.5) t50=Math.round(t);
                         if(Math.abs(y-start)>=Math.abs(end-start)*0.95){ t95=Math.round(t); break; } }
  console.log(`lerp ${lerp}  half:${String(t50).padStart(4)}ms  settle95:${String(t95).padStart(4)}ms  travelled:${Math.round(end-start)}`);
  await p.close();
}
await b.close();
