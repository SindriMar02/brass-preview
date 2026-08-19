import puppeteer from 'puppeteer-core';
const CH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b = await puppeteer.launch({ executablePath: CH, headless: 'new', args:['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
// record every state change from inside the page, on a rAF loop, from first paint
await p.evaluateOnNewDocument(() => {
  window.__log = [];
  const t0 = performance.now();
  function tick() {
    const l = document.querySelector('[data-load]');
    const media = document.querySelector('.pc-card--hero .pc-card__media');
    const mass = document.querySelector('.pc-card--hero .pc-mass > span:not(.pc-sr)');
    const row = document.querySelector('.pc-card--hero .pc-hero__row');
    window.__log.push({
      t: +(performance.now() - t0).toFixed(0),
      loading: document.documentElement.classList.contains('is-loading'),
      ready: document.documentElement.classList.contains('is-ready'),
      done: l ? l.classList.contains('is-done') : null,
      curtainH: l ? +l.getBoundingClientRect().height.toFixed(0) : -1,
      curtainY: l ? getComputedStyle(l).transform : null,
      heroT: media ? getComputedStyle(media).transform : null,
      massClip: mass ? getComputedStyle(mass).clipPath : null,
      rowOp: row ? getComputedStyle(row).opacity : null,
    });
    if (performance.now() - t0 < 4000) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});
await p.goto('http://localhost:8762/', { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 4200));
const log = await p.evaluate(() => window.__log);
// print every 4th frame plus every frame where a class flipped
let prev = null;
for (let i = 0; i < log.length; i++) {
  const e = log[i];
  const key = `${e.loading}|${e.ready}|${e.done}`;
  const flip = key !== prev; prev = key;
  if (flip || i % 6 === 0) console.log(String(e.t).padStart(5), flip ? '*' : ' ', `load=${e.loading?1:0} ready=${e.ready?1:0} done=${e.done===null?'-':(e.done?1:0)} h=${String(e.curtainH).padStart(4)} curtain=${(e.curtainY||'-').slice(0,30).padEnd(30)} hero=${(e.heroT||'-').slice(0,22).padEnd(22)} mass=${(e.massClip||'-').slice(0,24)}`);
}
await b.close();
