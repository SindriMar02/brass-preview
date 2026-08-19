import puppeteer from 'puppeteer-core';
import { execSync } from 'node:child_process';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args:['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:8762/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 3000));
await p.evaluate(() => document.getElementById('barusalur').scrollIntoView({ block: 'start' }));
await new Promise(r => setTimeout(r, 1800));
const items = await p.evaluate(() => {
  const card = document.getElementById('barusalur');
  const out = [];
  card.querySelectorAll('.pc-chrome *, .pc-mass > span:not(.pc-sr), .pc-card__foot *, .pc-action, .pc-label').forEach(e => {
    if (e.children.length) return;
    const t = (e.textContent||'').trim(); if (!t) return;
    const r = e.getBoundingClientRect();
    if (r.width < 6 || r.height < 6 || r.top < 0 || r.bottom > 900) return;
    out.push({ t: t.slice(0,30), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), color: getComputedStyle(e).color });
  });
  card.querySelectorAll('.pc-chrome, .pc-mass, .pc-card__foot, .pc-card__inner').forEach(e => e.style.visibility='hidden');
  return out;
});
await new Promise(r => setTimeout(r, 200));
await p.screenshot({ path: '/tmp/_cardbg.png' });
await b.close();
const lum = c => { const s=c/255; return s<=0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055,2.4); };
const L = (r,g,bb) => 0.2126*lum(r)+0.7152*lum(g)+0.0722*lum(bb);
for (const it of items) {
  const m = it.color.match(/(\d+),\s*(\d+),\s*(\d+)/); const Lt = L(+m[1],+m[2],+m[3]);
  const mx = Number(execSync(`magick /tmp/_cardbg.png -crop ${it.w}x${it.h}+${it.x}+${it.y} +repage -colorspace Gray -format "%[fx:255*maxima]" info:`).toString());
  const Lb = L(mx,mx,mx);
  const ratio = (Math.max(Lt,Lb)+0.05)/(Math.min(Lt,Lb)+0.05);
  console.log(`${it.t.padEnd(32)} worst ${ratio.toFixed(2)}:1 ${ratio < 4.5 ? '  <-- FAILS 4.5:1' : ''}`);
}
