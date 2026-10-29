# Diagrama de Flujo de Usuario (User Flow)
## Sistema BiciUrbana: Desbloqueo Express de Bicicleta

---

### 1. Visión General del Flujo

El siguiente diagrama detalla la experiencia del repartidor Carlos al interactuar con el sistema BiciUrbana, contemplando tanto el **camino feliz (*Happy Path*)** como la **bifurcación por microcorte de conectividad**, mostrando cómo se preservan los datos y se previene cualquier cobro duplicado mediante idempotencia:

```mermaid
flowchart TD
    Start([Inicio: Carlos llega a la estación con prisa]) --> Scan[Escanea código QR o ingresa a WebApp con una sola mano]
    Scan --> ViewHome[Carga Pantalla de Desbloqueo Express]
    
    ViewHome --> InputDock[Ingresa número de anclaje<br>ej. 14 con teclado o numpad ergonómico]
    InputDock --> PressUnlock[Presiona 'Desbloquear Bicicleta'<br>o pulsa tecla Enter]
    
    PressUnlock --> LockUI[Sistema deshabilita botón<br>y genera Idempotency-Key única]
    LockUI --> ShowSpinner[Muestra estado de carga accesible<br>aria-live: 'Conectando con estación...']
    
    ShowSpinner --> CheckNet{¿Microcorte de red móvil<br>o pérdida de paquetes?}
    
    %% Camino Feliz
    CheckNet -- NO: Conexión Estable --> ServerAuth[Servidor valida anclaje y autoriza depósito de garantía]
    ServerAuth --> UnlockMechanic[Pestillo de anclaje #14 se libera físicamente]
    UnlockMechanic --> DisplayPin[Muestra Pantalla de Éxito:<br>• PIN temporal en pantalla grande 8492<br>• Inicia contador de 120s para retirar]
    
    DisplayPin --> CopyPinAction{¿Desea copiar PIN al portapapeles?}
    CopyPinAction -- SÍ --> Clipboard[Presiona 'Copiar PIN'<br>Feedback: '¡Copiado!']
    CopyPinAction -- NO --> PullBike[Retira bicicleta física del anclaje #14]
    Clipboard --> PullBike
    PullBike --> FinishSuccess([Fin: Carlos inicia su entrega a tiempo])
    
    %% Bifurcación de Microcorte (Camino de Error Recuperable)
    CheckNet -- SÍ: Microcorte / Timeout --> CatchError[Captura excepción de red en cliente<br>Tiempo transcurrido: 2500ms]
    CatchError --> PreserveData[Preserva número de anclaje 14 en memoria y DOM]
    PreserveData --> RenderErrorView[Renderiza Pantalla de Error Recuperable:<br>• Alerta clara: 'Tu dinero está seguro'<br>• Muestra anclaje seleccionado: #14<br>• Enfoca automáticamente botón 'Reintentar']
    
    RenderErrorView --> Decision{Acción de Carlos}
    
    %% Reintento con Idempotencia
    Decision -- Presiona 'Reintentar Conexión' / Enter --> RetryTx[Reenvía petición con la MISMA Idempotency-Key<br>Garantiza que no se duplique el cobro]
    RetryTx --> ShowSpinner
    
    %% Cancelación Segura
    Decision -- Presiona 'Cancelar Operación' / Esc --> CancelTx[Anula la transacción en vuelo<br>Sin penalización ni retención bancaria]
    CancelTx --> ResetState[Retorna al formulario inicial limpio<br>Feedback: 'Operación cancelada con éxito']
    ResetState --> FinishCancel([Fin: Operación abortada de forma segura])

    classDef happy fill:#ECFDF5,stroke:#059669,stroke-width:2px,color:#065F46;
    classDef branch fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E;
    classDef error fill:#FEF2F2,stroke:#DC2626,stroke-width:2px,color:#991B1B;
    classDef normal fill:#EFF6FF,stroke:#2563EB,stroke-width:2px,color:#1E3A8A;

    class Start,Scan,ViewHome,InputDock,PressUnlock,LockUI,ShowSpinner normal;
    class CheckNet,Decision,CopyPinAction branch;
    class ServerAuth,UnlockMechanic,DisplayPin,Clipboard,PullBike,FinishSuccess happy;
    class CatchError,PreserveData,RenderErrorView,RetryTx,CancelTx,ResetState,FinishCancel error;
```

---

### 2. Análisis de Estados y Transiciones

| Estado Inicial | Evento Desencadenante | Condición / Guarda | Estado Siguiente | Mecanismo de Salvaguarda IHC |
|---|---|---|---|---|
| **Formulario Inicial** | `submit` / `Enter` | Input de anclaje válido (número 1 a 99) | **Procesando (Loading)** | El botón se inhabilita de inmediato para imposibilitar el doble envío compulsivo. |
| **Procesando** | Respuesta HTTP 200 | Conexión sin interrupciones | **Éxito (PIN Entregado)** | Despliegue de PIN temporal en caracteres de 40px y arranque del temporizador de 120s. |
| **Procesando** | Microcorte / Timeout (2500ms) | Pérdida de conectividad detectada | **Error Recuperable** | NO se borra el número de anclaje. El foco del teclado pasa a `#btnRetry`. Saldo protegido. |
| **Error Recuperable** | Clic `#btnRetry` / `Enter` | Usuario desea reintentar | **Procesando (Loading)** | Reenvía la transacción reutilizando la misma `Idempotency-Key` para evitar doble cargo. |
| **Error Recuperable** | Clic `#btnCancel` / `Esc` | Usuario decide no continuar | **Formulario Inicial** | Anula el token y asegura que no exista ningún saldo debitado o retenido. |
