import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args:['--no-sandbox'] });
for (const [tag, w, h] of [['d', 1440, 900], ['m', 390, 844]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
  await p.goto('http://localhost:8762/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500));
  const g = await p.evaluate(() => { const r = document.getElementById('matsedill').getBoundingClientRect();
    return { top: r.top + scrollY, height: r.height, vh: innerHeight }; });
  const start = g.top, end = g.top + g.height - g.vh;
  for (const f of [0.05, 0.5, 0.9]) {
    await p.evaluate(v => window.scrollTo(0, v), Math.round(start + (end - start) * f));
    await new Promise(r => setTimeout(r, 900));
    await p.screenshot({ path: `_rail-${tag}-${Math.round(f*100)}.png` });
  }
  await p.close();
}
await b.close();
console.log('done');
