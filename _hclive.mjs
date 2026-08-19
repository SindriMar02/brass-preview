import puppeteer from 'puppeteer-core';
import { execSync } from 'node:child_process';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args:['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('https://sindrimar02.github.io/brass-preview/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 3500));
const boxes = await p.evaluate(() => {
  const out = [];
  const items = [];
  document.querySelectorAll('.pc-card--hero .pc-hero__marks *, .pc-card--hero .pc-hero__row *, .pc-card--hero .pc-chrome__list a, .pc-card--hero .pc-chrome span, .pc-card--hero .pc-mass > span:not(.pc-sr)').forEach(e => {
    if (e.children.length) return;                 // leaf text nodes only
    const t = (e.textContent||'').trim(); if (!t) return;
    const r = e.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) return;
    items.push({ sel: t.slice(0,34), x: Math.max(0,Math.round(r.x)), y: Math.max(0,Math.round(r.y)), w: Math.round(r.width), h: Math.round(r.height) });
  });
  out.push(...items);
  // hide every text layer so the screenshot shows only photo + scrim
  document.querySelectorAll('.pc-card--hero .pc-chrome, .pc-card--hero .pc-hero__marks, .pc-card--hero .pc-hero__row, .pc-card--hero .pc-mass').forEach(e => e.style.visibility='hidden');
  return out;
});
await new Promise(r => setTimeout(r, 200));
await p.screenshot({ path: '/tmp/_herobg.png' });
await b.close();
// WCAG relative luminance of white text #F7F5F1
const lum = c => { const s = c/255; return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4); };
const L = (r,g,b) => 0.2126*lum(r)+0.7152*lum(g)+0.0722*lum(b);
const Ltext = L(247,245,241);
for (const bx of boxes) {
  // worst case = brightest part of the backdrop, so take a high percentile
  const out = execSync(`magick /tmp/_herobg.png -crop ${bx.w}x${bx.h}+${bx.x}+${bx.y} +repage -colorspace sRGB -format "%[fx:mean.r*255],%[fx:mean.g*255],%[fx:mean.b*255]" info:`).toString();
  const [r,g,gb] = out.split(',').map(Number);
  const p95 = execSync(`magick /tmp/_herobg.png -crop ${bx.w}x${bx.h}+${bx.x}+${bx.y} +repage -colorspace Gray -format "%[fx:100*maxima]" info:`).toString();
  const Lbg = L(r,g,gb);
  const ratio = (Math.max(Ltext,Lbg)+0.05)/(Math.min(Ltext,Lbg)+0.05);
  const bright = Number(p95)/100;
  const Lb2 = L(bright*255,bright*255,bright*255);
  const worst = (Math.max(Ltext,Lb2)+0.05)/(Math.min(Ltext,Lb2)+0.05);
  console.log(`${bx.sel.padEnd(20)} mean rgb(${r.toFixed(0)},${g.toFixed(0)},${gb.toFixed(0)})  mean-contrast ${ratio.toFixed(2)}:1   brightest-pixel-contrast ${worst.toFixed(2)}:1`);
}
