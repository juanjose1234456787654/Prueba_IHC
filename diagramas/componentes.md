# Arquitectura de Componentes: Inventario Atomic Design
## Sistema BiciUrbana: Desbloqueo Express de Bicicleta

---

### 1. Metodología Atomic Design (Brad Frost)

Para garantizar consistencia visual, modularidad en el código y accesibilidad estricta por teclado, los componentes de la interfaz de BiciUrbana se descomponen en 5 niveles jerárquicos:

```
  ┌──────────┐    ┌──────────┐    ┌────────────┐    ┌───────────┐    ┌─────────┐
  │  ÁTOMOS  │ ──>│ MOLÉCULAS│ ──>│ ORGANISMOS │ ──>│PLANTILLAS │ ──>│ PÁGINAS │
  └──────────┘    └──────────┘    └────────────┘    └───────────┘    └─────────┘
```

---

### 2. Inventario Detallado de Componentes

#### 2.1 Átomos (Elementos Mínimos Indivisibles)

* **`Atom-ButtonPrimary` (`.btn-primary`):**
  * *Uso:* Acción principal ("Desbloquear Bicicleta").
  * *Especificaciones:* Altura 54px, `border-radius: 12px`, fondo `#2563EB`, texto `#FFFFFF` (peso 600), ratio de contraste 4.6:1 (WCAG AA). Foco `:focus-visible` con `outline: 3px solid #1D4ED8; outline-offset: 3px`.
* **`Atom-ButtonSecondary` (`.btn-secondary`):**
  * *Uso:* Acciones de soporte o cancelación ("Cancelar Operación", "Finalizar").
  * *Especificaciones:* Altura 48px, fondo transparente con borde `#CBD5E1`, texto `#475569`. Foco `:focus-visible` idéntico.
* **`Atom-ButtonRetry` (`.btn-retry`):**
  * *Uso:* Botón enfocado automáticamente tras fallo de red ("Reintentar Conexión").
  * *Especificaciones:* Altura 54px, fondo `#D97706` (ámbar de alta visibilidad), texto blanco, icono de refresco SVG.
* **`Atom-InputDock` (`#dockInput`):**
  * *Uso:* Entrada numérica para código de anclaje (1 a 99).
  * *Especificaciones:* Altura 64px, texto centrado a 32px de tamaño (`font-weight: 700`), `inputmode="numeric"`, `pattern="[0-9]*"`, `autocomplete="off"`.
* **`Atom-BadgeStatus` (`.badge-status`):**
  * *Uso:* Señalizadores de estado de red (*Online*, *Microcorte*, *Reintentando*).
  * *Especificaciones:* Relleno con bordes redondeados (`pill`), indicador de punto LED circular (`.dot-indicator`).
* **`Atom-Spinner` (`.spinner`):**
  * *Uso:* Retroalimentación no bloqueante de espera asíncrona.
  * *Especificaciones:* SVG circular con rotación de 360° a 0.8s *linear infinite*, color `#2563EB`.
* **`Atom-TypographyPin` (`.pin-digit`):**
  * *Uso:* Dígitos del PIN temporal.
  * *Especificaciones:* Fuente monoespaciada `font-family: monospace`, 40px de altura, color `#0F172A`, *letter-spacing: 0.25em*.

---

#### 2.2 Moléculas (Uniones Funcionales de Átomos)

* **`Mol-DockInputField` (`.dock-field-group`):**
  * *Composición:* `Atom-Label` + `Atom-InputDock` + `Atom-InlineFeedback` (`aria-describedby`).
  * *Comportamiento:* Valida en tiempo real que el código ingresado sea un entero entre 1 y 99. Muestra mensaje de ayuda accesible sin mover la altura del layout.
* **`Mol-PinDisplayCard` (`.pin-card`):**
  * *Composición:* `Atom-TypographyPin` + `Atom-ButtonCopy` (`#btnCopyPin`) + `Atom-Timer` (`#timerCount`).
  * *Comportamiento:* Muestra el PIN de 4 dígitos, el tiempo restante para el retiro (120 s) y permite copiar el PIN con retroalimentación visual accesible en un clic.
* **`Mol-NetworkSimulationToolbar` (`.simulation-toolbar`):**
  * *Composición:* `Atom-Select` de modo de red + `Atom-Badge` de simulación + `Atom-Toggle`.
  * *Comportamiento:* Permite alternar fácilmente en pruebas entre: *"Conexión Normal (Éxito)"* y *"Simular Microcorte (Error recuperable)"*.
* **`Mol-BottomActionBar` (`.bottom-action-bar`):**
  * *Composición:* Agrupación de botones ergonómicos en la zona inferior de alcance del pulgar (*Thumb Zone*).
  * *Comportamiento:* Fija en la base móvil con `position: sticky; bottom: 0`, garantizando que Carlos pueda operar la acción clave con un solo pulgar.

---

#### 2.3 Organismos (Secciones Autónomas y Complejas)

* **`Org-UnlockForm` (`#unlockSection`):**
  * *Composición:* Encabezado de estación (`Mol-StationHeader`) + Teclado rápido táctil numérico de anclajes directos + `Mol-DockInputField` + `Mol-BottomActionBar` + `Mol-NetworkSimulationToolbar`.
  * *Responsabilidad:* Captura de la intención de desbloqueo, validación ergonómica y despacho del evento transaccional.
* **`Org-LoadingCard` (`#loadingSection`):**
  * *Composición:* `Atom-Spinner` + Texto de estado con `aria-live="polite"` + Información de anclaje seleccionado.
  * *Responsabilidad:* Mantener al usuario informado durante la espera asíncrona (H1) impidiendo envíos concurrentes.
* **`Org-ErrorCard` (`#errorSection`):**
  * *Composición:* Icono SVG de alerta de red + Mensaje explicativo de fondos seguros + Badge de anclaje retenido (`#errorDockBadge`) + Botón primario de reintento (`Atom-ButtonRetry`) + Botón secundario de cancelación.
  * *Responsabilidad:* Gestión transparente del fallo (H9), preservación de datos (H5) y reanudación idempotente de la tarea.
* **`Org-SuccessCard` (`#successSection`):**
  * *Composición:* Icono SVG de bicicleta desbloqueada + `Mol-PinDisplayCard` + Instrucciones de retiro físico + Botón de finalización.
  * *Responsabilidad:* Entrega del valor final de la tarea y cierre de la interacción.

---

#### 2.4 Plantillas (Templates) y Páginas (Pages)

* **`Template-MobileExpress`:**
  * Estructura Mobile-First fija de 360px a 480px centrada en pantalla.
  * Distribución: Header superior compacto (15%) + Área de contenido dinámico contextual (45%) + Barra inferior ergonómica *Thumb Zone* (40%).
* **`Page-BiciUrbanaApp`:**
  * Instancia única que intercambia los organismos en pantalla (`#unlockSection`, `#loadingSection`, `#errorSection`, `#successSection`) mediante transiciones CSS fluidas sin recarga de página (*Zero Page Reloads*).
