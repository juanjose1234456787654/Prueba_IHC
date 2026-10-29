# Registro de Prueba de Observación con Usuario Real
## Sistema BiciUrbana: Desbloqueo Express de Bicicleta

---

### 1. Ficha Técnica de la Sesión de Evaluación

* **Fecha y Hora de Ejecución:** Jueves, 29 de Octubre de 2026 – 10:15 AM.
* **Lugar / Contexto:** Entorno simulado de exteriores con teléfono inteligente en mano derecha y mochila térmica en mano izquierda (simulación de restricción de uso con una sola mano).
* **Evaluador / Facilitador:** Juan José Carvajal Jaya (Especialista en IHC).
* **Participante (Compañero evaluado):**
  * **Nombre:** Andrés Morales (26 años).
  * **Ocupación:** Estudiante universitario y repartidor de plataforma de entregas durante fines de semana.
  * **Frecuencia de uso de smartphones:** Intensiva (>6 horas diarias).
  * **Experiencia previa con sistemas de bicicletas compartidas:** Ocasional (2 a 3 veces por mes).
* **Metodología Empleada:** Observación directa estructurada combinada con el protocolo de **Pensamiento en Voz Alta (*Think Aloud Protocol*)**, cronómetro digital de precisión y registro en video de eventos de pantalla y teclado.

---

### 2. Tarea Asignada y Escenario

> **Instrucción dada al participante:**  
> *"Imagina que acabas de recibir un pedido urgente en tu app de delivery. Estás de pie frente a la estación física de BiciUrbana con una sola mano libre. Tu objetivo es desbloquear la bicicleta situada en el **anclaje 14** y obtener el PIN de retiro en el menor tiempo posible usando únicamente el pulgar de tu mano derecha o el teclado físico de tu dispositivo."*

---

### 3. Registro Cuantitativo de Métricas (ISO 9241-11)

Se comparó el desempeño del participante enfrentando primero el **Prototipo v1 (Sistema Inicial con Fallo)** y posteriormente el **Prototipo v2 (Optimizado y Accesible)** bajo condiciones idénticas de microcorte de red simulado:

| Métrica de Usabilidad | Prototipo v1 (Defectuoso) | Prototipo v2 (Accesible & Resiliente) | Meta / Umbral Aceptable | Variación / Impacto |
|---|:---:|:---:|:---:|:---:|
| **Tasa de Éxito de Tarea** | **0.0%** (Bloqueo fatal) | **100.0%** (PIN obtenido) | 100% | `+100%` (Eficacia recuperada) |
| **Tiempo Total de Tarea (TCT)** | **48.2 segundos** (Hasta abandono) | **13.6 segundos** (Retiro completado) | < 25 s | `-71.8%` de reducción de tiempo |
| **Cantidad de Errores No Forzados** | **2 intentos compulsivos** (Doble clic) | **0 errores** | 0 | `100%` eliminación de errores |
| **Pausas / Vacilaciones Inciertas** | **3 vacilaciones** (de >4s cada una) | **0 vacilaciones** | ≤ 1 | Eliminación de duda cognitiva |
| **Pérdida de Datos Ingresados** | **100%** (Input borrado tras error) | **0%** (Anclaje conservado) | 0% | Conservación total de contexto |
| **Cargos Financieros Injustificados** | **$5.00 USD** (Débito sin desbloqueo) | **$0.00 USD** (Cobro cero en fallo) | $0.00 | Salvaguarda patrimonial |

---

### 4. Registro Cualitativo y Citas Textuales del Usuario

Durante la sesión se registraron las siguientes reacciones y verbalizaciones espontáneas:

#### En Prototipo v1:
* **Segundo 05:** *"El campo está muy arriba en la pantalla, tuve que estirar el pulgar casi al borde para poder escribir el 14."*
* **Segundo 12 (Tras presionar Desbloquear):** *"Le di clic pero no hace nada... ¿se habrá enviado? Voy a darle otra vez."* (Produce doble clic no controlado - H5).
* **Segundo 22 (Pantalla en blanco total):** *"La pantalla se puso en blanco completa. Pensé que se había cerrado el navegador."*
* **Segundo 35 (Al saltar el modal de cobro):**  
  > 🗣️ **Cita textual clave:**  
  > *"¡Se quedó la pantalla pegada y no sé si ya me cobraron los 5 dólares! Dice aquí que me descontaron la plata pero el candado de la bicicleta sigue trabado. ¿Y ahora a quién le reclamo?"*
* **Segundo 48:** Andrés apaga la pantalla visiblemente molesto y decide no continuar.

#### En Prototipo v2:
* **Segundo 02:** *"Qué bien, el cursor ya está titilando en el número y los botones están abajo cerquita del dedo."*
* **Segundo 06:** Presiona `#14` en los chips rápidos con un solo toque de pulgar y pulsa `Enter`.
* **Segundo 08 (Al presentarse el microcorte):** *"Ah, me dice que hubo un microcorte pero en verde grande dice que mi dinero está a salvo. Y no me borró el 14."*
* **Segundo 11:** Pulsa la tecla `Enter` (el botón Reintentar ya tenía el foco activo).
* **Segundo 13.6:** *"¡Listo! Ya salió el código: 8492. Le di copiar y me marcó copiado. En 10 segundos ya tengo la bici."*

---

### 5. Priorización de Hallazgos y Decisiones de Ingeniería Aplicadas

1. **Prioridad 1 (Crítica - H1 y H5):**  
   * *Hallazgo:* La falta de spinner generaba pulsaciones múltiples que derivaban en cobros bancarios duplicados.
   * *Solución implementada:* Inhabilitación inmediata del botón con `aria-busy="true"`, loader SVG circular no intrusivo y token de idempotencia transaccional.
2. **Prioridad 2 (Alta - H9 y RF-02):**  
   * *Hallazgo:* Borrar el código de anclaje durante una falla causaba fatiga extrema en usuarios que operan con una sola mano.
   * *Solución implementada:* Preservación inmutable del estado (`state.dockNumber`) y despliegue del badge *"Bicicleta conservada: #14"* con foco directo en reintento.
3. **Prioridad 3 (Media - WCAG 2.1 AA):**  
   * *Hallazgo:* En v1 no había forma de operar el sistema sin la pantalla táctil.
   * *Solución implementada:* Contorno de foco de 3px azul índigo, navegación por tabulación fluida y soporte completo para teclas `Enter` (confirmar) y `Escape` (cancelar).
