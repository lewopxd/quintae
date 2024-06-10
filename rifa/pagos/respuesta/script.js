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


 const testingapp = false;
 var filedata = null;
var vector_tickets_selected =[];
var order = null;

window.addEventListener('load', function() {

   

    const { orderId, status } = obtenerValoresDeURL();

    order = orderId;
    console.log(orderId +"  "+status);
     
    if(status=="approved"){
        
    vector_tickets_selected = getVectorT(orderId);
    console.log(vector_tickets_selected);

   // createCards(vector_tickets_selected);
  
    
   
    readData()
    .then(() => {
          


      document.getElementById("card-title").innerHTML ="Muchas Gracias!<p> ";
      document.getElementById("card-subtitle").textContent ="El pago ha sido recibido con éxito.";
      document.getElementById("card-subtitle2").textContent = "Orden de compra: "+orderId;
      document.getElementById("card-subtitle3").textContent = vectorToString(vector_tickets_selected);
      document.getElementById("form-container").style.display = "block";
      document.getElementById("loader-container-holder3").style.display = "none";
     // document.getElementById("loader-container-holder2").style.display = "none";

       
        console.log(filedata);
       manageeSendToFire("","","bold");
       removeparms();

    }).catch(error => {
      console.error("Error al leer datos", error);
  });

    }else{
         
       removeparms();
        window.location.href = "../../../rifa";
    }
});

function removeparms(){
// Obtener la URL actual sin los parámetros de consulta y la terminación "/index.html"
let urlWithoutParams = window.location.origin + window.location.pathname;
urlWithoutParams = urlWithoutParams.replace(/\/index\.html$/, "");

// Reemplazar la URL actual en el historial sin parámetros de consulta y la terminación "/index.html"
window.history.replaceState({}, document.title, urlWithoutParams);

}

function obtenerValoresDeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('bold-order-id');
    const status = urlParams.get('bold-tx-status');
  
    // Asignar valores a las variables existentes
   let bold_order_id = orderId;
    let bold_tx_status = status;
  
    return { orderId, status };
  }




  async function fetchJson(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener el archivo JSON: ${response.statusText}`);
      }
      const data = await response.json();
       
      return data;
    } catch (error) {
      console.error("Hubo un problema con la solicitud fetch:", error);
      throw error;  
    }
  }


  async function readData() {
    // Uso de la función con una URL de ejemplo
    let url = 'https://firebasestorage.googleapis.com/v0/b/nyl8-e8917.appspot.com/o/data_raffle.json?alt=media&token=239aaef1-14d0-416a-9600-f863b4404319';
    if (testingapp) {
      url = "data_raffle.json";
    }
    return fetchJson(url) // Devuelve la promesa devuelta por fetchJson
      .then(data => {
        filedata = data;
      })
      .catch(error => {
        console.error("Error en el manejo de la promesa:", error);
        throw error; // Lanzar el error para que se maneje externamente
      });
  }



  function crearArchivoJson() {
    
    const jsonOriginal =  filedata;
    const jsonActualizado = JSON.stringify(jsonOriginal, null, 2);
    const blob = new Blob([jsonActualizado], { type: 'application/json' });
    return blob;
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
           console.log("file_updated");
        
           //  location.reload();


      });
     
    
  
  }


  function manageeSendToFire(nombre, telefono, vendedor){
   // console.log(filedata);
  
    var Named= nombre;
    var Numerd= telefono;
    var Vendord= vendedor;
  
    
  
     if(Named==""){
  Named = "null";
     }
  
     if(Numerd==""){
      Numerd = "null";
         }
  
    for (let index = 0; index < vector_tickets_selected.length; index++) {
      
    //  console.log(vector_tickets_selected[index]+"   "+Named+"    "+Numerd+"     "+Vendord);
      editarBoleta(vector_tickets_selected[index], Named, Numerd, Vendord);
    }
    
       updateFile(crearArchivoJson());
  }



  function getVectorT(cadena) {
    // Vector para almacenar los valores que comienzan con 'T'
    let vector_tickets_selected_GET = [];
    
    // Expresión regular para encontrar los valores que comienzan con 'T'
    const regex = /T(\d+)/g;
    
    // Buscar coincidencias en la cadena
    let match;
    while ((match = regex.exec(cadena)) !== null) {
      // Agregar el valor encontrado al vector_tickets_selected
      vector_tickets_selected_GET.push(match[1]);
    }
    
    return vector_tickets_selected_GET;
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



  function vectorToString(vector) {
    // Usa el método join() para unir todos los elementos del vector con una coma como separador
    let aux = "Ticket "
    if(vector.length>1){
aux = "Tickets: "
    }
    return "("+vector.length+") "+aux + "No. "+ vector.join(", ");
  }


  document.getElementById("accept-b").addEventListener("click", function() {
     
    window.location.href = "../../../rifa";

  });

 

  // Agregar un evento al formulario para manejar el envío
document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevenir el envío del formulario para manejarlo con JavaScript

  // Obtener los valores de los campos del formulario
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;

  // Aquí puedes manejar los datos del formulario, por ejemplo, enviarlos a un servidor o mostrarlos en la consola
  console.log('Nombre:', name);
  console.log('Teléfono:', phone);
  console.log(vector_tickets_selected);

  createCards(vector_tickets_selected, name, phone);

  document.getElementById("cardDownloader-container-holder").style.display ="flex";
  if(vector_tickets_selected.length > 2){
document.getElementById("upper-container").style.justifyContent ="unset"; 
  }
  
  document.getElementById("thnks-card-1").style.display ="none"; 

     manageeSendToFire(name, phone, "bold");


});



function createCards(dataArray, name, phone) {
  // Selecciona el contenedor donde se añadirán las tarjetas
  const container = document.getElementById('all-cards-holder');

  // Limpiar el contenedor antes de añadir nuevas tarjetas
  container.innerHTML = '';

  // Iterar sobre el array de datos
  dataArray.forEach((data, index) => {
      // Crear un div contenedor para la tarjeta
      const cardContainer = document.createElement('div');
      cardContainer.id = 'card-container';

      // Construir el contenido HTML para la tarjeta
      cardContainer.innerHTML = `
          <div class="cardWrap" id="cardWrap">
              <div class="card cardLeft">
                  <div class="title-big">
                      <h1>Gana <span>$500.0000</span><span id="minicero">,00</span> <span id="minicop">COP.</span></h1>
                  </div>
                  <div class="title">
                      <h2>Rifa pro-Marruecos</h2>
                      <span>  </span>
                  </div>
                  <div class="name">
                      <h2>Lotería de Boyacá</h2>
                      <span>Juega con 2 últimos dígitos</span>
                  </div>
                  <div class="seat">
                      <div class="nn-nn">15</div>
                      <span>día</span>
                  </div>
                  <div class="time">
                      <div class="nn-nn">JUN</div>
                      <span>mes</span>
                  </div>
                  <div class="valor">
                      <div class="nn-nn">25<mil>mil</mil></div>
                      <span>precio</span>
                  </div>
              </div>
              <div class="card cardRight">
                  <div class="eye">
                      <img id="img-eye" src="logo_light.svg" alt="Logo">
                  </div>
                  <div class="number">
                      <h3 id="big-number-red">${dataArray[index]}</h3>
                      <div class="number-contain">
                          <span id="nombrex">${name}</span>
                          <span id="telefonox">${phone}</span>
                      </div>
                  </div>
                  <div id="barcode-container">
                      <div class="barcode"></div>
                  </div>
              </div>
          </div>
      `;

      // Añadir el nuevo cardContainer al contenedor principal
      container.appendChild(cardContainer);
  });
}

 


document.getElementById("cardDdownloader-button").addEventListener("click", function() {

   
     
    var name = order;
    document.getElementById("loader-container-holder2").style.display ="flex";  
    document.getElementById("cardDownloader-icon").style.display ="none";
    document.getElementById("cardDownloader-text").style.display ="none";
    
    // Crear una copia del div
    const originalDiv = document.getElementById("all-cards-holder");
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


      waitThen(200, function() {
         
        window.location.href = '././';

  
      });
  
  
    });
  
  
  });


  function waitThen(time, accion) {
    setTimeout(accion, time);
  }