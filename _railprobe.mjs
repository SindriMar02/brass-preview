import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args:['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:8762/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2500));
const geo = await p.evaluate(() => {
  const s = document.getElementById('matsedill');
  const r = s.getBoundingClientRect();
  return { top: r.top + scrollY, height: r.height, vh: innerHeight,
           supports: CSS.supports('animation-timeline', 'view()') };
});
console.log('section', JSON.stringify(geo));
// pinned window: from section top to section bottom - vh
const start = geo.top, end = geo.top + geo.height - geo.vh;
console.log(`pinned travel ${Math.round(end - start)}px\n`);
console.log('progress  scrollY   scaleX   active   count');
for (let f = 0; f <= 1.0001; f += 0.1) {
  const y = Math.round(start + (end - start) * f);
  await p.evaluate(v => window.scrollTo(0, v), y);
  await new Promise(r => setTimeout(r, 260));
  const s = await p.evaluate(() => {
    const fill = document.querySelector('.pc-pin__railfill');
    const m = new DOMMatrixReadOnly(getComputedStyle(fill).transform);
    return { sx: +m.a.toFixed(3),
             active: document.querySelector('[data-stage]').getAttribute('data-active'),
             count: document.querySelector('[data-count]').textContent };
  });
  console.log(`${(f*100).toFixed(0).padStart(6)}%  ${String(y).padStart(7)}   ${String(s.sx).padStart(6)}   ${s.active.padStart(6)}   ${s.count}`);
}
await b.close();
