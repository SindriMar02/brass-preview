/* Does the page scroll when the cursor sits over each major region? */
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.setViewport({width:1440,height:900});
await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
await sleep(1800);

const geo=await p.evaluate(()=>{const r=document.querySelector('.pc-pin').getBoundingClientRect();return{top:Math.round(r.top+scrollY),h:Math.round(r.height)};});

async function probe(label, y, point) {
  await p.evaluate((v)=>window.lenis.scrollTo(v,{immediate:true}), y);
  await sleep(700);
  const before = await p.evaluate(()=>Math.round(window.scrollY));
  await p.mouse.move(point.x, point.y);
  await p.mouse.wheel({deltaY: 500});
  await sleep(900);
  const after = await p.evaluate(()=>Math.round(window.scrollY));
  console.log(`${label.padEnd(28)} ${before} -> ${after}   ${after-before > 100 ? 'scrolls' : '*** DEAD ZONE ***'}`);
}

await probe('hero (top)', 0, {x:700,y:450});
await probe('over the menu panel', geo.top+Math.round(geo.h*0.12), {x:1000,y:450});
await probe('over the course titles', geo.top+Math.round(geo.h*0.12), {x:200,y:450});
await probe('over a cream sheet', 1200, {x:700,y:500});
await probe('over the photo strip', 8600, {x:700,y:450});
await probe('over the footer', 11800, {x:700,y:700});
await b.close();
