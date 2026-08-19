import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const OUT=process.env.OUT||`${process.env.HOME}/Downloads`;
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-color-profile=srgb']});

// desktop landing, 2x for a crisp attachment
const p=await b.newPage();
await p.setViewport({width:1440,height:900,deviceScaleFactor:2});
await p.goto('https://sindrimar02.github.io/brass-preview/',{waitUntil:'networkidle0'});
await sleep(3000);                       // let the curtain lift and the hero settle
await p.evaluate(()=>window.lenis&&window.lenis.scrollTo(0,{immediate:true}));
await sleep(800);
await p.screenshot({path:`${OUT}/brass-preview-landing.png`});

// phone, since the whole pitch is that their menu is unreadable on one
const m=await b.newPage();
await m.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:3});
await m.goto('https://sindrimar02.github.io/brass-preview/',{waitUntil:'networkidle0'});
await sleep(3000);
await m.evaluate(()=>window.lenis&&window.lenis.scrollTo(0,{immediate:true}));
await sleep(800);
await m.screenshot({path:`${OUT}/brass-preview-landing-mobile.png`});
await b.close();
console.log('saved to', OUT);
