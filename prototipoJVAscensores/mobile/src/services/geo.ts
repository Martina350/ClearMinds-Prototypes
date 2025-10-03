// geo.ts — utilidades de geolocalización y tiempo

/**
 * Distancia Haversine en metros entre dos puntos {lat, lng}
 * @param {{lat:number, lng:number}} a
 * @param {{lat:number, lng:number}} b
 * @returns {number} metros
 */
export function haversine(a: {lat:number, lng:number}, b: {lat:number, lng:number}) {
  const R = 6371000; // m
  const toRad = (d: number) => (d * Math.PI) / 180;
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
export function geofenceOK(actual: {lat:number, lng:number}, objetivo: {lat:number, lng:number}, radioM: number) {
  if (!actual || !objetivo) return false;
  return haversine(actual, objetivo) <= (radioM ?? 120);
}

/**
 * ¿La Fecha/hora cae dentro de la(s) ventana(s) de atención?
 * ventana: { dia: 'Lun-Vie'|'Lun-Sab'|'Sab'|..., desde:'HH:mm', hasta:'HH:mm' }
 * @param {Date} fecha
 * @param {Array<{dia:string, desde:string, hasta:string}>} ventanas
 */
export function isWithinWindow(fecha: Date, ventanas: Array<{dia:string, desde:string, hasta:string}>) {
  if (!ventanas || !ventanas.length) return true;
  const day = fecha.getDay(); // 0=Dom ... 6=Sab
  const hhmm = fecha.toTimeString().slice(0, 5);

  return ventanas.some((v) => {
    const map: {[key: string]: number[]} = {
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
  return new Promise<{lat:number,lng:number}>((resolve) => {
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