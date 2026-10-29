# Sistema BiciUrbana: Desbloqueo Express de Bicicleta en Estación
### Proyecto de Evaluación y Rediseño de Interacción Humano-Computador (IHC)

[![IHC Standard](https://img.shields.io/badge/IHC-ISO%209241--11-blue.svg)](#)
[![Accessibility](https://img.shields.io/badge/WCAG%202.1-Nivel%20AA-green.svg)](#)
[![Design](https://img.shields.io/badge/UX-Ergonom%C3%ADa%20One--Hand-orange.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](#)

---

## 1. Caso de Estudio Asignado

* **Sistema:** **BiciUrbana Express** (Servicio metropolitano de micro-movilidad en estaciones físicas).
* **Persona Usuaria:** **Carlos (28 años)**, repartidor independiente que trabaja a contrarreloj en aplicaciones de entrega a domicilio.
* **Contexto Crítico:** Sostiene su teléfono inteligente con **una sola mano** (la otra sostiene un pedido o el manubrio). Opera en exteriores bajo luz solar directa y con alto ruido ambiental.
* **Tarea Crítica:** Desbloquear una bicicleta específica ingresando el número de su anclaje físico (docking station) y obtener de inmediato un PIN temporal de 4 dígitos para liberarla.
* **Restricciones Mandatorias:**
  1. Interfaz **100% operable por teclado** (navegación fluida por `Tab`, activación con `Enter` y cancelación con `Esc`).
  2. Diseño adaptado ergonómicamente al **uso con una sola mano** (*Thumb Zone* en el tercio inferior de la pantalla).
* **Fallo Original Detectado en v1:** Ante un microcorte de conectividad móvil, la pantalla se congela en blanco; al recargar desesperadamente la aplicación, se cobra el depósito de garantía ($5.00 USD), pero no se desbloquea el anclaje físico ni se entrega el PIN.

---

## 2. Integrantes y Roles del Equipo

| Nombre | Rol en el Proyecto | Responsabilidades Principales |
|---|---|---|
| **Juan José Carvajal Jaya** | **Especialista en IHC & Lead UX** | Diagnóstico heurístico de Nielsen, análisis de Norman (visceral, conductual, reflexivo), pruebas de observación y curva emocional. |
| **Juan José Carvajal Jaya** | **Desarrollador Frontend & Accesibilidad** | Arquitectura de componentes Atomic Design, prototipo v1 defectuoso, prototipo v2 resiliente y accesible, navegación por teclado WCAG AA. |

---

## 3. Enlaces a Issues Ficticios de Usabilidad y Arquitectura

El seguimiento técnico de los hallazgos críticos se gestiona a través de los siguientes issues documentados en [docs/diagnostico.md](file:///c:/IHC_P2/docs/diagnostico.md#7-issues-estructurados-seguimiento-de-ingeniería-de-usabilidad):

* [**Issue #1: Pantalla en blanco y pérdida total de estado ante microcorte de red**](file:///c:/IHC_P2/docs/diagnostico.md#issue-1-pantalla-en-blanco-y-pérdida-total-de-estado-ante-microcorte-de-red)
  * *Severidad:* Crítica | *Heurística:* H1 (Visibilidad del estado del sistema).
  * *Cierre:* Implementación de tarjeta de procesamiento con Spinner animado y feedback `aria-live`.
* [**Issue #2: Cobro duplicado y falta de protección contra doble clic (Idempotencia)**](file:///c:/IHC_P2/docs/diagnostico.md#issue-2-cobro-duplicado-y-falta-de-protección-contra-doble-clic-idempotencia)
  * *Severidad:* Crítica | *Heurística:* H5 (Prevención de errores).
  * *Cierre:* Deshabilitación inmediata de controles y generación de `Idempotency-Key` por sesión.
* [**Issue #3: Blanqueo del formulario y ausencia de botón de reintento accesible**](file:///c:/IHC_P2/docs/diagnostico.md#issue-3-blanqueo-del-formulario-y-ausencia-de-botón-de-reintento-accesible)
  * *Severidad:* Alta | *Heurística:* H9 (Reconocer y recuperarse de errores).
  * *Cierre:* Preservación del anclaje ingresado y botón enfocado automáticamente "Reintentar conexión".
* [**Issue #4: Inoperabilidad motriz con una sola mano y carencia de soporte de teclado**](file:///c:/IHC_P2/docs/diagnostico.md#issue-4-inoperabilidad-motriz-con-una-sola-mano-y-carencia-de-soporte-de-teclado)
  * *Severidad:* Alta | *Heurística:* H7 (Flexibilidad y eficiencia de uso) & WCAG 2.1.1.
  * *Cierre:* Rediseño del layout en Thumb Zone inferior y anillo de foco visible `3px solid #1D4ED8`.

---

## 4. Instrucciones Exactas para Ejecutar los Prototipos

Los prototipos están desarrollados en tecnologías web nativas (**HTML5 Semántico, CSS3 Vanilla y JavaScript ECMAScript 6+**), por lo que **no requieren compiladores, Webpack ni dependencias externas pesadas**.

### Opción A: Ejecución Directa en Navegador (Recomendada y Ultra Rápida)
1. Para el **Prototipo Defectuoso v1**:
   * Navega a la carpeta `prototipo/v1/` y haz doble clic sobre el archivo [index.html](file:///c:/IHC_P2/prototipo/v1/index.html), o ábrelo directamente en Google Chrome, Edge o Firefox.
2. Para el **Prototipo Optimizado v2**:
   * Navega a la carpeta `prototipo/v2/` y haz doble clic sobre el archivo [index.html](file:///c:/IHC_P2/prototipo/v2/index.html).

### Opción B: Ejecución con Servidor Local (Live Server / Node.js)
Si dispones de Node.js o la extensión *Live Server* de VS Code:
```bash
# Para ejecutar v2 en puerto local:
npx serve c:/IHC_P2/prototipo/v2
# O abrir con navegador predeterminado:
start c:/IHC_P2/prototipo/v2/index.html
```

---

## 5. Decisiones Clave de Diseño y Solución IHC

1. **Ergonomía de Una Sola Mano (*The Thumb Zone*):**
   * El 100% de los elementos interactivos primarios (teclado rápido de anclaje, botón de desbloqueo, botón de reintento y botón de copiado de PIN) están anclados en los 320 píxeles inferiores de la vista móvil (rango óptimo de alcance del pulgar sin estirar la mano).
2. **Navegación 100% por Teclado y Accesibilidad WCAG 2.1 AA:**
   * Anillo de foco visual con contraste superior a 4.5:1: `outline: 3px solid #1D4ED8; outline-offset: 3px`.
   * Atajos ergonómicos: `Enter` para la acción principal contextual, `Escape` para cancelar operaciones en vuelo y teclas numéricas para selección directa de muelle.
3. **Resiliencia ante Microcortes e Idempotencia:**
   * La interfaz captura la caída de red de forma no invasiva.
   * **Preservación total de datos:** El anclaje seleccionado no se borra.
   * **Garantía financiera:** Cada reintento viaja con la misma clave transaccional (`Idempotency-Key`), evitando cobros duplicados en la pasarela de pagos.
4. **Visibilidad Inmediata del PIN Temporal (MoT 1):**
   * El PIN se presenta en tipografía de 40px con alto contraste, acompañado de un botón de copiado al portapapeles y un temporizador regresivo de 120 segundos para retirar la bicicleta física.

---

## 6. Estructura Completa del Repositorio

```
├── README.md                           <- Este archivo: Resumen, ejecución, roles y decisiones
├── docs/
│   ├── diagnostico.md                  <- 7 touchpoints, 2 MoT, Norman, métricas reales vs estimadas, 3 issues
│   ├── requisitos.md                   <- 6 requisitos RF-01 a RF-06 formalizados
│   ├── trazabilidad.md                 <- Matriz completa de trazabilidad bidireccional
│   └── defensa.md                      <- Guía para tribunal docente y microcambios en vivo
├── diagramas/
│   ├── sitemap.md                      <- Árbol jerárquico de vistas y estados
│   ├── user_flow.md                    <- Flujo de usuario, camino feliz y bifurcación de microcorte
│   └── componentes.md                  <- Inventario de componentes bajo Atomic Design
├── wireframes/
│   └── wireframes_lofi.md              <- 4 pantallas Lo-Fi en formato ASCII con anotaciones
├── prototipo/
│   ├── v1/                             <- Prototipo inicial con fallo de red y cobro duplicado
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   └── v2/                             <- Prototipo optimizado, accesible y resiliente a microcortes
│       ├── index.html
│       ├── styles.css
│       └── app.js
├── pruebas/
│   └── sesion.md                       <- Registro de prueba empírica con usuario real y métricas
└── evidencias/
    └── curva_emocional.md              <- Gráfico ASCII de curva emocional Antes vs Después
```

---

## 7. Mapa de Trazabilidad Rápido

```
[DIAGNÓSTICO INICIAL] ──> [REQUISITO OBSERVABLE] ──> [COMPONENTE ATOMIC] ──> [PROTOTIPO V2]
 H1: Pantalla Congelada ──> RF-01: Estado de Carga  ──> Mol-LoadingStatus ──> app.js (renderLoading)
 H9: Datos Borrados     ──> RF-02: Preservar Datos  ──> Mol-SavedDataBadge──> state.dockNumber intacto
 H5: Doble Cobro        ──> RF-03: Reintento Idemp. ──> Atom-ButtonRetry  ──> data-idempotency-key
 H2: Falta de Claridad  ──> RF-04: PIN Destacado    ──> Mol-PinCard       ──> PIN 40px + Timer 120s
 Motricidad / Teclado   ──> RF-05: Foco y Teclado   ──> Atom-Button*      ──> outline 3px + TabIndex
 Pérdida de Control     ──> RF-06: Cancelación Esc  ──> Atom-BtnSecondary ──> Tecla Esc / Cero cobros
```
