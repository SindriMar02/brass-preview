/* wheel OVER the prevented panel (native scroll), then wheel OFF it (Lenis).
   If Lenis's internal target went stale, the page snaps backward or freezes. */
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.setViewport({width:1440,height:900});
await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
await sleep(1800);
const geo=await p.evaluate(()=>{const r=document.querySelector('.pc-pin').getBoundingClientRect();return{top:Math.round(r.top+scrollY),h:Math.round(r.height)};});
await p.evaluate((v)=>window.lenis.scrollTo(v,{immediate:true}), geo.top+300);
await sleep(800);

const s0 = await p.evaluate(()=>({y:Math.round(scrollY), lenisTarget:Math.round(window.lenis.targetScroll), animated:Math.round(window.lenis.animatedScroll)}));
// 3 ticks with the cursor over the panel
await p.mouse.move(1000,450);
for (let i=0;i<3;i++){ await p.mouse.wheel({deltaY:300}); await sleep(250); }
await sleep(700);
const s1 = await p.evaluate(()=>({y:Math.round(scrollY), lenisTarget:Math.round(window.lenis.targetScroll), animated:Math.round(window.lenis.animatedScroll)}));
// now move OFF the panel and give one tick
await p.mouse.move(200,450);
await p.mouse.wheel({deltaY:300});
await sleep(900);
const s2 = await p.evaluate(()=>({y:Math.round(scrollY), lenisTarget:Math.round(window.lenis.targetScroll)}));

console.log('start        ', JSON.stringify(s0));
console.log('after panel  ', JSON.stringify(s1));
console.log('after off    ', JSON.stringify(s2));
console.log(s2.y < s1.y ? `*** SNAPS BACK ${s1.y - s2.y}px ***` : 'no snap-back');
console.log('lenis drift while prevented:', s1.y - s1.lenisTarget, 'px');
await b.close();
