
var scrollTop_var;

var $body = $('body'),
    scrollDisabled = false,
    scrollTop;

window.onload = function () {
  console.info("hello world");
preventImages();

// Establecer el estado inicial (desactivado)
toggle.activado = true;
  
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
});


function button_call(){

  const over = document.getElementById("overlay");
  const currentDisplay = over.style.display;
  over.style.display = currentDisplay === 'block' ? 'none' : 'block';

toggle();  //funcion para activar y desactivar la barra desplazamiento

}


 // Función toggle que alterna entre activar y desactivar
function toggle() {
  // Verificar el estado actual y llamar a la función correspondiente
  if (toggle.activado) {
    ocultar_screen();
    scrollDisable();
    mostrarBotones();
  } else {
  mostrar_screen();
   scrollEnable();
   ocultarBotones();
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
}


function ocultarBotones(){
  var b1 = document.getElementById("c_button1");
  b1.classList.remove("visible");
  var b2 = document.getElementById("c_button2");
  b2.classList.remove("visible");
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