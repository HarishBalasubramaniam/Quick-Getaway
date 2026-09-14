(function(){
  const chapters=[...document.querySelectorAll(".chapter")];
  const dots=[...document.querySelectorAll(".tour-progress i")];
  const button=document.querySelector("#lock-in-button");
  const reveal=document.querySelector("#boarding-reveal");
  function updateStory(){
    const middle=innerHeight*.5;
    let index=0,closest=Infinity;
    chapters.forEach((chapter,i)=>{const d=Math.abs(chapter.getBoundingClientRect().top-middle);if(d<closest){closest=d;index=i;}});
    document.body.dataset.scene=String(index);
    chapters.forEach((chapter,i)=>chapter.classList.toggle("chapter--active",i===index));
    dots.forEach((dot,i)=>dot.classList.toggle("is-active",i<=index));
  }
  addEventListener("scroll",updateStory,{passive:true});addEventListener("resize",updateStory);updateStory();
  button?.addEventListener("click",()=>{reveal.hidden=false;button.hidden=true;requestAnimationFrame(()=>reveal.classList.add("is-visible"));setTimeout(()=>reveal.scrollIntoView({behavior:"smooth",block:"center"}),120);});
})();