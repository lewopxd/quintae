var filedata = null;
var hidex = true;
window.addEventListener('load', function() {
    console.log("Hola Mundo");
    createCells();
    readData();
});



function createCells(){
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
        divText.id = `matrix-numero-text${String(i).padStart(2, '0')}`;
        divText.textContent = `${String(i).padStart(2, '0')}` ;// Opcional: para mostrar el número dentro del div

        const div2 = document.createElement('div');
        div2.className = 'matrix-numero-img';
        div2.id = `matrix-numero-img-${String(i).padStart(2, '0')}`;
        
        div2.addEventListener('click', function() {
             manageClick(`${String(i).padStart(2, '0')}`);
           
          });

        div0.appendChild(div);
        div0.appendChild(divText);
        div0.appendChild(div2);
        matrixContainer.appendChild(div0);
      
    }


}

function manageClick(i){
console.log(i);
let num = document.getElementById("big-number-red");
let nom = document.getElementById("nombrex");
let tel = document.getElementById("telefonox");

num.innerText = i;
let boleta = (getBoletaByNumero(filedata, i));
var nombre = "Nombre:"
var telefono = "Teléfono:"
if(boleta){
nombre = boleta.nombre;
telefono = boleta.telefono;
console.log(nombre + " --- "+ telefono);

 
 

   if(nombre!=null && nom){
     
     if(hidex){
        nombre = formatString (nombre,1);
       }
       nom.innerText = nombre;
   }else{
    nom.innerText = "Nombre:";
   }

   if(telefono!=null && num){
    if(hidex){
        telefono = formatString (telefono,2);
       }
    tel.innerText = telefono;
  }else{
   tel.innerText = "Teléfono:";
  }
 
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
  fetchJson('https://firebasestorage.googleapis.com/v0/b/nyl8-e8917.appspot.com/o/data_raffle.json?alt=media&token=239aaef1-14d0-416a-9600-f863b4404319')
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
        // Puedes agregar más acciones aquí
      }
    });
  }
  


  function manageMatrix(numero){
 
 
    let div1 = document.getElementById("matrix-numero-img-"+numero);
    let div2 = document.getElementById("matrix-numero-"+numero);
    let div3 = document.getElementById("matrix-numero-text-"+numero);

    let what ="";

    let bol = getBoletaByNumero(filedata, numero);
  console.log(bol.responsable);

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
            

  }