 

const CACHE_NAME = '5e-portada-v1';

// ── Instalación: activar inmediatamente sin esperar pestañas antiguas ─────────
self.addEventListener('install', function (event) {
    self.skipWaiting();
});

// ── Activación: limpiar cachés de versiones anteriores ────────────────────────
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys
                    .filter(function (key) { return key !== CACHE_NAME; })
                    .map(function (key) { return caches.delete(key); })
            );
        }).then(function () {
            // Tomar control de las pestañas abiertas de inmediato
            return self.clients.claim();
        })
    );
});

// ── Intercepción de requests: solo para los frames de la animación ────────────
self.addEventListener('fetch', function (event) {
    const url = event.request.url;

    // Solo interceptar las imágenes de la portada animada
    if (!url.includes('animatedPortada')) return;

    event.respondWith(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(event.request).then(function (cached) {
                if (cached) {
                    // Cache hit → respuesta instantánea
                    return cached;
                }

                // Cache miss → ir a la red y guardar para la próxima vez
                return fetch(event.request).then(function (networkResponse) {
                    if (networkResponse && networkResponse.ok) {
                        // Clonar antes de consumir: la respuesta solo se puede leer una vez
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(function () {
                    // Sin red y sin caché: no hay nada que devolver (frame quedará null)
                    return new Response('', { status: 503 });
                });
            });
        })
    );
});
