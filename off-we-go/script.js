(()=>{
 const chapters=[...document.querySelectorAll('.chapter')],dots=[...document.querySelectorAll('nav i')];
 const layers=['desk','flight','bag','room','lock'].map(s=>document.querySelector('.'+s));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>n*n*(3-2*n);
 let offsets=[],queued=false,cameraY=scrollY,lastFrame=0;
 function measure(){offsets=chapters.map(c=>c.getBoundingClientRect().top+scrollY);cameraY=scrollY;schedule()}
 // Map an image-space feature to the viewport after object-fit: cover.
 function focal(selector,x,y,px=.5,py=.5){
  const img=document.querySelector(selector),w=innerWidth,h=innerHeight;
  if(!img.naturalWidth)return (x*100)+'% '+(y*100)+'%';
  const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight);
  const iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;
  return (clamp((x*iw-(iw-w)*px)/w)*100)+'% '+(clamp((y*ih-(ih-h)*py)/h)*100)+'%';
 }
 function render(now){
  queued=false;
  const dt=lastFrame?Math.min(50,now-lastFrame):16;lastFrame=now;
  cameraY=reduced.matches?scrollY:cameraY+(scrollY-cameraY)*(1-Math.exp(-dt/95));
  if(Math.abs(scrollY-cameraY)<.2)cameraY=scrollY;
  let i=0;const last=chapters.length-1;
  while(i<last&&cameraY>=offsets[i+1])i++;
  const raw=i<last?clamp((cameraY-offsets[i])/(offsets[i+1]-offsets[i])):0;
  const t=reduced.matches?(raw>.5?1:0):ease(clamp((raw-.12)/.76));
  const active=Math.min(last,i+(t>.5?1:0));
  document.body.dataset.scene=active;
  document.body.style.setProperty('--orbit',((i+t)*75)+'deg');
  layers.forEach(l=>{l.style.opacity='0';l.style.visibility='hidden';l.style.transform='none'});
  const draw=(n,opacity,scale,origin)=>{
   const l=layers[n];l.style.visibility='visible';l.style.opacity=opacity;
   l.style.transformOrigin=origin;l.style.transform='scale('+scale+')';
  };
  const mobile=innerWidth<=720;
  const origins=[mobile?'76% 55%':'72% 49%',focal('.flight-photo',.78,.35,mobile?.74:.72),focal('.night-photo',.91,.32,.5,0),focal('.room-photo',.48,.24),'50% 50%'];
  draw(i,1,1,origins[i]);
  if(i<last){
   if(reduced.matches){draw(i+1,t,1,origins[i+1])}
   else {
    const push=t;
    const fade=ease(clamp((t-.22)/.62));
    const pull=ease(clamp((t-.22)/.78));
    const zoom=[2.3,3.6,2.6,3.2][i];
    draw(i,1,1+(zoom-1)*push,origins[i]);
    // Sun fills the view, then the dark sky recedes into the night walk.
    const incomingOrigin=i===1?focal('.night-photo',.62,.035,.5,0):origins[i+1];
    const incomingZoom=i===1?2.8:i===2?1.35:1.12;
    draw(i+1,fade,i===3?1:1+(incomingZoom-1)*(1-pull),incomingOrigin);
    if(fade===1)layers[i].style.visibility='hidden';
   }
  }
  chapters.forEach((c,n)=>{
   c.classList.toggle('active',n===active);
   const copy=c.firstElementChild;
   const out=1-ease(clamp(t/.46)),incoming=ease(clamp((t-.62)/.38));
   const opacity=n===i?(i===last?1:out):n===i+1?incoming:0;
   copy.style.opacity=opacity;
   copy.style.visibility=opacity>.001?'visible':'hidden';
   copy.inert=n!==active||opacity<.8;
  });
  dots.forEach((d,n)=>d.classList.toggle('on',n<=active));
  if(cameraY!==scrollY)schedule();
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(render)}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);
 reduced.addEventListener('change',measure);document.fonts.ready.then(measure);
 document.querySelectorAll('.world img').forEach(img=>img.addEventListener('load',schedule));
 const flight=document.querySelector('.flight-photo');
 flight.addEventListener('error',()=>{if(!flight.dataset.retry){flight.dataset.retry='1';flight.src='https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85'}});
 const button=document.querySelector('#unlock'),dialog=document.querySelector('#boarding-dialog'),close=document.querySelector('#close-pass');
 const final=document.querySelector('.final'),padlock=document.querySelector('.padlock'),main=document.querySelector('main');
 let opening=false,timer;
 button.addEventListener('click',()=>{
  if(opening||dialog.open)return;
  opening=true;button.disabled=true;
  document.body.classList.add('revealing');
  final.classList.add('unlocking');padlock.setAttribute('aria-label','Unlocking golden padlock');
  main.inert=true;
  timer=setTimeout(()=>{
   dialog.showModal();close.focus();opening=false;
  },reduced.matches?0:1450);
 });
 function reset(){
  clearTimeout(timer);opening=false;main.inert=false;
  document.body.classList.remove('revealing');final.classList.remove('unlocking');
  padlock.setAttribute('aria-label','Locked golden padlock');button.disabled=false;
  button.focus({preventScroll:true});schedule();
 }
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',reset);
 measure();
})();