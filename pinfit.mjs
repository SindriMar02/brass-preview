import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const vp of [{width:1440,height:900},{width:1280,height:800},{width:1680,height:1050}]) {
  const p=await b.newPage();
  await p.setViewport(vp);
  await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
  await sleep(1600);
  const fit=await p.evaluate(()=>[...document.querySelectorAll('.pc-pin__panel')].map(el=>({
    over: el.scrollHeight - el.clientHeight,
  })));
  console.log(vp.width+'x'+vp.height, JSON.stringify(fit));
  await p.close();
}
await b.close();
