/* ====== EDITA AQUÍ ====== */
var FECHA = "2027-02-21T00:00:00-06:00"; // hora de El Salvador
var FOTOS = [       // src: foto optimizada. Para una nueva, exporta <nombre>-960.webp y <nombre>-480.webp
  {src:"fotos/FT1-960.webp",alt:"Foto 1",cap:"Cuando nos conocimos",c:"tall"},
  {src:"fotos/FT2-960.webp",alt:"Foto 2",cap:"Nuestra primera cita",c:"tall", pos:"40% 50%"},
  {src:"fotos/FT3-960.webp",alt:"Foto 3",cap:"Nuestro primer viaje",c:"", pos:"50% 25%"},
  {src:"fotos/FT4-960.webp",alt:"Foto 4",cap:"Un día cualquiera",c:""},
  {src:"fotos/FT5-960.webp",alt:"Foto 5",cap:"La propuesta",c:"tall"},
  {src:"fotos/FT6-960.webp",alt:"Foto 6",cap:"Con la familia",c:""},
  {src:"fotos/FT7-960.webp",alt:"Foto 7",cap:"Celebrando juntos",c:"wide", pos:"50% 40%"},
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
  {t:"Nuestra canción", a:"“Mi vida sin ti” — Jesús Adrián Romero", src:"musica/Mi Vida Sin Ti.mp3"},
  {t:"Nuestra canción", a:"“Ojala que si” — Ale Zeguer", src:"musica/Ojala_que_si.mp3"}

];
var SHEETS_URL = "https://script.google.com/macros/s/AKfycbwfyzlmakCYVzsUO0PftibgO6JGFEVp_VRxES7nzqB553fXQHQfVznBU72u3gEWfnkx/exec";
/* ========================= */
var $=function(id){return document.getElementById(id)};
function esperar(ms){return new Promise(function(r){setTimeout(r,ms)})}

// Paletas (el selector solo aparece con ?palette=1; para quitarlo del todo, borra .pal del HTML)
(function(){
  var root=document.documentElement,btns=document.querySelectorAll(".pal button"),
      caja=document.querySelector(".pal");
  if(caja&&!/[?&]palette=1(?:&|$)/.test(location.search))caja.hidden=true;
  function set(p){
    if(p==="champan")root.removeAttribute("data-palette");else root.setAttribute("data-palette",p);
    btns.forEach(function(b){b.setAttribute("aria-pressed",b.dataset.p===p)});
    try{localStorage.setItem("paleta",p)}catch(e){}
  }
  btns.forEach(function(b){b.onclick=function(){set(b.dataset.p)}});
  var s="champan";try{s=localStorage.getItem("paleta")||"champan"}catch(e){}
  set(s);
})();

// Menú móvil
(function(){
  var b=$("burger"),m=$("menu");
  function cerrar(){m.classList.remove("open");b.setAttribute("aria-expanded","false");b.setAttribute("aria-label","Abrir menú")}
  b.onclick=function(){var o=m.classList.toggle("open");b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"Cerrar menú":"Abrir menú")};
  m.addEventListener("click",function(e){if(e.target.closest("a"))cerrar()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")cerrar()});
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

var ITEMS=FOTOS.map(function(f,i){return {src:f.src||arte(i),alt:f.alt,cap:f.cap,c:f.c,pos:f.pos||"50% 50%"}});
function srcset(src){
  if(!/-960\.webp$/.test(src))return "";
  return src.replace("-960.webp","-480.webp")+" 480w, "+src+" 960w";
}
$("grid").innerHTML=ITEMS.map(function(f,i){
  var ss=srcset(f.src),tam=f.c==="wide"
    ?"(max-width:640px) 92vw, 430px"
    :"(max-width:640px) 46vw, (max-width:860px) 22vw, 205px";
  return '<button class="ph '+f.c+'" data-i="'+i+'" aria-label="Abrir '+f.alt+'"><img src="'+f.src+'"'+
    (ss?' srcset="'+ss+'" sizes="'+tam+'"':'')+
    ' alt="'+f.alt+'" style="object-position:'+f.pos+'" loading="lazy"><span>'+f.cap+'</span></button>';
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
  //$("lbs").onclick=function(e){if(e.target===this)close()};
  $("lbs").onclick=function(e){ // tocar fuera de la foto cierra la galería
    var r=this.getBoundingClientRect(),iw=img.naturalWidth||1,ih=img.naturalHeight||1,
        s=Math.min(r.width/iw,r.height/ih),w=iw*s,h=ih*s,x=r.left+(r.width-w)/2,y=r.top+(r.height-h)/2;
    if(e.clientX<x||e.clientX>x+w||e.clientY<y||e.clientY>y+h)close();
  };
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
  au.preload="none";au.volume=0.3;
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
})();

// Invitación personalizada (se activa con #i=CODIGO o ?i=CODIGO)
var TOKEN=new URLSearchParams(location.search).get("i")||
          new URLSearchParams(location.hash.replace(/^#/,"")).get("i");
function cargarInvitacion(){
  return fetch(SHEETS_URL+"?i="+encodeURIComponent(TOKEN)+"&t="+Date.now()).then(function(r){return r.json()});
}
// Muestra el formulario o la tarjeta de "lugar reservado" según la respuesta guardada
function estadoRsvp(d){
  var form=$("form"),caja=$("reservado"),lead=$("rsvp-lead"),h=$("rsvp-h"),
      txt=String(d.asistencia||"").trim(),
      si=/^s[íi]/i.test(txt),no=/^no/i.test(txt),
      listo=si||no;
  function verFormulario(){
    form.hidden=false;lead.hidden=false;caja.hidden=true;
    h.textContent=listo?"Cambia tu respuesta":"Confirma tu asistencia";
    $("msg").textContent="";
  }
  if(!listo){verFormulario();return}
  form.hidden=true;lead.hidden=true;caja.hidden=false;
  h.textContent="Tu confirmación";
  caja.innerHTML='<b></b><p></p><button type="button" class="cambiar">Cambiar mi respuesta</button>';
  caja.querySelector("b").textContent=si?"¡Tu lugar está reservado!":"Gracias por avisarnos";
  caja.querySelector("p").textContent=si
    ?(d.personas===1?"Reservamos 1 lugar a tu nombre.":"Reservamos "+d.personas+" lugares a tu nombre.")+" Te esperamos el 21 de febrero."
    :"Lamentamos que no puedas acompañarnos. Te vamos a extrañar.";
  caja.querySelector(".cambiar").onclick=function(){
    var clave=si?"Sí":"No";
    document.querySelectorAll("input[name=asiste]").forEach(function(r){r.checked=r.value.indexOf(clave)===0});
    $("pers").value=si?(d.personas||d.asientos):d.asientos;
    $("nota").value=d.nota||"";
    verFormulario();
  };
}

function mostrarInvitacion(d){
  var para=$("para"),p=$("pers");
  para.hidden=false;
  para.innerHTML="Invitación para<b></b><span></span>";
  para.querySelector("b").textContent=d.nombre;
  para.querySelector("span").textContent=d.asientos===1?"Tienes 1 lugar reservado":"Tienes "+d.asientos+" lugares reservados";
  p.max=d.asientos;p.value=d.asientos;
  p.closest("label").style.display=d.asientos===1?"none":"";
  $("rsvp").hidden=false;
  document.querySelector('nav a[href="#rsvp"]').hidden=false;
  estadoRsvp(d);
}
if(TOKEN){
  cargarInvitacion().then(function(d){
    if(d.ok)mostrarInvitacion(d);
    else{$("para").hidden=false;$("para").textContent="Este código de invitación no es válido."}
  }).catch(function(){
    $("para").hidden=false;
    $("para").textContent="No pudimos cargar tu invitación. Revisa tu conexión e inténtalo de nuevo.";
  });
}

// El POST es no-cors: se confirma releyendo el estado, con reintentos por la latencia de Sheets
function confirmarEstado(intentos){
  return cargarInvitacion().then(function(d){
    if(d&&d.ok&&d.asistencia)return d;
    if(intentos<=0)throw new Error("sin confirmación");
    return esperar(700).then(function(){return confirmarEstado(intentos-1)});
  },function(err){
    if(intentos<=0)throw err;
    return esperar(700).then(function(){return confirmarEstado(intentos-1)});
  });
}

// Confirmación (se guarda en la fila del invitado)
$("form").addEventListener("submit",function(ev){
  ev.preventDefault();
  if(!TOKEN)return;
  var f=ev.target,btn=f.querySelector("button[type=submit]"),msg=$("msg"),
      asiste=document.querySelector("input[name=asiste]:checked").value,
      datos=new URLSearchParams({i:TOKEN,asiste:asiste,personas:$("pers").value,nota:$("nota").value.trim()});
  btn.disabled=true;msg.textContent="Enviando…";
  fetch(SHEETS_URL,{method:"POST",mode:"no-cors",body:datos})
    .then(function(){return confirmarEstado(3)})
    .then(estadoRsvp)
    .catch(function(){msg.textContent="No pudimos guardar tu respuesta. Revisa tu conexión e inténtalo de nuevo."})
    .then(function(){btn.disabled=false});
});
