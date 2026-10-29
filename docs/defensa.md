# Guía de Defensa Técnica y Argumentación ante Tribunal Docente
## Sistema BiciUrbana: Desbloqueo Express de Bicicleta (IHC)

---

### 1. Resumen Ejecutivo del Proyecto

Este proyecto aborda la evaluación de usabilidad, diagnóstico heurístico y rediseño de alta fidelidad para el sistema **BiciUrbana Express**, enfocado en la persona usuaria **Carlos** (repartidor independiente contra reloj, con una sola mano ocupada). 

El proyecto resuelve de raíz las fallas de rediseño detectadas en el sistema v1 mediante la implementación de una arquitectura accesible, ergonómica en la zona inferior (*Thumb Zone*) y dotada de **tolerancia a fallos por microcorte de red**, garantizando la preservación incondicional de los datos y la protección del saldo económico del usuario mediante idempotencia.

---

### 2. Matriz de Preguntas Frecuentes del Tribunal Docente

#### Pregunta 1: "¿Por qué optaron por prototipado en código (HTML/CSS/JS) en lugar de una herramienta como Figma?"
* **Defensa Técnica y Argumentación:**
  1. **Validación real de eventos asíncronos y latencia:** Las herramientas estáticas como Figma o Adobe XD simulan transiciones basadas en temporizadores fijos, pero no permiten capturar excepciones de red nativas (`fetch catch`, `timeout`, fallas de promesa) ni emular condiciones de red inestables con reconexión idempotente.
  2. **Comprobación estricta de navegación por teclado (WCAG 2.1.1):** En Figma no es posible auditar el orden de tabulación nativo del DOM del navegador, la prevención de trampas de teclado (*keyboard traps*), ni la efectividad del `:focus-visible` con anillos contrastantes ante agentes de accesibilidad.
  3. **Compatibilidad con lectores de pantalla (WCAG 4.1.3):** Solo mediante HTML semántico y atributos de ARIA en vivo (`aria-live="polite"`, `role="status"`, `aria-busy`) es posible demostrar que un usuario invidente o con baja visión recibe retroalimentación sonora durante el microcorte.

---

#### Pregunta 2: "¿Cómo garantiza el sistema que no se cobre dos veces al usuario durante un microcorte?"
* **Defensa Técnica y Argumentación:**
  1. **Nivel Conductual (Frontend UI):** Inmediatamente al pulsar "Desbloquear", el botón pasa a estado `disabled="true"` con `aria-busy="true"`, bloqueando físicamente cualquier segundo clic compulsivo del usuario (Heurística H5 de Nielsen).
  2. **Nivel Transaccional (Idempotency Token):** En el archivo [prototipo/v2/app.js](file:///c:/IHC_P2/prototipo/v2/app.js) se genera un token único transaccional (`Idempotency-Key: bici-tx-${timestamp}-${randomUUID}`). Si la conexión sufre un microcorte y el usuario presiona "Reintentar Conexión", la petición asíncrona viaja **con el mismo token**. En una arquitectura REST, el servidor identifica que el depósito ya fue reservado y no genera una segunda deducción bancaria.
  3. **Nivel Psico-Emocional (Norman):** La interfaz muestra prominentemente el banner verde: *"TU DINERO ESTÁ 100% PROTEGIDO. Cero cobros realizados"*, erradicando el pánico financiero.

---

#### Pregunta 3: "¿Cómo se implementó la restricción de 'operación con una sola mano' en la interfaz?"
* **Defensa Técnica y Argumentación:**
  1. **Mapa de Alcance del Pulgar (*The Thumb Zone*):** Se diseñó bajo el modelo ergonómico de Steven Hoober. La zona superior alberga datos pasivos (nombre de la estación, estado de red). La zona de confort del pulgar (los 320 píxeles inferiores de la pantalla) alberga:
     * El botón primario de 56px de altura.
     * El teclado numérico de acceso rápido a anclajes frecuentes.
     * El botón de reintento tras fallas.
     * El botón de copiado del PIN temporal.
  2. **Target sizes generosos:** Ningún control accionable mide menos de 48px de altura (superando la recomendación WCAG 2.5.5 Target Size de 44x44px), permitiendo accionar el sistema en marcha sin perder el equilibrio.

---

#### Pregunta 4: "¿Cuál es la diferencia entre la medición real obtenida y la estimación heurística?"
* **Defensa Técnica y Argumentación:**
  * **La Estimación Heurística** (plasmada en `docs/diagnostico.md`) fue el análisis cualitativo preliminar donde se asignó severidad 4 a la falta de spinner y se predijo que el usuario abandonaría la app al sentirse estafado.
  * **La Medición Real** (documentada en `pruebas/sesion.md`) fue la recolección de métricas empíricas con cronómetro y usuario real (Andrés Morales):
    * Tiempo real en v1: **48.2 segundos** (hasta abandono con 0% de éxito).
    * Tiempo real en v2: **13.6 segundos** (con 100% de éxito tras el reintento).
    * Tasa de pérdida de datos: 100% en v1 vs 0% en v2.

---

### 3. Demostración Paso a Paso del Flujo de Recuperación de Error

Para exponer en vivo frente al tribunal docente, seguir esta secuencia exacta de 5 pasos:

1. **Paso 1: Demostración del fallo original en v1:**
   * Abrir [prototipo/v1/index.html](file:///c:/IHC_P2/prototipo/v1/index.html).
   * Ingresar anclaje `14` y hacer clic en "Desbloquear".
   * *Evidenciar ante el jurado:* La pantalla se congela en blanco, aparece el cobro indebido de $5.00, se borra el input y no hay botón para reintentar.
2. **Paso 2: Transición a v2 y configuración del escenario:**
   * Abrir [prototipo/v2/index.html](file:///c:/IHC_P2/prototipo/v2/index.html).
   * Verificar que en la barra superior esté seleccionado *"🟡 Simular Microcorte de Red"*.
3. **Paso 3: Navegación exclusiva por teclado:**
   * Sin tocar el ratón, pulsar `Tab` para navegar por los chips rápidos hasta `#14`, o presionar `Enter` en el campo prellenado.
   * *Evidenciar el anillo de foco azul de 3px:* Claramente visible y contrastado.
4. **Paso 4: Comportamiento ante el Microcorte:**
   * Se despliega el spinner con animación fluida y anuncio sonoro.
   * A los 1.8 segundos, entra la pantalla de error recuperable:
     * El número `#14` se mantiene intacto y visible.
     * Aparece el mensaje de garantía financiera.
     * El foco del teclado se posiciona **automáticamente** sobre el botón *"Reintentar Conexión"*.
5. **Paso 5: Recuperación y entrega de valor:**
   * Presionar simplemente la tecla `Enter`.
   * El sistema reintenta la conexión y transita a la pantalla de éxito.
   * Se muestra el PIN destacado `8492` en 42px, se inicia el temporizador de 120s y con pulsar `Enter` se copia el código al portapapeles.

---

### 4. Guía de Microcambios en Vivo (Preparación para Peticiones del Jurado)

Si el tribunal docente solicita modificar parámetros o componentes en vivo durante la defensa, ejecutar las siguientes modificaciones rápidas:

#### Microcambio A: Modificar el texto de garantía o mensaje de error
* **Archivo:** [prototipo/v2/index.html](file:///c:/IHC_P2/prototipo/v2/index.html)
* **Líneas aproximadas:** 142 - 148
* **Instrucción:**
  ```html
  <!-- Cambiar: -->
  <div class="safe-text">
    <strong>TU DINERO ESTÁ 100% PROTEGIDO</strong>
    <p>No se ha realizado ningún cobro ni retención en tu tarjeta.</p>
  </div>
  <!-- Por ejemplo, a petición del docente: -->
  <div class="safe-text">
    <strong>PROTECCIÓN TOTAL BICIURBANA: SALDO INTACTO</strong>
    <p>Garantía de cobro cero ante interrupciones de señal móvil.</p>
  </div>
  ```

#### Microcambio B: Cambiar el color o grosor del anillo de foco visual
* **Archivo:** [prototipo/v2/styles.css](file:///c:/IHC_P2/prototipo/v2/styles.css)
* **Líneas aproximadas:** 33 - 35
* **Instrucción:**
  ```css
  /* Cambiar las variables CSS en :root: */
  --focus-outline: 4px solid #10b981; /* Verde esmeralda de 4px */
  --focus-offset: 4px;
  ```
  *Efecto inmediato:* Al recargar v2 y navegar con `Tab`, todos los controles exhibirán un anillo verde esmeralda de 4px de grosor.

#### Microcambio C: Modificar el tiempo del temporizador regresivo (ej. de 120s a 60s)
* **Archivo:** [prototipo/v2/app.js](file:///c:/IHC_P2/prototipo/v2/app.js)
* **Línea aproximada:** 225
* **Instrucción:**
  ```javascript
  // Cambiar:
  startWithdrawalTimer(120);
  // Por:
  startWithdrawalTimer(60);
  ```

#### Microcambio D: Agregar un campo nuevo de "Código de Cupón Promocional"
* **Archivo:** [prototipo/v2/index.html](file:///c:/IHC_P2/prototipo/v2/index.html)
* **Instrucción:** Agregar dentro de `<form id="dockForm">`:
  ```html
  <div class="input-container" style="margin-top: 10px;">
    <label for="couponInput" class="input-label">Cupón de descuento (Opcional):</label>
    <input type="text" id="couponInput" class="dock-input" style="height: 44px; font-size: 16px; padding-left: 14px;" placeholder="PROMO2026" tabindex="0">
  </div>
  ```
