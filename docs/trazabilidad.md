# Matriz de Trazabilidad de Interacción Humano-Computador (IHC)
## Sistema BiciUrbana: Desbloqueo Express de Bicicleta

---

### 1. Propósito de la Trazabilidad

La presente matriz de trazabilidad garantiza la coherencia e integridad del diseño centrado en el usuario (UCD). Permite auditar de forma bidireccional cómo cada necesidad detectada en el diagnóstico inicial se transforma en un **Requisito Observable (RF)**, se mapea a una **Pantalla**, se ubica en un paso del **Flujo de Usuario**, se descompone en **Componentes Atómicos**, se proyecta en un **Wireframe Lo-Fi** y se materializa en el **Código del Prototipo v2**.

---

### 2. Matriz de Trazabilidad Integral

| Requisito ID | Pantalla Asociada | Flujo de Usuario (Paso) | Componente Atomic Design | Wireframe Lo-Fi (Ref.) | Implementación en Prototipo v2 | Estado de Cumplimiento |
|---|---|---|---|---|---|:---:|
| **RF-01**<br>Estado de carga visible y persistente | Pantalla 2:<br>`ScreenLoading` (Procesamiento) | Paso 4.1:<br>Envío de Solicitud y Espera de Servidor | **Molécula:** `LoadingStatus`<br>**Átomos:** `SpinnerAnim`, `TextAriaLive` | Wireframe #2:<br>`[PANTALLA 2: PROCESAMIENTO]` | - `app.js` (`renderLoading()` / `aria-live="polite"`)<br>- `styles.css` (`.spinner`, `.loading-card`)<br>- `index.html` (`#statusAnnouncement`) | **Verificado (100%)** |
| **RF-02**<br>Preservación de datos ante microcorte | Pantalla 3:<br>`ScreenError` (Error Recuperable) | Paso 5.2:<br>Captura de Error de Red y Preservación | **Molécula:** `SavedDataBadge`<br>**Átomos:** `BadgeIcon`, `TextValue` | Wireframe #3:<br>`[PANTALLA 3: ERROR RECUPERABLE]` | - `app.js` (`state.dockNumber` persistente)<br>- `index.html` (`#errorDockBadge`)<br>- Preservación en `#dockInput.value` | **Verificado (100%)** |
| **RF-03**<br>Botón de reintento idempotente | Pantalla 3:<br>`ScreenError` (Error Recuperable) | Paso 5.3:<br>Reintento Idempotente sin Duplicados | **Molécula:** `ActionGroup`<br>**Átomo:** `ButtonPrimary` (`#btnRetry`) | Wireframe #3:<br>`[PANTALLA 3: ERROR RECUPERABLE]` | - `app.js` (`handleRetry()` / `generateIdempotencyKey()`)<br>- Atributo `data-idempotency-key`<br>- Foco automático con `btnRetry.focus()` | **Verificado (100%)** |
| **RF-04**<br>Presentación clara de PIN con copiado | Pantalla 4:<br>`ScreenSuccess` (Confirmación) | Paso 6.1:<br>Visualización de PIN y Retiro Físico | **Molécula:** `PinDisplayCard`<br>**Átomos:** `PinNumber`, `BtnCopy`, `TimerCountdown` | Wireframe #4:<br>`[PANTALLA 4: CONFIRMACIÓN CON PIN]` | - `app.js` (`renderSuccess()`, `copyPinToClipboard()`, `startTimer()` 120s)<br>- `styles.css` (`.pin-code` 40px, `.timer-badge`) | **Verificado (100%)** |
| **RF-05**<br>Navegación por teclado con foco 3px | Transversal a todas las pantallas (1, 2, 3, 4) | Transversal a todos los pasos del flujo | **Átomos:** Todos los elementos interactivos (`button`, `input`, `select`) | Transversal a todos los Wireframes | - `styles.css` (`:focus-visible { outline: 3px solid #1D4ED8; outline-offset: 3px; }`)<br>- `index.html` (`tabindex="0"`, orden secuencial)<br>- `app.js` (atajos numéricos 1-9) | **Verificado (100%)** |
| **RF-06**<br>Mecanismo de cancelación explícita | Pantallas 1, 2 y 3:<br>`ScreenForm`, `ScreenLoading`, `ScreenError` | Paso 5.4:<br>Cancelación Segura y Retorno Limpio | **Átomo:** `ButtonSecondary` (`#btnCancel`) | Wireframe #2 y #3 (`[2] CANCELAR OPERACIÓN`) | - `app.js` (`handleCancel()`, listener `Escape` key)<br>- Mensaje de confirmación: *"Operación cancelada. 0 cargos efectuados"* | **Verificado (100%)** |

---

### 3. Vínculo Diagnóstico vs Arquitectura de Solución

| Hallazgo Heurístico (Diagnóstico Inicial) | Issue # | Requisito que lo Mitiga | Componente de Solución en Prototipo v2 | Impacto Emocional y Cognitivo |
|---|---|---|---|---|
| **H1:** Pantalla blanca congelada sin visibilidad de estado | **#1** | **RF-01** | Card de procesamiento con Spinner CSS SVG y anuncio sonoro para lectores de pantalla (`aria-live`). | Elimina la incertidumbre. El usuario sabe exactamente qué hace el sistema segundo a segundo. |
| **H5:** Cobro duplicado por recargas o doble clic sin idempotencia | **#2** | **RF-03** | Inhabilitación inmediata del botón tras el clic y cabecera virtual `Idempotency-Key` por sesión. | Seguridad reflexiva: Carlos tiene garantía total de que su dinero está a salvo de transacciones fantasma. |
| **H9:** Pérdida de anclaje ingresado y ausencia de reintento | **#3** | **RF-02**<br>**RF-03** | Pantalla de error recuperable con badge del anclaje guardado y botón enfocado "Reintentar conexión". | Reducción de fatiga motriz. Se resuelve el microcorte con una sola pulsación de pulgar o tecla `Enter`. |

---

### 4. Verificación de la Trazabilidad en Pruebas con Usuarios

Durante la sesión de prueba descrita en `pruebas/sesion.md`:
1. El usuario ejecutó el flujo con **simulación de microcorte activa**.
2. Se comprobó que el flujo transitó de `ScreenLoading` (RF-01) a `ScreenError` (RF-02) sin recarga de página.
3. El número de anclaje `"14"` se mantuvo intacto en la tarjeta de error (RF-02).
4. El foco del teclado se ubicó de inmediato en el botón `#btnRetry` (RF-05).
5. Al presionar `Enter`, el reintento se envió exitosamente con el mismo token transaccional (RF-03), liberando el anclaje y mostrando el PIN `8492` con temporizador de 120s (RF-04).
6. Ningún dato fue reescrito y ningún cargo duplicado fue efectuado.
