(function(){
  const canvas=document.querySelector("#scene"), panel=document.querySelector("#panel"), eyebrow=document.querySelector("#eyebrow"), title=document.querySelector("#title"), copy=document.querySelector("#copy"), button=document.querySelector("#next"), hint=document.querySelector("#hint"), progress=document.querySelector("#progress");
  const saved=(()=>{try{return JSON.parse(localStorage.getItem("poutyVerdict")||"null")}catch(e){return null}})();
  const categoryTitles={romantic:"Be Romantic",berserk:"Go Berserk",culture:"Going Antique, but feed me first!"};
  const dateText=saved? `${saved.departureDate.replace(" September "," Sept ")} — ${saved.returnDate}`:"24 Sept — 28 September 2026";
  const mood=categoryTitles[saved&&saved.category]||"Go Berserk";
  const wishes=saved&&saved.subtopics&&saved.subtopics.length?saved.subtopics:["Shopping Spree","Street Food Hunt","Night Markets","Café Hopping"];
  const chosenRoom=saved&&saved.stay?`Room ${saved.stay}`:"Room E";
  const steps=[
    {eyebrow:"A little rewind",title:"This is how<br><em>you got here.</em>",copy:"Every choice you made was a tiny clue. Let’s follow them from the beginning.",button:"Start from our dates",hint:"One little click at a time. No skipping the cute parts. 😉"},
    {eyebrow:"First, we found the window",title:"The dates<br><em>fell into place.</em>",copy:`${dateText}. Late September, just enough time to disappear together.`,button:"Then you picked the vibe",hint:"A calendar date became a little promise."},
    {eyebrow:"Then came the mood",title:"You said:<br><em>“${mood}.”</em>",copy:"Not a quiet little getaway. You wanted a city that stays awake with us.",button:"Show me the details",hint:"The plan was officially about to get deliciously chaotic."},
    {eyebrow:"You gave me the clues",title:"You wanted<br><em>all of this.</em>",copy:wishes.join(" · ")+". A perfectly suspicious list of priorities.",button:"And then there was the room",hint:"Every little preference narrowed down the secret."},
    {eyebrow:"The final choice was yours",title:`${chosenRoom}<br><em>won you over.</em>`,copy:"The whirlpool room. Because apparently a normal hotel room was never going to be enough for you. 🛁",button:"Unlock where it all leads",hint:"One key. One final reveal."},
    {eyebrow:"The final clue is ready",title:"Everything points<br><em>somewhere magical.</em>",copy:"The dates, the city mood, the food, the shopping and Room E have all led us to one last little secret.",button:"Take me there",hint:"Hold on — we’re about to fly straight into it. ✈️"}
  ];
  progress.innerHTML=steps.map(()=>"<i></i>").join(""); let step=-1;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x1b0c08,.055);const camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(0,1.3,8);
  const root=new THREE.Group();scene.add(root);const gold=new THREE.MeshStandardMaterial({color:0xd8a75c,roughness:.32,metalness:.72}),leather=new THREE.MeshStandardMaterial({color:0x552619,roughness:.46,metalness:.14}),paper=new THREE.MeshStandardMaterial({color:0xe7cfaa,roughness:.7});
  scene.add(new THREE.HemisphereLight(0xffd1a3,0x140806,2.2));const keyLight=new THREE.PointLight(0xffb466,38,18);keyLight.position.set(-3,4,5);scene.add(keyLight);const rim=new THREE.PointLight(0xd99a53,25,14);rim.position.set(4,1,-1);scene.add(rim);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(7,64),new THREE.MeshStandardMaterial({color:0x1a0a07,roughness:.7,metalness:.1}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.55;scene.add(floor);
  function box(w,h,d,mat,x,y,z,parent=root){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d,.12,.08,.12),mat);m.position.set(x,y,z);parent.add(m);return m}
  const suitcase=new THREE.Group();root.add(suitcase);box(3,1.7,.72,leather,0,-.08,0,suitcase);const lid=box(3,1.53,.2,leather,0,.02,.47,suitcase);box(3.12,.12,.12,gold,0,-.78,.48,suitcase);box(3.12,.1,.12,gold,0,.65,.48,suitcase);const tag=new THREE.Mesh(new THREE.BoxGeometry(.78,.48,.05),paper);tag.position.set(1.05,-.05,.58);tag.rotation.z=-.13;suitcase.add(tag);
  const calendar=new THREE.Group();calendar.visible=false;root.add(calendar);const calendarBoard=box(2.55,2.1,.12,new THREE.MeshStandardMaterial({color:0xe9d2ad,roughness:.58}),-1.7,.2,-.35,calendar);const header=box(2.55,.36,.15,new THREE.MeshStandardMaterial({color:0xb94d40,roughness:.48}),-1.7,1.05,-.25,calendar);for(let row=0;row<3;row++)for(let col=0;col<4;col++){const dot=new THREE.Mesh(new THREE.CircleGeometry(.12,16),new THREE.MeshBasicMaterial({color:(row===1&&col===1)?0xd8a75c:0x3b1d17}));dot.position.set(-2.4+col*.47,.55-row*.46,-.44);calendar.add(dot)}
  const bagGroup=new THREE.Group();bagGroup.visible=false;root.add(bagGroup);[[-1.6,-.75,.1,.75,.95,0xcd6d49],[1.55,-.85,.25,.68,.76,0x706c9a],[1.15,-.35,-.55,.5,.6,0x8a5636]].forEach(a=>{box(a[3],a[4],.28,new THREE.MeshStandardMaterial({color:a[5],roughness:.55,metalness:.06}),a[0],a[1],a[2],bagGroup);const h=new THREE.Mesh(new THREE.TorusGeometry(a[3]*.22,.035,8,18),gold);h.position.set(a[0],a[1]+a[4]/2,a[2]);bagGroup.add(h)});
  const wishesGroup=new THREE.Group();wishesGroup.visible=false;root.add(wishesGroup);wishes.slice(0,4).forEach((wish,index)=>{const ticket=box(1.05,.62,.05,paper,-1.75+(index%2)*1.2,.85-Math.floor(index/2)*.85,-.2,wishesGroup);ticket.rotation.z=(index-1.5)*.08;const seal=new THREE.Mesh(new THREE.CircleGeometry(.1,16),new THREE.MeshBasicMaterial({color:index%2?0xc7655c:0xd8a75c}));seal.position.set(ticket.position.x+.32,ticket.position.y-.12,-.25);wishesGroup.add(seal)});
  const keyGroup=new THREE.Group();keyGroup.visible=false;root.add(keyGroup);const ring=new THREE.Mesh(new THREE.TorusGeometry(.32,.08,12,32),gold);ring.position.set(1.6,.45,.35);const shaft=new THREE.Mesh(new THREE.BoxGeometry(.16,1.25,.12),gold);shaft.position.set(1.6,-.3,.35);box(.42,.18,.14,gold,1.76,-.72,.35,keyGroup);keyGroup.add(ring,shaft);
  const city=new THREE.Group();city.visible=false;root.add(city);for(let x=-3;x<=3;x+=.8){for(let z=-1.5;z<=1.5;z+=.8){const h=.3+Math.random()*1.55;box(.48,h,.48,new THREE.MeshStandardMaterial({color:0x45211a,roughness:.55,metalness:.15,emissive:0x160804,emissiveIntensity:.3}),x,-1.35+h/2,z,city);if(Math.random()>.55)box(.06,.07,.5,new THREE.MeshStandardMaterial({color:0xf4b45f,emissive:0xf4a53d,emissiveIntensity:1.3}),x,-1.35+h*.55,z+.245,city)}}const moon=new THREE.Mesh(new THREE.SphereGeometry(.42,24,24),new THREE.MeshBasicMaterial({color:0xffd083}));moon.position.set(2.2,1.8,-1.8);city.add(moon);
  const flight=new THREE.Group();flight.visible=false;scene.add(flight);
  const portal=new THREE.Mesh(new THREE.TorusGeometry(1.45,.045,12,64),new THREE.MeshBasicMaterial({color:0xd8a75c,transparent:true,opacity:.85}));portal.position.set(0,.15,-1.7);flight.add(portal);
  const plane=new THREE.Group();const fuselage=new THREE.Mesh(new THREE.ConeGeometry(.11,.9,12),new THREE.MeshStandardMaterial({color:0xf9edda,roughness:.25,metalness:.4}));fuselage.rotation.x=Math.PI/2;const wing=new THREE.Mesh(new THREE.BoxGeometry(1.05,.035,.22),gold);plane.add(fuselage,wing);plane.position.set(-3,-.7,2);plane.rotation.z=-.18;flight.add(plane);
  let travelling=false,arrived=false,travelStart=0;
  let targetRotation=.18,drag=false,lastX=0;canvas.addEventListener("pointerdown",e=>{drag=true;lastX=e.clientX});addEventListener("pointerup",()=>drag=false);addEventListener("pointermove",e=>{if(!drag)return;targetRotation+=(e.clientX-lastX)*.008;lastX=e.clientX});
  function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}addEventListener("resize",resize);resize();
  function selectStep(index){const s=steps[index];panel.classList.add("is-changing");setTimeout(()=>{eyebrow.textContent=s.eyebrow;title.innerHTML=s.title;copy.textContent=s.copy;button.innerHTML=`${s.button} <span aria-hidden="true">→</span>`;hint.textContent=s.hint;button.classList.toggle("dossier__button--final",index===steps.length-1);progress.querySelectorAll("i").forEach((dot,n)=>dot.classList.toggle("is-active",n<=index));panel.classList.remove("is-changing")},230);
    calendar.visible=index===1;bagGroup.visible=index===2;wishesGroup.visible=index===3;keyGroup.visible=index===4;city.visible=index>=5;lid.rotation.x=index>=2?-.52:0;targetRotation=index>=5?-.28:.18;keyLight.color.set(index>=5?0xff8b3d:0xffb466);
  }
  function arriveInBangkok(){
    travelling=true;travelStart=performance.now();flight.visible=true;city.visible=true;calendar.visible=false;bagGroup.visible=false;wishesGroup.visible=false;keyGroup.visible=false;
    panel.classList.add("is-changing");button.disabled=true;hint.textContent="";
  }
  function showArrival(){
    panel.classList.remove("is-changing");eyebrow.textContent="Destination unlocked";title.innerHTML="We’re going to<br><em>Bangkok.</em>";copy.textContent="City lights, midnight street food, shopping bags — and your hand in mine. The perfect recipe, isn’t it?";button.innerHTML="Secret secured <span aria-hidden=true>♥</span>";button.classList.add("dossier__button--final");hint.textContent="Now all you have to do is look cute, pack light, and let your guy handle the rest. 😎";
  }
  button.addEventListener("click",()=>{if(step===steps.length-1){if(!travelling&&!arrived)arriveInBangkok();return}step+=1;selectStep(step)});
  function animate(t){
    requestAnimationFrame(animate);
    if(travelling){
      const p=Math.min((t-travelStart)/3600,1),ease=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
      portal.scale.setScalar(1+ease*3.3);portal.rotation.z=t*.002;portal.material.opacity=.9-(ease*.45);
      plane.position.set(-3+ease*6.2,-.7+Math.sin(ease*Math.PI)*.55,2-ease*5.6);plane.rotation.z=-.18+ease*.34;
      camera.position.z=8-ease*5.7;camera.position.y=1.3-ease*.35;camera.lookAt(0,-.1,-.55);
      root.rotation.y+=(.03-root.rotation.y)*.05;root.position.y=0;
      if(p===1){travelling=false;arrived=true;flight.visible=false;suitcase.visible=false;camera.position.set(0,.95,2.3);camera.lookAt(0,-.3,-.4);showArrival();}
    }else if(!arrived){
      root.rotation.y+=(targetRotation-root.rotation.y)*.035;root.rotation.x=Math.sin(t*.00055)*.045;root.position.y=Math.sin(t*.00085)*.07;suitcase.rotation.z=Math.sin(t*.00065)*.025;
    }else{city.rotation.y=Math.sin(t*.00018)*.08;}
    if(keyGroup.visible)keyGroup.rotation.y=t*.001;
    renderer.render(scene,camera);
  }animate(0);
})();