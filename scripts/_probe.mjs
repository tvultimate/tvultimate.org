import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';
const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const p=await b.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
await p.goto('http://localhost:4399/',{waitUntil:'load'});
await p.waitForTimeout(800);
const shot=PNG.sync.read(await p.screenshot({fullPage:true}));
const t=await p.evaluate(()=>{
  const el=[...document.querySelectorAll('a')].find(a=>a.textContent.trim().startsWith('Battle of Idaho')&&!a.className);
  if(!el)return null;
  const r=el.getBoundingClientRect();
  const chain=[];let n=el;
  while(n&&n!==document.documentElement){const cs=getComputedStyle(n);
    chain.push({el:n.tagName+'.'+n.className,bg:cs.backgroundColor,bi:cs.backgroundImage.slice(0,60),op:cs.opacity,filter:cs.filter,mix:cs.mixBlendMode});
    n=n.parentElement;}
  return {r:{x:r.x,y:r.y+scrollY,w:r.width,h:r.height},color:getComputedStyle(el).color,chain};
});
console.log('rect',JSON.stringify(t.r),'color',t.color);
for(const c of t.chain)console.log(' ',c.el,'| bg',c.bg,'| bi',c.bi,'| op',c.op,'| filter',c.filter,'| mix',c.mix);
const px=(x,y)=>{const i=(shot.width*Math.round(y)+Math.round(x))<<2;return `rgb(${shot.data[i]},${shot.data[i+1]},${shot.data[i+2]})`};
console.log('left-mid',px(t.r.x+1,t.r.y+t.r.h/2),'right-mid',px(t.r.x+t.r.w-1,t.r.y+t.r.h/2));
console.log('top-c',px(t.r.x+t.r.w/2,t.r.y+1),'bot-c',px(t.r.x+t.r.w/2,t.r.y+t.r.h-1));
console.log('outside-left',px(t.r.x-3,t.r.y+t.r.h/2),'above',px(t.r.x+t.r.w/2,t.r.y-3));
await b.close();
