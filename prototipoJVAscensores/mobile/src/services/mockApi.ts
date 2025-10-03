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