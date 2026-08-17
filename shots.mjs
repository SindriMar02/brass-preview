/* Screenshot pass for the Brass prototype.
   The Browser pane pauses IntersectionObserver whenever it is hidden, which
   makes reveal-driven sections read as "never revealed". This drives a real
   headless Chrome instead, so what it captures is what a visitor sees. */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE || 'http://localhost:8762';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 60000 });
await sleep(2200);

/* walk the page so every reveal fires, then come back and shoot each stop */
const height = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < height; y += 700) {
  await page.evaluate((v) => (window.lenis? window.lenis.scrollTo(v,{immediate:true}) : window.scrollTo(0,v)), y);
  await sleep(220);
}
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(1200);

const stops = [
  ['_shot-01-hero.png', 0],
  ['_shot-02-place.png', 950],
  ['_shot-03-menu.png', 2400],
  ['_shot-04-rail.png', 4100],
  ['_shot-05-drinks.png', 4900],
  ['_shot-06-room.png', 6400],
  ['_shot-07-find.png', 7400],
  ['_shot-08-voice.png', 8400],
];

for (const [file, y] of stops) {
  await page.evaluate((v) => (window.lenis? window.lenis.scrollTo(v,{immediate:true}) : window.scrollTo(0,v)), y);
  await sleep(900);
  await page.screenshot({ path: file });
}

const state = await page.evaluate(() => ({
  revealed: document.querySelectorAll('[data-reveal].is-in').length,
  rows: document.querySelectorAll('.is-in .pc-row').length,
  bar: document.querySelector('[data-bar]').classList.contains('is-on'),
  docHeight: document.body.scrollHeight,
}));

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.reload({ waitUntil: 'networkidle0' });

await sleep(1800);
await page.screenshot({ path: '_shot-09-mobile.png' });

await browser.close();
console.log(JSON.stringify(state, null, 2));
