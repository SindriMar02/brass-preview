import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args:['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:8762/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2500));
const g = await p.evaluate(() => { const r = document.getElementById('matsedill').getBoundingClientRect();
  return { top: r.top + scrollY, height: r.height, vh: innerHeight }; });
const start = g.top, end = g.top + g.height - g.vh;
let prev = null;
for (let f = 0; f <= 1.0001; f += 0.01) {
  const y = Math.round(start + (end - start) * f);
  await p.evaluate(v => window.scrollTo(0, v), y);
  await new Promise(r => setTimeout(r, 90));
  const a = await p.evaluate(() => document.querySelector('[data-stage]').getAttribute('data-active'));
  if (a !== prev) { console.log(`course ${Number(a)+1} becomes active at ${(f*100).toFixed(0)}% of the travel`); prev = a; }
}
await b.close();
