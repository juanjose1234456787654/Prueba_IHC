/**
 * ============================================================================
 * SISTEMA BICIURBANA EXPRESS - PROTOTIPO v2 (ACCESIBLE & RESILIENTE)
 * Lógica de Interacción Humano-Computador (IHC) y Manejo Asíncrono
 * 
 * Implementación de Requisitos:
 * - RF-01: Estado de carga visible y persistente (H1).
 * - RF-02: Preservación total de datos ante microcortes (H9).
 * - RF-03: Botón de reintento idempotente sin cobros duplicados (H5).
 * - RF-04: Presentación destacada de PIN temporal (40px) y temporizador (120s).
 * - RF-05: Navegación por teclado con foco visible y atajos (Enter / Esc).
 * - RF-06: Mecanismo de cancelación explícita en cualquier pantalla previa.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // ESTADO GLOBAL DE LA APLICACIÓN
  // ==========================================
  const state = {
    dockNumber: '14',
    simulationMode: 'microcorte', // 'normal' o 'microcorte'
    currentTransactionId: null,
    idempotencyKey: null,
    isProcessing: false,
    retryCount: 0,
    timerInterval: null,
    timeRemaining: 120,
    pin: '8492'
  };

  // ==========================================
  // REFERENCIAS AL DOM
  // ==========================================
  // Vistas
  const views = {
    form: document.getElementById('viewForm'),
    loading: document.getElementById('viewLoading'),
    error: document.getElementById('viewError'),
    success: document.getElementById('viewSuccess')
  };

  // Elementos de Formulario e Inputs
  const dockForm = document.getElementById('dockForm');
  const dockInput = document.getElementById('dockInput');
  const dockErrorMsg = document.getElementById('dockErrorMsg');
  const btnUnlock = document.getElementById('btnUnlock');
  const quickChips = document.querySelectorAll('.btn-chip');

  // Herramientas de Simulación y Red
  const simSelect = document.getElementById('networkSimulationSelect');
  const networkText = document.getElementById('networkText');
  const networkPill = document.querySelector('.dot-led');
  const liveRegion = document.getElementById('statusLiveRegion');

  // Componentes de Estados
  const loadingDockBadge = document.getElementById('loadingDockBadge');
  const errorPreservedDock = document.getElementById('errorPreservedDock');
  const btnRetry = document.getElementById('btnRetry');
  const btnCancelLoading = document.getElementById('btnCancelLoading');
  const btnCancelError = document.getElementById('btnCancelError');

  // Componentes de Éxito
  const successDockNum = document.getElementById('successDockNum');
  const pinValue = document.getElementById('pinValue');
  const btnCopyPin = document.getElementById('btnCopyPin');
  const copyBtnText = document.getElementById('copyBtnText');
  const timerCounter = document.getElementById('timerCounter');
  const btnFinish = document.getElementById('btnFinish');

  // ==========================================
  // GESTIÓN DE VISTAS Y ACCESIBILIDAD
  // ==========================================
  function switchView(targetViewKey) {
    Object.keys(views).forEach(key => {
      const viewEl = views[key];
      if (key === targetViewKey) {
        viewEl.classList.add('active');
        viewEl.removeAttribute('aria-hidden');
      } else {
        viewEl.classList.remove('active');
        viewEl.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function announceLive(message) {
    if (!liveRegion) return;
    liveRegion.textContent = '';
    // Retraso para que el lector de pantalla reconozca el cambio de región viva
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 50);
  }

  function generateIdempotencyKey() {
    return 'bici-tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
  }

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================
  dockInput.value = state.dockNumber;
  state.simulationMode = simSelect.value;

  simSelect.addEventListener('change', (e) => {
    state.simulationMode = e.target.value;
    if (state.simulationMode === 'normal') {
      networkText.textContent = '4G Red Estable';
      networkPill.classList.remove('offline');
      announceLive('Modo de prueba cambiado a conexión normal');
    } else {
      networkText.textContent = '4G Señal Inestable';
      networkPill.classList.add('offline');
      announceLive('Modo de prueba cambiado a simulación de microcorte');
    }
  });

  // Selección rápida de anclajes con una sola mano (Thumb Zone Media)
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      quickChips.forEach(c => c.classList.remove('active-chip'));
      chip.classList.add('active-chip');
      const val = chip.getAttribute('data-dock');
      dockInput.value = val;
      state.dockNumber = val;
      clearInputError();
      dockInput.focus();
    });
  });

  dockInput.addEventListener('input', () => {
    state.dockNumber = dockInput.value.trim();
    clearInputError();
    // Actualizar chip si coincide
    quickChips.forEach(chip => {
      if (chip.getAttribute('data-dock') === state.dockNumber) {
        chip.classList.add('active-chip');
      } else {
        chip.classList.remove('active-chip');
      }
    });
  });

  function showInputError(msg) {
    dockErrorMsg.textContent = msg;
    dockErrorMsg.style.display = 'block';
    dockInput.setAttribute('aria-invalid', 'true');
    announceLive('Error en formulario: ' + msg);
  }

  function clearInputError() {
    dockErrorMsg.textContent = '';
    dockErrorMsg.style.display = 'none';
    dockInput.removeAttribute('aria-invalid');
  }

  // ==========================================
  // FLUJO TRANSACCIONAL ASÍNCRONO
  // ==========================================
  function handleUnlockSubmit() {
    const rawVal = dockInput.value.trim();
    const dockNum = parseInt(rawVal, 10);

    if (!rawVal || isNaN(dockNum) || dockNum < 1 || dockNum > 99) {
      showInputError('Ingresa un número de anclaje válido entre 1 y 99.');
      dockInput.focus();
      return;
    }

    state.dockNumber = rawVal;
    state.isProcessing = true;

    // PREVENCIÓN H5: Deshabilitar botón y generar Idempotency-Key
    btnUnlock.disabled = true;
    btnUnlock.setAttribute('aria-busy', 'true');
    state.idempotencyKey = generateIdempotencyKey();

    // RF-01: Estado de carga visible y persistente
    loadingDockBadge.textContent = `#${state.dockNumber}`;
    switchView('loading');
    announceLive(`Verificando anclaje #${state.dockNumber}. Por favor espera.`);

    // Simulación del trayecto de red
    const isMicrocorte = (state.simulationMode === 'microcorte');

    setTimeout(() => {
      if (isMicrocorte && state.retryCount === 0) {
        // Simulación de microcorte de red en el primer intento
        handleNetworkError();
      } else {
        // Camino de éxito (conexión estable o reintento exitoso)
        handleUnlockSuccess();
      }
    }, 1800);
  }

  dockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUnlockSubmit();
  });

  btnUnlock.addEventListener('click', (e) => {
    e.preventDefault();
    handleUnlockSubmit();
  });

  // ==========================================
  // MANEJO DE ERROR RECUPERABLE (RF-02, RF-03 / H9)
  // ==========================================
  function handleNetworkError() {
    state.isProcessing = false;
    btnUnlock.disabled = false;
    btnUnlock.removeAttribute('aria-busy');

    // RF-02: Preservación de datos (NO se borra el anclaje)
    errorPreservedDock.textContent = `#${state.dockNumber}`;
    dockInput.value = state.dockNumber; // Garantiza persistencia en el input

    // Actualizar pill de red
    networkText.textContent = 'Microcorte Detectado';
    networkPill.classList.add('offline');

    switchView('error');

    // RF-03 & RF-05: Foco automático en botón Reintentar
    setTimeout(() => {
      btnRetry.focus();
    }, 80);

    announceLive(
      `Microcorte de conexión detectado. Tu dinero está seguro y no se realizó ningún cobro. El anclaje #${state.dockNumber} está guardado. Presiona Enter para reintentar conexión.`
    );
  }

  // Reintento Idempotente (RF-03)
  btnRetry.addEventListener('click', () => {
    state.retryCount++;
    state.isProcessing = true;
    btnRetry.disabled = true;

    // RF-01: Volver a estado de carga usando la MISMA clave transaccional
    switchView('loading');
    announceLive(`Reintentando conexión con anclaje #${state.dockNumber} con clave segura...`);

    setTimeout(() => {
      // El reintento solventa la conexión exitosamente
      btnRetry.disabled = false;
      handleUnlockSuccess();
    }, 1600);
  });

  // ==========================================
  // CONFIRMACIÓN Y ENTREGA DE PIN (RF-04 / MoT 1)
  // ==========================================
  function handleUnlockSuccess() {
    state.isProcessing = false;
    state.retryCount = 0;
    btnUnlock.disabled = false;
    btnUnlock.removeAttribute('aria-busy');

    // Actualizar datos en pantalla de éxito
    successDockNum.textContent = state.dockNumber;
    state.pin = String(Math.floor(1000 + Math.random() * 9000));
    pinValue.textContent = state.pin;

    // Restaurar indicador de red
    networkText.textContent = 'Conectado a Estación';
    networkPill.classList.remove('offline');

    switchView('success');

    // Iniciar temporizador regresivo de 120s
    startWithdrawalTimer(120);

    // Foco en botón de copiado
    setTimeout(() => {
      btnCopyPin.focus();
    }, 100);

    announceLive(
      `¡Bicicleta en anclaje #${state.dockNumber} desbloqueada! Tu PIN temporal es ${state.pin}. Tienes 120 segundos para retirarla.`
    );
  }

  // Copiado rápido al portapapeles con confirmación accesible (RF-04)
  btnCopyPin.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(state.pin);
      }
      btnCopyPin.classList.add('copied');
      copyBtnText.textContent = '¡PIN Copiado!';
      announceLive('PIN ' + state.pin + ' copiado al portapapeles.');

      setTimeout(() => {
        btnCopyPin.classList.remove('copied');
        copyBtnText.textContent = 'Copiar PIN';
      }, 2500);
    } catch (err) {
      console.warn('Clipboard fallback:', err);
      copyBtnText.textContent = 'PIN: ' + state.pin;
    }
  });

  // Temporizador regresivo de 120 segundos
  function startWithdrawalTimer(seconds) {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timeRemaining = seconds;
    updateTimerDisplay();

    state.timerInterval = setInterval(() => {
      state.timeRemaining--;
      updateTimerDisplay();

      if (state.timeRemaining <= 0) {
        clearInterval(state.timerInterval);
        timerCounter.textContent = 'Tiempo límite alcanzado';
        announceLive('El tiempo de retiro ha expirado. Por favor solicita un nuevo PIN.');
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    if (!timerCounter) return;
    timerCounter.textContent = `${state.timeRemaining} segundos`;
  }

  // ==========================================
  // CANCELACIÓN EXPLÍCITA (RF-06 / H3)
  // ==========================================
  function handleCancelOperation() {
    state.isProcessing = false;
    state.retryCount = 0;
    btnUnlock.disabled = false;
    btnUnlock.removeAttribute('aria-busy');

    if (state.timerInterval) clearInterval(state.timerInterval);

    switchView('form');
    dockInput.focus();

    announceLive('Operación cancelada de forma segura. No se ha realizado ningún cobro a tu cuenta.');
  }

  btnCancelLoading.addEventListener('click', handleCancelOperation);
  btnCancelError.addEventListener('click', handleCancelOperation);

  btnFinish.addEventListener('click', () => {
    if (state.timerInterval) clearInterval(state.timerInterval);
    alert(`🎉 ¡Excelente viaje! Has retirado la bicicleta del anclaje #${state.dockNumber}.\nDisfruta tu recorrido con BiciUrbana.`);
    handleCancelOperation();
  });

  // ==========================================
  // ATAJOS GLOBALES DE TECLADO (RF-05 / WCAG 2.1.1)
  // ==========================================
  document.addEventListener('keydown', (e) => {
    // Tecla Escape (Esc): Cancelación en cualquier pantalla previa
    if (e.key === 'Escape' || e.keyCode === 27) {
      if (views.loading.classList.contains('active') || views.error.classList.contains('active')) {
        e.preventDefault();
        handleCancelOperation();
      }
    }

    // Tecla Enter en vista de Error: Reintento inmediato
    if (e.key === 'Enter' && views.error.classList.contains('active')) {
      if (document.activeElement !== btnCancelError) {
        e.preventDefault();
        btnRetry.click();
      }
    }
  });

});
