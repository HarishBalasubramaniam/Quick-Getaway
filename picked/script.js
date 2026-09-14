(function(){
  const chapters=[...document.querySelectorAll(".chapter")];
  const dots=[...document.querySelectorAll(".tour-progress i")];
  const button=document.querySelector("#lock-in-button");
  const reveal=document.querySelector("#boarding-reveal");
  let current=0;
  function setChapter(index){
    if(index===current&&document.body.dataset.scene!==undefined)return;
    document.body.dataset.direction=index>=current?"forward":"back";
    current=index;
    document.body.dataset.scene=String(index);
    chapters.forEach((chapter,i)=>chapter.classList.toggle("chapter--active",i===index));
    dots.forEach((dot,i)=>dot.classList.toggle("is-active",i<=index));
  }
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible)setChapter(chapters.indexOf(visible.target));
  },{threshold:[.25,.45,.65],rootMargin:"-12% 0px -12% 0px"});
  chapters.forEach((chapter,index)=>{observer.observe(chapter);if(index===0)chapter.classList.add("chapter--active");});
  setChapter(0);
  button?.addEventListener("click",()=>{
    reveal.hidden=false;button.hidden=true;
    requestAnimationFrame(()=>reveal.classList.add("is-visible"));
    setTimeout(()=>reveal.scrollIntoView({behavior:"smooth",block:"center"}),120);
  });
})();