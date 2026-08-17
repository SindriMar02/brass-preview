/* On a phone the panel fills the screen. Once it is scrolled to its end, does
   the PAGE continue, or is the finger trapped? */
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.setViewport({width:360,height:780,isMobile:true,hasTouch:true,deviceScaleFactor:2});
await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
await sleep(1800);
const geo=await p.evaluate(()=>{const r=document.querySelector('.pc-pin').getBoundingClientRect();return{top:Math.round(r.top+scrollY),h:Math.round(r.height)};});
await p.evaluate((v)=>(window.lenis?window.lenis.scrollTo(v,{immediate:true}):scrollTo(0,v)), geo.top+200);
await sleep(900);

const box = await p.evaluate(()=>{const r=document.querySelector('.pc-pin__panel[data-panel="0"]').getBoundingClientRect();return{x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
await p.mouse.move(box.x, box.y);

// exhaust the panel's own scroll
for (let i=0;i<6;i++){ await p.mouse.wheel({deltaY:200}); await sleep(180); }
await sleep(600);
const mid = await p.evaluate(()=>({
  panelTop: Math.round(document.querySelector('.pc-pin__panel[data-panel="0"]').scrollTop),
  panelMax: Math.round(document.querySelector('.pc-pin__panel[data-panel="0"]').scrollHeight - document.querySelector('.pc-pin__panel[data-panel="0"]').clientHeight),
  pageY: Math.round(window.scrollY),
}));
// keep going with the cursor still inside the panel
for (let i=0;i<5;i++){ await p.mouse.wheel({deltaY:300}); await sleep(180); }
await sleep(800);
const end = await p.evaluate(()=>({ pageY: Math.round(window.scrollY) }));
console.log('panel exhausted:', JSON.stringify(mid));
console.log('page after further scrolling inside panel:', end.pageY);
console.log(end.pageY > mid.pageY + 100 ? 'PASS page continues (scroll chains)' : '*** TRAPPED: page will not move while the finger is in the panel ***');
await b.close();
