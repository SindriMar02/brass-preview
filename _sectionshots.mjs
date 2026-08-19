import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args:['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await p.goto('http://localhost:8762/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 3000));
for (const id of ['barusalur', 'morgunverdur']) {
  const ok = await p.evaluate(i => { const e = document.getElementById(i); if (!e) return false; e.scrollIntoView({block:'start'}); return true; }, id);
  if (!ok) { console.log('missing #' + id); continue; }
  await new Promise(r => setTimeout(r, 1600));
  await p.screenshot({ path: `_sec-${id}.png` });
  console.log('shot', id);
}
await b.close();
