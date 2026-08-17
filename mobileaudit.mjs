import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const BASE=process.env.BASE||'https://sindrimar02.github.io/brass-preview';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});

for (const vp of [{w:390,h:844},{w:360,h:780}]) {
  const p=await b.newPage();
  await p.setViewport({width:vp.w,height:vp.h,isMobile:true,hasTouch:true,deviceScaleFactor:2});
  await p.goto(BASE+'/',{waitUntil:'networkidle0'});
  await sleep(2200);
  // walk so lazy content and reveals fire
  const H=await p.evaluate(()=>document.body.scrollHeight);
  for(let y=0;y<H;y+=500){ await p.evaluate((v)=>(window.lenis?window.lenis.scrollTo(v,{immediate:true}):scrollTo(0,v)),y); await sleep(120); }
  await p.evaluate(()=>(window.lenis?window.lenis.scrollTo(0,{immediate:true}):scrollTo(0,0))); await sleep(500);

  const r = await p.evaluate(() => {
    const out={};
    out.horizontalOverflow = document.documentElement.scrollWidth - window.innerWidth;
    out.viewportMeta = !!document.querySelector('meta[name="viewport"][content*="width=device-width"]');
    // tap targets
    const small=[];
    document.querySelectorAll('a,button,input,[role="button"]').forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.width===0&&r.height===0) return;
      if(r.height<40||r.width<40) small.push((el.textContent||el.tagName).trim().slice(0,28)+` ${Math.round(r.width)}x${Math.round(r.height)}`);
    });
    out.tapTargetsUnder40 = small;
    // tiny text
    const tiny=[];
    document.querySelectorAll('p,span,a,li,dd,dt,h1,h2,h3').forEach(el=>{
      if(!el.textContent.trim()) return;
      const fs=parseFloat(getComputedStyle(el).fontSize);
      if(fs<11) tiny.push(el.textContent.trim().slice(0,26)+` ${fs}px`);
    });
    out.textUnder11px = [...new Set(tiny)].slice(0,8);
    out.imagesMissingAlt = [...document.images].filter(i=>!i.hasAttribute('alt')).length;
    out.h1Count = document.querySelectorAll('h1').length;
    out.langAttr = document.documentElement.lang;
    out.titleLen = document.title.length;
    out.hasSkipLink = !!document.querySelector('.pc-skip');
    out.formLabels = [...document.querySelectorAll('input')].every(i=>!!document.querySelector(`label[for="${i.id}"]`));
    return out;
  });
  console.log(`\n=== ${vp.w}x${vp.h} ===`);
  for (const [k,v] of Object.entries(r)) console.log(`${k}: ${Array.isArray(v)? (v.length? JSON.stringify(v):'none') : v}`);
  await p.close();
}
await b.close();
