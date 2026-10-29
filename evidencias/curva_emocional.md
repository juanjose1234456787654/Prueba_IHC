# Evidencia de Experiencia de Usuario: Curva Emocional Comparativa
## Sistema BiciUrbana: Desbloqueo Express de Bicicleta

---

### 1. Marco Teórico: Curva de Experiencia Emocional

En Interacción Humano-Computador, la curva emocional (*Customer Journey Emotional Curve*) cuantifica la fluctuación de los estados afectivos y cognitivos del usuario a lo largo de los sucesivos puntos de contacto (*touchpoints*).

* **Escala de Valencia Emocional:**
  * **+2 (Deleite / Satisfacción Total):** Sensación de control, velocidad, confianza y eficacia.
  * **+1 (Tranquilidad / Complacencia):** La interfaz responde como se espera, sin fricciones.
  * ** 0 (Neutralidad):** Expectativa estándar de servicio.
  * **-1 (Confusión / Incertidumbre):** Falta de retroalimentación inmediata, duda motriz.
  * **-2 (Frustración Extrema / Rabia):** Sensación de engaño, pérdida de dinero, pantalla congelada, abandono del servicio.

---

### 2. Gráfico Comparativo de Curva Emocional (ASCII)

```
 Valencia
 Emocional
   ▲
+2 ┤                                                 [★ v2: +2]
   │                                                 (Éxito con PIN)
+1 ┤                       [● v2: +1]  [● v2: +1]  /
   │                       (Feedback)  (Recupera) /
 0 ┤───[● v1/v2: 0]─────────────┼───────────┼────/───────────────
   │   (Llegada)   \           │           │   /
-1 ┤                \          │           │  /
   │                 [▼ v1: -1]│           │ /
-2 ┤                 (Input)   \           │/
   │                            \          /
   │                             \        /
   │                              [▼▼ v1: -2] ──────────────── [▼▼ v1: -2]
   │                              (Microcorte & Congelamiento) (Cobro fantasma
   │                                                            y abandono)
   └─────┬───────────┬─────────────┬───────────┬───────────┬───────────┬─────►
        TP-1        TP-2          TP-3        TP-4        TP-5        TP-6   Touchpoint
      Llegada      Apertura     Ingreso      Envío y      Manejo     Desenlace
      Estación     WebApp       Anclaje     Microcorte   del Error   de Tarea
```

---

### 3. Matriz Comparativa Detallada por Touchpoint

| Touchpoint (TP) | Prototipo v1 (Sistema Inicial) | Prototipo v2 (Optimizado Accesible) | Delta Emocional (Δ) | Explicación Técnica y Psicológica |
|---|:---:|:---:|:---:|---|
| **TP-1: Llegada a la estación** | **0** (Neutral) | **0** (Neutral) | `0` | Carlos llega con prisa al anclaje #14. En ambos casos la expectativa es desbloquear rápidamente la bicicleta. |
| **TP-2: Apertura de la WebApp** | **-0.5** (Leve duda) | **+1** (Tranquilidad) | `+1.5` | En v1 los botones son pequeños y están arriba. En v2 la interfaz es Mobile First ergonómica con carga instantánea y foco claro. |
| **TP-3: Ingreso de código de anclaje** | **-1** (Incertidumbre) | **+1** (Eficacia) | `+2.0` | En v1 el input es pequeño (35px). En v2 el input mide 64px, con teclado numérico ergonómico y botones rápidos en la zona del pulgar. |
| **TP-4: Envío y Microcorte de red** | **-2** (Pánico / Fricción) | **+0.5** (Control) | `+2.5` | En v1 la pantalla se congela en blanco sin spinner. En v2 se muestra de inmediato un loader accesible con mensaje *"Verificando anclaje..."*. |
| **TP-5: Manejo del Error de Red** | **-2** (Furia / Estafa) | **+1.5** (Alivio y Confianza) | `+3.5` | En v1 se borra el código y se cobra $5.00 al recargar. En v2 la pantalla avisa que el dinero está 100% seguro, preserva el #14 y enfoca el botón "Reintentar". |
| **TP-6: Desenlace de la Tarea** | **-2** (Abandono Definitivo) | **+2** (Deleite / Satisfacción) | `+4.0` | En v1 Carlos pierde $5.00 y no desbloquea. En v2 Carlos pulsa Enter, obtiene su PIN 8492 en caracteres gigantes (40px) y retira la bicicleta en 14 segundos. |

---

### 4. Análisis Psico-Cognitivo de la Recuperación de Error en v2

#### 4.1 La "Caída en el Abismo" en v1
En el prototipo v1, el microcorte desencadena el peor escenario previsto por la literatura de HCI:
* **Falta de Feedback (H1 de Nielsen):** El usuario experimenta ceguera del sistema; no sabe si la pulsación se registró.
* **Violación del Modelo Mental:** El usuario recarga la página como mecanismo intuitivo de defensa, pero el sistema castiga esta acción duplicando el cobro monetario.
* **Pérdida de la Tarea (Norman):** La frustración alcanza el nivel reflexivo; Carlos asocia la marca BiciUrbana con ineficiencia y fraude.

#### 4.2 El "Efecto Resiliencia" en v2
En el prototipo v2, la curva emocional se mantiene en terreno positivo (+0.5 a +2) a pesar de la falla de conectividad:
1. **Transparencia Inmediata:** El mensaje no usa códigos crípticos (no muestra *"Error 504"* ni *"Fetch failed"*), sino lenguaje humano comprensible: *"Microcorte de señal detectado"*.
2. **Garantía Económica Incondicional:** La confirmación destacada *"Tu dinero está 100% seguro. Cero cargos efectuados"* neutraliza instantáneamente la ansiedad de pérdida monetaria.
3. **Cero Retrabajo Motor:** Conservar el número *"14"* respeta el principio de ergonomía para una sola mano; Carlos no tiene que volver a mirar el muelle ni teclear de nuevo.
4. **Acción de Reintento a un Clic:** El foco automático en el botón *"Reintentar"* permite resolver la incidencia con un solo toque del pulgar o un toque de la tecla `Enter`.
