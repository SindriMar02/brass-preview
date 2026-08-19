import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args:['--no-sandbox'] });
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844 });
await p.goto('http://localhost:8762/', { waitUntil: 'networkidle0' });
console.log(JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.pc-pin__foot')].map(e => ({
  txt: e.textContent.slice(0,24), display: getComputedStyle(e).display, fs: getComputedStyle(e).fontSize,
  rect: e.getBoundingClientRect().height })))));
await b.close();
