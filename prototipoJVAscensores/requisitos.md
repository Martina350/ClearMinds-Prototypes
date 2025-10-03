Quiero que construyas un prototipo funcional (sin backend real) con dos entregables:

Web Admin (HTML + Tailwind CSS + JavaScript “vanilla”) usando un mock.json para simular datos.

App móvil (React Native con Expo) sólo frontend, leyendo mocks locales (sin backend).

Contexto del producto: planificación y ejecución de mantenimientos de ascensores para JB Ascensors.
Enfoque: web para operaciones/administración y móvil para técnicos.
Excluir explícitamente cualquier módulo de inventario/bodega.

Objetivos funcionales (ambos entregables)

Planificación inteligente: asignar OTs por técnico, con restricciones de cliente/edificio (ventanas de horario, días permitidos, duración estimada).

Rutas y reprogramación: optimización simple por cercanía (heurística), reprogramar por cancelación o por emergencia.

Ejecución en campo (móvil): check-in (Llegué) y check-out (Salí) con timestamp y validación de distancia (geofence simulada), checklist por cliente, observaciones, firma del cliente, cierre de OT.

Evidencia y reporte: generar un PDF simulado (plantilla HTML → imprimir a PDF) con checklist, horas, ubicación aproximada y firma; opción de “Enviar por correo” simulada (sólo UI).

Dashboard: métricas básicas (cumplimiento, cancelaciones, emergencias, tiempo promedio en sitio).

Entregable 1: Web Admin (HTML + Tailwind + JS + mock.json)
Tech y restricciones

Sin frameworks (solo HTML estático, Tailwind via CDN, JS vanilla con módulos).

Datos desde ./data/mock.json con fetch.

No hay build step requerido (opcional script de Tailwind CDN).

Rutas en páginas separadas (archivos .html) o SPA simple con enrutador por hash (elige la opción más simple).

Estructura de carpetas sugerida
/web
  index.html              # landing: tablero/resumen
  clientes.html           # ABM clientes/edificios + geocodificación simulada
  agenda.html             # calendario, generación y optimización de rutas (simulada)
  ots.html                # lista de OTs, estados, reprogramación
  plantillas.html         # CRUD de plantillas de checklist
  reporte.html            # visor de reporte (HTML imprimible > PDF)
  /css/
    styles.css            # (opcional adicional al Tailwind CDN)
  /js/
    app.js                # bootstrap, utils y router por hash (si haces SPA)
    store.js              # carga de mocks y estado in-memory
    geo.js                # funciones distancia Haversine y geofence
    optimize.js           # heurística simple de ruta
    ui-*.js               # componentes pequeños (modales, toasts)
  /data/
    mock.json
  /assets/
    logo.png
    placeholder-signature.png

Páginas y componentes mínimos

Dashboard (index.html):

KPIs: % OTs completadas, # cancelaciones, # emergencias, tiempo promedio en sitio, OTs pendientes por técnico.

Gráfico simple (puede ser <canvas> con JS vanilla).

Clientes/Edificios (clientes.html):

Tabla de clientes con búsqueda.

CRUD de Edificio (dirección, geo aproximada, ventanas/horario, duración estimada).

Simulación de geocodificación: campo lat/lng manual + botón “Calcular distancia” entre edificios.

Plantillas (plantillas.html):

Constructor de checklist (CRUD de ítems; marcar ítems obligatorios).

Asignar Plantilla → Cliente (posibilidad de múltiples plantillas por cliente).

Agenda/Rutas (agenda.html):

Calendario simple por día.

Asignar OTs por técnico.

Botón “Optimizar ruta”: usar heurística “nearest neighbor” por lat/lng respetando ventana (simular validación).

Cancelar/postergar OTs.

Sugerir candidatos para huecos: lista priorizada por distancia (y un “score” básico).

OTs (ots.html):

Tabla de OTs (filtros por estado/cliente/técnico).

Ver detalle de eventos (asignación, llegada/salida, reprogramaciones).

Acceso a reporte.html para ver/”imprimir” el PDF.

Reporte (reporte.html):

Plantilla HTML imprimible (logo, datos cliente/edificio, técnico, horas reales, ubicación aprox., checklist con checks, observaciones y firma).

Botón “Imprimir/Guardar PDF” (uso del diálogo de impresión del navegador).

Botón “Enviar por correo” (simulado: mostrar un toast “enviado”).

mock.json (ejemplo mínimo)

Guarda en /web/data/mock.json (ajusta según necesites):
{
  "tecnicos": [
    { "id": "tec-1", "nombre": "Ana", "telefono": "0990000001", "activo": true },
    { "id": "tec-2", "nombre": "Luis", "telefono": "0990000002", "activo": true },
    { "id": "tec-3", "nombre": "María", "telefono": "0990000003", "activo": true }
  ],
  "clientes": [
    { "id": "cli-1", "nombre": "Ministerio de Educación", "email": "contacto@minedu.gob", "contacto": "Ing. Pérez" },
    { "id": "cli-2", "nombre": "Edificio Bahía", "email": "admin@bahiabuild.com", "contacto": "Sra. López" }
  ],
  "edificios": [
    { "id": "edi-1", "clienteId": "cli-1", "direccion": "Av. Siempre Viva 123", "lat": -0.1807, "lng": -78.4678,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "08:00", "hasta": "10:00" }],
      "duracionMin": 60
    },
    { "id": "edi-2", "clienteId": "cli-2", "direccion": "Calle Bahía 456", "lat": -0.2050, "lng": -78.4900,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "09:00", "hasta": "11:00" }],
      "duracionMin": 90
    }
  ],
  "plantillas": [
    { "id": "pl-1", "nombre": "Privados - General", "clienteId": null,
      "items": [
        { "id": "it-1", "texto": "Limpiar contactos", "obligatorio": true },
        { "id": "it-2", "texto": "Revisión de pozo", "obligatorio": true },
        { "id": "it-3", "texto": "Engrase guías", "obligatorio": false }
      ]
    },
    { "id": "pl-2", "nombre": "Ministerio - TDR", "clienteId": "cli-1",
      "items": [
        { "id": "it-4", "texto": "Prueba sistema emergencia", "obligatorio": true },
        { "id": "it-5", "texto": "Verificación puertas", "obligatorio": true }
      ]
    }
  ],
  "ots": [
    { "id": "ot-1001", "tipo": "preventivo", "edificioId": "edi-1", "plantillaId": "pl-2", "tecnicoId": "tec-1",
      "programada": "2025-10-03T08:00:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-1002", "tipo": "preventivo", "edificioId": "edi-2", "plantillaId": "pl-1", "tecnicoId": "tec-1",
      "programada": "2025-10-03T10:30:00", "estado": "programada", "minPendientes": 0, "eventos": [] }
  ],
  "config": {
    "geofenceM": 120,
    "minCandidatosHueco": 5
  }
}

Funciones JS que debes implementar

loadMock(): Promise<State> carga y normaliza datos.

haversine(a, b): number distancia en metros.

isWithinWindow(fecha, ventanas): boolean respeta “desde/hasta”.

optimizeRoute(otsDelDia): Ot[] heurística “nearest neighbor” por lat/lng.

sugerirCandidatos(hueco, edificios, k=5): Candidato[] prioriza por distancia y flexibilidad simulada.

geofenceOK(ubicacionActual, edificio, radioM): boolean.

renderPDF(otId): HTMLElement retorna el nodo HTML listo para imprimir.

saveToLocalState() / persistMock() opcional para simular cambios (localStorage).


Entregable 2: App Móvil (React Native + Expo)
Tech

Expo (TypeScript opcional).

Estado simple (Context API o Zustand).

Mock de datos en assets/mock.json (puede ser copia del de web) + un “mock api” (src/services/mockApi.ts).

Nada de backend real.

Estructura sugerida

/mobile
  App.tsx
  /assets/
    mock.json
    logo.png
  /src/
    /screens/
      HomeScreen.tsx           # lista de OTs del día por técnico
      OtDetailScreen.tsx       # datos del edificio, plantilla y acciones
      ChecklistScreen.tsx      # render dinámico de ítems
      SignatureScreen.tsx      # firma en canvas
      ReportPreviewScreen.tsx  # HTML/Markdown → Print/Share (simulado)
    /components/
      OtCard.tsx
      StatBadge.tsx
    /services/
      mockApi.ts               # getOtsByTecnico, getEdificio, getPlantilla...
      geo.ts                   # distancia y geofence (mismo criterio que web)
      time.ts                  # timestamps y formatos
    /store/
      useSession.ts            # técnico logueado simulado
      useOts.ts                # estado de OTs (programada, en curso, etc.)
    /lib/
      signature.ts             # guarda firma como dataURL






---

### `web/data/mock.json` (usar igual en `mobile/assets/mock.json`)

```json
{
  "tecnicos": [
    { "id": "tec-1", "nombre": "Ana", "telefono": "0990000001", "activo": true },
    { "id": "tec-2", "nombre": "Luis", "telefono": "0990000002", "activo": true },
    { "id": "tec-3", "nombre": "María", "telefono": "0990000003", "activo": true },
    { "id": "tec-4", "nombre": "Carlos", "telefono": "0990000004", "activo": true },
    { "id": "tec-5", "nombre": "Sofía", "telefono": "0990000005", "activo": true },
    { "id": "tec-6", "nombre": "Diego", "telefono": "0990000006", "activo": true }
  ],
  "clientes": [
    { "id": "cli-1", "nombre": "Ministerio de Educación", "email": "contacto@minedu.gob", "contacto": "Ing. Pérez" },
    { "id": "cli-2", "nombre": "Edificio Bahía", "email": "admin@bahiabuild.com", "contacto": "Sra. López" },
    { "id": "cli-3", "nombre": "Torre Amazonas", "email": "ops@amazonas.ec", "contacto": "Sr. Andrade" },
    { "id": "cli-4", "nombre": "Centro Empresarial Norte", "email": "ce.norte@empresa.ec", "contacto": "Lic. Mora" },
    { "id": "cli-5", "nombre": "Hospital Metropolitano", "email": "mantenimientos@metrohosp.ec", "contacto": "Dra. Rivera" }
  ],
  "edificios": [
    {
      "id": "edi-1",
      "clienteId": "cli-1",
      "direccion": "Av. Amazonas y José Riofrío",
      "lat": -0.1767,
      "lng": -78.4827,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "08:00", "hasta": "10:00" }],
      "duracionMin": 60
    },
    {
      "id": "edi-2",
      "clienteId": "cli-2",
      "direccion": "Calle Bahía 456",
      "lat": -0.205,
      "lng": -78.49,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "09:00", "hasta": "11:00" }],
      "duracionMin": 90
    },
    {
      "id": "edi-3",
      "clienteId": "cli-3",
      "direccion": "Av. de los Shyris 1200",
      "lat": -0.176,
      "lng": -78.478,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "10:00", "hasta": "12:00" }],
      "duracionMin": 60
    },
    {
      "id": "edi-4",
      "clienteId": "cli-4",
      "direccion": "Av. Eloy Alfaro y Portugal",
      "lat": -0.1769,
      "lng": -78.4695,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "08:30", "hasta": "11:30" }],
      "duracionMin": 75
    },
    {
      "id": "edi-5",
      "clienteId": "cli-5",
      "direccion": "Av. Mariana de Jesús Oe7",
      "lat": -0.1845,
      "lng": -78.4975,
      "ventanas": [{ "dia": "Lun-Sab", "desde": "07:00", "hasta": "09:30" }],
      "duracionMin": 60
    },
    {
      "id": "edi-6",
      "clienteId": "cli-2",
      "direccion": "Av. 6 de Diciembre N34",
      "lat": -0.1852,
      "lng": -78.4771,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "11:00", "hasta": "13:00" }],
      "duracionMin": 45
    },
    {
      "id": "edi-7",
      "clienteId": "cli-3",
      "direccion": "República de El Salvador 500",
      "lat": -0.1762,
      "lng": -78.4722,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "09:30", "hasta": "12:30" }],
      "duracionMin": 60
    },
    {
      "id": "edi-8",
      "clienteId": "cli-4",
      "direccion": "NNUU y Shyris",
      "lat": -0.1738,
      "lng": -78.4763,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "08:00", "hasta": "09:30" }],
      "duracionMin": 45
    },
    {
      "id": "edi-9",
      "clienteId": "cli-5",
      "direccion": "Av. América y Mariana de Jesús",
      "lat": -0.1934,
      "lng": -78.4979,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "10:30", "hasta": "12:30" }],
      "duracionMin": 90
    },
    {
      "id": "edi-10",
      "clienteId": "cli-1",
      "direccion": "Av. 10 de Agosto y Patria",
      "lat": -0.2041,
      "lng": -78.497,
      "ventanas": [{ "dia": "Lun-Vie", "desde": "08:00", "hasta": "10:00" }],
      "duracionMin": 60
    }
  ],
  "plantillas": [
    {
      "id": "pl-1",
      "nombre": "Privados - General",
      "clienteId": null,
      "items": [
        { "id": "it-1", "texto": "Limpieza de contactos", "obligatorio": true },
        { "id": "it-2", "texto": "Revisión de pozo", "obligatorio": true },
        { "id": "it-3", "texto": "Engrase de guías", "obligatorio": false },
        { "id": "it-4", "texto": "Prueba de freno", "obligatorio": true }
      ]
    },
    {
      "id": "pl-2",
      "nombre": "Ministerio - TDR",
      "clienteId": "cli-1",
      "items": [
        { "id": "it-5", "texto": "Prueba de sistema de emergencia", "obligatorio": true },
        { "id": "it-6", "texto": "Verificación de puertas y sensores", "obligatorio": true },
        { "id": "it-7", "texto": "Bitácora de eventos del mes", "obligatorio": true }
      ]
    },
    {
      "id": "pl-3",
      "nombre": "Hospitales - Seguridad ampliada",
      "clienteId": "cli-5",
      "items": [
        { "id": "it-8", "texto": "Chequeo de energía de respaldo", "obligatorio": true },
        { "id": "it-9", "texto": "Prueba de alarma y comunicación", "obligatorio": true },
        { "id": "it-10", "texto": "Certificación de higiene del pozo", "obligatorio": false }
      ]
    }
  ],
  "ots": [
    { "id": "ot-1001", "tipo": "preventivo", "edificioId": "edi-1", "plantillaId": "pl-2", "tecnicoId": "tec-1", "programada": "2025-10-03T08:00:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-1002", "tipo": "preventivo", "edificioId": "edi-10", "plantillaId": "pl-2", "tecnicoId": "tec-1", "programada": "2025-10-03T10:00:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-1003", "tipo": "preventivo", "edificioId": "edi-3", "plantillaId": "pl-1", "tecnicoId": "tec-1", "programada": "2025-10-03T11:30:00", "estado": "programada", "minPendientes": 0, "eventos": [] },

    { "id": "ot-2001", "tipo": "preventivo", "edificioId": "edi-2", "plantillaId": "pl-1", "tecnicoId": "tec-2", "programada": "2025-10-03T09:00:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-2002", "tipo": "correctivo", "edificioId": "edi-6", "plantillaId": "pl-1", "tecnicoId": "tec-2", "programada": "2025-10-03T11:15:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-2003", "tipo": "preventivo", "edificioId": "edi-7", "plantillaId": "pl-1", "tecnicoId": "tec-2", "programada": "2025-10-03T13:00:00", "estado": "programada", "minPendientes": 0, "eventos": [] },

    { "id": "ot-3001", "tipo": "preventivo", "edificioId": "edi-4", "plantillaId": "pl-1", "tecnicoId": "tec-3", "programada": "2025-10-03T08:30:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-3002", "tipo": "emergencia", "edificioId": "edi-8", "plantillaId": "pl-1", "tecnicoId": "tec-3", "programada": "2025-10-03T10:00:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-3003", "tipo": "preventivo", "edificioId": "edi-7", "plantillaId": "pl-1", "tecnicoId": "tec-3", "programada": "2025-10-03T11:30:00", "estado": "programada", "minPendientes": 0, "eventos": [] },

    { "id": "ot-4001", "tipo": "preventivo", "edificioId": "edi-5", "plantillaId": "pl-3", "tecnicoId": "tec-4", "programada": "2025-10-03T07:15:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-4002", "tipo": "correctivo", "edificioId": "edi-9", "plantillaId": "pl-3", "tecnicoId": "tec-4", "programada": "2025-10-03T10:45:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-4003", "tipo": "preventivo", "edificioId": "edi-3", "plantillaId": "pl-1", "tecnicoId": "tec-4", "programada": "2025-10-03T12:30:00", "estado": "programada", "minPendientes": 0, "eventos": [] },

    { "id": "ot-5001", "tipo": "preventivo", "edificioId": "edi-8", "plantillaId": "pl-1", "tecnicoId": "tec-5", "programada": "2025-10-03T08:00:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-5002", "tipo": "preventivo", "edificioId": "edi-4", "plantillaId": "pl-1", "tecnicoId": "tec-5", "programada": "2025-10-03T09:30:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-5003", "tipo": "preventivo", "edificioId": "edi-6", "plantillaId": "pl-1", "tecnicoId": "tec-5", "programada": "2025-10-03T11:00:00", "estado": "programada", "minPendientes": 0, "eventos": [] },

    { "id": "ot-6001", "tipo": "preventivo", "edificioId": "edi-2", "plantillaId": "pl-1", "tecnicoId": "tec-6", "programada": "2025-10-03T08:15:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-6002", "tipo": "correctivo", "edificioId": "edi-10", "plantillaId": "pl-2", "tecnicoId": "tec-6", "programada": "2025-10-03T10:30:00", "estado": "programada", "minPendientes": 0, "eventos": [] },
    { "id": "ot-6003", "tipo": "preventivo", "edificioId": "edi-1", "plantillaId": "pl-2", "tecnicoId": "tec-6", "programada": "2025-10-03T12:00:00", "estado": "programada", "minPendientes": 0, "eventos": [] }
  ],
  "config": {
    "geofenceM": 120,
    "minCandidatosHueco": 5
  }
}



// geo.js — utilidades de geolocalización y tiempo

/**
 * Distancia Haversine en metros entre dos puntos {lat, lng}
 * @param {{lat:number, lng:number}} a
 * @param {{lat:number, lng:number}} b
 * @returns {number} metros
 */
export function haversine(a, b) {
  // TODO: implementar fórmula Haversine real
  const R = 6371000; // m
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Valida si una ubicación está dentro del radio (m)
 * @param {{lat:number, lng:number}} actual
 * @param {{lat:number, lng:number}} objetivo
 * @param {number} radioM
 * @returns {boolean}
 */
export function geofenceOK(actual, objetivo, radioM) {
  if (!actual || !objetivo) return false;
  return haversine(actual, objetivo) <= (radioM ?? 120);
}

/**
 * ¿La Fecha/hora cae dentro de la(s) ventana(s) de atención?
 * ventana: { dia: 'Lun-Vie'|'Lun-Sab'|'Sab'|..., desde:'HH:mm', hasta:'HH:mm' }
 * @param {Date} fecha
 * @param {Array<{dia:string, desde:string, hasta:string}>} ventanas
 */
export function isWithinWindow(fecha, ventanas) {
  // TODO: soportar más formatos de "dia" si lo necesitas
  if (!ventanas || !ventanas.length) return true;
  const day = fecha.getDay(); // 0=Dom ... 6=Sab
  const hhmm = fecha.toTimeString().slice(0, 5);

  return ventanas.some((v) => {
    const map = {
      'Lun-Vie': [1, 2, 3, 4, 5],
      'Lun-Sab': [1, 2, 3, 4, 5, 6],
      'Sab': [6],
      'Dom': [0]
    };
    const dias = map[v.dia] ?? [1, 2, 3, 4, 5];
    return (
      dias.includes(day) &&
      hhmm >= v.desde &&
      hhmm <= v.hasta
    );
  });
}

/**
 * Helper para obtener coords del navegador (simular si no hay permisos)
 * @returns {Promise<{lat:number,lng:number}>}
 */
export function getCurrentPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Mock: punto cero
      return resolve({ lat: 0, lng: 0 });
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }),
      () => resolve({ lat: 0, lng: 0 }),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}


// optimize.js — heurísticas simples de ruteo y sugerencias

import { haversine, isWithinWindow } from './geo.js';

/**
 * Reordena OTs del día por "vecino más cercano" (heurística)
 * Respeta ventanas: si no cumple ventana, marca flag .fueraDeVentana = true
 * @param {Array<OT>} otsDelDia — OTs con edificio {lat,lng,ventanas} embebido
 * @param {{lat:number,lng:number}} startPoint — opcional, punto de inicio del técnico
 * @returns {Array<OT>} copia ordenada con flags
 */
export function optimizeRoute(otsDelDia, startPoint) {
  // TODO: mejorar con heurísticas de ventanas de tiempo (TSP-TW)
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
    next.fueraDeVentana = !isWithinWindow(fecha, next.edificio.ventanas);
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
export function sugerirCandidatos(punto, edificios, k = 5) {
  // TODO: agregar factores (flexibilidad, SLA, prioridad contrato)
  const arr = (edificios ?? []).map((e) => {
    const distanciaM = haversine(punto, { lat: e.lat, lng: e.lng });
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
  return haversine(p, { lat: ot.edificio.lat, lng: ot.edificio.lng });
}

/**
 * Marca minutos pendientes cuando se suspende una OT (emergencia)
 * @param {OT} ot
 * @param {number} minutosRestantes
 * @returns {OT}
 */
export function marcarPendiente(ot, minutosRestantes) {
  const clone = { ...ot };
  clone.minPendientes = Math.max(0, Math.round(minutosRestantes || 0));
  clone.estado = 'suspendida';
  // TODO: push evento 'suspendida'
  return clone;
}



// mockApi.ts — capa de acceso a mocks en Expo (sin backend)
// Carga el JSON de /assets/mock.json y expone helpers de lectura/escritura en memoria.

import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

// Tipos mínimos (amplía según necesites)
export type Tecnico = { id: string; nombre: string; telefono: string; activo: boolean };
export type Ventana = { dia: string; desde: string; hasta: string };
export type Edificio = {
  id: string;
  clienteId: string;
  direccion: string;
  lat: number;
  lng: number;
  ventanas: Ventana[];
  duracionMin: number;
};
export type PlantillaItem = { id: string; texto: string; obligatorio: boolean };
export type Plantilla = { id: string; nombre: string; clienteId?: string | null; items: PlantillaItem[] };
export type EventoOT = { tipo: 'asignacion'|'llegada'|'salida'|'suspendida'|'reprogramada'|'cerrada'; timestamp: string; lat?: number; lng?: number };
export type OT = {
  id: string;
  tipo: 'preventivo' | 'correctivo' | 'emergencia';
  edificioId: string;
  plantillaId: string;
  tecnicoId: string;
  programada: string; // ISO
  estado: 'programada' | 'en_curso' | 'suspendida' | 'reprogramada' | 'completada';
  minPendientes: number;
  eventos: EventoOT[];
  // campos computados en runtime (no persistentes)
  _edificio?: Edificio;
  _plantilla?: Plantilla;
};

type MockShape = {
  tecnicos: Tecnico[];
  clientes: any[];
  edificios: Edificio[];
  plantillas: Plantilla[];
  ots: OT[];
  config: { geofenceM: number; minCandidatosHueco: number };
};

let cache: MockShape | null = null;

/**
 * Carga el mock desde assets al cache (una sola vez)
 */
export async function loadMock(): Promise<MockShape> {
  if (cache) return cache;

  // 1) Resuelve el asset (funciona dentro de Expo bundle)
  const asset = Asset.fromModule(require('../../assets/mock.json'));
  await asset.downloadAsync();

  // 2) Lee el archivo
  const fileUri = asset.localUri!;
  const raw = await FileSystem.readAsStringAsync(fileUri);
  cache = JSON.parse(raw);

  return cache!;
}

/**
 * Devuelve OTs del técnico para una fecha (por defecto hoy)
 */
export async function getOtsByTecnico(tecnicoId: string, dateISO?: string): Promise<OT[]> {
  const data = await loadMock();
  const day = dateISO ? new Date(dateISO) : new Date();
  const y = day.getFullYear();
  const m = day.getMonth();
  const d = day.getDate();

  const sameDay = (iso: string) => {
    const dt = new Date(iso);
    return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
  };

  const ots = data.ots.filter((ot) => ot.tecnicoId === tecnicoId && sameDay(ot.programada));
  return ots.map(hydrateOT(data));
}

/**
 * Hidrata una OT con edificio/plantilla embebidos (_edificio/_plantilla)
 */
const hydrateOT = (data: MockShape) => (ot: OT): OT => {
  const edificio = data.edificios.find((e) => e.id === ot.edificioId);
  const plantilla = data.plantillas.find((p) => p.id === ot.plantillaId);
  return { ...ot, _edificio: edificio, _plantilla: plantilla };
};

/**
 * Marca llegada: agrega evento y cambia estado a en_curso
 */
export async function marcarLlegada(otId: string, coords?: { lat: number; lng: number }): Promise<OT | null> {
  const data = await loadMock();
  const idx = data.ots.findIndex((o) => o.id === otId);
  if (idx < 0) return null;
  const now = new Date().toISOString();

  const updated: OT = {
    ...data.ots[idx],
    estado: 'en_curso',
    eventos: [
      ...data.ots[idx].eventos,
      { tipo: 'llegada', timestamp: now, lat: coords?.lat, lng: coords?.lng }
    ]
  };
  data.ots[idx] = updated;
  return hydrateOT(data)(updated);
}

/**
 * Marca salida: agrega evento; NO cierra aún
 */
export async function marcarSalida(otId: string, coords?: { lat: number; lng: number }): Promise<OT | null> {
  const data = await loadMock();
  const idx = data.ots.findIndex((o) => o.id === otId);
  if (idx < 0) return null;
  const now = new Date().toISOString();

  const updated: OT = {
    ...data.ots[idx],
    eventos: [
      ...data.ots[idx].eventos,
      { tipo: 'salida', timestamp: now, lat: coords?.lat, lng: coords?.lng }
    ]
  };
  data.ots[idx] = updated;
  return hydrateOT(data)(updated);
}

/**
 * Cierra OT (requiere que ya exista llegada y salida; la validación la haces en UI)
 */
export async function cerrarOT(otId: string): Promise<OT | null> {
  const data = await loadMock();
  const idx = data.ots.findIndex((o) => o.id === otId);
  if (idx < 0) return null;
  const now = new Date().toISOString();

  const updated: OT = {
    ...data.ots[idx],
    estado: 'completada',
    eventos: [
      ...data.ots[idx].eventos,
      { tipo: 'cerrada', timestamp: now }
    ]
  };
  data.ots[idx] = updated;
  return hydrateOT(data)(updated);
}

/**
 * Suspende (emergencia): marca minPendientes y evento
 */
export async function suspenderOT(otId: string, minPendientes: number): Promise<OT | null> {
  const data = await loadMock();
  const idx = data.ots.findIndex((o) => o.id === otId);
  if (idx < 0) return null;
  const now = new Date().toISOString();

  const updated: OT = {
    ...data.ots[idx],
    estado: 'suspendida',
    minPendientes: Math.max(0, Math.round(minPendientes || 0)),
    eventos: [
      ...data.ots[idx].eventos,
      { tipo: 'suspendida', timestamp: now }
    ]
  };
  data.ots[idx] = updated;
  return hydrateOT(data)(updated);
}

/**
 * Inyecta una emergencia fake para pruebas
 */
export async function inyectarEmergencia(tecnicoId: string, edificioId: string, plantillaId: string): Promise<OT> {
  const data = await loadMock();
  const id = `ot-EM-${Date.now()}`;
  const now = new Date();
  const nueva: OT = {
    id,
    tipo: 'emergencia',
    edificioId,
    plantillaId,
    tecnicoId,
    programada: now.toISOString(),
    estado: 'programada',
    minPendientes: 0,
    eventos: [{ tipo: 'asignacion', timestamp: now.toISOString() }]
  };
  data.ots.push(nueva);
  return hydrateOT(data)(nueva);
}

/**
 * Config global (geofence, candidatos, etc.)
 */
export async function getConfig() {
  const data = await loadMock();
  return data.config;
}
