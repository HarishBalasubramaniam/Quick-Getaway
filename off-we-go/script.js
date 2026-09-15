(()=>{
 const chapters=[...document.querySelectorAll('.chapter')], dots=[...document.querySelectorAll('nav i')];
 const layers=['desk','flight','arrival','bag','room','lock'].map(s=>document.querySelector('.'+s));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let offsets=[],queued=false;
 const clamp=n=>Math.max(0,Math.min(1,n)), ease=n=>n*n*(3-2*n);
 function measure(){offsets=chapters.map(c=>c.getBoundingClientRect().top+scrollY);schedule()}
 function render(){
  queued=false;let i=0;while(i<offsets.length-1&&scrollY>=offsets[i+1])i++;
  const raw=i<5?clamp((scrollY-offsets[i])/(offsets[i+1]-offsets[i])):0;
  const t=reduced.matches?(raw>.5?1:0):ease(clamp((raw-.22)/.66));
  const active=Math.min(5,i+(t>.5?1:0));
  document.body.dataset.scene=active;
  document.body.style.setProperty('--orbit',((i+t)*60)+'deg');
  layers.forEach(l=>{l.style.opacity='0';l.style.transform='none';l.style.visibility='hidden'});
  const mobile=innerWidth<=720;
  const draw=(n,opacity,scale,origin)=>{
    const l=layers[n];l.style.visibility='visible';l.style.opacity=opacity;
    l.style.transformOrigin=origin;l.style.transform='scale('+scale+')';
  };
  const origins=[mobile?'76% 55%':'72% 49%','78% 54%','72% 42%','65% 50%','60% 50%','50% 50%'];
  const zooms=[2.65,1.18,1.9,1.12,1.12,1];
  draw(i,1,reduced.matches?1:1+(zooms[i]-1)*t,origins[i]);
  if(i<5){
    const fade=ease(clamp((t-.28)/.72));
    draw(i+1,fade,reduced.matches?1:1+.18*(1-t),origins[i+1]);
    layers[i].style.opacity=1-fade;
  }
  // Arrival rises into the sky, dissolves to night, then reveals the street.
  if(i===2&&!reduced.matches){
    const rise=ease(clamp(t/.48));
    const dissolve=ease(clamp((t-.38)/.22));
    const reveal=ease(clamp((t-.58)/.42));
    draw(2,1,1+5*rise,'58% 2%');
    draw(3,dissolve,6-5*reveal,'62% 2%');
    // Keep the outgoing image opaque under the incoming sky to avoid a black dip.
    if(dissolve===1)layers[2].style.visibility='hidden';
  }
  chapters.forEach((c,n)=>{
    c.classList.toggle('active',n===active);
    const rect=c.getBoundingClientRect();
    const visible=rect.bottom>0&&rect.top<innerHeight;
    c.firstElementChild.style.opacity=visible?'1':'0';
    c.firstElementChild.style.transform='none';
  });
  dots.forEach((d,n)=>d.classList.toggle('on',n<=active));
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(render)}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);
 reduced.addEventListener('change',measure);document.fonts.ready.then(measure);
 const img=document.querySelector('.flight-photo');
 img.addEventListener('error',()=>{if(!img.dataset.retry){img.dataset.retry='1';img.src='https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85'}});
 const b=document.querySelector('#unlock'),p=document.querySelector('.pass');
 b.addEventListener('click',()=>{if(!p.hidden)return;p.hidden=false;b.disabled=true;b.textContent='LOCKED IN ✓';measure();p.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'center'})});
 measure();
})();