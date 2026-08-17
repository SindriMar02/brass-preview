import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
p.on('console',m=>console.log('CONSOLE',m.type(),m.text()));
p.on('pageerror',e=>console.log('PAGEERROR',e.message));
await p.setViewport({width:1440,height:900});
p.goto('http://localhost:8752/',{waitUntil:'domcontentloaded'}).catch(()=>{});
for (const t of [200,500,1000,1600,2400]) {
  await sleep(t===200?200:t-  (t===500?200:t===1000?500:t===1600?1000:1600));
  const s=await p.evaluate(()=>({
    loading:document.documentElement.classList.contains('is-loading'),
    ready:document.documentElement.classList.contains('is-ready'),
    num:(document.querySelector('[data-load-num]')||{}).textContent,
    fill:(document.querySelector('[data-load-fill]')||{}).style?.width,
    reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,
    imgs:document.images.length,
  })).catch(e=>({err:String(e)}));
  console.log(t, JSON.stringify(s));
}
await b.close();
