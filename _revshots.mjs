import puppeteer from 'puppeteer-core';
const CH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b = await puppeteer.launch({ executablePath: CH, headless: 'new', args:['--no-sandbox'] });
for (const [tag, w, h] of [['d', 1440, 900], ['m', 390, 844]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
  await p.evaluateOnNewDocument(() => {
    window.__ready = new Promise(r => {
      const i = setInterval(() => {
        if (document.documentElement.classList.contains('is-ready')) { clearInterval(i); r(performance.now()); }
      }, 8);
    });
  });
  await p.goto('http://localhost:8762/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  await p.screenshot({ path: `_rev-${tag}-curtain.png` });     // curtain up
  await p.evaluate(() => window.__ready);
  for (const ms of [350, 600, 800, 1100]) {
    await p.evaluate(t => new Promise(r => setTimeout(r, t)), ms === 350 ? 350 : 0);
    if (ms !== 350) await new Promise(r => setTimeout(r, 200));
    await p.screenshot({ path: `_rev-${tag}-lift-${ms}.png` });
  }
  await new Promise(r => setTimeout(r, 2500));
  await p.screenshot({ path: `_rev-${tag}-settled.png` });
  await p.close();
}
await b.close();
console.log('shots done');
