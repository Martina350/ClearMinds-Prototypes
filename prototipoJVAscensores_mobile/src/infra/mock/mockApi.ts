import { OTLocal } from '../../domain/models';

type ChecklistItem = {
  id: string;
  tipo: 'bool' | 'text' | 'number' | 'foto';
  obligatorio?: boolean;
  label: string;
};

type ChecklistTemplate = {
  id: string;
  items: ChecklistItem[];
};

// Datos quemados de ejemplo (CABA)
let ots: OTLocal[] = [
  {
    id: 'OT-1001',
    estado: 'PROGRAMADA',
    edificio: 'Edificio Centro Histórico',
    ventana: '09:00 - 11:00',
    durEstimadaMin: 60,
    plantillaId: 'CHK-STD',
    tecnicoId: 'TEC-01',
    planificada: new Date().toISOString().slice(0, 10),
    lat: -0.1807,
    lon: -78.4678,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'OT-1002',
    estado: 'PROGRAMADA',
    edificio: 'Torre La Carolina',
    ventana: '11:30 - 13:00',
    durEstimadaMin: 45,
    plantillaId: 'CHK-STD',
    tecnicoId: 'TEC-01',
    planificada: new Date().toISOString().slice(0, 10),
    lat: -0.2050,
    lon: -78.4900,
    updatedAt: new Date().toISOString()
  }
];

const templates: ChecklistTemplate[] = [
  {
    id: 'CHK-STD',
    items: [
      { id: 'i1', tipo: 'bool', obligatorio: true, label: 'Equipo energizado' },
      { id: 'i2', tipo: 'text', label: 'Observación general' },
      { id: 'i3', tipo: 'number', obligatorio: true, label: 'Tiempo de prueba (s)' },
      { id: 'i4', tipo: 'foto', label: 'Foto del tablero' }
    ]
  }
];

export function getOtsToday(): OTLocal[] {
  return ots;
}

export function getOtById(id: string): OTLocal | undefined {
  return ots.find((o) => o.id === id);
}

export function getChecklistTemplateById(id: string): ChecklistTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export function createEmergencyOt(): OTLocal {
  const id = `OT-EM-${Date.now()}`;
  const em: OTLocal = {
    id,
    estado: 'PROGRAMADA',
    edificio: 'Emergencia - Av. Mariscal Sucre',
    ventana: 'Ahora',
    durEstimadaMin: 30,
    plantillaId: 'CHK-STD',
    tecnicoId: 'TEC-01',
    planificada: new Date().toISOString().slice(0, 10),
    lat: -0.2200,
    lon: -78.5200,
    updatedAt: new Date().toISOString()
  };
  ots = [em, ...ots];
  return em;
}

export function reorderRouteByIdFirst(otId: string) {
  const idx = ots.findIndex((o) => o.id === otId);
  if (idx <= 0) return;
  const [sel] = ots.splice(idx, 1);
  ots = [sel, ...ots];
}


