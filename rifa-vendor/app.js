   //---------------[   FIREBASE      ]-----------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

import { getStorage, ref, uploadString, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyBZoGbzX_oGbF4rJX6ZmWgrVnaw4VSFhNQ",
    authDomain: "nyl8-e8917.firebaseapp.com",
    databaseURL: "https://nyl8-e8917-default-rtdb.firebaseio.com",
    projectId: "nyl8-e8917",
    storageBucket: "nyl8-e8917.appspot.com",
    messagingSenderId: "543397236830",
    appId: "1:543397236830:web:92deac723c3a5e72d3a4cf",
    measurementId: "G-RRV77YMTY5"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);


  //---------------[         ]-----------------------------------------

var filedata = null;
var newfiledata = null;
var hidex = false;
var al =  Math.floor(Math.random() * (3300 - 2100 + 1)) + 2100;
var timeToLoad = 0;
var vector_selled = [];
var vector_No_selled = [];
var ticketsToBuy = 1; //1 si se usa selector de cantidad de tiquetes
var vector_tickets_selected = [];
var maxTicketsToBuy  = 100;
var testingapp = false;
var valueTicket = 25000;
var msgBuilder = "";
var firstAcceptClick = false;
var secondAcceptClick = false;
var actualVendor=null;
var actualSelectedNumber =null;
window.addEventListener('load', function() {
    console.log("Hola Mundo");
     

    createCells()
    .then(() => {
      
        return readData();
       
    })
    .then(() => {
       
      return manageSections();
    })
    .catch(error => {
      console.error("Error en secuencia de ejecucion:", error);
  });


});


function manageSections(){
  return new Promise((resolve, reject) => {
 
 
const params = new URLSearchParams(window.location.search);


 
if (params.get('auth') === 'true') {
   
  setTimeout(() => {
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('rifa').style.display = 'block';
    setLimitInput();
    setListOptions();
     testButtonComprar();
 resolve(); // Llamada a resolve para completar la promesa
}, timeToLoad);
}else{
  document.getElementById('inicio').style.display = 'block';
  window.location.href = window.location.origin;
}
  
});
}


function setLimitInput(){
  setTimeout(() => {
  var input = document.getElementById("n-tickets");
  var vec = vector_No_selled;
  

  input.setAttribute("max", (vector_No_selled.length-1));
  input.setAttribute("min", (1));
  }, 1000);
}


function setListOptions(){
  setTimeout(() => {
  var listaDesplegable = document.getElementById("listaTickets");

  var x = vector_No_selled.length;

  if(x>maxTicketsToBuy){
    x = maxTicketsToBuy-1;
  }else{
    x=vector_No_selled.length - 2;
  }
// Agregar x opciones nuevas
for (var i = 1; i <= x; i++) {
  var nuevaOpcion = document.createElement("option");
  nuevaOpcion.value = "" + (i + 1); // +3 porque ya hay 3 opciones iniciales
  nuevaOpcion.text = "" + (i + 1);
  listaDesplegable.appendChild(nuevaOpcion);
}
}, 1000);

}
function createCells(){

  return new Promise((resolve, reject) => {
    const matrixContainer = document.getElementById('matrix');

    for (let i = 0; i <= 99; i++) {

        const div0 = document.createElement('div');
        div0.className = 'matrix-numero-container';
        div0.id = `matrix-numero-container-${String(i).padStart(2, '0')}`;
        

        const div = document.createElement('div');
        div.className = 'matrix-numero';
        div.id = `matrix-numero-${String(i).padStart(2, '0')}`;
         
        
        const divText = document.createElement('div');
        divText.className = 'matrix-numero-text';
        divText.id = `matrix-numero-text-${String(i).padStart(2, '0')}`;
        divText.textContent = `${String(i).padStart(2, '0')}` ;// Opcional: para mostrar el número dentro del div

        const div2 = document.createElement('div');
        div2.className = 'matrix-numero-img';
        div2.id = `matrix-numero-img-${String(i).padStart(2, '0')}`;
        
       

        div0.appendChild(div);
        div0.appendChild(divText);
        div0.appendChild(div2);
        matrixContainer.appendChild(div0);


        div2.addEventListener('click', function() {
          manageClick(`${String(i).padStart(2, '0')}`);
        
       });
      
    }
    
    resolve(); // Llamada a resolve para completar la promesa
  });
  
}

function manageClick(i){

   

  


   if(!vector_selled.includes(i) && !vector_tickets_selected.includes(i) ){
    if (vector_tickets_selected.length<ticketsToBuy){
      vector_tickets_selected.push(i); 
    }else{
      vector_tickets_selected[vector_tickets_selected.length-1] = i;
       
    }
    
   }
   

 

  let div = document.getElementById("matrix-numero-"+i);
  let div_T = document.getElementById("matrix-numero-text-"+i);

 
 

  if(div.classList.contains("active")){
   div.classList.remove("active");
   div_T.classList.remove("active");
   actualSelectedNumber = null;
   document.getElementById("big-number-red").textContent ="--";
   vector_tickets_selected = vector_tickets_selected.filter(function(item) {
    return item !== i;
  });
 
  }else{

    
 
let num = document.getElementById("big-number-red");
let nom = document.getElementById("nombrex");
let tel = document.getElementById("telefonox");

  highBox(i);
 actualSelectedNumber = i;
 // Envía el valor al documento principal
window.parent.postMessage(actualSelectedNumber, '*');
 document.getElementById("error-text").style.display = "none";

num.innerText = i;
let boleta = (getBoletaByNumero(filedata, i));
var nombre = "Nombre:"
var telefono = "Teléfono:"
if(boleta){
nombre = boleta.nombre;
telefono = boleta.telefono;
 

 
 

   if(nombre!=null && nom){
     
     if(hidex){
        nombre = formatString (nombre,1);
       }
       nom.textContent = nombre;
   }else{
    nom.textContent = "Nombre:";
   }

   if(telefono!=null && num){
    if(hidex){
        telefono = "Tel: "+formatString (telefono,1);
       }
    tel.textContent = telefono;
  }else{
   tel.textContent = "Teléfono:";
  }
 
}

  }


  testButtonComprar();
}

function highBox(i){
  
let div_id = document.getElementById("matrix-numero-"+i);
let div_id_text = document.getElementById("matrix-numero-text-"+i);
let div = document.querySelectorAll(".matrix-numero");
let div_text = document.querySelectorAll(".matrix-numero-text");

if(!vector_selled.includes(i)  ){
  div.forEach(function(elemento) {

    let str = elemento.id;
    str =  str.substring(str.length-2);
    
    if(!vector_tickets_selected.includes(str)){
    elemento.classList.remove("active");
    actualSelectedNumber = null;
    }
    
  });
  
  div_text.forEach(function(elemento) {
    let str = elemento.id;
    str =  str.substring(str.length-2);
    
    if(!vector_tickets_selected.includes(str)){
    elemento.classList.remove("active");
   actualSelectedNumber = null;
    }
  });
}




if(vector_selled.includes(i)){
 // navigator.vibrate([100, 20, 100]);
}else{

   
  div_id.classList.add("active");
  div_id_text.classList.add("active");
  playGameSound();
  navigator.vibrate(80);

}

}


function formatString(str, id) {
    // Divide la cadena en palabras
    const words = str.split(' ');
  
    // Procesa cada palabra dependiendo del id
    const formattedWords = words.map(word => {
      if (id === 1) {
        // Si id es 1 y la palabra tiene menos de 6 caracteres, toma el primer carácter y añade ***
        if (word.length < 6) {
          return `${word.charAt(0)}***`;
        }
        // Si id es 1 y la palabra tiene 6 o más caracteres, toma los tres primeros caracteres
        return `${word.slice(0, 3)}***`;
      } else if (id === 2) {
        // Si id es 2, toma los tres últimos caracteres y añade seis asteriscos
        return `******${word.slice(-3)}`;
      }
      // Si id no es 1 ni 2, devuelve la palabra sin cambios (o podrías lanzar un error)
      return word;
    });
  
    // Junta las palabras formateadas en una cadena
    return formattedWords.join(' ');
  }
  



async function fetchJson(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener el archivo JSON: ${response.statusText}`);
      }
      const data = await response.json();
      // Acción a realizar inmediatamente después de leer el archivo JSON
     // console.log("Archivo JSON leído exitosamente:", data);
      return data;
    } catch (error) {
      console.error("Hubo un problema con la solicitud fetch:", error);
      throw error; // Rethrow the error for further handling if needed
    }
  }
  

  function readData(){
  // Uso de la función con una URL de ejemplo
  let url = 'https://firebasestorage.googleapis.com/v0/b/nyl8-e8917.appspot.com/o/data_raffle.json?alt=media&token=239aaef1-14d0-416a-9600-f863b4404319';
  if(testingapp){
url = "data_raffle.json";
  }
  fetchJson(url)
    .then(data => {
      // Aquí puedes hacer algo con los datos obtenidos
     // console.log("Datos JSON obtenidos:", data);
      filedata = data;
      checkSoldTickets(data);
    })
    .catch(error => {
      // Manejo de errores adicionales si es necesario
      console.error("Error en el manejo de la promesa:", error);
    });
  
}


function getBoletaByNumero(jsonData, numero) {
    // Encuentra la boleta con el número especificado
    const boleta = jsonData.boletas.find(boleta => boleta.numero === numero);
    
    // Si se encuentra la boleta, devuelve su contenido; de lo contrario, devuelve null
    if (boleta) {
      return boleta;
    } else {
      console.log(`No se encontró la boleta con el número ${numero}`);
      return null;
    }
  }

function checkSoldTickets(jsonData) {
    // Recorre el array de boletas
    jsonData.boletas.forEach(boleta => {
      // Evalúa si la boleta está vendida
      if (boleta.vendido === true) {
        // Realiza una acción si la boleta está vendida
      //  console.log(`La boleta número ${boleta.numero} está vendida.`);
        manageMatrix(boleta.numero);
        vector_selled.push(boleta.numero);
        // Puedes agregar más acciones aquí
      }else{
        vector_No_selled.push(boleta.numero);
      }
    });
  }
  


  function manageMatrix(numero){
 
 
    let div1 = document.getElementById("matrix-numero-img-"+numero);
    let div2 = document.getElementById("matrix-numero-"+numero);
    let div3 = document.getElementById("matrix-numero-text-"+numero);

    let what ="";

    let bol = getBoletaByNumero(filedata, numero);
   

  if(bol.responsable=="leo"){
what = "vendido1"
  }else if(bol.responsable=="paula"){
    what = "vendido2"

  }else if(bol.responsable=="nico"){
    what = "vendido3"
  }  else if(bol.responsable=="cami"){
    what = "vendido4"
  }else{
    what = "vendido0"
  }


    if(div1){
        div1.classList.add(what);
        
    }

    if(div2){
        div2.classList.add(what);
    }

    if(div3){
    div3.classList.add(what);
    }
    div1.style.opacity = 0;      
      div2.style.opacity = 0.2;
      div3.style.opacity = 0.2;
  }


  document.getElementById("button-lucky").addEventListener("click", function() {
    
       let totalNoSelled = vector_No_selled.length;
        
       var x = totalNoSelled-1; // El límite superior del rango
      
       
       var iteraciones = 9 + numeroAleatorio(5);


       const factorDeReduccion = 1.1; // Reducción del 10% en cada iteración
let tiempoDeEspera = 90; // Tiempo inicial de espera


for (let index = 0; index < iteraciones; index++) {
   
    setTimeout(function() {
        var aleatorio = numeroAleatorio(x);
       
       // highBox();

        manageClick(vector_No_selled[aleatorio]);
        

    }, tiempoDeEspera * index);
    
    // Reducir el tiempo de espera para la próxima iteración
    tiempoDeEspera *= factorDeReduccion;
}


});


function numeroAleatorio(x) {
  return Math.floor(Math.random() * (x + 1));
}


function playGameSound() {
  var url = "game_click.mp3"
  var audio = new Audio(url);
  audio.volume = 0.03;
  audio.play();
}


document.getElementById("less-tickets").addEventListener("click", function() {

 let input = document.getElementById("n-tickets");
 let actual = input.value;

 if(actual>1){
 input.value = parseInt(actual)-1;
 ticketsToBuy = parseInt(input.value);
 ticketsToBuyChanged();
 }



});

document.getElementById("more-tickets").addEventListener("click", function() {

  let input = document.getElementById("n-tickets");
  let actual = parseInt(input.value);
 
    var x = vector_No_selled.length-1;

    

    

    if (x>maxTicketsToBuy){
      x = maxTicketsToBuy;
    }

  if(actual < x){
  input.value = actual+1;
  ticketsToBuy = parseInt(input.value);
  ticketsToBuyChanged();
  }
 
 
 
 });



 
document.getElementById('listaTickets').addEventListener('change', function(event) {
   
  ticketsToBuy = parseInt(event.target.value)
   
  ticketsToBuyChanged();
 
});




function ticketsToBuyChanged(){
    if(ticketsToBuy>1){
     document.getElementById("button-lucky").style.display = "none";
     document.getElementById("upper-text").textContent = "Selecciona lo(s) número(s):";

    }else{
      document.getElementById("button-lucky").style.display = "flex";
      document.getElementById("upper-text").textContent = "Selecciona el número:";
    }

    
    if(vector_tickets_selected.length>0){
   vector_tickets_selected = [];
   
     clearAll();
      testButtonComprar();
    }
}



function clearAll(){
  let div = document.querySelectorAll(".matrix-numero");
  let div_text = document.querySelectorAll(".matrix-numero-text");
  
  
    div.forEach(function(elemento) {
      elemento.classList.remove("active");
    });
    
    div_text.forEach(function(elemento) {
      elemento.classList.remove("active"); 
    });
  
}



function testButtonComprar(){

  var r = false;
  let el = document.getElementById("button-buy");

  let selected = vector_tickets_selected.length
 
  if(selected<1){
     el.classList.add("desactive");
     r=false;
  }else{
    
    el.classList.remove("desactive");
    r=true;
  }
   return r;
}



document.getElementById('button-buy').addEventListener('click', function() {
  // Lógica que quieres ejecutar cuando se hace clic en el botón "Comprar"
  // Por ejemplo, mostrar el overlay

  if(testButtonComprar()){

    if(vector_tickets_selected.length>1){
      let spanA = document.getElementById("modal-title-a");
      spanA.textContent = "¿Guardar tickets: ";
    }else{
      let spanA = document.getElementById("modal-title-a");
      spanA.textContent = "¿Guardar ticket: ";
    }
     let span = document.getElementById("modal-title-b");
     span.textContent = "No. "+convertirVecATexto (vector_tickets_selected)+"";

    let overlay = document.getElementById("overlay");
    overlay.style.display = "flex";
      
     // enviarWp();
let vendorx = obtenerValorCookieVendor();
    
      if(vendorx!=null){
          if(vendorx!="none"){
              
            establecerSeleccionPorDefecto(vendorx);
          }
      }

  }
 
});



document.getElementById('accept-button').addEventListener('click', function() {

  if(!firstAcceptClick){

    var total= vector_tickets_selected.length * valueTicket;
    document.getElementById("tickets-card").textContent = "("+vector_tickets_selected.length+") Ticket x "+convertirADineroTexto(valueTicket)+" ";
      msgBuilder = "("+vector_tickets_selected.length+")Ticket x "+convertirADineroTexto(valueTicket)+"";
      msgBuilder = msgBuilder +"\n";

    document.getElementById("tickets-card-N").textContent =  "T.No.: ["+vector_tickets_selected.join(', ')+"]";
    msgBuilder = msgBuilder +  "No.: ["+vector_tickets_selected.join(', ')+"]";
    msgBuilder = msgBuilder +"\n";
    
    document.getElementById("total-card-value").textContent = convertirADineroTexto(total);
    msgBuilder = msgBuilder + "Total: "+convertirADineroTexto(total);
    
    document.getElementById("content2-Tickets-value").textContent = vector_tickets_selected.join(", ");
    if(vector_tickets_selected.length>1){
      document.getElementById("content2-Tickets").textContent = "Tickets: ";
    }else{
      document.getElementById("content2-Tickets").textContent = "Ticket: ";
    }

   document.getElementById("modal-content2").style.display = "flex";
   document.getElementById("modal-title").style.display = "none";

   document.getElementById("modal-buttons").style.flexDirection = "row-reverse";


   firstAcceptClick = true;
  }else{

    if(!secondAcceptClick){
document.getElementById("content2-Vendedor-sure").style.display = "flex";
secondAcceptClick = true;
    }else{
      document.getElementById("cancel-button").click();
      document.getElementById("modal-title").style.display = "block";
      document.getElementById("modal-content2").style.display = "none";
      document.getElementById("content2-Vendedor-sure").style.display = "none";

      manageeSendToFire();
      document.getElementById("modal-buttons").style.flexDirection = "row";
      firstAcceptClick = false;
      secondAcceptClick = false;
    }

  }



});



document.getElementById('cancel-button').addEventListener('click', function() {
  let overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  document.getElementById("modal-content2").style.display  = "none";
  document.getElementById("modal-title").style.display = "block";
  document.getElementById("modal-buttons").style.flexDirection = "row";
  document.getElementById("content2-Vendedor-sure").style.display = "none";
  firstAcceptClick=false;
  secondAcceptClick = false;
});




function convertirVecATexto(vector) {
  if (vector.length === 0) return ''; // Si el vector está vacío, retornar cadena vacía
  if (vector.length === 1) return vector[0]; // Si el vector tiene solo un elemento, retornar ese elemento
  if (vector.length === 2) return `${vector[0]} y ${vector[1]}`; // Si hay dos elementos, retornar con 'y'

  let texto = ''; // Inicializar la cadena de texto

  // Recorrer todos los elementos excepto el último
  for (let i = 0; i < vector.length - 1; i++) {
      texto += vector[i] + ', '; // Agregar el elemento seguido de una coma y un espacio
  }

  // Agregar el último elemento precedido por 'y'
  texto += 'y ' + vector[vector.length - 1];

  return texto;
}

function esDispositivoMovil() {
   
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}



function enviarWp() {

  var wapN = "573214960609"
  var iniURL1="https://wa.me";
  var iniURL2="https://web.whatsapp.com";
  

  var m1 = "🎯 *Hola, Quiero comprar la rifa:*\n\n";
 var m2 = "\n\nhttps://teatro5esencia.com/rifa";
    var encondeMessage = encodeURIComponent(m1+"```"+msgBuilder+"```"+m2);
             
           

 // var url1 ="https://wa.me/573214960609?text=Hola%20Quinta%20Esencia%2C%20quisiera%20ponerme%20en%20contacto%20con%20ustedes.";
 // var url2 = "https://web.whatsapp.com/send?phone=573214960609&text=Hola%20Quinta%20Esencia%2C%20quisiera%20ponerme%20en%20contacto%20con%20ustedes.";
 
 var url1 = iniURL1+"/"+wapN+"?text="+encondeMessage;
 var url2 = iniURL2+"/send?phone="+wapN+"&text="+encondeMessage;
  

  if (esDispositivoMovil()) {
    console.log("La página se está ejecutando en un dispositivo móvil.");
     
    window.open(url1, '_blank');
  } else {
    console.log("La página se está ejecutando en una computadora.");
   
    window.open(url2, '_blank');
  }


}


function formatearVectorForWap(vec) {
  return vec.map(elemento => `*[${elemento.padStart(3)} ]*`).join(' ');
}



function convertirADineroTexto(numero) {
  let miles;
  let r;
  if (numero % 1000 !== 0) {
    miles = numero;
    r=numero.toString();
  }else{
    miles = numero / 1000;
    r = miles.toString() + "mil";
  }

  // Dividimos el número por 1000 para obtener los miles
  

  // Convertimos el número a cadena y añadimos "mil"
  return "$"+r;
}



function manageeSendToFire(){
  console.log(filedata);

  var Named= document.getElementById("content2-Nombre-input").value;
  var Numerd= document.getElementById("content2-Numero-input").value;
  var Vendord= document.getElementById("content2-Vendedor-select").value;

  actualVendor = Vendord;

   if(Named==""){
Named = "null";
   }

   if(Numerd==""){
    Numerd = "null";
       }

  for (let index = 0; index < vector_tickets_selected.length; index++) {
    
    console.log(vector_tickets_selected[index]+"   "+Named+"    "+Numerd+"     "+Vendord);
    editarBoleta(vector_tickets_selected[index], Named, Numerd, Vendord);
  }
  
     updateFile(crearArchivoJson());
      updateDom();
     


}

function updateDom(){
  readData();
  manageSections();
  if(actualSelectedNumber!=null){
    console.log(actualSelectedNumber);

      document.getElementById("matrix-numero-img-"+actualSelectedNumber).click();
  
   
  }
}

function editarBoleta(numero, nuevoNombre, nuevoTelefono, nuevoResponsable) {
  // Encontrar el objeto con el número específico
  let boleta = filedata.boletas.find(b => b.numero === numero);
  if (boleta) {
    // Modificar los valores según sea necesario
    boleta.vendido = true;
    boleta.nombre = nuevoNombre;
    boleta.telefono = nuevoTelefono;
    boleta.responsable = nuevoResponsable;
  } else {
    console.log("Boleta no encontrada.");
  }
}


function updateFile(file) {
  const storage = getStorage(app);

  // Create a storage reference from our storage service
  const FileRef = ref(storage, 'data_raffle.json');

  // Raw string is the default if no format is provided
  const metadatos = {
    type: 'application/json',
    lastModified: Date.now(),
    lastModifiedDate: new Date(),
    name: 'data_raffle.json',
    contentEncoding: 'identity',
    contentDisposition: "inline; filename*=utf-8''data_raffle.json",

  };

   
    uploadBytes(FileRef, file, metadatos).then((snapshot) => {
       
      console.log('Uploaded file');
      // Recargar la página
      var date = new Date();
      date.setFullYear(date.getFullYear() + 100); // Añadir 100 años a la fecha actual
      var expires = "expires=" + date.toUTCString();
    
     
     
      document.cookie = "vendor="+actualVendor+"; " + expires + "; path=/";

           location.reload();
    });
   
  

}


function crearArchivoJson() {
  // Objeto JSON original
  const jsonOriginal =  filedata;
   

  // Convertir el objeto JSON a cadena de texto con formato
  const jsonActualizado = JSON.stringify(jsonOriginal, null, 2);

  // Crear un Blob con el contenido JSON
  const blob = new Blob([jsonActualizado], { type: 'application/json' });

  // Crear metadatos para el archivo




  // Devolver el objeto File
  return blob;
}



function obtenerValorCookieVendor() {
  // Obtener todas las cookies
  var cookies = document.cookie.split(';');
  
  // Recorrer todas las cookies para buscar la que tiene el nombre 'vendor'
  for(var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.startsWith("vendor=")) {
          // Extraer y devolver el valor de la cookie
          return cookie.substring("vendor=".length, cookie.length);
      }
  }
  
  return "none"; // La cookie 'vendor' no existe, devuelve 'none'
}




function establecerSeleccionPorDefecto(valor) {
    // Obtener el elemento select
    var select = document.getElementById("content2-Vendedor-select");

    // Iterar sobre las opciones del select
    for (var i = 0; i < select.options.length; i++) {
        // Verificar si el valor de la opción es igual al valor deseado
        if (select.options[i].value === valor) {
            // Establecer la opción como seleccionada
            select.options[i].selected = true;
            break; // Salir del bucle una vez que se ha establecido la selección
        }
    }
}


function waitThen(time, accion) {
  setTimeout(accion, time);
}

document.getElementById("cardDdownloader-button").addEventListener("click", function() {

if (actualSelectedNumber ==  null){
  navigator.vibrate(200); // Vibra durante 200 milisegundos (ms)
  document.getElementById("error-text").style.display = "block";
} else{
  document.getElementById("error-text").style.display = "none";
  var name = "T"+actualSelectedNumber;
  document.getElementById("loader-container-holder2").style.display ="flex";  
  document.getElementById("cardDownloader-icon").style.display ="none";
  document.getElementById("cardDownloader-text").style.display ="none";
  
  // Crear una copia del div
  const originalDiv = document.getElementById("card-container");
  const copyDiv = originalDiv.cloneNode(true);

  // Función para escalar un elemento
  function scaleElement(element, scale) {
    const computedStyle = window.getComputedStyle(element);

    element.style.width = parseFloat(computedStyle.width) * scale + "px";
    element.style.height = parseFloat(computedStyle.height) * scale + "px";
    element.style.fontSize = parseFloat(computedStyle.fontSize) * scale + "px";
    element.style.lineHeight = parseFloat(computedStyle.lineHeight) * scale + "px";

    // Ajustar padding y margin
    element.style.paddingTop = parseFloat(computedStyle.paddingTop) * scale + "px";
    element.style.paddingRight = parseFloat(computedStyle.paddingRight) * scale + "px";
    element.style.paddingBottom = parseFloat(computedStyle.paddingBottom) * scale + "px";
    element.style.paddingLeft = parseFloat(computedStyle.paddingLeft) * scale + "px";

    element.style.marginTop = parseFloat(computedStyle.marginTop) * scale + "px";
    element.style.marginRight = parseFloat(computedStyle.marginRight) * scale + "px";
    element.style.marginBottom = parseFloat(computedStyle.marginBottom) * scale + "px";
    element.style.marginLeft = parseFloat(computedStyle.marginLeft) * scale + "px";
  }

  // Ajustar el tamaño de la copia y de todos sus elementos internos
  const scaleValue = 4;
  scaleElement(copyDiv, scaleValue);
  const children = copyDiv.querySelectorAll('*');
  children.forEach(child => scaleElement(child, scaleValue));

  // Ocultar la copia en la página
  copyDiv.style.position = "absolute";
  copyDiv.style.left = "-9999px";
  document.body.appendChild(copyDiv);

  // Capturar la copia del div
  html2canvas(copyDiv, {
    backgroundColor: null, // Esto asegura que el fondo sea transparente
    useCORS: true, // Permitir el uso de CORS si hay imágenes externas
    scale: scaleValue // Escalar el canvas
  }).then(function(canvas) {
    // Crear un enlace de descarga
    var enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = name+".png";

    // Simular un clic en el enlace para iniciar la descarga
    enlace.click();

    // Eliminar la copia del div después de capturar
    document.body.removeChild(copyDiv);

    waitThen(100, function() {
       
      document.getElementById("loader-container-holder2").style.display ="none";  
      document.getElementById("cardDownloader-icon").style.display ="flex";
      document.getElementById("cardDownloader-text").style.display ="flex";

    });


  });

}
});