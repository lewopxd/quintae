// ledirec_info/loader.js
// Primer script: Valida que la URL de acceso contenga la clave autorizada.
// Si no se reconoce, redirige inmediatamente a la página anterior sin mostrar error.

(function() {
  'use strict';

  function redirectSilently() {
    if (document.referrer && document.referrer !== window.location.href) {
      window.location.replace(document.referrer);
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.replace('../index.html');
    }
  }

  function isValidAccessUrl() {
    var search = window.location.search || '';
    var host = window.location.hostname || '';
    var proto = window.location.protocol || '';

    // En entorno local (localhost, 127.0.0.1, file://), permitir siempre el acceso para desarrollo
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || proto === 'file:' || host === '') {
      return true;
    }

    var containsKey = search.indexOf('lewopxd') !== -1 || search.indexOf('lwpxd') !== -1 || search.indexOf('ledirec') !== -1;
    var hasColorParam = search.indexOf('c=') !== -1;
    return containsKey || hasColorParam;
  }

  if (!isValidAccessUrl()) {
    redirectSilently();
  } else {
    var script = document.createElement('script');
    script.src = 'decryptor.js';
    script.async = true;
    script.onerror = redirectSilently;
    document.body.appendChild(script);
  }
})();
