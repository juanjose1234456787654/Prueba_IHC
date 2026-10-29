# Wireframes de Baja Fidelidad (Lo-Fi)
## Sistema BiciUrbana: Desbloqueo Express de Bicicleta

---

### 1. Consideraciones de Diseño Ergonómico (Thumb Zone)

Los wireframes están diseñados siguiendo el mapa de alcance del pulgar de Steven Hoober (*The Thumb Zone*):
* **Zona Natural (Inferior):** Ubicación de todos los botones de acción inmediata (Desbloquear, Reintentar, Copiar PIN).
* **Zona de Alcance (Media):** Campo numérico y botones de selección rápida de anclaje.
* **Zona Difícil (Superior):** Únicamente información estática de referencia (Nombre de estación, hora y señal de red).

---

### 2. Pantalla 1: Formulario de Selección de Anclaje (Estado Inicial)

```
┌──────────────────────────────────────────────┐
│ [≡] BiciUrbana Express        [● Online 4G]  │ <-- Barra Superior (Referencial)
├──────────────────────────────────────────────┤
│ Estación #04: Plaza Central (12 bicis disp.) │
│                                              │
│          ¿QUÉ BICICLETA VAS A USAR?          │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ NÚMERO DE ANCLAJE                      │  │
│  │                                        │  │
│  │             [    14    ]               │  │ <-- Input Numérico Grande (64px)
│  │                                        │  │     Foco visible: outline 3px
│  └────────────────────────────────────────┘  │
│                                              │
│  Selección rápida con pulgar:                │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │ 12 │ │ 13 │ │ 14 │ │ 15 │ │ 16 │ │ 17 │   │ <-- Botones rápidos de anclaje
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘   │
│                                              │
│  Simulación de Red para Pruebas:             │
│  [ Modo: Conexión Normal (Éxito) ▼ ]         │ <-- Switch interactivo
│                                              │
├──────────────────────────────────────────────┤
│ [== THUMB ZONE: ALCANCE NATURAL DEL PULGAR =]│
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │       DESBLOQUEAR BICICLETA (Enter)    │  │ <-- Botón Primario (Alto: 54px)
│  └────────────────────────────────────────┘  │     Fondo contrastado #2563EB
│  Depósito temporal de garantía: $5.00        │
└──────────────────────────────────────────────┘
```

* **Anotaciones de Accesibilidad e IHC:**
  * El campo `#dockInput` tiene foco inicial automático con `autofocus`.
  * La tecla `Enter` dispara directamente el formulario.
  * Botones numéricos rápidos con tamaño de toque de 48x48px con margen de 8px.

---

### 3. Pantalla 2: Procesamiento y Enlace Asíncrono (Estado de Espera)

```
┌──────────────────────────────────────────────┐
│ [≡] BiciUrbana Express        [◌ Conectando] │
├──────────────────────────────────────────────┤
│ Estación #04: Plaza Central                  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │                                        │  │
│  │                 ╭───╮                  │  │
│  │                │  ●  │                 │  │ <-- Spinner Circular SVG (60 FPS)
│  │                 ╰───╯                  │  │     Animación no bloqueante
│  │                                        │  │
│  │       VERIFICANDO ANCLAJE #14...       │  │ <-- aria-live="polite"
│  │                                        │  │
│  │   • Validando pestillo electrónico     │  │
│  │   • Reteniendo depósito seguro ($5.00) │  │
│  │                                        │  │
│  │   Por favor no retires la bicicleta    │  │
│  │   hasta ver tu PIN en pantalla.        │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
├──────────────────────────────────────────────┤
│ [== THUMB ZONE: ALCANCE NATURAL DEL PULGAR =]│
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │       CANCELAR OPERACIÓN (Esc)         │  │ <-- Botón de Aborto Seguro
│  └────────────────────────────────────────┘  │     H3: Control y Libertad
└──────────────────────────────────────────────┘
```

* **Anotaciones de Accesibilidad e IHC:**
  * Botón principal inhabilitado (`disabled`, `aria-busy="true"`), evitando envíos duplicados (H5).
  * Mensaje de voz sintetizada emitido mediante `aria-live` para lectores de pantalla.
  * Tecla `Escape` disponible para cancelar en cualquier milisegundo antes de la confirmación física.

---

### 4. Pantalla 3: Error Recuperable ante Microcorte (Preservación y Reintento)

```
┌──────────────────────────────────────────────┐
│ [≡] BiciUrbana Express       [⚠ Microcorte]  │
├──────────────────────────────────────────────┤
│ Estación #04: Plaza Central                  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  ⚠ FALLO DE CONEXIÓN TEMPORAL          │  │ <-- Mensaje claro sin tecnicismos
│  │                                        │  │     (Heurística H9 de Nielsen)
│  │  Detectamos un microcorte en la señal  │  │
│  │  móvil durante la verificación.        │  │
│  │                                        │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │ ✓ TU DINERO ESTÁ 100% SEGURO     │  │  │ <-- Confianza Reflexiva de Norman
│  │  │ No se ha realizado ningún cobro. │  │  │
│  │  └──────────────────────────────────┘  │  │
│  │                                        │  │
│  │  Bicicleta seleccionada: [ ANCLAJE #14 ]│  │ <-- RF-02: Preservación de datos
│  │  (Datos conservados sin pérdidas)      │  │
│  └────────────────────────────────────────┘  │
│                                              │
├──────────────────────────────────────────────┤
│ [== THUMB ZONE: ALCANCE NATURAL DEL PULGAR =]│
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │   ⟳ REINTENTAR CONEXIÓN (Enter)        │  │ <-- FOCO AUTOMÁTICO (RF-03/RF-05)
│  └────────────────────────────────────────┘  │     outline: 3px solid #1D4ED8
│  ┌────────────────────────────────────────┐  │
│  │       CANCELAR OPERACIÓN (Esc)         │  │ <-- Botón Secundario (48px)
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

* **Anotaciones de Accesibilidad e IHC:**
  * El foco pasa de inmediato a `[⟳ REINTENTAR CONEXIÓN]` al renderizar la vista.
  * Presionar la tecla `Enter` reintenta la misma transacción con la misma `Idempotency-Key` (cero riesgo de cobro duplicado).
  * El anclaje `"14"` se muestra visualmente guardado, eliminando la necesidad de reescribirlo.

---

### 5. Pantalla 4: Confirmación de Desbloqueo y Entrega de PIN

```
┌──────────────────────────────────────────────┐
│ [≡] BiciUrbana Express        [✓ Conectado]  │
├──────────────────────────────────────────────┤
│ Estación #04: Plaza Central                  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │     ✓ ¡BICICLETA #14 DESBLOQUEADA!     │  │ <-- Feedback positivo inmediato
│  │                                        │  │
│  │        TU PIN TEMPORAL DE RETIRO:      │  │
│  │                                        │  │
│  │             ╭──────────────╮           │  │
│  │             │  8  4  9  2  │           │  │ <-- Tipografía Destacada (40px)
│  │             ╰──────────────╯           │  │     RF-04 (Legible a 1 metro)
│  │                                        │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  📋 COPIAR PIN AL PORTAPAPELES   │  │  │ <-- Botón Rápido Accesible
│  │  └──────────────────────────────────┘  │  │
│  │                                        │  │
│  │  Tiempo restante para retirar del dock:│  │
│  │           ⏱ 118 SEGUNDOS               │  │ <-- Temporizador regresivo dinámico
│  │                                        │  │
│  │  1. Presiona el botón físico del dock. │  │
│  │  2. Ingresa el PIN 8492 en el teclado. │  │
│  │  3. Jala la bicicleta hacia atrás.     │  │
│  └────────────────────────────────────────┘  │
│                                              │
├──────────────────────────────────────────────┤
│ [== THUMB ZONE: ALCANCE NATURAL DEL PULGAR =]│
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │    FINALIZAR Y LIBERAR ANCLAJE (Enter) │  │ <-- Botón Primario de Cierre
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

* **Anotaciones de Accesibilidad e IHC:**
  * El botón de copiar tiene confirmación audible y visual (`¡Copiado!` en verde durante 2.5s).
  * El temporizador alerta a los 30 segundos restantes cambiando a color ámbar preventivo.
  * El botón finaliza la sesión y devuelve la app a estado listo para un nuevo viaje.
