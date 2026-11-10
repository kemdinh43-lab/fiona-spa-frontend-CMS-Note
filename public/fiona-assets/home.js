(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  if (menu && menuButton) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded)); menu.hidden = expanded;
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.focus(); } });
  }
  document.querySelectorAll('.service-explorer').forEach(explorer => {
    const cards = Array.from(explorer.querySelectorAll('.service-card'));
    explorer.querySelectorAll('[data-service-filter]').forEach(button => button.addEventListener('click', () => {
      const group = button.dataset.serviceFilter;
      explorer.querySelectorAll('[data-service-filter]').forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
      cards.forEach(card => { card.hidden = group === 'all' ? card.dataset.selected !== 'true' : card.dataset.category !== group; });
      explorer.querySelector('.services-empty').hidden = cards.some(card => !card.hidden);
    }));
  });
  let opener = null;
  document.querySelectorAll('[data-open-dialog]').forEach(button => button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.openDialog);
    if (!dialog) return; opener = button; dialog.showModal(); document.body.style.overflow = 'hidden';
  }));
  document.querySelectorAll('.treatment-dialog').forEach(dialog => {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus(); });
  });
})();
(() => {
 const hero=document.querySelector('.hero-slider');
 if(hero){
  const slides=[...hero.querySelectorAll('.hero-photo')],dots=[...hero.querySelectorAll('[data-slide]')],pause=hero.querySelector('.hero-pause');
  let index=0,timer=null,userPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const show=n=>{index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('is-active',i===index));dots.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));};
  const stop=()=>{clearInterval(timer);timer=null;};
  const start=()=>{stop();if(!userPaused&&!document.hidden)timer=setInterval(()=>show(index+1),6000);};
  dots.forEach(b=>b.addEventListener('click',()=>{show(Number(b.dataset.slide));start();}));
  const label=()=>{if(!pause)return;pause.textContent=userPaused?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(userPaused));pause.setAttribute('aria-label',document.documentElement.lang.startsWith('vi')?(userPaused?'Tiếp tục trình chiếu':'Tạm dừng trình chiếu'):(userPaused?'Play slideshow':'Pause slideshow'));};
  pause?.addEventListener('click',()=>{userPaused=!userPaused;label();start();});
  hero.addEventListener('mouseenter',stop);hero.addEventListener('mouseleave',start);hero.addEventListener('focusin',stop);hero.addEventListener('focusout',start);document.addEventListener('visibilitychange',start);
  let touchX=0;hero.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});hero.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50){show(index+(dx<0?1:-1));start();}},{passive:true});label();start();
 }
 const links=[...document.querySelectorAll('.gallery-tile a')];
 if(links.length){const d=document.createElement('dialog');d.className='photo-lightbox';d.setAttribute('aria-label',document.documentElement.lang.startsWith('vi')?'Ảnh Fiona':'Fiona photo');d.innerHTML='<button aria-label="Close / Đóng">×</button><img alt=""><p></p>';document.body.append(d);let opener;
 links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();opener=a;d.querySelector('img').src=a.href;d.querySelector('img').alt=a.querySelector('img').alt;d.querySelector('p').textContent=a.querySelector('img').alt;d.showModal();}));d.querySelector('button').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d)d.close();});d.addEventListener('close',()=>opener?.focus());}
})();
(() => {
 const gallery=document.querySelector('.detail-gallery');if(!gallery)return;
 const image=gallery.querySelector('#detail-current-photo'),thumbs=[...gallery.querySelectorAll('[data-detail-photo]')];let index=0;
 const show=n=>{index=(n+thumbs.length)%thumbs.length;image.src=thumbs[index].dataset.detailPhoto;thumbs.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));};
 thumbs.forEach((button,i)=>button.addEventListener('click',()=>show(i)));
 gallery.querySelector('.detail-prev')?.addEventListener('click',()=>show(index-1));gallery.querySelector('.detail-next')?.addEventListener('click',()=>show(index+1));
 gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}});
 let x=0;image.addEventListener('touchstart',e=>{x=e.changedTouches[0].clientX;},{passive:true});image.addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-x;if(Math.abs(dx)>50)show(index+(dx<0?1:-1));},{passive:true});
})();

/* Sparse scroll-linked frangipani accents: no loop, no scroll interception. */
(() => {
 const sections=document.querySelectorAll('.service-menu-section, .service-article-flowers');
 const script=[...document.scripts].find(s=>s.src.includes('/fiona/assets/home.js'));
 if(!sections.length||!script)return;
 sections.forEach(section=>{
 const base=new URL('menu-flowers/',script.src),reduce=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:600px)');
 const layer=document.createElement('div');layer.className='menu-flower-layer';layer.setAttribute('aria-hidden','true');section.append(layer);
 const assets=[{"n": 1, "width": 128.221, "left": -11.554, "top": -14.059}, {"n": 2, "width": 195.938, "left": -79.688, "top": -10.078}, {"n": 3, "width": 191.45, "left": -5.954, "top": -87.863}, {"n": 4, "width": 139.644, "left": -4.9, "top": -21.214}, {"n": 5, "width": 132.139, "left": -22.023, "top": -19.705}, {"n": 6, "width": 237.951, "left": -3.985, "top": -3.226}, {"n": 7, "width": 195.023, "left": -86.936, "top": -98.445}, {"n": 8, "width": 176.124, "left": -37.219, "top": -59.761}];
 // Persistent trajectories replace nearest-flower swapping: each bloom travels through
 // the viewport, fading only at the ends of its path. Time adds a slow natural fall.
 const flowers=Array.from({length:12},(_,i)=>{
  const asset=assets[i%assets.length],frame=document.createElement('span');
  frame.className='menu-flower';frame.dataset.side=i%2?'right':'left';
  frame.style.setProperty('--flower-size',`${[64,46,74,52,58,68,44,60,50,72,56,48][i]}px`);
  const image=document.createElement('img');image.alt='';image.width=1254;image.height=1254;image.decoding='async';image.src=new URL(`flower-${asset.n}.png`,base).href;
  image.style.cssText=`width:${asset.width}%;left:${asset.left}%;top:${asset.top}%;`;frame.append(image);layer.append(frame);
  return {frame,i,x:.04+Math.random()*.92,phase:Math.random(),speed:.72+Math.random()*.55,sway:Math.random()*Math.PI*2,rotation:-45+Math.random()*90};
 });
 let active=false,raf=0,last=0,fall=0,zones=[],zoneWidth=0;
 const readZones=()=>{const rect=section.getBoundingClientRect();zones=[...section.querySelectorAll('.menu-service-top h3,.menu-service-price,.menu-service-content>p,.service-menu-heading,.menu-service-footnote,.service-article h2,.service-article h3,.service-article p,.service-article li,.service-article summary,.service-article .detail-price-row,.service-article .button')].map(e=>{const r=e.getBoundingClientRect();return {left:r.left-8,right:r.right+8,top:r.top-rect.top-5,bottom:r.bottom-rect.top+5};});zoneWidth=innerWidth;};
 readZones();new ResizeObserver(readZones).observe(section);
 const clamp=v=>Math.max(0,Math.min(1,v));
 const draw=now=>{
  raf=0;if(!active||document.hidden||reduce.matches){last=0;return;}
  if(last)fall+=Math.min(now-last,64)/1000*22;
  last=now;
  const rect=section.getBoundingClientRect(),vh=innerHeight,mobile=phone.matches;
  const count=mobile?6:12,travel=vh+240,scroll=-rect.top;
  if(zoneWidth!==innerWidth)readZones();
  const envelope=clamp((vh-rect.top)/230)*clamp((rect.bottom+140)/220);
  flowers.forEach(f=>{
   if(f.i>=count){f.frame.style.opacity='0';return;}
   const phase=((fall*f.speed+scroll*.55+f.phase*travel)%travel+travel)%travel;
   const screen=phase-120;
   const fade=clamp(phase/160)*clamp((travel-phase)/160)*envelope;
   const size=mobile?38:parseFloat(f.frame.style.getPropertyValue('--flower-size'));
   const sway=Math.sin(phase/travel*Math.PI*2+f.sway)*(mobile?14:34);
   const x=Math.max(0,Math.min(innerWidth-size,f.x*(innerWidth-size)+sway));
   const localY=screen-rect.top;
   const cx=x+size/2,cy=localY+size/2;
   let clearance=1;
   zones.forEach(z=>{const dx=Math.max(z.left-cx,0,cx-z.right),dy=Math.max(z.top-cy,0,cy-z.bottom);clearance=Math.min(clearance,clamp(Math.hypot(dx,dy)/(size*.85+18)));});
   f.frame.style.left=`${x}px`;f.frame.style.right='auto';
   f.frame.style.top=`${localY}px`;
   f.frame.style.opacity=String(fade*((mobile?.065:.07)+clearance*(mobile?.27:.34)));
   f.frame.style.transform=`rotate(${f.rotation+phase/travel*65}deg)`;
  });
  raf=requestAnimationFrame(draw);
 };
 const start=()=>{if(active&&!raf&&!document.hidden&&!reduce.matches)raf=requestAnimationFrame(draw);};
 const stop=()=>{cancelAnimationFrame(raf);raf=0;last=0;};
 new IntersectionObserver(entries=>{
  active=entries[0].isIntersecting;
  if(active)start();else {stop();flowers.forEach(f=>f.frame.style.opacity='0');}
 },{rootMargin:'180px 0px'}).observe(section);
 reduce.addEventListener('change',()=>{if(reduce.matches){stop();flowers.forEach(f=>f.frame.style.opacity='0');}else start();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
 });
})();

/* Accessible, collapsible contact shortcuts. */
(() => {
 const widget=document.querySelector('.contact-widget'),toggle=widget?.querySelector('.contact-toggle'),options=widget?.querySelector('.contact-options');
 if(!toggle||!options)return;
 const setOpen=open=>{options.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?toggle.dataset.closeLabel:toggle.dataset.openLabel);};
 toggle.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'));
 widget.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(false);toggle.focus();}});
 options.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
})();

/* Reels: four columns on desktop; one at a time with arrows on mobile. */
document.querySelectorAll('[data-fiona-videos]').forEach(carousel=>{
 const track=carousel.querySelector('.fiona-video-track'),slides=[...track.children],mobile=matchMedia('(max-width:760px)'),reduce=matchMedia('(prefers-reduced-motion: reduce)');let index=0,lastIndex=0,pending=false,settleTimer;
 const frames=slides.map(s=>s.querySelector('iframe'));
 const fit=()=>{frames.forEach((frame,i)=>{const w=Math.round(slides[i].clientWidth);if(w<1)return;const src=new URL(frame.dataset.originalSrc||frame.src);frame.dataset.originalSrc=frame.dataset.originalSrc||frame.src;src.searchParams.set('width',String(w));src.searchParams.set('height',String(Math.round(w*476/267)));if(frame.src!==src.href)frame.src=src.href;});};
 const stopPrevious=()=>{if(index!==lastIndex&&mobile.matches){const frame=frames[lastIndex];frame.src=frame.src;lastIndex=index;}};
 const announce=()=>{carousel.querySelector('.video-carousel-status').textContent=`Video ${index+1} / ${slides.length}`;};
 const show=delta=>{index=(index+delta+slides.length)%slides.length;stopPrevious();pending=true;clearTimeout(settleTimer);track.scrollTo({left:index*track.clientWidth,behavior:reduce.matches?'instant':'smooth'});announce();settleTimer=setTimeout(()=>{pending=false;},450);};
 carousel.querySelector('.video-prev').addEventListener('click',()=>show(-1));carousel.querySelector('.video-next').addEventListener('click',()=>show(1));
 track.addEventListener('scroll',()=>{if(!mobile.matches||pending)return;const next=Math.round(track.scrollLeft/track.clientWidth);if(next!==index){index=next;stopPrevious();announce();}},{passive:true});
 track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(e.key==='ArrowRight'?1:-1);}});
 let previousWidth=0;new ResizeObserver(()=>{const width=track.clientWidth;if(width===previousWidth)return;previousWidth=width;fit();track.scrollTo({left:mobile.matches?index*width:0,behavior:'instant'});}).observe(track);announce();
});

/* Photo mosaic opens the service's actual gallery. */
(()=>{const g=document.querySelector('[data-product-gallery]');if(!g)return;const d=g.querySelector('dialog'),img=d.querySelector('img'),count=d.querySelector('.product-lightbox-count'),photos=JSON.parse(g.querySelector('.product-gallery-data').textContent);let index=0,opener;function show(i){index=(i+photos.length)%photos.length;img.src=photos[index];count.textContent=(index+1)+' / '+photos.length;}g.querySelectorAll('[data-gallery-index]').forEach(b=>b.addEventListener('click',()=>{opener=b;show(Number(b.dataset.galleryIndex));d.showModal()}));d.querySelector('.product-lightbox-close').addEventListener('click',()=>d.close());d.querySelector('.product-lightbox-prev').addEventListener('click',()=>show(index-1));d.querySelector('.product-lightbox-next').addEventListener('click',()=>show(index+1));d.addEventListener('click',e=>{if(e.target===d)d.close()});d.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(index+1);if(e.key==='ArrowLeft')show(index-1)});d.addEventListener('close',()=>opener?.focus());})();

/* Keep the displayed menu price and booking duration in sync. */
(()=>{
 const picker=document.querySelector('[data-duration-picker]');if(!picker)return;
 const select=picker.querySelector('select'),price=picker.querySelector('output'),link=document.querySelector('[data-duration-booking]');
 const sync=()=>{const option=select.selectedOptions[0];if(!option)return;price.textContent=option.dataset.price||'';if(link){const url=new URL(link.href);url.searchParams.set('minutes',option.value);link.href=url.href;}};
 select.addEventListener('change',sync);sync();
})();
