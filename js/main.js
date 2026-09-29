/* ====== EDITA AQUÍ ====== */
//var WHATSAPP = "+50376194982";  // tu número con código de país, sin +, ej: "50370000000"
var FECHA = "2027-02-21T00:00:00-06:00"; // hora de El Salvador
var FOTOS = [       // src vacío = imagen de ejemplo; pon tu foto (ruta o data:URI)
  {src:"",alt:"Foto 1",cap:"Cuando nos conocimos",c:"tall"},
  {src:"",alt:"Foto 2",cap:"Nuestra primera cita",c:"wide"},
  {src:"",alt:"Foto 3",cap:"Nuestro primer viaje",c:""},
  {src:"",alt:"Foto 4",cap:"Un día cualquiera",c:""},
  {src:"",alt:"Foto 5",cap:"La propuesta",c:"tall"},
  {src:"",alt:"Foto 6",cap:"Con la familia",c:""},
  {src:"",alt:"Foto 7",cap:"Celebrando juntos",c:"wide"},
  {src:"",alt:"Foto 8",cap:"Rumbo al altar",c:""}
];
var ITINERARIO = [
  ["4:00 pm","Recepción de invitados","Bienvenida y llegada a La Estancia."],
  ["5:00 pm","Ceremonia","El momento en que nos decimos «sí»."],
  ["6:00 pm","Fotos y cóctel","Brindis y fotos con familia y amigos."],
  ["7:00 pm","Cena","Un banquete para celebrar juntos."],
  ["8:00 pm","Primer baile y fiesta","La pista es toda suya."],
  ["9:00 pm","Cierre","Gracias por acompañarnos."]
];
var CANCIONES = [ // {t:"Título", a:"Artista", src:"archivo.mp3"}
  {t:"Nuestra canción", a:"Ojala que si - Ale Zeguer", src:"musica/Ojala_que_si.mp3"}
];
var SHEETS_URL = "https://script.google.com/macros/s/AKfycbwfyzlmakCYVzsUO0PftibgO6JGFEVp_VRxES7nzqB553fXQHQfVznBU72u3gEWfnkx/exec";
/* ========================= */
var $=function(id){return document.getElementById(id)};

// Paletas
(function(){
  var root=document.documentElement,btns=document.querySelectorAll(".pal button");
  function set(p){
    if(p==="champan")root.removeAttribute("data-palette");else root.setAttribute("data-palette",p);
    btns.forEach(function(b){b.setAttribute("aria-pressed",b.dataset.p===p)});
    try{localStorage.setItem("paleta",p)}catch(e){}
  }
  btns.forEach(function(b){b.onclick=function(){set(b.dataset.p)}});
  var s="champan";try{s=localStorage.getItem("paleta")||"champan"}catch(e){}
  set(s);
})();

// Cuenta regresiva
(function(){
  var target=new Date(FECHA).getTime(),box=$("count"),e={d:$("d"),h:$("h"),m:$("m"),s:$("s")};
  function p(n){return String(n).padStart(2,"0")}
  function tick(){
    var diff=target-Date.now();
    if(diff<=0){box.outerHTML='<p class="done">¡Hoy nos casamos!</p>';clearInterval(t);return}
    var x=Math.floor(diff/1000);
    e.d.textContent=p(Math.floor(x/86400));e.h.textContent=p(Math.floor(x%86400/3600));
    e.m.textContent=p(Math.floor(x%3600/60));e.s.textContent=p(x%60);
  }
  var t=setInterval(tick,1000);tick();
})();

// Fotos de ejemplo (paisajes ilustrados)
var ESCENAS=[
  ["#F6C9A8","#F1E3D0","#D99A7E","#B9775F","#8C5A4B","#FFF1D6"],
  ["#BFD8E6","#EAF2F5","#8FB4C6","#6F97AE","#4F7690","#FFFFFF"],
  ["#CFE0C8","#F0F3E6","#9DBA96","#749A74","#4E765A","#FFF8DC"],
  ["#D9CDEA","#F4EEF8","#B7A2D2","#9580B8","#705C98","#FFF2F6"],
  ["#F3CFD2","#FBEDEA","#E3A7AE","#C98493","#A3616F","#FFF7EC"],
  ["#EBD5A5","#F8EFD8","#CFAE6C","#B08D4E","#856A38","#FFFBEF"],
  ["#2D3550","#5C6688","#3C4468","#2B3252","#1C2240","#F5EFD8"],
  ["#B7D3EE","#F0F6FC","#9BBBDB","#7C9FC6","#5A7FAA","#FFFFFF"]
];
function arte(i){
  var p=ESCENAS[i%ESCENAS.length],sx=90+(i*67)%220;
  var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+p[0]+'"/><stop offset="1" stop-color="'+p[1]+'"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="'+sx+'" cy="'+(150+(i%3)*20)+'" r="46" fill="'+p[5]+'" opacity=".85"/><path d="M0 330 Q100 270 200 320 T400 300 V500H0Z" fill="'+p[2]+'"/><path d="M0 390 Q120 330 240 380 T400 360 V500H0Z" fill="'+p[3]+'"/><path d="M0 450 Q150 410 280 445 T400 430 V500H0Z" fill="'+p[4]+'"/></svg>';
  return "data:image/svg+xml;utf8,"+encodeURIComponent(svg);
}
var ITEMS=FOTOS.map(function(f,i){return {src:f.src||arte(i),alt:f.alt,cap:f.cap,c:f.c}});
$("grid").innerHTML=ITEMS.map(function(f,i){
  return '<button class="ph '+f.c+'" data-i="'+i+'" aria-label="Abrir '+f.alt+'"><img src="'+f.src+'" alt="'+f.alt+'" loading="lazy"><span>'+f.cap+'</span></button>';
}).join("");

// Lightbox
(function(){
  var lb=$("lb"),img=$("lbi"),cur=0,last=null,tx=0;
  function show(){var it=ITEMS[cur];img.src=it.src;img.alt=it.alt;$("lbc").textContent=it.cap;$("lbk").textContent=(cur+1)+" / "+ITEMS.length}
  function go(d){cur=(cur+d+ITEMS.length)%ITEMS.length;show()}
  function open(i){last=document.activeElement;cur=i;show();lb.hidden=false;document.body.style.overflow="hidden";requestAnimationFrame(function(){lb.classList.add("on")});$("lbx").focus()}
  function close(){lb.classList.remove("on");document.body.style.overflow="";setTimeout(function(){lb.hidden=true},250);if(last)last.focus()}
  $("grid").addEventListener("click",function(e){var b=e.target.closest(".ph");if(b)open(+b.dataset.i)});
  $("lbx").onclick=close;$("lbp").onclick=function(){go(-1)};$("lbn").onclick=function(){go(1)};
  $("lbs").onclick=function(e){if(e.target===this)close()};
  lb.addEventListener("touchstart",function(e){tx=e.changedTouches[0].clientX},{passive:true});
  lb.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)go(dx<0?1:-1)});
  document.addEventListener("keydown",function(e){
    if(lb.hidden)return;
    if(e.key==="Escape")close();
    else if(e.key==="ArrowLeft")go(-1);
    else if(e.key==="ArrowRight")go(1);
    else if(e.key==="Tab"){
      var f=[$("lbx"),$("lbp"),$("lbn")],i=f.indexOf(document.activeElement);
      e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus();
    }
  });
})();

// Itinerario
$("tl").innerHTML=ITINERARIO.map(function(i){
  return '<li><time>'+i[0]+'</time><div><h3>'+i[1]+'</h3><p>'+i[2]+'</p></div></li>';
}).join("");

// Reproductor
(function(){
  var i=0,au=new Audio(),play=$("play"),seek=$("seek"),disc=$("disc");
au.volume=0.5;
  function fmt(x){x=Math.floor(x||0);return Math.floor(x/60)+":"+String(x%60).padStart(2,"0")}
  function setPlaying(v){play.innerHTML=v?"&#10074;&#10074;":"&#9654;";play.setAttribute("aria-label",v?"Pausar":"Reproducir");disc.classList.toggle("on",v)}
  function load(n){
    i=(n+CANCIONES.length)%CANCIONES.length;var c=CANCIONES[i];
    $("tt").textContent=c.t;$("ta").textContent=c.a;
    au.src=c.src||"";seek.value=0;$("cur").textContent="0:00";$("dur").textContent="0:00";
    var ok=!!c.src;play.disabled=!ok;$("note").textContent=ok?"":"Aún no hay archivo de audio. Agrega la ruta en CANCIONES.";
    setPlaying(false);
  }
  play.onclick=function(){if(au.paused){au.play().then(function(){setPlaying(true)}).catch(function(){$("note").textContent="No se pudo reproducir el audio."})}else{au.pause();setPlaying(false)}};
  $("prev").onclick=function(){load(i-1)};$("next").onclick=function(){load(i+1)};
  $("prev").disabled=$("next").disabled=CANCIONES.length<2;
  au.ontimeupdate=function(){if(au.duration){seek.value=au.currentTime/au.duration*100;$("cur").textContent=fmt(au.currentTime)}};
  au.onloadedmetadata=function(){$("dur").textContent=fmt(au.duration)};
  au.onended=function(){if(CANCIONES.length>1){load(i+1);au.play().then(function(){setPlaying(true)})}else setPlaying(false)};
  seek.oninput=function(){if(au.duration)au.currentTime=seek.value/100*au.duration};
  load(0);
// Reproducción automática (o al primer toque si el navegador la bloquea)
  var EVENTOS=["pointerdown","keydown","touchend"];
  function quitar(){EVENTOS.forEach(function(ev){document.removeEventListener(ev,alPrimerToque)})}
  function intentar(){
    if(!au.src||!au.paused)return;
    au.play().then(function(){setPlaying(true);quitar()}).catch(function(){});
  }
  function alPrimerToque(e){
    if(e.target.closest("#play")){quitar();return} // si toca el botón, su propio play se encarga
    intentar();
  }
  EVENTOS.forEach(function(ev){document.addEventListener(ev,alPrimerToque)});
  intentar();
})();

// Confirmación (se guarda en Google Sheets)
$("form").addEventListener("submit",function(ev){
  ev.preventDefault();
  var n=$("nombre").value.trim();if(!n)return;
  var f=ev.target,btn=f.querySelector("button[type=submit]"),msg=$("msg"),
      asiste=document.querySelector("input[name=asiste]:checked").value;
  if(!SHEETS_URL||SHEETS_URL.indexOf("PEGA_AQUI")===0){msg.textContent="Falta configurar el envío.";return}
  var datos=new URLSearchParams({
    nombre:n,
    asiste:asiste,
    personas:asiste.indexOf("Sí")===0?$("pers").value:0,
    nota:$("nota").value.trim()
  });
  btn.disabled=true;msg.textContent="Enviando…";
  fetch(SHEETS_URL,{method:"POST",mode:"no-cors",body:datos})
    .then(function(){msg.textContent="¡Gracias, "+n.split(" ")[0]+"! Tu confirmación fue enviada.";f.reset()})
    .catch(function(){msg.textContent="No se pudo enviar. Revisa tu conexión e inténtalo de nuevo."})
    .then(function(){btn.disabled=false});
});
