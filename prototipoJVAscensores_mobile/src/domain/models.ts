export type OtEstado = 'PROGRAMADA' | 'EN_CURSO' | 'SUSPENDIDA' | 'REPROGRAMADA' | 'COMPLETADA';

export interface OTLocal {
  id: string;
  estado: OtEstado;
  edificio: string;
  ventana: string;
  durEstimadaMin: number;
  plantillaId: string;
  tecnicoId: string;
  planificada: string;
  minutosPendientes?: number;
  lat?: number;
  lon?: number;
  updatedAt: string;
}

export type EventoTipo = 'ASIGNACION' | 'LLEGADA' | 'SALIDA' | 'SUSPENDIDA' | 'REPROGRAMADA' | 'CERRADA' | 'EMERGENCIA';

export interface EventoLocal {
  id: string;
  otId: string;
  tipo: EventoTipo;
  timestamp: string;
  lat?: number;
  lon?: number;
  accuracy?: number;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
}

export interface ChecklistRespLocal {
  id: string;
  otId: string;
  itemId: string;
  valor?: string | number | boolean;
  observacion?: string;
  fotoLocalUri?: string;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
}

export interface FirmaLocal {
  id: string;
  otId: string;
  pngLocalUri: string; // data url o file://
  nombreFirmante: string;
  timestamp: string;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
}


