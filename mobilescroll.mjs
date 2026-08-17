/* With Lenis running, a nested scroller only works if data-lenis-prevent is on
   it. Prove the panel scrolls and that the PAGE does not move instead. */
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.setViewport({width:360,height:780,isMobile:true,hasTouch:true,deviceScaleFactor:2});
await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
await sleep(1800);
const geo=await p.evaluate(()=>{const r=document.querySelector('.pc-pin').getBoundingClientRect();return{top:Math.round(r.top+scrollY),h:Math.round(r.height)};});
await p.evaluate((y)=>(window.lenis?window.lenis.scrollTo(y,{immediate:true}):window.scrollTo(0,y)), geo.top+Math.round(geo.h*0.10));
await sleep(900);

const before = await p.evaluate(()=>({
  panelTop: document.querySelector('.pc-pin__panel[data-panel="0"]').scrollTop,
  pageY: Math.round(window.scrollY),
  hasPrevent: document.querySelector('.pc-pin__panel[data-panel="0"]').hasAttribute('data-lenis-prevent'),
  overflowY: getComputedStyle(document.querySelector('.pc-pin__panel[data-panel="0"]')).overflowY,
}));

// wheel inside the panel
const box = await p.evaluate(()=>{const r=document.querySelector('.pc-pin__panel[data-panel="0"]').getBoundingClientRect();return{x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
await p.mouse.move(box.x, box.y);
await p.mouse.wheel({deltaY: 300});
await sleep(700);

const after = await p.evaluate(()=>({
  panelTop: Math.round(document.querySelector('.pc-pin__panel[data-panel="0"]').scrollTop),
  pageY: Math.round(window.scrollY),
}));
console.log('before:', JSON.stringify(before));
console.log('after :', JSON.stringify(after));
console.log(after.panelTop > 20 ? 'PASS panel scrolled' : 'FAIL panel did not scroll');
console.log(Math.abs(after.pageY-before.pageY) < 30 ? 'PASS page held still' : 'WARN page scrolled too ('+(after.pageY-before.pageY)+'px)');
await b.close();
