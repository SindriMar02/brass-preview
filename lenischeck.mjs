/* Lenis must not break what the page is built on: sticky pinning, CSS
   scroll-timelines, and the observers. Prove each one with Lenis running. */
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.setViewport({width:1440,height:900});
await p.goto((process.env.BASE||'http://localhost:8762')+'/',{waitUntil:'networkidle0'});
await sleep(2200);

const active = await p.evaluate(()=>({ lenis: typeof window.lenis === 'object' && !!window.lenis }));
console.log('lenis running:', active.lenis);

// real scroll position must advance (transform-based libs leave it at 0)
await p.evaluate(()=>window.lenis.scrollTo(3000,{immediate:true}));
await sleep(600);
const real = await p.evaluate(()=>({
  scrollY: Math.round(window.scrollY),
  docEl: Math.round(document.documentElement.scrollTop),
  bodyTransform: getComputedStyle(document.body).transform,
}));
console.log('native scroll advanced:', JSON.stringify(real));

// sticky hero must still pin, scroll-timeline must still scrub, observers must fire
const geo = await p.evaluate(()=>{const r=document.querySelector('.pc-pin').getBoundingClientRect();return {top:Math.round(r.top+scrollY),h:Math.round(r.height)};});
await p.evaluate((y)=>window.lenis.scrollTo(y,{immediate:true}), geo.top+Math.round(geo.h*0.45));
await sleep(900);
const mid = await p.evaluate(()=>{
  const st=document.querySelector('[data-stage]');
  const r=st.getBoundingClientRect();
  const strip=getComputedStyle(document.querySelector('.pc-stack')).backgroundColor;
  return {
    pinnedAtTop: Math.abs(r.top) < 2,
    activeCourse: st.getAttribute('data-active'),
    count: document.querySelector('[data-count]').textContent,
    stackGround: strip,
    revealed: document.querySelectorAll('[data-reveal].is-in').length,
    barOn: document.querySelector('[data-bar]').classList.contains('is-on'),
  };
});
console.log('with lenis mid-pin:', JSON.stringify(mid));
await b.close();
