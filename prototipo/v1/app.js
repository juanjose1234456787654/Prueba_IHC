/**
 * BiciUrbana Express - Prototipo v1 (Comportamiento Defectuoso Original)
 * 
 * Este script simula explícitamente las tres fallas críticas de IHC:
 * - H1 (Visibilidad del estado): Ausencia total de spinner o feedback inmediato.
 * - H5 (Prevención de errores): Permite clics repetidos y procesa cobros sin token idempotente.
 * - H9 (Recuperación de errores): Borra los datos del anclaje y cobra $5.00 sin liberar la bicicleta.
 */

document.addEventListener('DOMContentLoaded', () => {
  const dockInput = document.getElementById('dockNumber');
  const btnUnlock = document.getElementById('btnUnlock');
  const whiteScreenOverlay = document.getElementById('whiteScreenOverlay');
  const errorModal = document.getElementById('errorModal');
  const btnCloseError = document.getElementById('btnCloseError');
  const txStatus = document.getElementById('txStatus');

  let totalCharges = 0;

  btnUnlock.addEventListener('click', () => {
    const dock = dockInput.value.trim();

    if (!dock) {
      alert('Ingresa un código de anclaje');
      return;
    }

    // FALLA H5: No se deshabilita el botón; permite clics múltiples
    // FALLA H1: No hay spinner ni indicador visual inmediato
    console.log(`[v1] Petición enviada para anclaje: ${dock}. Conectando...`);

    // Simulación de congelamiento por microcorte de red tras 1.2 segundos
    setTimeout(() => {
      // La pantalla se congela en blanco total (White screen of death)
      whiteScreenOverlay.style.display = 'flex';
      console.warn('[v1] Error de red: Pantalla congelada en blanco');

      // Tras 2.5 segundos en blanco, salta el modal de error catastrófico
      setTimeout(() => {
        whiteScreenOverlay.style.display = 'none';
        
        // Simulación de cobro indebido sin liberación
        totalCharges += 5.00;
        txStatus.textContent = `Cobrado: $${totalCharges.toFixed(2)} USD (Retenido sin PIN)`;
        txStatus.style.color = '#dc2626';

        // FALLA H9: Se destruyen los datos que el usuario había ingresado
        dockInput.value = '';

        // Mostrar modal de error no recuperable
        errorModal.style.display = 'flex';
      }, 2500);

    }, 1200);
  });

  btnCloseError.addEventListener('click', () => {
    errorModal.style.display = 'none';
    console.log('[v1] Formulario en blanco. El usuario debe volver a teclear y perdió $5.00.');
  });
});
