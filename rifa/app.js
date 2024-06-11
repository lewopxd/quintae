 

var filedata = null;
var newfiledata = null;
var hidex = true;
var al = Math.floor(Math.random() * (3300 - 2100 + 1)) + 2100;
var timeToLoad = 2000;
var vector_selled = [];
var vector_No_selled = [];
var ticketsToBuy = 1; //1 si se usa selector de cantidad de tiquetes
var vector_tickets_selected = [];
var maxTicketsToBuy = 100;
var testingapp = false;
var valueTicket = 25000;
var msgBuilder = "";
var firstAcceptClick = false;
var justThis = atob('cmFiYXQyNA==');
var isinvendor = false;

var counClcikerSecure = 0;

var ajustePeso = 50.5;
var order_id = null;
var currency = null;
var amount = null;
var api_key = "YNk51CRDEowDtmwiTPHhgyib-IZ958cn4412y23rVKY";

var integrity_signature = null;
var redirection_url = "https://teatro5esencia.com/rifa/pagos/respuesta/index.html";
var tax = "5";
var description = null;
var actualSelectedNumber = null;
var thisRedirectU = null;
// bad api_key: https://checkout.bold.co/error/generic-error
window.addEventListener('load', function () {
  console.log("Hola Mundo");
  integrity_signature = null;

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


window.addEventListener('message', function(event) {
  // Verifica si el mensaje proviene del iframe correcto (opcional)
   
       actualSelectedNumber = event.data;
      console.log("Valor recibido desde el iframe:", actualSelectedNumber);
      
      // Usa el valor recibido como desees
  
});

function manageSections() {
  return new Promise((resolve, reject) => {



    setTimeout(() => {
      document.getElementById('inicio').style.display = 'none';
      document.getElementById('rifa').style.display = 'block';
      const iframe = document.getElementById('frm');
      const url = "../../rifa-vendor/" + atob("P2F1dGg9dHJ1ZQ==");
      iframe.src = url;
      setLimitInput();
      setListOptions();
      testButtonComprar();
      resolve(); // Llamada a resolve para completar la promesa
    }, timeToLoad);


  });
}


function setLimitInput() {
  setTimeout(() => {
    var input = document.getElementById("n-tickets");
    var vec = vector_No_selled;


    input.setAttribute("max", (vector_No_selled.length - 1));
    input.setAttribute("min", (1));
  }, 1000);
}


function setListOptions() {
  setTimeout(() => {
    var listaDesplegable = document.getElementById("listaTickets");

    var x = vector_No_selled.length;

    if (x > maxTicketsToBuy) {
      x = maxTicketsToBuy - 1;
    } else {
      x = vector_No_selled.length - 2;
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
function createCells() {

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
      divText.textContent = `${String(i).padStart(2, '0')}`;// Opcional: para mostrar el número dentro del div

      const div2 = document.createElement('div');
      div2.className = 'matrix-numero-img';
      div2.id = `matrix-numero-img-${String(i).padStart(2, '0')}`;



      div0.appendChild(div);
      div0.appendChild(divText);
      div0.appendChild(div2);
      matrixContainer.appendChild(div0);


      div2.addEventListener('click', function () {
        manageClick(`${String(i).padStart(2, '0')}`);

      });

    }

    resolve(); // Llamada a resolve para completar la promesa
  });

}

function manageClick(i) {






  if (!vector_selled.includes(i) && !vector_tickets_selected.includes(i)) {
    if (vector_tickets_selected.length < ticketsToBuy) {
      vector_tickets_selected.push(i);
    } else {
      vector_tickets_selected[vector_tickets_selected.length - 1] = i;
    }

  }




  let div = document.getElementById("matrix-numero-" + i);
  let div_T = document.getElementById("matrix-numero-text-" + i);




  if (div.classList.contains("active")) {
    div.classList.remove("active");
    div_T.classList.remove("active");

    vector_tickets_selected = vector_tickets_selected.filter(function (item) {
      return item !== i;
    });

  } else {



    let num = document.getElementById("big-number-red");
    let nom = document.getElementById("nombrex");
    let tel = document.getElementById("telefonox");

    highBox(i);


    num.innerText = i;
    let boleta = (getBoletaByNumero(filedata, i));
    var nombre = "Nombre:"
    var telefono = "Teléfono:"
    if (boleta) {
      nombre = boleta.nombre;
      telefono = boleta.telefono;





      if (nombre != null && nom) {

        if (hidex) {
          nombre = formatString(nombre, 1);
        }
        nom.textContent = nombre;
      } else {
        nom.textContent = "Nombre:";
      }

      if (telefono != null && num) {
        if (hidex) {
          telefono = "Tel: " + formatString(telefono, 1);
        }
        tel.textContent = telefono;
      } else {
        tel.textContent = "Teléfono:";
      }

    }

  }


  testButtonComprar();
}

function highBox(i) {

  let div_id = document.getElementById("matrix-numero-" + i);
  let div_id_text = document.getElementById("matrix-numero-text-" + i);
  let div = document.querySelectorAll(".matrix-numero");
  let div_text = document.querySelectorAll(".matrix-numero-text");

  if (!vector_selled.includes(i)) {
    div.forEach(function (elemento) {

      let str = elemento.id;
      str = str.substring(str.length - 2);

      if (!vector_tickets_selected.includes(str)) {
        elemento.classList.remove("active");
      }

    });

    div_text.forEach(function (elemento) {
      let str = elemento.id;
      str = str.substring(str.length - 2);

      if (!vector_tickets_selected.includes(str)) {
        elemento.classList.remove("active");

      }
    });
  }




  if (vector_selled.includes(i)) {
    // navigator.vibrate([100, 20, 100]);
  } else {


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


function readData() {
  // Uso de la función con una URL de ejemplo
  let url = 'https://firebasestorage.googleapis.com/v0/b/nyl8-e8917.appspot.com/o/data_raffle.json?alt=media&token=239aaef1-14d0-416a-9600-f863b4404319';
  if (testingapp) {
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
    } else {
      vector_No_selled.push(boleta.numero);
    }
  });
}



function manageMatrix(numero) {


  let div1 = document.getElementById("matrix-numero-img-" + numero);
  let div2 = document.getElementById("matrix-numero-" + numero);
  let div3 = document.getElementById("matrix-numero-text-" + numero);

  let what = "";

  let bol = getBoletaByNumero(filedata, numero);


  if (bol.responsable == "leo") {
    what = "vendido1"
  } else if (bol.responsable == "paula") {
    what = "vendido2"

  } else if (bol.responsable == "nico") {
    what = "vendido3"
  } else if (bol.responsable == "cami") {
    what = "vendido4"
  } else {
    what = "vendido0"
  }


  if (div1) {
    div1.classList.add(what);

  }

  if (div2) {
    div2.classList.add(what);
  }

  if (div3) {
    div3.classList.add(what);
  }


}


document.getElementById("button-lucky").addEventListener("click", function () {

  let totalNoSelled = vector_No_selled.length;

  var x = totalNoSelled - 1; // El límite superior del rango


  var iteraciones = 9 + numeroAleatorio(5);


  const factorDeReduccion = 1.1; // Reducción del 10% en cada iteración
  let tiempoDeEspera = 90; // Tiempo inicial de espera


  for (let index = 0; index < iteraciones; index++) {

    setTimeout(function () {
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


document.getElementById("less-tickets").addEventListener("click", function () {

  let input = document.getElementById("n-tickets");
  let actual = input.value;

  if (actual > 1) {
    input.value = parseInt(actual) - 1;
    ticketsToBuy = parseInt(input.value);
    ticketsToBuyChanged();
  }



});

document.getElementById("more-tickets").addEventListener("click", function () {

  let input = document.getElementById("n-tickets");
  let actual = parseInt(input.value);

  var x = vector_No_selled.length - 1;





  if (x > maxTicketsToBuy) {
    x = maxTicketsToBuy;
  }

  if (actual < x) {
    input.value = actual + 1;
    ticketsToBuy = parseInt(input.value);
    ticketsToBuyChanged();
  }



});




document.getElementById('listaTickets').addEventListener('change', function (event) {

  ticketsToBuy = parseInt(event.target.value)

  ticketsToBuyChanged();

});




function ticketsToBuyChanged() {
  if (ticketsToBuy > 1) {
    document.getElementById("button-lucky").style.display = "none";
    document.getElementById("upper-text").textContent = "Selecciona tu(s) número(s):";

  } else {
    document.getElementById("button-lucky").style.display = "flex";
    document.getElementById("upper-text").textContent = "Selecciona tu número:";
  }


  if (vector_tickets_selected.length > 0) {
    vector_tickets_selected = [];

    clearAll();
    testButtonComprar();
  }
}



function clearAll() {
  let div = document.querySelectorAll(".matrix-numero");
  let div_text = document.querySelectorAll(".matrix-numero-text");


  div.forEach(function (elemento) {
    elemento.classList.remove("active");
  });

  div_text.forEach(function (elemento) {
    elemento.classList.remove("active");
  });

}



function testButtonComprar() {

  var r = false;
  let el = document.getElementById("button-buy");

  let selected = vector_tickets_selected.length

  if (selected < 1) {
    el.classList.add("desactive");
    r = false;
  } else {

    el.classList.remove("desactive");
    r = true;
  }
  return r;
}



document.getElementById('button-buy').addEventListener('click', function () {
  // Lógica que quieres ejecutar cuando se hace clic en el botón "Comprar"
  // Por ejemplo, mostrar el overlay

  if (testButtonComprar()) {

    if (vector_tickets_selected.length > 1) {
      let spanA = document.getElementById("modal-title-a");
      spanA.textContent = "Comprar tickets: ";
    } else {
      let spanA = document.getElementById("modal-title-a");
      spanA.textContent = "Comprar ticket: ";
    }
    let span = document.getElementById("modal-title-b");
    span.textContent = "No. " + convertirVecATexto(vector_tickets_selected);

    let overlay = document.getElementById("overlay");
    overlay.style.display = "flex";

    // enviarWp();
  }

});



document.getElementById('accept-button').addEventListener('click', function () {

  if (!firstAcceptClick) {

    var total = vector_tickets_selected.length * valueTicket;
    document.getElementById("tickets-card").textContent = "(" + vector_tickets_selected.length + ") Ticket x " + convertirADineroTexto(valueTicket) + " ";
    msgBuilder = "(" + vector_tickets_selected.length + ")Ticket x " + convertirADineroTexto(valueTicket) + "";
    msgBuilder = msgBuilder + "\n";

    document.getElementById("tickets-card-N").textContent = "T.No.: [" + vector_tickets_selected.join(', ') + "]";
    msgBuilder = msgBuilder + "No.: [" + vector_tickets_selected.join(', ') + "]";
    msgBuilder = msgBuilder + "\n";

    document.getElementById("total-card-value").textContent = convertirADineroTexto(total);
    msgBuilder = msgBuilder + "Total: " + convertirADineroTexto(total);


    document.getElementById("modal-content").style.display = "block";
    document.getElementById("modal-title").style.display = "none";

    document.getElementById("modal-buttons").style.flexDirection = "row-reverse";



    if (!isinvendor) {
      manageBoldOpsBefore();

    }


    firstAcceptClick = true;
  } else {


    document.getElementById("cancel-button").click();
    document.getElementById("modal-title").style.display = "block";
    enviarWp();
    document.getElementById("modal-buttons").style.flexDirection = "row";
    firstAcceptClick = false;
  }



});
//------------------------------------------------------------------------------------------------>>>>
//------------------------------------------------------------------------------------------------>>>>
//--------------------------------[    T   E  S  T]---------------------------------------------------------------->>>>
//------------------------------------------------------------------------------------------------>>>>
//------------------------------------------------------------------------------------------------>>>>

function manageBoldOpsBefore() {
  document.getElementById("loader-container-holder2").style.display = "flex";

  document.getElementById("modal-buttons").style.flexDirection = "row";
  document.getElementById("modal-buttons").style.display = "none";
  document.getElementById("modal-x-button").style.display = "none";

  document.getElementById("modal-content").style.display = "none";


  // que hacer antes de mostrar el boton?  

  //   1. Calcular los valores solicitando el hash
  calculateBoldValues();

  //2. Evaluar si ya existen los valores

  // >>>> calculateBoldValues then => checkBoldParameters

  //   

  // manageBoldOpsAfter();
  //CHECKBOLDwebResponse


  // si el boton no funciona entonces solo mostrar la opción de whataspp ?
}

function calculateBoldValues() {
  console.log("calculando ... bold");

  let intentos = 15;
  let tiempo_espera = 1000;
  var Ntickets = vector_tickets_selected.length;

  var ticketsString = vector_tickets_selected.join(', ');

  var sAux = "";
  if (Ntickets > 1) {
    sAux = "s";
  }

  var idBuilder = builID(vector_tickets_selected);
  var costoBold = (((3.29 * (valueTicket * Ntickets)) / 100) + 900) + ajustePeso;
  var calculateTotalBold = aproximarEnteroSiguiente((valueTicket * Ntickets) + costoBold);
  var descrptionString = "[ (" + Ntickets + ") Ticket" + sAux + ": No. " + ticketsString + " ] + IVA"

  order_id = idBuilder;
  currency = "COP";
  amount = calculateTotalBold;
   description = descrptionString;
   

  // Generar un parámetro de consulta único
  const uniqueParam = new Date().getTime();
  const urlp = `https://nyl8-e8917.web.app/bold/transactioner/bfun.js?${uniqueParam}`;

  var dots = ".";
  // Función para intentar cargar el script con reintentos
  function fetchWithRetry(url, attempts) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Fetch failed');
        }
        return response.text();
      })
      .catch(error => {
        if (attempts === 1) {
          throw error;
        }
        console.log(`Reintentando cargar el script... intentos restantes: ${attempts - 1}`);

        let msg_error_red = "";

        if (attempts <= (intentos - 11)) {
          msg_error_red = "Tenemos problemas con la velocidad de tu internet..."
        } else if (attempts <= (intentos - 6)) {
          msg_error_red = "Esto esta tardando más de lo normal..."
        } else if (attempts <= (intentos)) {
          msg_error_red = "Procesando Información..."
        }


        document.getElementById("error-loader-spinner").style.display = "block";

        document.getElementById("error-loader-spinner").textContent = msg_error_red + " (" + (attempts - 1) + ")";


        return new Promise(resolve => setTimeout(resolve, tiempo_espera))
          .then(() => fetchWithRetry(url, attempts - 1));
      });
  }

  
  // Llamar a fetchWithRetry con 10 intentos
  fetchWithRetry(urlp, intentos)
    .then(scriptContent => {
      const script = document.createElement('script');
      script.id = "script0";
      script.textContent = ofusc(scriptContent);
      document.body.appendChild(script);

      // Llamar a bFunBuilder después de cargar el script
      return callBFun(urlp, idBuilder, calculateTotalBold, "COP");
    })
    .then(hash => {
      // console.log('Hash obtenido:', hash);

      integrity_signature = hash;




      return insertarParametrosEnScript("bold-script", order_id, currency, amount, api_key, integrity_signature, redirection_url, tax, description);
    })
    .then(() => {

      document.getElementById("wrapper").style.display = "flex";
      document.getElementById("error-loader-spinner").style.display = "none";
      document.getElementById("error-loader-spinner").style.color = "var(--color-red)";


      console.log('Parámetros insertados en el script');

      // Revisar si se insertaron los parámetros -- intentos: 10
      CheckBoldParameters("bold-script", order_id, currency, amount, api_key, integrity_signature, redirection_url, tax, description, 10);
    })
    .catch(error => {
      console.log("ups no pude cargar el js");

      document.getElementById("wrapper").style.display = "none";
      document.getElementById("error-loader-spinner").textContent = "";
      document.getElementById("error-loader-spinner").style.color = "black";
      document.getElementById("error-loader-spinner").innerHTML = "<h1>Lamentamos los inconvenientes 🥺</h1><br>Por favor actualiza la página o intenta más tarde.<br>¡Contamos con tu apoyo!";
      console.error('Error:', error);
    });
}



function CheckBoldParameters(scriptId, orderId, currency, amount, apiKey, integritySignature, redirectionUrl, tax, description, maxAttempts) {
  // console.log(scriptId, orderId, currency, amount, apiKey, integritySignature, redirectionUrl, tax, description, maxAttempts);

  const boldScriptElement = document.getElementById(scriptId);

  if (!boldScriptElement) {
    console.error('No se encontró ningún elemento con el ID:', scriptId);
    return;
  }

  let attempts = 0;

  const checkParameters = () => {
    let allParametersCorrect = true;

    const parameters = [
      { attribute: 'data-order-id', value: orderId },
      { attribute: 'data-currency', value: currency },
      { attribute: 'data-amount', value: amount },
      { attribute: 'data-api-key', value: apiKey },
      { attribute: 'data-integrity-signature', value: integritySignature },
      { attribute: 'data-redirection-url', value: redirectionUrl },
      { attribute: 'data-tax', value: `vat-${tax}` },
      { attribute: 'data-description', value: description }
    ];

    parameters.forEach(param => {
      const attrValue = boldScriptElement.getAttribute(param.attribute);
      //  console.log(`Verificando ${param.attribute}: esperado=${param.value}, encontrado=${attrValue}`);
      if (String(attrValue) != String(param.value)) {
        console.log("!!!!!! " + attrValue + "   no es igual a: " + param.value);
        allParametersCorrect = false;
      } else if (attrValue == null) {
        console.log("! " + attrValue + " = null");
        allParametersCorrect = false;
      } else if (param.value == null) {

        console.log("! " + param.value + " = null");
        allParametersCorrect = false;

      } else {
        //console.log (">>>>> "+attrValue+"  es igual a: "+param.value);
      }
    });

    if (allParametersCorrect) {
      document.getElementById("error-loader-spinner").style.display = "none";
      document.getElementById("error-loader-spinner").textContent = "";
      console.log('Parámetros insertados y valores correctos');

      manageBoldOpsAfter();

      return;
    } else {
      document.getElementById("error-loader-spinner").style.display.color = "var(--color-red)";
      document.getElementById("error-loader-spinner").style.display = "block";
      document.getElementById("error-loader-spinner").textContent = "";
      attempts++;
      if (attempts < maxAttempts) {
        console.log(`Intento ${attempts}: Esperando 1 segundo...`);


        var msg_e = "";


        if (attempts >= (maxAttempts / 2)) {
          msg_e = ""
        } else if (attempts >= 0) {
          msg_e = ""
        }


        document.getElementById("error-loader-spinner").innerHTML = msg_e;

        setTimeout(checkParameters, 1000);
      } else {

        manageBoldOpsAfter2();

        return;
/**
        document.getElementById("error-loader-spinner").style.display = "block";
        document.getElementById("wrapper").style.display = "none";
        document.getElementById("error-loader-spinner").textContent = "";
        document.getElementById("error-loader-spinner").style.color = "black";
        document.getElementById("error-loader-spinner").innerHTML = "<h1>Lamentamos los inconvenientes  🥺</h1><br>Actualiza la página o intenta mas tarde<br>¡Contamos con tu apoyo!"
        console.error('Se alcanzó el número máximo de intentos sin encontrar todos los parámetros con los valores correctos.');
     
      **/
      }

    }
  };
  checkParameters();

}


function checkBoldWebResponse() {
  getUrlBold();
}

 

function getUrlBold() {
  // Llama a la función y utiliza .then() para manejarla después de que se haya creado el listener
agregarClickListener()
.then((elementoConListener) => {
  console.log("Listener configurado correctamente en el elemento:", elementoConListener);
 // elementoConListener.click();
  
}).then(() => {
  console.log("Se hizo clic en el elemento.");
  const url = thisRedirectU;
   
obtenerUrlRedireccion(url)
  .then(redirectUrl => {
    console.log('URL de redirección:', redirectUrl);
   
  });
})
.catch((error) => {
  console.error("Error al configurar el listener:", error);
});

}
 
 

//>>>>>>>>>>>
 

//>>>>>>>>>>>


function manageBoldOpsAfter() {
  esperar(800)
    .then(() => {
      document.getElementById("modal-x-button").style.display = "block";

      document.getElementById("modal-content").style.display = "block";
      document.getElementById("loader-container-holder2").style.display = "none";

      esperar(0)
        .then(() => {



        console.log("bold is working");

        removeScript0();
            
        //  checkBoldWebResponse();
        });
    });
}


function manageBoldOpsAfter2() {
  esperar(800)
    .then(() => {
      document.getElementById("modal-x-button").style.display = "block";

      document.getElementById("modal-content").style.display = "block";
      document.getElementById("loader-container-holder2").style.display = "none";
      document.getElementById("nequi-card").textContent="Continúa en nuestro chat de whatsapp para terminar la compra ";
      document.getElementById("number-nequi-card").textContent="";
  
      document.getElementById("p-nequi2").textContent="";
      document.getElementById("button-PAY").style.display = "none"
   
     
     
       esperar(0)
        .then(() => {


        //  checkBoldWebResponse();
        });
    });
}

function esperar(time) {
  return new Promise(resolve => {

    setTimeout(() => {


      resolve();
    }, time);
  });
}



document.getElementById('cancel-button').addEventListener('click', function () {
  let overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  document.getElementById("modal-content").style.display = "none";
  document.getElementById("modal-title").style.display = "block";
  document.getElementById("modal-buttons").style.flexDirection = "row";
  firstAcceptClick = false;
});





function callBFun(url, id, monto, divisa) {
  //console.log("calling bFunBuilder("+id, monto, divisa+") in "+ url);
  return new Promise((resolve, reject) => {
    // Realiza una solicitud GET para obtener el archivo JavaScript desde el sitio B
    fetch(url)
      .then(response => {
        // Verifica si la respuesta es exitosa
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Ejecuta el JavaScript obtenido en el contexto global de la página A
        return response.text();
      })
      .then(js => {
        eval(js); // Ejecuta el JavaScript obtenido

        // Llama a la función en el sitio B y devuelve la promesa resultante
        //console.log("id: "+ id +"   monto: "+monto+"    divisa: "+divisa);
        return bFunBuilder(id, monto, divisa);
      })
      .then(hash => {
        // Resuelve la promesa con el hash obtenido
        resolve(hash);
      })
      .catch(error => {
        // Rechaza la promesa con el error obtenido
        reject(error);
      });
  });
}


function builID(vec) {
  // Itera sobre cada elemento del vector y agrega 'T' al inicio de cada valor
  const res = "5ERIF241" + vec.map(valor => 'T' + valor).join('');
  return res;
}


function aproximarEnteroSiguiente(numero) {
  var x = Math.ceil(numero);

  return aproximarACentena(x);
}

function aproximarACentena(numero) {
  return Math.round(numero / 100) * 100;
}


function insertarParametrosEnScript(scriptId, orderId, currency, amount, apiKey, integritySignature, redirectionUrl, tax, description) {
  // Obtener el elemento con el ID proporcionado
  const boldScriptElement = document.getElementById(scriptId);

  // Verificar si el elemento existe
  if (boldScriptElement) {
    // Actualizar los atributos del elemento
    boldScriptElement.setAttribute('data-order-id', orderId);
    boldScriptElement.setAttribute('data-currency', currency);
    boldScriptElement.setAttribute('data-amount', amount);
    boldScriptElement.setAttribute('data-api-key', apiKey);
    boldScriptElement.setAttribute('data-integrity-signature', integritySignature);
    boldScriptElement.setAttribute('data-redirection-url', redirectionUrl);
    boldScriptElement.setAttribute('data-tax', `vat-${tax}`);
    boldScriptElement.setAttribute('data-description', description);

    //console.log('Parámetros actualizados en el script exitosamente.');
  } else {
    console.error('No se encontró ningún elemento con el ID:', scriptId);
  }

}



function caracterYNumeroAlAzar() {
  // Carácter aleatorio entre A y Z
  const caracter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Código ASCII para A es 65

  // Número aleatorio entre 00 y 99
  const numero = ('0' + Math.floor(Math.random() * 100)).slice(-2); // Asegura que el número tenga dos dígitos

  return caracter + numero;
}





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
  var iniURL1 = "https://wa.me";
  var iniURL2 = "https://web.whatsapp.com";


  var m1 = "🎯 *Hola, Quiero comprar la rifa:*\n\n";
  var m2 = "\n\nhttps://teatro5esencia.com/rifa";
  var encondeMessage = encodeURIComponent(m1 + "```" + msgBuilder + "```" + m2);



  // var url1 ="https://wa.me/573214960609?text=Hola%20Quinta%20Esencia%2C%20quisiera%20ponerme%20en%20contacto%20con%20ustedes.";
  // var url2 = "https://web.whatsapp.com/send?phone=573214960609&text=Hola%20Quinta%20Esencia%2C%20quisiera%20ponerme%20en%20contacto%20con%20ustedes.";

  var url1 = iniURL1 + "/" + wapN + "?text=" + encondeMessage;
  var url2 = iniURL2 + "/send?phone=" + wapN + "&text=" + encondeMessage;


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
    r = numero.toString();
  } else {
    miles = numero / 1000;
    r = miles.toString() + "mil";
  }

  // Dividimos el número por 1000 para obtener los miles


  // Convertimos el número a cadena y añadimos "mil"
  return "$" + r;
}


function createListenersSecure() {
  document.getElementById('btn-cancel-secur').addEventListener('click', function () {
    document.getElementById("overlay-secur").style.display = "none";
    counClcikerSecure = 0;
    isinvendor = false;
  });

  document.getElementById('btn-accpet-secur').addEventListener('click', function () {
    document.getElementById("overlay-secur").style.display = "none";
    counClcikerSecure = 0;
    document.getElementById("overlay-secure-pswd").style.display = "flex";
  });


  document.getElementById('btn-cancel-pswd').addEventListener('click', function () {

    document.getElementById("overlay-secure-pswd").style.display = "none";
    counClcikerSecure = 0;
    isinvendor = false;
  
  });
  
  
  document.getElementById('btn-accept-pswd').addEventListener('click', function () {
    var x = document.getElementById("overlay-secure-pswd-input").value;
    if (x == justThis) {
  
      document.getElementById("overlay-secure-pswd").style.display = "none";
      document.getElementById("overlay-frame").style.display = "flex";
      document.getElementById("botonSuperiorDerecha").style.display = "block";
      createCookieAuth();
      isinvendor = true;
  
    } else {
      navigator.vibrate(200);
  
      var el = document.getElementById('overlay-secure-pswd-card-id');
  
  
  
      el.classList.remove("shake");
      void el.offsetWidth;
      el.classList.add("shake");
  
      isinvendor = false;
  
  
    }
  
    counClcikerSecure = 0;
  
  
  });
  

}


document.getElementById('eye-go').addEventListener('click', function () {
  counClcikerSecure++;
  startAsyncCounter();

  if (counClcikerSecure == 3) {

    if (existeCookieUserAuth()) {
     
      document.getElementById("overlay-frame").style.display = "flex";
      document.getElementById("botonSuperiorDerecha").style.display = "block";
      isinvendor = true;


    } else {


      addVendorToDom()
      .then((mensaje) => {
        console.log(mensaje);

        createListenersSecure();
        
      document.getElementById("overlay-frame").style.display = "none";
      document.getElementById("overlay-secur").style.display = "flex";
      isinvendor = false;
      counClcikerSecure = 0;

      })
      .catch((error) => {
        console.error(error);
      });


    }
  }


});













async function startAsyncCounter() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1900); // 3000 milisegundos = 3 segundos
  });
  counClcikerSecure = 0;
}



function existeCookieUserAuth() {
  // Obtener todas las cookies
  var cookies = document.cookie.split(';');
  var exist = false;
  // Recorrer todas las cookies para buscar la que tiene el valor 'user=auth'
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith("user=") && cookie.includes("auth")) {
      var exist = true;
      console.log("cookie_existe? " + exist + " --");
      createCookieAuth();
      return true; // Se encontró la cookie 'user=auth'
    }
  }



  exist = false;
  console.log("cookie_existe? " + exist + "---");

  return false; // No se encontró la cookie 'user=auth'
}

function createCookieAuth() {
  var date = new Date();
  date.setMonth(date.getMonth() + 2); // Añadir 2 meses a la fecha actual
  var expires = "expires=" + date.toUTCString();

  document.cookie = "user=auth; " + expires + "; path=/";
}


document.getElementById('botonSuperiorDerecha').addEventListener('click', function () {

  updateAll()
    .then(() => {
      document.getElementById("overlay-frame").style.display = "none";
      document.getElementById("botonSuperiorDerecha").style.display = "none";
        console.log("updateAll completado exitosamente");
    })
    .catch(error => {
        console.error("Error en updateAll:", error);
    });


  
});

function updateAll() {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          updateJsonData()
              .then(() => {
                  updateDomScreen();
                  resolve();
              })
              .catch(error => {
                  reject(error);
              });
      }, 100);
  });
}


 
    function updateJsonData() {
      return new Promise((resolve, reject) => {
           readData();
           
              resolve();
           
      });
  }
          



function updateDomScreen(){
console.log("actializando Dom");
manageSections();

window.location.reload();
}


 

document.getElementById('modal-x-button').addEventListener('click', function () {
  let overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  document.getElementById("modal-content").style.display = "none";
  document.getElementById("modal-title").style.display = "block";
  document.getElementById("modal-buttons").style.flexDirection = "row";
  document.getElementById("modal-buttons").style.display = "flex";
  document.getElementById("modal-x-button").style.display = "none";
  firstAcceptClick = false;

});


document.getElementById('WhatsApp-PAY').addEventListener('click', function () {
  enviarWp();
  document.getElementById("modal-x-button").click();

});


function agregarClickListener() {
  return new Promise((resolve, reject) => {
    // Obtener el elemento que contiene el shadow root
    const container = document.querySelector('bold-payment-button');
    
    if (!container) {
      reject("No se pudo encontrar el contenedor con shadow root.");
      return;
    }

    // Obtener el shadow root del elemento
    const shadowRoot = container.shadowRoot;
    
    if (!shadowRoot) {
      reject("No se pudo encontrar el shadow root.");
      return;
    }

    // Encontrar el elemento dentro del shadow root
    const boldPaymentButton = shadowRoot.querySelector('#boldPaymentButton');
    
    if (!boldPaymentButton) {
      reject("No se pudo encontrar el elemento con id boldPaymentButton dentro del shadow root.");
      return;
    }

    // Agregar el event listener para el clic
    boldPaymentButton.addEventListener('click', function() {
      // Imprimir que se hizo clic
      console.log('Se hizo clic en el elemento con id boldPaymentButton: ' + thisRedirectU);
    });

    console.log("Listener armado.");

    // Resuelve la promesa pasando el elemento como valor
    resolve(boldPaymentButton);
  });
}





////// Script button
(function () {
  "use strict";
  function O(t, n) {
    t.insertAdjacentElement("afterend", n);
  }
  const a = "Pagar con", g = "dark", y = "light", A = "S", p = "M", N = "L", i = "boldPaymentButton", r = "boldPaymentButtonStyles", D = "boldLogo", S = [`${i}--${g}`, `${i}--${N}`], c = "bold-payment-button", b = "<bold>", s = {JS_LIBRARY: "library", HTML_SCRIPT: "script", NO_AMOUNT: "no-amount"}, l = '@import"https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap";[id^=boldPaymentButton]{position:relative;display:flex;justify-content:center;align-items:center;border:none;font-family:Montserrat,sans-serif;font-weight:500;cursor:pointer;gap:8px;user-select:none}.boldPaymentButton--dark{background:linear-gradient(270deg,#ee424e 13.86%,#121e6c 83.33%);color:#fff;.boldLogo{content:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA1OSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjA3NDEgMTMuNTY2NEgzMi4zNDlDMzIuMDA1OCAxNy4xNzAxIDI4LjkzNjUgMTkuOTk5NCAyNS4yMTA5IDE5Ljk5OTRDMjEuNDg1NCAxOS45OTk0IDE4LjQxNjcgMTcuMTcwMSAxOC4wNzM1IDEzLjU2NjRIMTguMDc0MVpNNy44ODk2NyA1LjgyNDVWMTkuOTY3NEMxMS41MjUyIDE5LjYyNzMgMTQuMzgxNyAxNi41ODU5IDE0LjM4MTcgMTIuODk1N0MxNC4zODE3IDkuMjA1NDMgMTEuNTI1MiA2LjE2NTIgNy44ODk2NyA1LjgyNTA5VjUuODI0NVpNMjUuMjExNSA1Ljc5MjVDMjEuNDg2NiA1Ljc5MjUgMTguNDE3MyA4LjYyMjk4IDE4LjA3NDEgMTIuMjI2N0gzMi4zNDlDMzIuMDA1OCA4LjYyMjk4IDI4LjkzNjUgNS43OTI1IDI1LjIxMDkgNS43OTI1SDI1LjIxMTVaTTAuNjc5Njg4IDEwLjk1NDZWMjBINi40OTQzM1YwSDAuNjc5Njg4VjEwLjk1NDZaTTUyLjUwNTcgMFYxOS45OTk0SDU4LjMyMDNWMEg1Mi41MDU3Wk00NC42NTk5IDEyLjg5NjJDNDQuNjU5OSAxMy4zNDU0IDQ0LjcwNDEgMTMuNzgzOCA0NC43ODUgMTQuMjA5OUM0NS4zNjg4IDE3LjI4NTEgNDcuOTU4OCAxOS42NjgyIDUxLjE1MjYgMTkuOTY2OFY1LjgyNDVDNDcuNTE3MSA2LjE2NDYgNDQuNjYwNSA5LjIwNjAyIDQ0LjY2MDUgMTIuODk2Mkg0NC42NTk5Wk0zNS4yODk2IDE5Ljk5OTRINDEuMTA0MlYwSDM1LjI4OTZWMTkuOTk5NFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==)}}.boldPaymentButton--light{background:#f7f8fb;color:#121e6c;.boldLogo{content:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA1OSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjA3NDEgMTMuNTY2NEgzMi4zNDlDMzIuMDA1OCAxNy4xNzAxIDI4LjkzNjUgMTkuOTk5NCAyNS4yMTA5IDE5Ljk5OTRDMjEuNDg1NCAxOS45OTk0IDE4LjQxNjcgMTcuMTcwMSAxOC4wNzM1IDEzLjU2NjRIMTguMDc0MVpNNy44ODk2NyA1LjgyNDVWMTkuOTY3NEMxMS41MjUyIDE5LjYyNzMgMTQuMzgxNyAxNi41ODU5IDE0LjM4MTcgMTIuODk1N0MxNC4zODE3IDkuMjA1NDMgMTEuNTI1MiA2LjE2NTIgNy44ODk2NyA1LjgyNTA5VjUuODI0NVpNMjUuMjExNSA1Ljc5MjVDMjEuNDg2NiA1Ljc5MjUgMTguNDE3MyA4LjYyMjk4IDE4LjA3NDEgMTIuMjI2N0gzMi4zNDlDMzIuMDA1OCA4LjYyMjk4IDI4LjkzNjUgNS43OTI1IDI1LjIxMDkgNS43OTI1SDI1LjIxMTVaTTAuNjc5Njg4IDEwLjk1NDZWMjBINi40OTQzM1YwSDAuNjc5Njg4VjEwLjk1NDZaTTUyLjUwNTcgMFYxOS45OTk0SDU4LjMyMDNWMEg1Mi41MDU3Wk00NC42NTk5IDEyLjg5NjJDNDQuNjU5OSAxMy4zNDU0IDQ0LjcwNDEgMTMuNzgzOCA0NC43ODUgMTQuMjA5OUM0NS4zNjg4IDE3LjI4NTEgNDcuOTU4OCAxOS42NjgyIDUxLjE1MjYgMTkuOTY2OFY1LjgyNDVDNDcuNTE3MSA2LjE2NDYgNDQuNjYwNSA5LjIwNjAyIDQ0LjY2MDUgMTIuODk2Mkg0NC42NTk5Wk0zNS4yODk2IDE5Ljk5OTRINDEuMTA0MlYwSDM1LjI4OTZWMTkuOTk5NFoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl83MzJfMzAxNDkpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNzMyXzMwMTQ5IiB4MT0iNTguMzIwMyIgeTE9IjEwIiB4Mj0iMC42Nzk2ODYiIHkyPSI5Ljk5OTk5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIG9mZnNldD0iMC4xMzg2MTQiIHN0b3AtY29sb3I9IiNFRTQyNEUiLz4KPHN0b3Agb2Zmc2V0PSIwLjgzMzMzMyIgc3RvcC1jb2xvcj0iIzEyMUU2QyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==)}}.boldPaymentButton--L{height:48px;padding:16px 32px;border-radius:32px;font-size:14px;line-height:20px}.boldPaymentButton--M{height:40px;padding:12px 28px;border-radius:26.667px;font-size:12px;line-height:16px;.boldLogo{width:46px}}.boldPaymentButton--S{height:32px;padding:8px 20px;border-radius:21.333px;font-size:11px;line-height:12px;.boldLogo{width:40px}}';
  class I extends HTMLElement {
    constructor() {
      super(), this.attachShadow({mode: "open"}), this._addButtonHTMLToShadowDOM();
    }
    _addButtonHTMLToShadowDOM() {
      this.shadowRoot.innerHTML = `
      <style>${l}</style>
      <button id=${i}><span>${a}</span><i class=${D}></i></button>
    `;

   
    }
  }
  function m(t, n) {
    if (!t.integrationType) {
      const o = n ? s.JS_LIBRARY : s.HTML_SCRIPT, e = !t.amount || t.amount === "0";
      t.integrationType = e ? `${s.NO_AMOUNT}-${o}` : o;
    }
  }
  function f(t) {
    t.openingTime || (t.openingTime = String(Date.now()));
  }
  function k(t) {
    t.originUrl || (t.originUrl = window.location.href);
  }
  function B(t, n) {
    k(n), f(n), m(n, t);
  }
  const h = "https://checkout.bold.co", j = "BoldPaymentButton", M = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~=&";
  function U(t, n) {
    const o = M.indexOf(t);
    if (o === -1) return t;
    const e = (o + n + M.length) % M.length;

    
      
    return M[e];
  }
  function z(t) {
    let n = "";
    for (let o = 0; o < t.length; o++) {
      const e = j.charCodeAt(o % j.length);
      n += U(t[o], e);
    }
    return n;
  }
  function _(t) {
    const n = t.currentTarget, o = t.composedPath().find(n => n instanceof I);
    return !!o ? o.previousElementSibling : n.previousElementSibling;
  }
  function R(t) {
    const o = _(t).dataset;
    return delete o.boldButton, o;
  }
  function L(t, {isBoldCheckoutLibrary: n} = {isBoldCheckoutLibrary: false}) {
    B(n, t);
    const o = Object.keys(t).map(n => `${n.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}=${t[n]}`).join(b), e = z(o), u = `${h}/btn?${encodeURIComponent(e)}`;
   
      // Imprimir la URL generada en la consola
   //   console.log("URL generada:", u);
      thisRedirectU = u;
       
      document.getElementById("modal-content").style.display = "none";
      document.getElementById("modal-card-alert").style.display = "block"; 
      document.getElementById("modal-x-button").style.display = "none";
      iniciarPuntosEnConsola(300);

      esperaXSegundos(() => {
        
        window.location.href = u;
    });
   //
  }


  function esperaXSegundos(callback) {
    setTimeout(callback, 2700); // 2000 milisegundos = 2 segundos
}

  function L2(t, {isBoldCheckoutLibrary: n} = {isBoldCheckoutLibrary: false}) {
    B(n, t);
    const o = Object.keys(t).map(n => `${n.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}=${t[n]}`).join(b), e = z(o), u = `${h}/btn?${encodeURIComponent(e)}`;
   console.log(u);
  }
  function Y(t) {
    const n = R(t);
    
    L(n);
  }
  function Z(t) {
    const n = document.createElement("button");
    return n.type = "button", n.id = t ? `${i}-${t}` : i, n.innerHTML = `<span>${a}</span><i class=${D}></i>`, n;
  }
  function $() {
    const t = document.createElement("style");
    t.innerHTML = l, t.id = r, document.head.appendChild(t);
  }
  function H() {
    customElements.define(c, I);
  }
  function v(t) {
    if (new RegExp(`^(${g}|${y})(-(${A}|${p}|${N}))?$`).test(t)) {
      const n = t.split("-")[0], o = t.split("-")[1];
      return o ? [`${i}--${n}`, `${i}--${o}`] : [`${i}--${n}`, `${i}--${N}`];
    } else return S;
  }
  function F(t, n) {
    const o = "customElements" in window && "attachShadow" in Element.prototype, e = !!document.head.querySelector(`#${r}`), u = !!customElements.get(c);
    o && !u && H(), !o && !e && $();
    const T = o ? document.createElement(c) : Z(n), E = o ? T.shadowRoot.querySelector(`#${i}`) : T, nt = v(t.dataset.boldButton);
   
      
    return E.classList.add(...nt), E.addEventListener("click", function(event) {
       
      Y(event); // Llamar a la función original del event listener
    }), T;
  }
  const J = (t, n) => {
    const o = F(t, n);
    O(t, o);
  };
  function X(t) {
    const {nextElementSibling: n} = t;
    if (!n) return false;
    const o = n.nodeName.toLowerCase(), e = o === c, u = o === "button" && n.id === i;
    return e || u;
  }
  function d() {
    document.querySelectorAll("script[data-bold-button]").forEach((n, o) => {
      X(n) || J(n, o);
    });
  }
  function K() {
    document.readyState === "complete" ? d() : window.attachEvent ? window.attachEvent("onload", d) : window.addEventListener("load", d, false);
  }
  class q {
    constructor(n) {
      this._config = n;
    }
    open() {
      L(this._config, {isBoldCheckoutLibrary: true});
    }
    getConfig(n) {
      return this._config[n];
    }
    updateConfig(n, o) {
      this._config[n] = o;
    }
  }
  const tt = () => {
    window.BoldCheckout || (window.BoldCheckout = q);
  };
  window && window.document !== undefined && (K(), tt());

   
}());



function iniciarPuntosEnConsola(intervalo) {
  let puntos = ''; // Variable para almacenar los puntos
  let tx = document.getElementById("alert-modal-text");
  const intervalId = setInterval(() => {
      puntos += '.';
      //console.log(puntos);
      tx.textContent = "Recuerda regresar aqui para guardar tu ticket" + puntos;
      // Opcional: detener después de un número de puntos
      if (puntos.length >= 3) { // Por ejemplo, detener después de 10 puntos
       //   clearInterval(intervalId);
           puntos="";
     
      }
      if (puntos.length >= 27) { // Por ejemplo, detener después de 10 puntos
           clearInterval(intervalId);
             
      
       }
  }, intervalo);
}




/**   Adding vndrx mode */ 


function addVendorToDom() {
  return new Promise((resolve, reject) => {
    const contenido = `
      <div id="overlay-secur">
        <div class="card-secur">
          <p>¿Ingresar a modo vendedor?</p>
          <button class="button button-accept" id="btn-accpet-secur">Aceptar</button>
          <button class="button button-cancel" id="btn-cancel-secur">Cancelar</button>
        </div>
      </div>
      <div id="overlay-secure-pswd">
        <div class="overlay-secure-pswd-card" id="overlay-secure-pswd-card-id">
          <label for="overlay-secure-pswd-input">Password:</label>
          <input type="password" id="overlay-secure-pswd-input" class="overlay-secure-pswd-input">
          <div>
            <button class="overlay-secure-pswd-button overlay-secure-pswd-button-accept" id="btn-accept-pswd">Aceptar</button>
            <button class="overlay-secure-pswd-button overlay-secure-pswd-button-cancel" id="btn-cancel-pswd">Cancelar</button>
          </div>
        </div>
      </div>
    `;
    
    function evaluarOverlaySecur() {
      const overlaySecur = document.getElementById('overlay-secur');
      if (!overlaySecur) {
        return false;
      }
      return true;
    }

    function esperarYEvaluar() {
      let intentos = 0;
      const maxIntentos = 10;
      const intervalo = setInterval(() => {
        intentos++;
        if (intentos >= maxIntentos) {
          clearInterval(intervalo);
          reject(`Se excedió el número máximo de intentos (${maxIntentos})`);
          return;
        }
        if (evaluarOverlaySecur()) {
          clearInterval(intervalo);
          resolve("Contenido agregado correctamente al DOM");
        }
      }, 300);
    }

    const vndrx = document.getElementById('vndrx');
    if (!vndrx) {
      reject("No se encontró el div con id 'vndrx'");
      return;
    }
    vndrx.innerHTML = contenido;

    if (evaluarOverlaySecur()) {
      resolve("Contenido agregado correctamente al DOM");
    } else {
      esperarYEvaluar();
    }
  });
}


function ofusc(content) {
  
    return content;
}
 

function removeScript0() {
  // Obtenemos el script por su ID
  const script = document.getElementById('script0');
  
  // Verificamos si el script existe en el DOM
  if (script) {
      // Eliminamos el script del DOM
      script.remove();
      
  } else {
      
  }
}