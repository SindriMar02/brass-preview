import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.setViewport({width:1440,height:900});
await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
await sleep(1800);
await p.evaluate(()=>window.lenis.scrollTo(0,{immediate:true})); await sleep(400);
await p.evaluate(()=>document.body.focus());
for (const key of ['Space','PageDown','ArrowDown','End']) {
  const before = await p.evaluate(()=>Math.round(window.scrollY));
  await p.keyboard.press(key);
  await sleep(900);
  const after = await p.evaluate(()=>Math.round(window.scrollY));
  console.log(`${key.padEnd(10)} ${before} -> ${after}  ${after>before?'PASS':'FAIL (no movement)'}`);
  await p.evaluate(()=>window.lenis.scrollTo(0,{immediate:true})); await sleep(300);
}
await b.close();
