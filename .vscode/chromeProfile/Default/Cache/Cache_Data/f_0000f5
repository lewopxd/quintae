
var scrollTop_var;

var screenisblack=false;

var $body = $('body'),
    scrollDisabled = false,
    scrollTop;

window.onload = function () {
  console.info("hello world");
preventImages();

// Establecer el estado inicial (desactivado)
toggle.activado = true;
   
 


 getUserIPandLocation();
   
 //console.log("is user from colombia:" + isUserFromColombia());
 
  
};

function submit() {
  var valorInputName = document.getElementById("text_input_name_form").value;
  var valorInputEmail = document.getElementById("text_input_email_form").value;
  var valorInputMessage = document.getElementById("text_input_message_form").value;


 

  var elemento_name = document.getElementById("error_text_name_form");
  var elemento_email = document.getElementById("error_text_email_form");
  var elemento_message = document.getElementById("error_text_message_form");

  if (!validarInput(valorInputName)) {
    
    if (elemento_name) {
      elemento_name.style.display = 'block';
    }


  } else {
    console.log(valorInputName);
    elemento_name.style.display = 'none';
  }


  if (!validarInput(valorInputEmail)) {
    
    if (elemento_email) {
      elemento_email.style.display = 'block';
    }


  } else {
    console.log(valorInputEmail);
    elemento_email.style.display = 'none';
  }


  if (!validarInput(valorInputMessage)) {
    
    if (elemento_message) {
      elemento_message.style.display = 'block';
    }


  } else {
    console.log(valorInputMessage);
    elemento_message.style.display = 'none';
  }


   if (validarInput(valorInputName) 
   &&  validarInput(valorInputEmail)  
  &&  validarInput(valorInputMessage) ){

      
      // Llamar a la función para enviar la solicitud POST con Fetch
  enviarPOSTconFetch(valorInputName, valorInputEmail, valorInputMessage);

 

   }


}


function validarInput(valorInput) {
  // Obtener el valor del input

  // Verificar si el valor está vacío o no
  if (valorInput.trim() !== '') {
    // Si el valor no está vacío, retornar true
    return true;
  } else {
    // Si el valor está vacío, retornar false
    return false;
  }
}


function enviarPOSTconFetch(valorInputName, valorInputEmail, valorInputMessage) {

 enviando(valorInputName, valorInputEmail, valorInputMessage);


  // Datos a enviar en el cuerpo de la solicitud
  var datos = {
      name: valorInputName,
      email: valorInputEmail,
      message: valorInputMessage,
      _captcha: 'false',
      _template: 'table',
     
  };

  // Configuración de la solicitud
  var configuracion = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
  };

  // URL a la que se enviará la solicitud POST
  var url = 'https://formsubmit.co/35e16f0782295afe3b87c1bf5da09bf0';

  // Realizar la solicitud POST
  fetch(url, configuracion).
  
  then(response => {
   
    if (response.ok) {
      
      

      enviado();
       
  }else{
    console.log("no enviado");
    throw new Error('Error en la solicitud');
    
   
  }
    

})
.catch(error => {
    // Manejo de errores

    funcionerror();
    console.error('Error:', error)
  
});

}


function enviando(valorInputName, valorInputEmail, valorInputMessage){
  console.log("enviando...");

var containerform = document.getElementById("container_upper_form");
containerform.style.display = "none";

var containerSend = document.getElementById("container_sending");
containerSend.style.display = "block";


  var InputName = document.getElementById("span_de_form");
  InputName.innerText = valorInputName +" ("+valorInputEmail+")";
   
  var InputEmail = document.getElementById("span_para_form");
  InputEmail.innerText = "Teatro Quinta esencia";

  var InputMessage = document.getElementById("span_message_form");
  InputMessage.innerText = valorInputMessage;

}

function enviado(){

  console.log("enviado");
 var tit = document.getElementById("title_Send");
 tit.innerText = ("Mensaje Enviado ✓");

 var holder = document.getElementById("sending_holder");
 holder.style.display = "none";
 
  

}


function funcionerror(){
  var tit = document.getElementById("title_Send");
 tit.innerText = ("No fue posible enviar tu mensaje en este momento, por favor escribenos a nuestro correo: teatro5esencia@gmail.com");

 var holder = document.getElementById("sending_holder");
 holder.style.display = "none";
}


function preventImages(){
  // Selecciona todas las imágenes de la página
var imagenes = document.querySelectorAll('img');

// Itera sobre todas las imágenes y agrega un evento para evitar el menú contextual
imagenes.forEach(function(imagen) {

  imagen.draggable = false;
  imagen.addEventListener('contextmenu', function(event) {
    // Evita que se abra el menú contextual
    event.preventDefault();
  });
});

}

function instainfo(){   
}
 

function openNewTab(url) {
  window.open(url, '_blank');
}

 

window.addEventListener('scroll', function() {
if(!screenisblack){
  var winnerSection = document.getElementById('winner');
  var divOculto = document.getElementById('button-flotante-holder');

  // Obtener la posición vertical de la parte superior de la sección "Winner"
  var winnerPosition = winnerSection.getBoundingClientRect().top;

  // Obtener la posición vertical actual del scroll
  var scrollPosition = window.scrollY ;

  // Mostrar el div oculto si el scroll está más abajo de la sección "Winner"
  if (scrollPosition > winnerPosition) {
    divOculto.classList.add('visible');
     
  } else {
    
    divOculto.classList.remove('visible');
  }


}
});


function button_call(){
  
 if(!esDispositivoMovil()){
  //hide3button();
 } 

 try{
  const over = document.getElementById("overlay");
  const currentDisplay = over.style.display;
  over.style.display = currentDisplay === 'block' ? 'none' : 'block';

toggle();  //funcion para activar y desactivar la barra desplazamiento
document.getElementById("button-flotante-holder").classList.toggle('activo');
 }catch {
  console.error(e);
 }
  
}


 // Función toggle que alterna entre activar y desactivar
function toggle() {
  // Verificar el estado actual y llamar a la función correspondiente
  if (toggle.activado) {
    ocultar_screen();
    scrollDisable();
    mostrarBotones();
    screenisblack=true;
  } else {
       let cardx = document.getElementById("qr_call_card");
       if (cardx.classList.contains('active')) {
        cardx.classList.remove("active");
       }else{

       }
    
  mostrar_screen();
   scrollEnable();
   ocultarBotones();
   screenisblack=false;
   
  }
  
  // Alternar el estado
  toggle.activado = !toggle.activado;
}

function mostrarBotones(){
   //botones
var b1 = document.getElementById("c_button1");
b1.classList.add("visible");
var b2 = document.getElementById("c_button2");
b2.classList.add("visible");

var b3 = document.getElementById("c_button3");
b3.classList.add("visible");
}


function ocultarBotones(){
  var b1 = document.getElementById("c_button1");
  b1.classList.remove("visible");
  var b2 = document.getElementById("c_button2");
  b2.classList.remove("visible");

  var b3 = document.getElementById("c_button3");
  b3.classList.remove("visible");
}

function mostrar_screen() {



// Seleccionar todos los elementos <section>
const secciones = document.querySelectorAll('section');
const navs = document.querySelectorAll('nav');
// Iterar sobre cada elemento <section> y agregar la clase deseada
secciones.forEach(seccion => {
  seccion.classList.remove('filter-div');
 
});
navs.forEach(nav => {
  nav.classList.remove('filter-div');
     
});

}

function ocultar_screen() {
 
 
// Seleccionar todos los elementos <section>
const secciones = document.querySelectorAll('section');
const navs = document.querySelectorAll('nav');
// Iterar sobre cada elemento <section> y agregar la clase deseada
secciones.forEach(seccion => {
  seccion.classList.add('filter-div');
     
});

navs.forEach(nav => {
  nav.classList.add('filter-div');
     
});
 




}


function scrollDisable() {
   
  scrollTop = $(window).scrollTop();

  $body.addClass('scrolDisabled')
      .css({
      top: -1 * scrollTop
  });
  
}

function scrollEnable() {
 
  $body.removeClass('scrolDisabled');
    $(window).scrollTop(scrollTop);

  
}

function overlayclick(){
  document.getElementById("button-flotante-holder").click();
}


function gotowhatsapp(){
  document.getElementById("qr_call_card").classList.remove("active");
  overlayclick();
  detectarDispositivo();
}

function esDispositivoMovil() {
   
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function detectarDispositivo() {
  var url1 ="https://wa.me/573214960609?text=Hola%20Quinta%20Esencia%2C%20quisiera%20ponerme%20en%20contacto%20con%20ustedes.";
  var url2 = "https://web.whatsapp.com/send?phone=573214960609&text=Hola%20Quinta%20Esencia%2C%20quisiera%20ponerme%20en%20contacto%20con%20ustedes.";
 
 
  

  if (esDispositivoMovil()) {
    console.log("La página se está ejecutando en un dispositivo móvil.");
     
    window.open(url1, '_blank');
  } else {
    console.log("La página se está ejecutando en una computadora.");
   
    window.open(url2, '_blank');
  }


}

function gotocall(){
  //solo funciona en el mobil
 url_col =  "tel:3214960609";
url = "tel:+573214960609";

 

 

if(isUserFromColombia){
console.log("from colombia");
url = url_col;
}else{
  console.log("not from colombia");
}

 if(esDispositivoMovil()){
  overlayclick();
  window.open(  url, '_blank');
 }else{


  let card = document.getElementById("qr_call_card");

  if (card.classList.contains('active')) {
  document.getElementById("qr_call_card").classList.remove("active");
  }else{
    document.getElementById("qr_call_card").classList.add("active");
  }
        
 }
}
function gotomail(){

  document.getElementById("qr_call_card").classList.remove("active");


 //al parecer solo funciona en safari
 url_contacts = "data:text/vcard;charset=utf-8,BEGIN%3AVCARD%0AVERSION%3A3.0%0AN%3A;Contacto%0ATEL%3A+5732149606069%0AEND%3AVCARD";
 

 // solo funciona en el mobil
 url_mail_pref = "mailto:teatro5esencia@gmail.com?subject=Queremos%20ponernos%20en%20contacto&body=Hola%20Quinta%20Esencia"
  if(esDispositivoMovil()){
    overlayclick();
    window.open(  url_mail_pref, '_blank');
  }else{
    overlayclick();
    var seccion = document.getElementById('contacto');
    seccion.scrollIntoView({ behavior: 'smooth' });
  }

}


function isUserFromColombia() {
  return new Promise((resolve, reject) => {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data.country === 'CO') {
                console.log("from colombia");
                resolve(true);
            } else {
              console.log("not from colombia");
                resolve(false);
            }
        })
        .catch(error => reject(error));
});
}

 
function hide3button(){
  document.getElementById("c_button3").style.display = "none";
}



 
 


function getUserIPandLocation() {
  fetch('https://ipapi.co/json')
      .then(response => response.json())
      .then(data => {
          // el objeto "data" devuelto contiene mucha información útil. 
          // console.log(response);
          var date= obtenerFechaGMTmenos5();
          var time = "(GMT-5,BOG) "+obtenerHoraGMTmenos5();

          let ip = data.ip; // esto es la IP
          let city = data.city; // esto es la ciudad
          let region = data.region; // esto es la región
          let country = data.country_name; // esto es el país 
         
          let lat = data.latitude;
          let long = data.longitude;
          let url_map = "https://www.google.com/maps/?q="+lat+","+long;

          let browser = getBrowserInfo();
          let os = getOSInfo();
          let device = getDeviceInfo();

/*
          
          console.log(ip);
          console.log(city);
          console.log(region);
          console.log(country);
          console.log(lat);
          console.log(long);
          console.log(url_map);
          console.log(".....");      
        
*/
         postData(date, time, ip, city, region, country, lat, long, url_map, browser, os, device);

      })
      .catch(error => console.error('Hubo un error:', error));

    }

  

    // La función recibe date y time como argumentos
async function postData(date, time, ip, city, region, country, lat, long, url_map, browser, os, device ) {
  try{

    
    
  // Preparando los datos a enviar
  let data = { DATE: date, TIME: time , IP: ip, CITY: city,	REGION: region,	COUNTRY: country,	LAT: lat,	LONG: long,	URL_MAP: url_map, BROWSER: browser, OS: os, DEVICE: device };
  
  // Ejecutando el POST
  let response = await fetch('https://script.google.com/macros/s/AKfycbwhemyScE-37d4Za0y2s-8BReelAEZCQEaeU2ewvWAv6o4XxVlcueIBBlM0q8EutZfplg/exec', {
    method: 'POST', 
    mode: 'no-cors', 
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
     
    body: new URLSearchParams(data).toString() 
  });
  //imprimiendo respuesta del servidor
 
//console.log("se realizo intento de post  a gscript");
}catch{
  console.error("No fue posible enviar los datos a gscript");
}
}


/*  

// funcion de google script

function doPost(e){
   
   
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('sheet1'); 

    var date = e.parameter.DATE;
    var time = e.parameter.TIME;
    var ip = e.parameter.IP;
    var city = e.parameter.CITY;
    var region = e.parameter.REGION;
    var country = e.parameter.COUNTRY;
    var lat = e.parameter.LAT;
    var long = e.parameter.LONG;
    var url_map = e.parameter.URL_MAP;
    
    
    sheet.appendRow([date, time, ip, city, region, country, lat, long, url_map]);
  
 
  
}

*/
 



// obtener fecha 
function obtenerFechaGMTmenos5() {
   // Crear un objeto Date
   var date = new Date(); 

   // Configurar la zona horaria a GMT-5
   var options = { 
       timeZone: "America/Bogota", 
       year: 'numeric', 
       month: '2-digit',
       day: '2-digit'
   };

   // Devolver la fecha en formato yyyy/mm/dd
   return date.toLocaleDateString("es-CO", options);
}

//    obtener hora

function obtenerHoraGMTmenos5() {
   // Crear un objeto Date
   var date = new Date(); 

   // Configurar la zona horaria a GMT-5
   var options = { 
       timeZone: "America/Bogota", 
       hour: '2-digit', 
       minute: '2-digit', 
       second: '2-digit' 
   };

   // Devolver la hora en formato hh:mm:ss
   return date.toLocaleTimeString("es-CO", options);
}


function getBrowserInfo() {
  var ua = navigator.userAgent, tem, 
  M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if(/trident/i.test(M[1])){
      tem =  /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE, V.' + (tem[1] || '');
  }
  if(M[1]=== 'Chrome'){
      tem = ua.match(/\bOPR|Edge\/(\d+)/)
      if(tem != null) return 'Nombre: Opera, Versión: ' + tem[1];
  }   
  M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return '' + M[0] + ', V.' + M[1];
}

function getOSInfo() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('windows') !== -1) return 'Windows';
  if (userAgent.indexOf('macintosh') !== -1) return 'Macintosh';
  if (userAgent.indexOf('ipad') !== -1) return 'iPad';
  if (userAgent.indexOf('iphone') !== -1) return 'iPhone';
  if (userAgent.indexOf('ipod') !== -1) return 'iPod';
  if (userAgent.indexOf('android') !== -1) return 'Android';
  if (userAgent.indexOf('linux') !== -1) return 'Linux';
  return 'Unknown';
}

function getDeviceInfo() {
var device = "Unknown";
var agent = navigator.userAgent.toLowerCase();

if(agent.indexOf("android") >= 0) device = "Android";
if(agent.indexOf("iphone") >= 0) device = "iPhone";
if(agent.indexOf("ipad") >= 0) device = "iPad";
if(agent.indexOf("windows phone") >= 0) device = "Windows Phone";
if(agent.indexOf("windows nt") >= 0) device = "Windows PC";
if(agent.indexOf("macintosh") >= 0) device = "Macintosh";

return device;
}