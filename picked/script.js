(function(){
  const chapters=[...document.querySelectorAll(".chapter")];
  const dots=[...document.querySelectorAll(".tour-progress i")];
  function updateStory(){
    const height=document.documentElement.scrollHeight-innerHeight;
    const progress=height?scrollY/height:0;
    const index=Math.min(chapters.length-1,Math.floor(progress*chapters.length+.001));
    document.body.dataset.chapter=String(index);
    chapters.forEach((chapter,i)=>chapter.classList.toggle("chapter--active",i===index));
    dots.forEach((dot,i)=>dot.classList.toggle("is-active",i<=index));
  }
  addEventListener("scroll",updateStory,{passive:true});
  addEventListener("resize",updateStory);
  updateStory();
})();
