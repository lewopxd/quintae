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

window.addEventListener('load', function() {

    const { orderId, status } = obtenerValoresDeURL();
    console.log(orderId +"  "+status);

    if(status=="approved"){
        
    vector_tickets_selected = getVectorT(orderId);
    console.log(vector_tickets_selected);
    readData()
    .then(() => {
          
       
        console.log(filedata);
       manageeSendToFire("","","bold");

    }).catch(error => {
      console.error("Error al leer datos", error);
  });

    }else{
        //no se realizó transacción
    }
});



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
      // Acción a realizar inmediatamente después de leer el archivo JSON
     // console.log("Archivo JSON leído exitosamente:", data);
      return data;
    } catch (error) {
      console.error("Hubo un problema con la solicitud fetch:", error);
      throw error; // Rethrow the error for further handling if needed
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
    console.log(filedata);
  
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
      
      console.log(vector_tickets_selected[index]+"   "+Named+"    "+Numerd+"     "+Vendord);
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