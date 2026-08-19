import puppeteer from 'puppeteer-core';
const CH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b = await puppeteer.launch({ executablePath: CH, headless: 'new', args:['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:8762/', { waitUntil: 'networkidle0' });
console.log(JSON.stringify(await p.evaluate(() => {
  const q = s => document.querySelector('.pc-card--hero ' + s);
  const r = (n,e) => e ? { el:n, top:+e.getBoundingClientRect().top.toFixed(0), bottom:+e.getBoundingClientRect().bottom.toFixed(0) } : {el:n, missing:true};
  return [r('.pc-chrome', q('.pc-chrome')), r('.pc-hero__marks', q('.pc-hero__marks')), r('.pc-mass', q('.pc-mass')), r('.pc-hero__row', q('.pc-hero__row'))];
}), null, 1));
await b.close();
