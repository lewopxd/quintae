# Arquitectura de datos y presentación para fichas técnicas de teatros (Riders)

## 0. Principio rector

Se separan dos capas:

- **Capa de datos**: modelo jerárquico que debe sostener render geométrico, niveles de completitud muy distintos entre teatros, y compatibilidad mundial (unidades, idioma, normativa, terminología).
- **Capa de presentación**: tarjeta (portada) + pestañas (secciones). Es un patrón de UI ya resuelto; se deriva directamente del modelo de datos una vez este está bien definido.

La taxonomía de secciones **no la define cada teatro** — es fija y universal, definida por el esquema. Un teatro puede tener una sección vacía (sin datos o no aplica), pero la sección existe siempre. Esto es lo que permite que una misma plantilla de tarjeta sirva para un teatro con 6 líneas de info y uno con 400.

Cada campo del sistema tiene **tres estados posibles**, nunca dos:
1. Valor declarado
2. No aplica (ej. un teatro sin foso)
3. Sin datos capturados todavía (existe en la realidad, pero no está digitalizado)

Esta distinción es la base real del "indicador de completitud" — sin ella, el indicador cuenta huecos legítimos como pendientes y queda falseado.

---

## 1. Modelo de niveles (capa de datos)

### Nivel 0 — Ficha / Identidad (portada de la tarjeta)

Datos mínimos que existen siempre, sin excepción:

| Campo | Notas |
|---|---|
| Nombre del teatro | texto libre |
| Ciudad | metadato separado |
| País | metadato separado |
| Dirección | texto libre + coordenadas (no asumir sistemas locales tipo Calle/Carrera) |
| Imagen / render de portada | url o archivo |
| Fecha de última actualización | **clave, no decorativa** — decide qué versión de la verdad se muestra cuando hay múltiples fichas del mismo teatro |
| Indicador de completitud | calculado sobre los 3 estados de campo, no sobre presencia/ausencia binaria |
| Link de descarga/visualización del PDF original | no negociable — garantiza que el 100% de la info quede accesible aunque el esquema no capture cada matiz |
| Aforo | si existe el dato |

**Regla de versionado**: cuando llega un rider nuevo de un teatro ya existente en la base, la operación es **reemplazar/versionar**, nunca fusionar campo por campo dos documentos de distintas fechas (evidencia: mismo teatro, Colón, con dos fichas —consola y cantidad de varas distintas— porque el inventario cambia en el tiempo).

---

### Nivel 1 — Núcleo geométrico transversal

Lo que el renderizador necesita para dibujar el recinto sin descripción manual caso por caso.

**1.1 Sobre escénico**
- Ancho de boca de escena
- Fondo de escenario
- Altura de boca de escena
- Altura hasta la parrilla
- Altura del escenario respecto al nivel de platea
- Pendiente del piso (si tiene)
- Material del piso
- Carga máxima admisible del piso

**1.2 Posiciones de montaje** (entidad reutilizable — generalización de "vara/varilla/batten/pipe/perche")

Cada posición de montaje tiene:
| Atributo | Descripción |
|---|---|
| Identificador | el que use cada teatro: V1, LX3, "Mentirosa", etc. |
| Tipo | vara contrapesada de un viaje, de doble viaje, barra fija, torre/boom, posición de piso, balcón, puente |
| Ubicación en el sobre escénico | distancia desde línea de boca; lateral o central — esto posiciona el elemento en el plano |
| Dimensiones | longitud, diámetro |
| Carga máxima | peso admisible |

**Cadena de referencia** (necesaria para el futuro renderizado de equipos):
`Posición de montaje → circuito/dimmer → instancia de equipo`

Esto replica lo que ya hace el TJEG: tabla de varas (número, tipo, ubicación, dimensiones, carga) vinculada por separado a una tabla de circuitos/dimmers por vara.

---

### Nivel 2 — Secciones categorizadas (= pestañas de la tarjeta)

Ver jerarquía exacta más abajo (sección 2). Estructura repetible dentro de cada pestaña:

- **Widget "ítem de equipo"** (lista): cantidad, tipo, marca, referencia, descripción, ubicación opcional, referencia opcional a catálogo (Nivel 3), pares clave-valor libres para specs adicionales.
- **Widget "campos con huecos"** (ficha descriptiva): campos tipados propios de cada sección, cada uno con sus 3 estados posibles.

Con estos dos widgets se cubre el 100% del contenido observado en los seis documentos de referencia (TJEG, CASA CNA, Quimera, Tecal, y las dos versiones del Colón).

---

### Nivel 3 — Catálogo maestro de equipos

Decisión de mayor apalancamiento del sistema.

- Cada tipo de equipo (ej. "Elipsoidal Source Four zoom 25°-50°, ETC, 750W, 7.6kg") se define **una sola vez** en un catálogo compartido entre todos los teatros, con un ID único.
- Cada teatro no repite la especificación técnica: referencia el ID + declara cantidad + (opcional) en qué posición de montaje están instalados esos ejemplares.
- Beneficios: consistencia de datos, símbolo gráfico dibujado una sola vez por entrada de catálogo (no por teatro), habilita búsquedas transversales futuras ("qué teatros tienen tal seguidor").

**Flujo de dos caminos para la cola larga** (marcas/modelos no catalogados):
1. Coincidencia exacta o difusa con catálogo existente → se referencia por ID.
2. Sin coincidencia → se guarda como **texto libre con bandera "sin catalogar"**. Sigue siendo 100% visible y buscable. Queda disponible para asignación posterior de ID (manual o asistida por IA comparando contra catálogo).

**Referencia de modelo de datos (no adoptar tal cual, sí mirar como referencia para Nivel 1 y 3):** GDTF (General Device Type Format, DIN SPEC 15800) y su contenedor MVR (My Virtual Rig, DIN SPEC 15801) — estándar abierto de la industria (Vectorworks, MA Lighting, Robe Lighting) usado por 60+ fabricantes y 10+ plataformas de control. Cubre hoy sobre todo iluminación, servidores de medios y tramoya; audio y video quedan fuera (ampliación planeada a futuro en el propio estándar). Confirma que ni la industria ha resuelto el rider completo — solo la parte de iluminación/rigging.

---

### Nivel 4 — Bloque libre

Todo rider tiene contenido que no cabe en campos tipados: reseña institucional, notas legales, protocolos de seguridad, recomendaciones ("no se permite fuego, agua ni tierra en el escenario").

- No estructurar. Casilla de texto libre por sección.
- **Etiquetado por idioma** (el idioma del rider original, no el de la interfaz).
- Forzar esto a campos tipados rompe el esquema cada vez que aparece una particularidad no prevista — y en teatro esas particularidades son la norma, no la excepción.

---

## 2. Jerarquía exacta de pestañas (capa de presentación)

### Cara de la tarjeta (resumen, sin entrar)
1. Imagen/render de portada
2. Nombre del teatro
3. Ciudad + país
4. Aforo
5. Medida más útil del sobre escénico (ancho de boca × fondo)
6. Fecha de última actualización
7. Indicador de completitud
8. Acceso directo al PDF original

### Al entrar — pestañas (Nivel 2), en este orden:

#### Pestaña 1 — Escenario y Tramoya
*(única pestaña con contenido geométrico protagonista — candidata a plano 2D generado a partir de los datos, no solo tabla)*
- Sub 1.1 Dimensiones del sobre escénico (Nivel 1: boca, fondo, alturas, pendiente, piso, carga)
- Sub 1.2 Posiciones de montaje (listado completo: id, tipo, ubicación, dimensiones, carga)
- Sub 1.3 Equipos de tramoya (telones, ciclorama, patas, bambalinas, varas motorizadas vs manuales — widget ítem de equipo)
- Sub 1.4 Foso de orquesta (dimensiones, capacidad, mecanización si tiene — estado "no aplica" frecuente aquí)
- Sub 1.5 Notas libres de escenario (Nivel 4)

#### Pestaña 2 — Iluminación
- Sub 2.1 Inventario de luminarias (widget ítem de equipo: cantidad, tipo, marca, referencia, catálogo Nivel 3 si aplica)
- Sub 2.2 Sistema de control (consola, protocolo — DMX/sACN/Art-Net, versión/modelo)
- Sub 2.3 Dimmers y circuitos (tabla de circuitos, capacidad por circuito, vínculo a posición de montaje del Nivel 1)
- Sub 2.4 Conexión eléctrica específica de iluminación (tipo de conector, fases)
- Sub 2.5 Notas libres de iluminación

#### Pestaña 3 — Sonido
- Sub 3.1 Altavoces / sistema de PA (widget ítem de equipo)
- Sub 3.2 Amplificadores
- Sub 3.3 Consola de mezcla (modelo, canales)
- Sub 3.4 Micrófonos (inventario)
- Sub 3.5 Monitores de escenario
- Sub 3.6 Backline (si el teatro lo provee)
- Sub 3.7 Límite de decibeles / normativa acústica local (Nivel 4, etiquetado por jurisdicción — ej. Resolución 0627 de 2006 en Colombia)
- Sub 3.8 Notas libres de sonido

#### Pestaña 4 — Video / Proyección
- Sub 4.1 Proyectores (widget ítem de equipo)
- Sub 4.2 Pantallas / superficies de proyección (dimensiones, tipo)
- Sub 4.3 Servidores de medios / switchers
- Sub 4.4 Conectividad de señal (HDMI, SDI, fibra)
- Sub 4.5 Notas libres de video *(sección con alta probabilidad de estado "sin datos" o "no aplica" — es la más nueva del dominio y la que GDTF/MVR aún no cubren)*

#### Pestaña 5 — Camerinos y Bienestar
- Sub 5.1 Cantidad y capacidad de camerinos
- Sub 5.2 Equipamiento por camerino (espejos, baños, duchas, aire acondicionado)
- Sub 5.3 Espacios de bienestar adicionales (sala de calentamiento, catering/green room)
- Sub 5.4 Notas libres

#### Pestaña 6 — Personal Técnico
- Sub 6.1 Roles disponibles por función (jefe técnico, iluminador, sonidista, tramoyistas, etc.)
- Sub 6.2 Cantidad de personal por rol
- Sub 6.3 Horarios / turnos de montaje y función
- Sub 6.4 Notas libres (convenios laborales, sindicato, etc.)

#### Pestaña 7 — Logística y Accesos
- Sub 7.1 Accesos de carga (dimensiones de puertas, muelles, rampas)
- Sub 7.2 Zona de descarga y parqueo de tráileres
- Sub 7.3 Elevadores de carga (dimensiones, capacidad)
- Sub 7.4 Alojamiento y transporte cercano (si el rider lo incluye)
- Sub 7.5 Notas libres

#### Pestaña 8 — Seguridad
- Sub 8.1 Salidas de emergencia y protocolos
- Sub 8.2 Restricciones (fuego, agua, elementos sobre el escenario — Nivel 4 frecuentemente)
- Sub 8.3 Normativa local de seguridad escénica (etiquetada por jurisdicción)
- Sub 8.4 Notas libres

#### Pestaña 9 — Otros / Notas Institucionales
- Sub 9.1 Reseña institucional del teatro (bloque libre, tipo Quimera)
- Sub 9.2 Información de contacto administrativo
- Sub 9.3 Cualquier contenido no clasificable en las pestañas anteriores

> Esta secuencia de 9 pestañas es la misma que aparece comprimida al mínimo en Quimera/Tecal (una pantalla) y expandida al máximo en el TJEG (16 páginas) — que funcione en ambos extremos sin modificar la estructura es la validación de que la taxonomía está bien elegida.

---

## 3. Compatibilidad mundial — reglas de desacople

| Riesgo de asumir | Regla |
|---|---|
| Unidades métricas por defecto | Guardar cada magnitud con unidad explícita, o normalizar internamente a métrico y convertir solo para mostrar |
| Terminología regional fija (vara/varilla/batten/pipe/perche; tarima/praticable/riser; camerino/dressing room/loge) | Tesauro de sinónimos que mapea término regional → concepto interno único |
| Un solo estándar eléctrico | Lista controlada y ampliable de conectores/voltajes (NEMA 110V/220V, CEE/Schuko, BS 1363, Camlock, PowerCON, Socapex) — un mismo teatro puede reportar varios a la vez |
| Normativa única | Todo texto normativo (dB máximos, reglas de seguridad) se guarda como bloque libre **etiquetado por jurisdicción**, nunca como regla fija del código |
| Sistema de direcciones local (Calle/Carrera) | Dirección en texto libre + coordenadas geográficas; ciudad/país como metadatos separados |
| Idioma único | Separar idioma de la interfaz (traducible: "Escenario"/"Stage"/"Plateau") del idioma del contenido capturado (el del rider original, etiquetado por bloque) |

---

## 4. Resumen de la lógica de "auto-rellenado" de tarjetas

Una tarjeta genérica sabe qué mostrar y dónde sin lógica especial por teatro porque:

1. La lista de pestañas (Nivel 2) es fija y universal — no depende del contenido de un teatro particular.
2. Dentro de cada pestaña, todo el contenido se expresa con solo dos formas repetibles: *lista de ítems de equipo* y *campos con huecos*. El renderizador solo necesita saber pintar estas dos formas, no una por categoría.
3. Cada campo declara su propio estado (valor / no aplica / sin datos), lo cual permite renderizar consistentemente aunque la cantidad de información varíe de 6 líneas a 400.

Los pendientes identificados para profundizar en otra sesión: el flujo detallado "equipo sin catalogar → propuesta asistida por IA" y el cálculo no arbitrario del score de completitud.# Arquitectura de datos y presentación para fichas técnicas de teatros (Riders)

## 0. Principio rector

Se separan dos capas:

- **Capa de datos**: modelo jerárquico que debe sostener render geométrico, niveles de completitud muy distintos entre teatros, y compatibilidad mundial (unidades, idioma, normativa, terminología).
- **Capa de presentación**: tarjeta (portada) + pestañas (secciones). Es un patrón de UI ya resuelto; se deriva directamente del modelo de datos una vez este está bien definido.

La taxonomía de secciones **no la define cada teatro** — es fija y universal, definida por el esquema. Un teatro puede tener una sección vacía (sin datos o no aplica), pero la sección existe siempre. Esto es lo que permite que una misma plantilla de tarjeta sirva para un teatro con 6 líneas de info y uno con 400.

Cada campo del sistema tiene **tres estados posibles**, nunca dos:
1. Valor declarado
2. No aplica (ej. un teatro sin foso)
3. Sin datos capturados todavía (existe en la realidad, pero no está digitalizado)

Esta distinción es la base real del "indicador de completitud" — sin ella, el indicador cuenta huecos legítimos como pendientes y queda falseado.

---

## 1. Modelo de niveles (capa de datos)

### Nivel 0 — Ficha / Identidad (portada de la tarjeta)

Datos mínimos que existen siempre, sin excepción:

| Campo | Notas |
|---|---|
| Nombre del teatro | texto libre |
| Ciudad | metadato separado |
| País | metadato separado |
| Dirección | texto libre + coordenadas (no asumir sistemas locales tipo Calle/Carrera) |
| Imagen / render de portada | url o archivo |
| Fecha de última actualización | **clave, no decorativa** — decide qué versión de la verdad se muestra cuando hay múltiples fichas del mismo teatro |
| Indicador de completitud | calculado sobre los 3 estados de campo, no sobre presencia/ausencia binaria |
| Link de descarga/visualización del PDF original | no negociable — garantiza que el 100% de la info quede accesible aunque el esquema no capture cada matiz |
| Aforo | si existe el dato |

**Regla de versionado**: cuando llega un rider nuevo de un teatro ya existente en la base, la operación es **reemplazar/versionar**, nunca fusionar campo por campo dos documentos de distintas fechas (evidencia: mismo teatro, Colón, con dos fichas —consola y cantidad de varas distintas— porque el inventario cambia en el tiempo).

---

### Nivel 1 — Núcleo geométrico transversal

Lo que el renderizador necesita para dibujar el recinto sin descripción manual caso por caso.

**1.1 Sobre escénico**
- Ancho de boca de escena
- Fondo de escenario
- Altura de boca de escena
- Altura hasta la parrilla
- Altura del escenario respecto al nivel de platea
- Pendiente del piso (si tiene)
- Material del piso
- Carga máxima admisible del piso

**1.2 Posiciones de montaje** (entidad reutilizable — generalización de "vara/varilla/batten/pipe/perche")

Cada posición de montaje tiene:
| Atributo | Descripción |
|---|---|
| Identificador | el que use cada teatro: V1, LX3, "Mentirosa", etc. |
| Tipo | vara contrapesada de un viaje, de doble viaje, barra fija, torre/boom, posición de piso, balcón, puente |
| Ubicación en el sobre escénico | distancia desde línea de boca; lateral o central — esto posiciona el elemento en el plano |
| Dimensiones | longitud, diámetro |
| Carga máxima | peso admisible |

**Cadena de referencia** (necesaria para el futuro renderizado de equipos):
`Posición de montaje → circuito/dimmer → instancia de equipo`

Esto replica lo que ya hace el TJEG: tabla de varas (número, tipo, ubicación, dimensiones, carga) vinculada por separado a una tabla de circuitos/dimmers por vara.

---

### Nivel 2 — Secciones categorizadas (= pestañas de la tarjeta)

Ver jerarquía exacta más abajo (sección 2). Estructura repetible dentro de cada pestaña:

- **Widget "ítem de equipo"** (lista): cantidad, tipo, marca, referencia, descripción, ubicación opcional, referencia opcional a catálogo (Nivel 3), pares clave-valor libres para specs adicionales.
- **Widget "campos con huecos"** (ficha descriptiva): campos tipados propios de cada sección, cada uno con sus 3 estados posibles.

Con estos dos widgets se cubre el 100% del contenido observado en los seis documentos de referencia (TJEG, CASA CNA, Quimera, Tecal, y las dos versiones del Colón).

---

### Nivel 3 — Catálogo maestro de equipos

Decisión de mayor apalancamiento del sistema.

- Cada tipo de equipo (ej. "Elipsoidal Source Four zoom 25°-50°, ETC, 750W, 7.6kg") se define **una sola vez** en un catálogo compartido entre todos los teatros, con un ID único.
- Cada teatro no repite la especificación técnica: referencia el ID + declara cantidad + (opcional) en qué posición de montaje están instalados esos ejemplares.
- Beneficios: consistencia de datos, símbolo gráfico dibujado una sola vez por entrada de catálogo (no por teatro), habilita búsquedas transversales futuras ("qué teatros tienen tal seguidor").

**Flujo de dos caminos para la cola larga** (marcas/modelos no catalogados):
1. Coincidencia exacta o difusa con catálogo existente → se referencia por ID.
2. Sin coincidencia → se guarda como **texto libre con bandera "sin catalogar"**. Sigue siendo 100% visible y buscable. Queda disponible para asignación posterior de ID (manual o asistida por IA comparando contra catálogo).

**Referencia de modelo de datos (no adoptar tal cual, sí mirar como referencia para Nivel 1 y 3):** GDTF (General Device Type Format, DIN SPEC 15800) y su contenedor MVR (My Virtual Rig, DIN SPEC 15801) — estándar abierto de la industria (Vectorworks, MA Lighting, Robe Lighting) usado por 60+ fabricantes y 10+ plataformas de control. Cubre hoy sobre todo iluminación, servidores de medios y tramoya; audio y video quedan fuera (ampliación planeada a futuro en el propio estándar). Confirma que ni la industria ha resuelto el rider completo — solo la parte de iluminación/rigging.

---

### Nivel 4 — Bloque libre

Todo rider tiene contenido que no cabe en campos tipados: reseña institucional, notas legales, protocolos de seguridad, recomendaciones ("no se permite fuego, agua ni tierra en el escenario").

- No estructurar. Casilla de texto libre por sección.
- **Etiquetado por idioma** (el idioma del rider original, no el de la interfaz).
- Forzar esto a campos tipados rompe el esquema cada vez que aparece una particularidad no prevista — y en teatro esas particularidades son la norma, no la excepción.

---

## 2. Jerarquía exacta de pestañas (capa de presentación)

### Cara de la tarjeta (resumen, sin entrar)
1. Imagen/render de portada
2. Nombre del teatro
3. Ciudad + país
4. Aforo
5. Medida más útil del sobre escénico (ancho de boca × fondo)
6. Fecha de última actualización
7. Indicador de completitud
8. Acceso directo al PDF original

### Al entrar — pestañas (Nivel 2), en este orden:

#### Pestaña 1 — Escenario y Tramoya
*(única pestaña con contenido geométrico protagonista — candidata a plano 2D generado a partir de los datos, no solo tabla)*
- Sub 1.1 Dimensiones del sobre escénico (Nivel 1: boca, fondo, alturas, pendiente, piso, carga)
- Sub 1.2 Posiciones de montaje (listado completo: id, tipo, ubicación, dimensiones, carga)
- Sub 1.3 Equipos de tramoya (telones, ciclorama, patas, bambalinas, varas motorizadas vs manuales — widget ítem de equipo)
- Sub 1.4 Foso de orquesta (dimensiones, capacidad, mecanización si tiene — estado "no aplica" frecuente aquí)
- Sub 1.5 Notas libres de escenario (Nivel 4)

#### Pestaña 2 — Iluminación
- Sub 2.1 Inventario de luminarias (widget ítem de equipo: cantidad, tipo, marca, referencia, catálogo Nivel 3 si aplica)
- Sub 2.2 Sistema de control (consola, protocolo — DMX/sACN/Art-Net, versión/modelo)
- Sub 2.3 Dimmers y circuitos (tabla de circuitos, capacidad por circuito, vínculo a posición de montaje del Nivel 1)
- Sub 2.4 Conexión eléctrica específica de iluminación (tipo de conector, fases)
- Sub 2.5 Notas libres de iluminación

#### Pestaña 3 — Sonido
- Sub 3.1 Altavoces / sistema de PA (widget ítem de equipo)
- Sub 3.2 Amplificadores
- Sub 3.3 Consola de mezcla (modelo, canales)
- Sub 3.4 Micrófonos (inventario)
- Sub 3.5 Monitores de escenario
- Sub 3.6 Backline (si el teatro lo provee)
- Sub 3.7 Límite de decibeles / normativa acústica local (Nivel 4, etiquetado por jurisdicción — ej. Resolución 0627 de 2006 en Colombia)
- Sub 3.8 Notas libres de sonido

#### Pestaña 4 — Video / Proyección
- Sub 4.1 Proyectores (widget ítem de equipo)
- Sub 4.2 Pantallas / superficies de proyección (dimensiones, tipo)
- Sub 4.3 Servidores de medios / switchers
- Sub 4.4 Conectividad de señal (HDMI, SDI, fibra)
- Sub 4.5 Notas libres de video *(sección con alta probabilidad de estado "sin datos" o "no aplica" — es la más nueva del dominio y la que GDTF/MVR aún no cubren)*

#### Pestaña 5 — Camerinos y Bienestar
- Sub 5.1 Cantidad y capacidad de camerinos
- Sub 5.2 Equipamiento por camerino (espejos, baños, duchas, aire acondicionado)
- Sub 5.3 Espacios de bienestar adicionales (sala de calentamiento, catering/green room)
- Sub 5.4 Notas libres

#### Pestaña 6 — Personal Técnico
- Sub 6.1 Roles disponibles por función (jefe técnico, iluminador, sonidista, tramoyistas, etc.)
- Sub 6.2 Cantidad de personal por rol
- Sub 6.3 Horarios / turnos de montaje y función
- Sub 6.4 Notas libres (convenios laborales, sindicato, etc.)

#### Pestaña 7 — Logística y Accesos
- Sub 7.1 Accesos de carga (dimensiones de puertas, muelles, rampas)
- Sub 7.2 Zona de descarga y parqueo de tráileres
- Sub 7.3 Elevadores de carga (dimensiones, capacidad)
- Sub 7.4 Alojamiento y transporte cercano (si el rider lo incluye)
- Sub 7.5 Notas libres

#### Pestaña 8 — Seguridad
- Sub 8.1 Salidas de emergencia y protocolos
- Sub 8.2 Restricciones (fuego, agua, elementos sobre el escenario — Nivel 4 frecuentemente)
- Sub 8.3 Normativa local de seguridad escénica (etiquetada por jurisdicción)
- Sub 8.4 Notas libres

#### Pestaña 9 — Otros / Notas Institucionales
- Sub 9.1 Reseña institucional del teatro (bloque libre, tipo Quimera)
- Sub 9.2 Información de contacto administrativo
- Sub 9.3 Cualquier contenido no clasificable en las pestañas anteriores

> Esta secuencia de 9 pestañas es la misma que aparece comprimida al mínimo en Quimera/Tecal (una pantalla) y expandida al máximo en el TJEG (16 páginas) — que funcione en ambos extremos sin modificar la estructura es la validación de que la taxonomía está bien elegida.

---

## 3. Compatibilidad mundial — reglas de desacople

| Riesgo de asumir | Regla |
|---|---|
| Unidades métricas por defecto | Guardar cada magnitud con unidad explícita, o normalizar internamente a métrico y convertir solo para mostrar |
| Terminología regional fija (vara/varilla/batten/pipe/perche; tarima/praticable/riser; camerino/dressing room/loge) | Tesauro de sinónimos que mapea término regional → concepto interno único |
| Un solo estándar eléctrico | Lista controlada y ampliable de conectores/voltajes (NEMA 110V/220V, CEE/Schuko, BS 1363, Camlock, PowerCON, Socapex) — un mismo teatro puede reportar varios a la vez |
| Normativa única | Todo texto normativo (dB máximos, reglas de seguridad) se guarda como bloque libre **etiquetado por jurisdicción**, nunca como regla fija del código |
| Sistema de direcciones local (Calle/Carrera) | Dirección en texto libre + coordenadas geográficas; ciudad/país como metadatos separados |
| Idioma único | Separar idioma de la interfaz (traducible: "Escenario"/"Stage"/"Plateau") del idioma del contenido capturado (el del rider original, etiquetado por bloque) |

---

## 4. Resumen de la lógica de "auto-rellenado" de tarjetas

Una tarjeta genérica sabe qué mostrar y dónde sin lógica especial por teatro porque:

1. La lista de pestañas (Nivel 2) es fija y universal — no depende del contenido de un teatro particular.
2. Dentro de cada pestaña, todo el contenido se expresa con solo dos formas repetibles: *lista de ítems de equipo* y *campos con huecos*. El renderizador solo necesita saber pintar estas dos formas, no una por categoría.
3. Cada campo declara su propio estado (valor / no aplica / sin datos), lo cual permite renderizar consistentemente aunque la cantidad de información varíe de 6 líneas a 400.

Los pendientes identificados para profundizar en otra sesión: el flujo detallado "equipo sin catalogar → propuesta asistida por IA" y el cálculo no arbitrario del score de completitud.