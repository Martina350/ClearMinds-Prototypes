// optimize.js — heurísticas simples de ruteo y sugerencias

/**
 * Reordena OTs del día por "vecino más cercano" (heurística)
 * Respeta ventanas: si no cumple ventana, marca flag .fueraDeVentana = true
 * @param {Array<OT>} otsDelDia — OTs con edificio {lat,lng,ventanas} embebido
 * @param {{lat:number,lng:number}} startPoint — opcional, punto de inicio del técnico
 * @returns {Array<OT>} copia ordenada con flags
 */
function optimizeRoute(otsDelDia, startPoint) {
  const result = [];
  const pending = [...(otsDelDia ?? [])];
  let current =
    startPoint ??
    (pending.length ? toPoint(pending[0]) : { lat: 0, lng: 0 });

  while (pending.length) {
    pending.sort((a, b) => {
      const da = distanceTo(current, a);
      const db = distanceTo(current, b);
      return da - db;
    });
    const next = pending.shift();
    // Flag ventana de atención
    const fecha = new Date(next.programada);
    next.fueraDeVentana = !window.isWithinWindow(fecha, next.edificio.ventanas);
    result.push(next);
    current = toPoint(next);
  }
  return result;
}

/**
 * Sugerencias para llenar un hueco: top-K por distancia
 * @param {{lat:number,lng:number}} punto
 * @param {Array<{id:string, lat:number, lng:number, clienteId:string}>} edificios
 * @param {number} k
 * @returns {Array<{edificioId:string, distanciaM:number, score:number}>}
 */
function sugerirCandidatos(punto, edificios, k = 5) {
  const arr = (edificios ?? []).map((e) => {
    const distanciaM = window.haversine(punto, { lat: e.lat, lng: e.lng });
    const score = 1 / (1 + distanciaM); // simple inversa
    return { edificioId: e.id, distanciaM, score };
  });
  arr.sort((a, b) => b.score - a.score);
  return arr.slice(0, k);
}

function toPoint(ot) {
  return {
    lat: ot?.edificio?.lat ?? 0,
    lng: ot?.edificio?.lng ?? 0
  };
}

function distanceTo(p, ot) {
  return window.haversine(p, { lat: ot.edificio.lat, lng: ot.edificio.lng });
}

/**
 * Marca minutos pendientes cuando se suspende una OT (emergencia)
 * @param {OT} ot
 * @param {number} minutosRestantes
 * @returns {OT}
 */
function marcarPendiente(ot, minutosRestantes) {
  const clone = { ...ot };
  clone.minPendientes = Math.max(0, Math.round(minutosRestantes || 0));
  clone.estado = 'suspendida';
  // TODO: push evento 'suspendida'
  return clone;
}

// exponer globalmente
window.optimizeRoute = optimizeRoute;
window.sugerirCandidatos = sugerirCandidatos;
window.marcarPendiente = marcarPendiente;