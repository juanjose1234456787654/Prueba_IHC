# Especificación de Requisitos de Interacción Humano-Computador (IHC)
## Sistema BiciUrbana: Desbloqueo Express de Bicicleta

---

### 1. Marco de Especificación

Los siguientes requisitos funcionales y de interacción han sido redactados bajo la sintaxis formal observable:
> **"El sistema DEBE [acción medible] CUANDO [evento desencadenante] PARA [beneficio/criterio de éxito]".**

Cada requisito cuenta con criterios de aceptación verificables mediante pruebas manuales y automatizadas, así como su alineación con las pautas de accesibilidad **WCAG 2.1 (Niveles A y AA)** y la norma **ISO 9241-11** (Eficacia, Eficiencia y Satisfacción).

---

### 2. Tabla de Requisitos Observables

| ID | Formulación Observable | Criterio de Verificación / Métrica | Pauta WCAG / Heurística |
|---|---|---|---|
| **RF-01** | **El sistema DEBE** desplegar un indicador de estado de carga visual y semántico no bloqueante en menos de 100 ms **CUANDO** el usuario acciona el botón "Desbloquear Bicicleta" **PARA** informar que la solicitud está en proceso y evitar que el usuario asuma que el sistema está congelado o inactivo. | - Despliegue de spinner animado y texto *"Conectando con estación..."* en tiempo real.<br>- Contenedor con atributo `aria-live="polite"` y `role="status"`.<br>- Tiempo de aparición < 100 ms tras el clic/Enter. | H1 (Visibilidad del estado)<br>WCAG 4.1.3 (Status Messages) |
| **RF-02** | **El sistema DEBE** preservar el valor del número de anclaje ingresado en memoria y en el campo de entrada **CUANDO** ocurra un fallo de conexión o microcorte de red **PARA** evitar que el usuario deba reescribir manualmente el código en condiciones de fatiga y premura con una sola mano. | - El valor del campo `#dockNumber` persiste idéntico tras el fallo.<br>- Almacenamiento temporal en estado (`state.currentDock`).<br>- Tasa de pérdida de datos = 0%. | H9 (Reconocer errores)<br>WCAG 3.3.4 (Error Prevention) |
| **RF-03** | **El sistema DEBE** habilitar un botón de reintento enfocado automáticamente y asociado a un token de idempotencia único **CUANDO** se detecte un microcorte o timeout de red **PARA** permitir reanudar la petición con un solo toque o pulsación de teclado sin generar cobros duplicados en la cuenta del usuario. | - Generación de `idempotencyToken = UUID-v4` por intento.<br>- Bloqueo de peticiones duplicadas en vuelo.<br>- Botón `#btnRetry` accesible con foco automático al recibir error. | H5 (Prevención de errores)<br>H9 (Recuperación de errores)<br>WCAG 2.1.1 (Teclado) |
| **RF-04** | **El sistema DEBE** presentar en pantalla el PIN temporal de desbloqueo con tipografía destacada (mínimo 32px de altura) y un botón de copiado rápido con confirmación accesible **CUANDO** la estación confirme la liberación del anclaje **PARA** que el repartidor visualice el código a un metro de distancia o lo copie al portapapeles sin esfuerzo cognitivo. | - Tamaño de fuente del PIN = 2.5rem (40px) y espaciado entre caracteres *letter-spacing: 0.25em*.<br>- Botón "Copiar PIN" con respuesta háptica/visual (*"¡Copiado!"* por 2 segundos).<br>- Temporizador regresivo visible de 120 segundos. | H2 (Correspondencia con el mundo real)<br>H8 (Diseño estético y minimalista)<br>WCAG 1.4.3 (Contraste) |
| **RF-05** | **El sistema DEBE** permitir la navegación completa por teclado siguiendo un orden secuencial lógico (`tabindex="0"`) con un anillo de foco visual permanente de mínimo 3px de grosor y ratio de contraste > 4.5:1 **CUANDO** el usuario navegue usando la tecla `Tab` o `Shift+Tab` **PARA** garantizar la operabilidad total sin requerir gestos táctiles complejos. | - Anillo de foco CSS: `outline: 3px solid #1D4ED8; outline-offset: 3px`.<br>- Sin trampas de foco (*no keyboard traps*).<br>- Teclas de acción rápida: `Enter` para enviar/reintentar, `Escape` para cancelar. | H7 (Flexibilidad y eficiencia)<br>WCAG 2.1.1 (Teclado)<br>WCAG 2.4.7 (Foco visible) |
| **RF-06** | **El sistema DEBE** ofrecer un mecanismo de cancelación explícita y segura accesible mediante la tecla `Escape` o el botón "Cancelar" **CUANDO** el usuario se encuentre en cualquier pantalla previa a la liberación física de la bicicleta **PARA** permitir abortar la operación sin penalizaciones económicas ni estados inconsistentes. | - Botón "Cancelar" visible en pantalla de carga y de error.<br>- Event listener para tecla `Escape` (código `27`).<br>- Retorno al estado limpio con confirmación de cero cargos económicos. | H3 (Control y libertad del usuario)<br>WCAG 2.5.2 (Cancelación de puntero) |

---

### 3. Fichas de Detalle Técnico por Requisito

#### RF-01: Estado de carga visible y persistente
* **Evento de entrada:** `submit` en `#dockForm` o evento `keydown (Enter)` en `#dockInput`.
* **Comportamiento en UI:**
  1. El botón `#btnSubmit` cambia a clase `.is-loading`, su texto cambia a *"Verificando..."* y se añade `aria-busy="true"`.
  2. Aparece un componente `Loader` circular con animación SVG fluida (60 FPS).
  3. La región de anuncios `#statusAnnouncement` recibe el mensaje *"Verificando anclaje y disponibilidad de la bicicleta"*.
* **Condición de salida:** Respuesta exitosa (200 OK) o captura de error de red (Timeout / 504).

#### RF-02: Preservación de datos de anclaje ante microcortes
* **Evento de entrada:** Evento `network-error` o simulación de microcorte activa.
* **Comportamiento en UI:**
  1. La vista cambia de `ScreenLoading` a `ScreenError`.
  2. El valor ingresado (ej. *"14"*) se mantiene renderizado en un badge destacado: *"Anclaje seleccionado: #14"*.
  3. El input del formulario preserva el valor `value="14"` para que al volver a la vista de formulario no se requiera reingreso.

#### RF-03: Botón de reintento accesible por teclado sin duplicar transacciones
* **Evento de entrada:** Renderizado de la pantalla `ScreenError`.
* **Comportamiento en UI:**
  1. El foco del navegador se traslada programáticamente a `document.getElementById('btnRetry').focus()`.
  2. Se asocia un atributo `data-idempotency-key="biciurbana-tx-${timestamp}-${randomUUID}"`.
  3. Al pulsar `Enter` o clic en `#btnRetry`, la transacción se reenvía manteniendo la misma clave transaccional, garantizando que el banco solo registre un único cobro si el anclaje se libera.

#### RF-04: Presentación clara de PIN temporal con botón de copiado rápido
* **Evento de entrada:** Confirmación exitosa de liberación por el servidor mock.
* **Comportamiento en UI:**
  1. Se despliega la pantalla `ScreenSuccess`.
  2. El PIN de 4 dígitos (ej. `8492`) se muestra en un contenedor central con tipografía monoespaciada de 40px con alto contraste (#0F172A sobre fondo #EFF6FF).
  3. Se inicia un temporizador de 120 segundos en cuenta regresiva para retirar la bicicleta física del muelle.
  4. Botón accesible "Copiar PIN" que copia el código al portapapeles mediante `navigator.clipboard.writeText()` y muestra retroalimentación visual inmediata.

#### RF-05: Navegación completa por teclado con foco visible
* **Evento de entrada:** Pulsaciones de teclas `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`.
* **Comportamiento en UI:**
  1. Tabulación ordenada y secuencial:
     * En Formulario: Atajos de teclado numérico (1-9) -> Input anclaje -> Botón Desbloquear -> Selector de simulación.
     * En Error: Botón Reintentar -> Botón Cancelar.
     * En Éxito: Botón Copiar PIN -> Botón Finalizar Retiro.
  2. Cada elemento enfocado muestra un contorno visual nítido `outline: 3px solid #1D4ED8` con desplazamiento `outline-offset: 3px`.
  3. Tecla `Escape` cierra cualquier estado transitorio y devuelve al formulario base.

#### RF-06: Mecanismo de cancelación explícita en cualquier paso previo
* **Evento de entrada:** Clic en botón "Cancelar" o pulsación de la tecla `Escape`.
* **Comportamiento en UI:**
  1. La operación en vuelo se anula de forma segura.
  2. Se notifica al usuario: *"Operación cancelada. No se ha realizado ningún cobro a tu cuenta."*
  3. El sistema vuelve a la pantalla inicial manteniendo limpio el estado financiero.
