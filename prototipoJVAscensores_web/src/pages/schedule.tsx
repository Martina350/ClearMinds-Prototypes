import React from "react";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  Select, 
  SelectItem, 
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Input,
  Tabs,
  Tab,
  Textarea,
  Radio,
  RadioGroup,
  Checkbox,
  Tooltip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory } from "react-router-dom";

// ================== TIPOS DE DATOS ==================

// Tipos de datos para actividades de mantenimiento
interface MaintenanceActivity {
  id: string;
  technicianId: string;
  technicianName: string;
  activity: string;
  client: string;
  building: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  // Fecha específica para actividades (formato ISO: YYYY-MM-DD)
  date?: string;
  // Día de la semana para actividades recurrentes
  dayOfWeek?: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  startTime: string;
  endTime: string;
  duration: number; // en minutos
  type: "preventivo" | "correctivo" | "emergencia";
  status: "programado" | "en_progreso" | "completado" | "retrasado";
  priority: "baja" | "media" | "alta";
  // Configuración de recurrencia
  recurrence?: {
    type: "unica" | "diaria" | "semanal" | "mensual" | "trimestral" | "anual";
    endDate?: string; // Fecha de fin de la recurrencia
  };
}

// Tipos de técnicos
interface Technician {
  id: string;
  name: string;
  zone: string;
  availability: "disponible" | "ocupado" | "en_ruta";
  color: string;
}

// Tipos de feriados
interface Holiday {
  id: string;
  name: string;
  date: string; // formato ISO: YYYY-MM-DD
  type: "nacional" | "regional" | "personalizado";
  isMovable: boolean; // Si el feriado puede moverse (puentes)
  isActive: boolean; // Si está activo o fue eliminado
}

// Tipos de notificaciones
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
  read: boolean;
}

// ================== FERIADOS DE ECUADOR 2025 ==================
// Feriados oficiales de Ecuador - Se cargan automáticamente
const ECUADOR_HOLIDAYS_2025: Holiday[] = [
  { id: "h1", name: "Año Nuevo", date: "2025-01-01", type: "nacional", isMovable: false, isActive: true },
  { id: "h2", name: "Carnaval", date: "2025-03-03", type: "nacional", isMovable: true, isActive: true },
  { id: "h3", name: "Carnaval", date: "2025-03-04", type: "nacional", isMovable: true, isActive: true },
  { id: "h4", name: "Viernes Santo", date: "2025-04-18", type: "nacional", isMovable: true, isActive: true },
  { id: "h5", name: "Día del Trabajo", date: "2025-05-01", type: "nacional", isMovable: false, isActive: true },
  { id: "h6", name: "Batalla de Pichincha", date: "2025-05-24", type: "nacional", isMovable: false, isActive: true },
  { id: "h7", name: "Primer Grito de Independencia", date: "2025-08-10", type: "nacional", isMovable: false, isActive: true },
  { id: "h8", name: "Independencia de Guayaquil", date: "2025-10-09", type: "nacional", isMovable: false, isActive: true },
  { id: "h9", name: "Día de los Difuntos", date: "2025-11-02", type: "nacional", isMovable: false, isActive: true },
  { id: "h10", name: "Independencia de Cuenca", date: "2025-11-03", type: "nacional", isMovable: false, isActive: true },
  { id: "h11", name: "Navidad", date: "2025-12-25", type: "nacional", isMovable: false, isActive: true },
  { id: "h12", name: "Fin de Año", date: "2025-12-31", type: "nacional", isMovable: false, isActive: true },
];

export const SchedulePage: React.FC = () => {
  const history = useHistory();
  
  // ================== MODALES ==================
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isAddActivityOpen, onOpen: onAddActivityOpen, onOpenChange: onAddActivityOpenChange } = useDisclosure();
  const { isOpen: isHolidayModalOpen, onOpen: onHolidayModalOpen, onOpenChange: onHolidayModalOpenChange } = useDisclosure();
  const { isOpen: isAnnualPlanningOpen, onOpen: onAnnualPlanningOpen, onOpenChange: onAnnualPlanningOpenChange } = useDisclosure();
  
  // ================== ESTADOS ==================
  const [selectedTechnician, setSelectedTechnician] = React.useState<string>("todos");
  const [selectedActivity, setSelectedActivity] = React.useState<MaintenanceActivity | null>(null);
  const [emergencyMode, setEmergencyMode] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  
  // Nuevo: Estado para la vista del calendario
  const [viewMode, setViewMode] = React.useState<"dia" | "semana" | "mes" | "anual">("semana");
  
  // Nuevo: Estado para el mes/año seleccionado (vista mensual y anual)
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  
  // Nuevo: Estado para feriados (inicializado con feriados de Ecuador)
  const [holidays, setHolidays] = React.useState<Holiday[]>(ECUADOR_HOLIDAYS_2025);
  
  // Nuevo: Estado para notificaciones
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  
  // Nuevo: Estado para el formulario de nueva actividad
  const [newActivityForm, setNewActivityForm] = React.useState({
    technicianId: "",
    activity: "",
    client: "",
    building: "",
    address: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "preventivo" as "preventivo" | "correctivo" | "emergencia",
    priority: "media" as "baja" | "media" | "alta",
    recurrenceType: "unica" as "unica" | "diaria" | "semanal" | "mensual" | "trimestral" | "anual",
    recurrenceEndDate: "",
  });

  // Nuevo: Estado para planificación anual masiva
  const [annualPlanningItems, setAnnualPlanningItems] = React.useState<Array<{
    id: string;
    clientName: string;
    buildingName: string;
    address: string;
    activities: Array<{
      name: string;
      type: "preventivo" | "correctivo" | "emergencia";
      priority: "baja" | "media" | "alta";
      frequency: "mensual" | "trimestral" | "semestral" | "anual";
      dayOfMonth: number; // Día del mes (1-31)
      startTime: string;
      endTime: string;
      technicianId: string;
    }>;
  }>>([]);

  // Datos de ejemplo - técnicos
  const technicians: Technician[] = [
    { id: "T001", name: "Juan Pérez", zone: "Norte", availability: "disponible", color: "#07ADDB" },
    { id: "T002", name: "María López", zone: "Sur", availability: "ocupado", color: "#ABD9D3" },
    { id: "T003", name: "Carlos Mendez", zone: "Este", availability: "en_ruta", color: "#4F90DB" },
    { id: "T004", name: "Ana Gómez", zone: "Oeste", availability: "disponible", color: "#f59e0b" },
  ];

  // Datos de ejemplo - actividades programadas distribuidas por días de la semana
  const [activities, setActivities] = React.useState<MaintenanceActivity[]>([
    // Domingo (0)
    {
      id: "A001",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Inspección Dominical",
      client: "Plaza de Toros",
      building: "Edificio Principal",
      location: { lat: -0.1750, lng: -78.4850, address: "Av. Amazonas, Quito" },
      dayOfWeek: 0,
      startTime: "09:30",
      endTime: "11:00",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A002",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Mantenimiento de Fin de Semana",
      client: "Centro de Convenciones",
      building: "Pabellón Principal",
      location: { lat: -0.2550, lng: -78.5450, address: "Av. de los Shyris, Quito" },
      dayOfWeek: 0,
      startTime: "13:00",
      endTime: "15:30",
      duration: 150,
      type: "preventivo",
      status: "programado",
      priority: "baja"
    },
    {
      id: "A003",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Emergencia Dominical",
      client: "Centro Comercial",
      building: "Zona de Carga",
      location: { lat: -0.3850, lng: -78.6750, address: "Av. Eloy Alfaro, Quito" },
      dayOfWeek: 0,
      startTime: "16:00",
      endTime: "17:00",
      duration: 60,
      type: "emergencia",
      status: "programado",
      priority: "alta"
    },
    {
      id: "A029",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Calibración Matutina",
      client: "Edificio Residencial",
      building: "Torre A",
      location: { lat: -0.3150, lng: -78.6050, address: "Av. Amazonas, Quito" },
      dayOfWeek: 0,
      startTime: "07:30",
      endTime: "09:00",
      duration: 90,
      type: "preventivo",
      status: "completado",
      priority: "media"
    },
    {
      id: "A030",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Inspección de Seguridad",
      client: "Banco Central",
      building: "Bóveda",
      location: { lat: -0.1800, lng: -78.4800, address: "Av. Amazonas, Quito" },
      dayOfWeek: 0,
      startTime: "11:30",
      endTime: "13:00",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "alta"
    },

    // Lunes (1)
    {
      id: "A004",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Mantenimiento Preventivo",
      client: "Torre Norte",
      building: "Edificio A",
      location: { lat: -0.1807, lng: -78.4678, address: "Av. Amazonas N24-03, Quito" },
      dayOfWeek: 1,
      startTime: "08:00",
      endTime: "10:00",
      duration: 120,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A005",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Inspección de Cables",
      client: "Centro Comercial Plaza",
      building: "Edificio Principal",
      location: { lat: -0.1950, lng: -78.4850, address: "Av. 6 de Diciembre, Quito" },
      dayOfWeek: 1,
      startTime: "10:30",
      endTime: "12:00",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "baja"
    },
    {
      id: "A006",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Mantenimiento Vespertino",
      client: "Centro Comercial Quito",
      building: "Torre Norte",
      location: { lat: -0.1950, lng: -78.4900, address: "Av. 6 de Diciembre, Quito" },
      dayOfWeek: 1,
      startTime: "14:00",
      endTime: "16:00",
      duration: 120,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A007",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Calibración Matutina",
      client: "Torre Ejecutiva",
      building: "Piso 15",
      location: { lat: -0.1850, lng: -78.4750, address: "Av. 12 de Octubre, Quito" },
      dayOfWeek: 1,
      startTime: "07:30",
      endTime: "08:30",
      duration: 60,
      type: "preventivo",
      status: "completado",
      priority: "baja"
    },
    {
      id: "A032",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Mantenimiento Correctivo",
      client: "Fábrica de Textiles",
      building: "Nave Industrial 1",
      location: { lat: -0.2850, lng: -78.5750, address: "Av. Galo Plaza Lasso, Quito" },
      dayOfWeek: 1,
      startTime: "07:00",
      endTime: "08:30",
      duration: 90,
      type: "correctivo",
      status: "en_progreso",
      priority: "alta"
    },
    {
      id: "A034",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Emergencia - Ascensor Detenido",
      client: "Centro Financiero",
      building: "Piso 8",
      location: { lat: -0.1880, lng: -78.4750, address: "Av. Shyris, Quito" },
      dayOfWeek: 1,
      startTime: "16:30",
      endTime: "17:00",
      duration: 30,
      type: "emergencia",
      status: "en_progreso",
      priority: "alta"
    },
    // Martes (2)
    {
      id: "A008",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Reparación de Motor",
      client: "Ministerio de Salud",
      building: "Bloque A",
      location: { lat: -0.2000, lng: -78.5000, address: "República de El Salvador, Quito" },
      dayOfWeek: 2,
      startTime: "08:30",
      endTime: "11:30",
      duration: 180,
      type: "correctivo",
      status: "en_progreso",
      priority: "alta"
    },
    {
      id: "A009",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Mantenimiento de Puertas",
      client: "Hospital Metropolitano",
      building: "Torre Sur",
      location: { lat: -0.1650, lng: -78.4900, address: "Av. Mariana de Jesús, Quito" },
      dayOfWeek: 2,
      startTime: "12:00",
      endTime: "14:00",
      duration: 120,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A010",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Revisión de Emergencia",
      client: "Hospital San Francisco",
      building: "Edificio Principal",
      location: { lat: -0.2050, lng: -78.5000, address: "Av. Colón, Quito" },
      dayOfWeek: 2,
      startTime: "07:00",
      endTime: "08:30",
      duration: 90,
      type: "correctivo",
      status: "en_progreso",
      priority: "alta"
    },
    {
      id: "A011",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Inspección de Seguridad",
      client: "Banco Central",
      building: "Torre Principal",
      location: { lat: -0.1800, lng: -78.4800, address: "Av. Amazonas, Quito" },
      dayOfWeek: 2,
      startTime: "15:00",
      endTime: "16:30",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "alta"
    },
    {
      id: "A036",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Mantenimiento Preventivo",
      client: "Mall del Sur",
      building: "Zona de Estacionamiento",
      location: { lat: -0.2250, lng: -78.5100, address: "Av. Maldonado, Quito" },
      dayOfWeek: 2,
      startTime: "14:30",
      endTime: "16:00",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A038",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Reparación de Botones",
      client: "Edificio Corporativo",
      building: "Torre Sur",
      location: { lat: -0.1700, lng: -78.4800, address: "Av. 10 de Agosto, Quito" },
      dayOfWeek: 2,
      startTime: "09:00",
      endTime: "10:30",
      duration: 90,
      type: "correctivo",
      status: "programado",
      priority: "media"
    },
    // Miércoles (3)
    {
      id: "A012",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Emergencia - Ascensor Detenido",
      client: "Centro Financiero",
      building: "Piso 12",
      location: { lat: -0.1880, lng: -78.4750, address: "Av. Shyris, Quito" },
      dayOfWeek: 3,
      startTime: "09:00",
      endTime: "10:30",
      duration: 90,
      type: "emergencia",
      status: "en_progreso",
      priority: "alta"
    },
    {
      id: "A013",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Revisión Anual",
      client: "Torre Ejecutiva",
      building: "Edificio B",
      location: { lat: -0.1920, lng: -78.4820, address: "Av. República, Quito" },
      dayOfWeek: 3,
      startTime: "11:00",
      endTime: "13:00",
      duration: 120,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A014",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Mantenimiento Preventivo",
      client: "Universidad Católica",
      building: "Facultad de Ingeniería",
      location: { lat: -0.2100, lng: -78.4950, address: "Av. Universitaria, Quito" },
      dayOfWeek: 3,
      startTime: "08:00",
      endTime: "09:00",
      duration: 60,
      type: "preventivo",
      status: "completado",
      priority: "media"
    },
    {
      id: "A015",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Reparación de Botones",
      client: "Edificio Corporativo",
      building: "Torre Sur",
      location: { lat: -0.1700, lng: -78.4800, address: "Av. 10 de Agosto, Quito" },
      dayOfWeek: 3,
      startTime: "14:30",
      endTime: "16:00",
      duration: 90,
      type: "correctivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A039",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Inspección de Rutina",
      client: "Edificio de Oficinas",
      building: "Piso 3",
      location: { lat: -0.2750, lng: -78.5650, address: "Av. Portugal, Quito" },
      dayOfWeek: 3,
      startTime: "07:30",
      endTime: "09:00",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "baja"
    },
    {
      id: "A040",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Calibración de Equipos",
      client: "Centro Médico",
      building: "Laboratorio",
      location: { lat: -0.1900, lng: -78.4900, address: "Av. Colón, Quito" },
      dayOfWeek: 3,
      startTime: "13:30",
      endTime: "15:00",
      duration: 90,
      type: "correctivo",
      status: "programado",
      priority: "alta"
    },
    {
      id: "A041",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Mantenimiento de Ascensores",
      client: "Edificio de Apartamentos",
      building: "Torre A",
      location: { lat: -0.3450, lng: -78.6350, address: "Av. Portugal, Quito" },
      dayOfWeek: 3,
      startTime: "10:00",
      endTime: "11:30",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A042",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Revisión de Sistemas",
      client: "Centro de Datos",
      building: "Sala de Control",
      location: { lat: -0.4150, lng: -78.7050, address: "Av. 6 de Diciembre, Quito" },
      dayOfWeek: 3,
      startTime: "16:30",
      endTime: "17:00",
      duration: 30,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    // Jueves (4)
    {
      id: "A016",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Calibración de Sensores",
      client: "Universidad Central",
      building: "Facultad de Ingeniería",
      location: { lat: -0.2100, lng: -78.4950, address: "Av. Universitaria, Quito" },
      dayOfWeek: 4,
      startTime: "08:00",
      endTime: "09:30",
      duration: 90,
      type: "preventivo",
      status: "completado",
      priority: "baja"
    },
    {
      id: "A017",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Mantenimiento Preventivo",
      client: "Mall del Sur",
      building: "Zona de Estacionamiento",
      location: { lat: -0.2250, lng: -78.5100, address: "Av. Maldonado, Quito" },
      dayOfWeek: 4,
      startTime: "10:00",
      endTime: "12:00",
      duration: 120,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A018",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Emergencia - Ascensor Bloqueado",
      client: "Centro Comercial San Marino",
      building: "Piso 8",
      location: { lat: -0.1880, lng: -78.4750, address: "Av. Shyris, Quito" },
      dayOfWeek: 4,
      startTime: "13:30",
      endTime: "15:00",
      duration: 90,
      type: "emergencia",
      status: "en_progreso",
      priority: "alta"
    },
    {
      id: "A019",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Inspección de Seguridad",
      client: "Banco Central",
      building: "Bóveda",
      location: { lat: -0.1800, lng: -78.4800, address: "Av. Amazonas, Quito" },
      dayOfWeek: 4,
      startTime: "16:00",
      endTime: "17:00",
      duration: 60,
      type: "preventivo",
      status: "programado",
      priority: "alta"
    },
    {
      id: "A043",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Revisión de Seguridad",
      client: "Edificio Gubernamental",
      building: "Entrada Principal",
      location: { lat: -0.3750, lng: -78.6650, address: "Av. 10 de Agosto, Quito" },
      dayOfWeek: 4,
      startTime: "07:00",
      endTime: "08:00",
      duration: 60,
      type: "preventivo",
      status: "programado",
      priority: "alta"
    },
    {
      id: "A044",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Mantenimiento Rutinario",
      client: "Condominio Los Álamos",
      building: "Bloque D",
      location: { lat: -0.2250, lng: -78.5150, address: "Av. González Suárez, Quito" },
      dayOfWeek: 4,
      startTime: "07:30",
      endTime: "09:00",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "baja"
    },
    {
      id: "A045",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Inspección de Rutina",
      client: "Hotel Gran Plaza",
      building: "Recepción",
      location: { lat: -0.2150, lng: -78.5050, address: "Av. 12 de Octubre, Quito" },
      dayOfWeek: 4,
      startTime: "09:30",
      endTime: "10:30",
      duration: 60,
      type: "preventivo",
      status: "programado",
      priority: "baja"
    },
    {
      id: "A046",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Mantenimiento Correctivo",
      client: "Fábrica de Textiles",
      building: "Nave Industrial 2",
      location: { lat: -0.2850, lng: -78.5750, address: "Av. Galo Plaza Lasso, Quito" },
      dayOfWeek: 4,
      startTime: "12:30",
      endTime: "14:00",
      duration: 90,
      type: "correctivo",
      status: "programado",
      priority: "alta"
    },
    // Viernes (5)
    {
      id: "A020",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Inspección Semanal",
      client: "Edificio Corporativo",
      building: "Torre Central",
      location: { lat: -0.1700, lng: -78.4800, address: "Av. 10 de Agosto, Quito" },
      dayOfWeek: 5,
      startTime: "09:00",
      endTime: "11:00",
      duration: 120,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A021",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Mantenimiento Semanal",
      client: "Torre Financiera",
      building: "Edificio Principal",
      location: { lat: -0.1900, lng: -78.4850, address: "Av. Amazonas, Quito" },
      dayOfWeek: 5,
      startTime: "07:30",
      endTime: "09:00",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A022",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Revisión de Componentes",
      client: "Centro de Datos",
      building: "Sala de Servidores",
      location: { lat: -0.2950, lng: -78.5850, address: "Av. 6 de Diciembre, Quito" },
      dayOfWeek: 5,
      startTime: "11:30",
      endTime: "13:00",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A023",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Inspección Final",
      client: "Centro Comercial Iñaquito",
      building: "Torre Norte",
      location: { lat: -0.1750, lng: -78.4900, address: "Av. Amazonas, Quito" },
      dayOfWeek: 5,
      startTime: "15:30",
      endTime: "17:00",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "baja"
    },
    {
      id: "A047",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Emergencia - Ascensor Detenido",
      client: "Centro Financiero",
      building: "Piso 10",
      location: { lat: -0.1880, lng: -78.4750, address: "Av. Shyris, Quito" },
      dayOfWeek: 5,
      startTime: "07:00",
      endTime: "08:30",
      duration: 90,
      type: "emergencia",
      status: "en_progreso",
      priority: "alta"
    },
    {
      id: "A048",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Mantenimiento Correctivo",
      client: "Fábrica de Textiles",
      building: "Nave Industrial 3",
      location: { lat: -0.2850, lng: -78.5750, address: "Av. Galo Plaza Lasso, Quito" },
      dayOfWeek: 5,
      startTime: "11:00",
      endTime: "12:00",
      duration: 60,
      type: "correctivo",
      status: "programado",
      priority: "alta"
    },
    {
      id: "A049",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Inspección de Rutina",
      client: "Edificio de Oficinas",
      building: "Piso 7",
      location: { lat: -0.3950, lng: -78.6850, address: "Av. República, Quito" },
      dayOfWeek: 5,
      startTime: "14:00",
      endTime: "15:00",
      duration: 60,
      type: "preventivo",
      status: "programado",
      priority: "baja"
    },
    {
      id: "A050",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Revisión de Sistemas",
      client: "Centro de Datos",
      building: "Sala de UPS",
      location: { lat: -0.4850, lng: -78.7750, address: "Av. 6 de Diciembre, Quito" },
      dayOfWeek: 5,
      startTime: "13:30",
      endTime: "15:00",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },

    // Sábado (6)
    {
      id: "A024",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Mantenimiento Especial",
      client: "Centro Médico",
      building: "Edificio Principal",
      location: { lat: -0.1900, lng: -78.4900, address: "Av. Colón, Quito" },
      dayOfWeek: 6,
      startTime: "10:00",
      endTime: "12:30",
      duration: 150,
      type: "preventivo",
      status: "programado",
      priority: "baja"
    },
    {
      id: "A025",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Revisión General",
      client: "Centro Comercial Quicentro",
      building: "Patio de Comidas",
      location: { lat: -0.2650, lng: -78.5550, address: "Av. Naciones Unidas, Quito" },
      dayOfWeek: 6,
      startTime: "07:00",
      endTime: "09:00",
      duration: 120,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A026",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Mantenimiento Programado",
      client: "Gimnasio",
      building: "Área de Máquinas",
      location: { lat: -0.3250, lng: -78.6150, address: "Av. Eloy Alfaro, Quito" },
      dayOfWeek: 6,
      startTime: "14:00",
      endTime: "16:00",
      duration: 120,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A027",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Calibración de Equipos",
      client: "Centro Médico",
      building: "Laboratorio",
      location: { lat: -0.1900, lng: -78.4900, address: "Av. Colón, Quito" },
      dayOfWeek: 6,
      startTime: "09:00",
      endTime: "10:30",
      duration: 90,
      type: "correctivo",
      status: "programado",
      priority: "alta"
    },
    {
      id: "A051",
      technicianId: "T001",
      technicianName: "Juan Pérez",
      activity: "Inspección de Seguridad",
      client: "Banco Central",
      building: "Torre Principal",
      location: { lat: -0.1800, lng: -78.4800, address: "Av. Amazonas, Quito" },
      dayOfWeek: 6,
      startTime: "13:00",
      endTime: "14:30",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "alta"
    },
    {
      id: "A052",
      technicianId: "T002",
      technicianName: "María López",
      activity: "Mantenimiento Preventivo",
      client: "Mall del Sur",
      building: "Zona de Estacionamiento",
      location: { lat: -0.2250, lng: -78.5100, address: "Av. Maldonado, Quito" },
      dayOfWeek: 6,
      startTime: "07:00",
      endTime: "08:30",
      duration: 90,
      type: "preventivo",
      status: "programado",
      priority: "media"
    },
    {
      id: "A053",
      technicianId: "T003",
      technicianName: "Carlos Mendez",
      activity: "Inspección de Rutina",
      client: "Edificio de Oficinas",
      building: "Piso 6",
      location: { lat: -0.2750, lng: -78.5650, address: "Av. Portugal, Quito" },
      dayOfWeek: 6,
      startTime: "09:00",
      endTime: "10:00",
      duration: 60,
      type: "preventivo",
      status: "programado",
      priority: "baja"
    },
    {
      id: "A054",
      technicianId: "T004",
      technicianName: "Ana Gómez",
      activity: "Emergencia - Ascensor Bloqueado",
      client: "Centro Comercial",
      building: "Piso 5",
      location: { lat: -0.3850, lng: -78.6750, address: "Av. Eloy Alfaro, Quito" },
      dayOfWeek: 6,
      startTime: "16:30",
      endTime: "17:00",
      duration: 30,
      type: "emergencia",
      status: "en_progreso",
      priority: "alta"
    },
  ]);

  // ================== FUNCIONES HELPERS ==================
  
  // Verificar si una fecha es feriado
  const isHoliday = (date: string): Holiday | null => {
    const holiday = holidays.find(h => h.date === date && h.isActive);
    return holiday || null;
  };

  // Agregar nueva notificación
  const addNotification = (title: string, message: string, type: Notification["type"]) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Crear actividad recurrente
  const createRecurringActivity = (baseActivity: MaintenanceActivity) => {
    if (!baseActivity.recurrence || baseActivity.recurrence.type === "unica") {
      return [baseActivity];
    }

    const generatedActivities: MaintenanceActivity[] = [];
    const startDate = new Date(baseActivity.date || selectedDate);
    const endDate = baseActivity.recurrence.endDate 
      ? new Date(baseActivity.recurrence.endDate) 
      : new Date(selectedYear, 11, 31); // Fin del año seleccionado

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      generatedActivities.push({
        ...baseActivity,
        id: `${baseActivity.id}-${currentDate.toISOString().split('T')[0]}`,
        date: currentDate.toISOString().split('T')[0],
      });

      // Incrementar fecha según el tipo de recurrencia
      switch (baseActivity.recurrence.type) {
        case "diaria":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "semanal":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "mensual":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "trimestral":
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case "anual":
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }

    return generatedActivities;
  };

  // Filtrar actividades según el técnico seleccionado y la vista
  const getFilteredActivities = () => {
    let filtered = selectedTechnician === "todos" 
      ? activities 
      : activities.filter(act => act.technicianId === selectedTechnician);

    // Filtrar según la vista actual
    switch (viewMode) {
      case "dia":
        filtered = filtered.filter(act => act.date === selectedDate);
        break;
      case "semana":
        // Mantener todas las actividades con dayOfWeek definido
        filtered = filtered.filter(act => act.dayOfWeek !== undefined);
        break;
      case "mes":
        filtered = filtered.filter(act => {
          if (!act.date) return false;
          const actDate = new Date(act.date);
          return actDate.getMonth() === selectedMonth && actDate.getFullYear() === selectedYear;
        });
        break;
      case "anual":
        filtered = filtered.filter(act => {
          if (!act.date) return false;
          const actDate = new Date(act.date);
          return actDate.getFullYear() === selectedYear;
        });
        break;
    }

    return filtered;
  };

  const filteredActivities = getFilteredActivities();

  // Configuración de la cuadrícula semanal
  const daysOfWeek = [
    { id: 0, name: "Domingo", short: "DOM" },
    { id: 1, name: "Lunes", short: "LUN" },
    { id: 2, name: "Martes", short: "MAR" },
    { id: 3, name: "Miércoles", short: "MIÉ" },
    { id: 4, name: "Jueves", short: "JUE" },
    { id: 5, name: "Viernes", short: "VIE" },
    { id: 6, name: "Sábado", short: "SÁB" },
  ];

  // Franjas horarias más detalladas (cada 30 minutos)
  const timeSlots = [
    "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00"
  ];

  // Función para convertir tiempo a índice de franja horaria (cada 30 minutos)
  const timeToSlotIndex = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours - 7) * 60 + minutes; // 07:00 es el inicio
    return Math.floor(totalMinutes / 30); // Cada slot es 30 minutos
  };

  // Función para obtener la posición top del bloque en píxeles
  const getBlockTopPosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours - 7) * 60 + minutes; // 07:00 es el inicio
    const slotIndex = Math.floor(totalMinutes / 30); // Cada slot es 30 minutos
    return slotIndex * 60 + (slotIndex * 8); // 60px por slot + 8px de gap
  };

  // Función para calcular la altura del bloque en función de la duración
  const getBlockHeight = (duration: number) => {
    const slotHeight = 60; // Altura de cada franja horaria en píxeles (30 min)
    const slots = Math.ceil(duration / 30); // Duración en franjas de 30 minutos
    return slots * slotHeight - 8; // -8 para el gap entre bloques
  };

  // Función para obtener el color del bloque según el tipo y estado
  const getBlockColor = (type: string, status: string) => {
    if (type === "emergencia") return "bg-red-500";
    if (type === "correctivo") {
      return status === "en_progreso" ? "bg-orange-400" : "bg-orange-500";
    }
    if (type === "preventivo") {
      if (status === "completado") return "bg-green-500";
      if (status === "en_progreso") return "bg-blue-400";
      return "bg-blue-500";
    }
    return "bg-gray-500";
  };

  // Función para obtener el color del borde
  const getBlockBorderColor = (type: string) => {
    if (type === "emergencia") return "border-red-600";
    if (type === "correctivo") return "border-orange-600";
    return "border-blue-600";
  };

  // Calcular estadísticas
  const stats = {
    total: filteredActivities.length,
    completadas: filteredActivities.filter(a => a.status === "completado").length,
    enProgreso: filteredActivities.filter(a => a.status === "en_progreso").length,
    programadas: filteredActivities.filter(a => a.status === "programado").length,
    emergencias: filteredActivities.filter(a => a.type === "emergencia").length,
  };

  // Función para abrir el modal con los detalles de la actividad
  const handleActivityClick = (activity: MaintenanceActivity) => {
    setSelectedActivity(activity);
    onOpen();
  };

  // Función para navegar al mapa con la ubicación
  const handleNavigateToMap = () => {
    if (selectedActivity) {
      // Aquí puedes pasar la ubicación al mapa mediante state o query params
      history.push({
        pathname: '/map',
        state: { 
          location: selectedActivity.location,
          activity: selectedActivity 
        }
      });
    }
  };

  // ================== FUNCIONES DE MANEJO DE EVENTOS ==================
  
  // Función para optimizar el cronograma
  const handleOptimizeSchedule = () => {
    // Lógica de optimización basada en cercanía y disponibilidad
    const optimized = [...activities].sort((a, b) => {
      // Ordenar por prioridad y luego por hora
      if (a.priority !== b.priority) {
        const priorityOrder = { alta: 0, media: 1, baja: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.startTime.localeCompare(b.startTime);
    });
    
    setActivities(optimized);
    addNotification(
      "Cronograma Optimizado", 
      "El cronograma ha sido reorganizado según prioridad y horarios", 
      "success"
    );
  };

  // Función para activar modo emergencia
  const handleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode);
    if (!emergencyMode) {
      addNotification(
        "Modo Emergencia Activado",
        "Las emergencias tendrán prioridad en la asignación de técnicos",
        "warning"
      );
    }
  };

  // Función para agregar nueva actividad
  const handleAddActivity = () => {
    const newActivity: MaintenanceActivity = {
      id: `A${Date.now()}`,
      technicianId: newActivityForm.technicianId,
      technicianName: technicians.find(t => t.id === newActivityForm.technicianId)?.name || "",
      activity: newActivityForm.activity,
      client: newActivityForm.client,
      building: newActivityForm.building,
      location: {
        lat: -0.1807,
        lng: -78.4678,
        address: newActivityForm.address,
      },
      date: newActivityForm.date,
      startTime: newActivityForm.startTime,
      endTime: newActivityForm.endTime,
      duration: calculateDuration(newActivityForm.startTime, newActivityForm.endTime),
      type: newActivityForm.type,
      status: "programado",
      priority: newActivityForm.priority,
      recurrence: {
        type: newActivityForm.recurrenceType,
        endDate: newActivityForm.recurrenceEndDate || undefined,
      },
    };

    // Generar actividades recurrentes si es necesario
    const generatedActivities = createRecurringActivity(newActivity);
    setActivities(prev => [...prev, ...generatedActivities]);
    
    addNotification(
      "Actividad Creada",
      `Se creó la actividad "${newActivity.activity}" ${generatedActivities.length > 1 ? `con ${generatedActivities.length} ocurrencias` : ""}`,
      "success"
    );

    // Resetear formulario
    setNewActivityForm({
      technicianId: "",
      activity: "",
      client: "",
      building: "",
      address: "",
      date: "",
      startTime: "",
      endTime: "",
      type: "preventivo",
      priority: "media",
      recurrenceType: "unica",
      recurrenceEndDate: "",
    });
  };

  // Función para calcular duración en minutos
  const calculateDuration = (start: string, end: string): number => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  };

  // Función para modificar feriado
  const handleModifyHoliday = (holidayId: string, newDate: string) => {
    setHolidays(prev => prev.map(h => 
      h.id === holidayId ? { ...h, date: newDate } : h
    ));
    addNotification(
      "Feriado Modificado",
      "La fecha del feriado ha sido actualizada",
      "info"
    );
  };

  // Función para eliminar/desactivar feriado
  const handleToggleHoliday = (holidayId: string) => {
    setHolidays(prev => prev.map(h => 
      h.id === holidayId ? { ...h, isActive: !h.isActive } : h
    ));
  };

  // Función para agregar feriado personalizado
  const handleAddCustomHoliday = (name: string, date: string) => {
    const newHoliday: Holiday = {
      id: `custom-${Date.now()}`,
      name,
      date,
      type: "personalizado",
      isMovable: true,
      isActive: true,
    };
    setHolidays(prev => [...prev, newHoliday]);
    addNotification(
      "Feriado Agregado",
      `Se agregó el feriado "${name}"`,
      "success"
    );
  };

  // ================== FUNCIONES DE PLANIFICACIÓN ANUAL ==================

  // Agregar nuevo edificio/cliente a la planificación
  const handleAddPlanningItem = () => {
    const newItem = {
      id: `planning-${Date.now()}`,
      clientName: "",
      buildingName: "",
      address: "",
      activities: []
    };
    setAnnualPlanningItems(prev => [...prev, newItem]);
  };

  // Agregar actividad a un edificio específico
  const handleAddActivityToPlanningItem = (itemId: string) => {
    setAnnualPlanningItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          activities: [
            ...item.activities,
            {
              name: "",
              type: "preventivo" as const,
              priority: "media" as const,
              frequency: "mensual" as const,
              dayOfMonth: 1,
              startTime: "09:00",
              endTime: "11:00",
              technicianId: ""
            }
          ]
        };
      }
      return item;
    }));
  };

  // Eliminar edificio de la planificación
  const handleRemovePlanningItem = (itemId: string) => {
    setAnnualPlanningItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Eliminar actividad de un edificio
  const handleRemoveActivityFromPlanningItem = (itemId: string, activityIndex: number) => {
    setAnnualPlanningItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          activities: item.activities.filter((_, idx) => idx !== activityIndex)
        };
      }
      return item;
    }));
  };

  // Actualizar datos del edificio
  const handleUpdatePlanningItem = (itemId: string, field: string, value: string) => {
    setAnnualPlanningItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Actualizar actividad de un edificio
  const handleUpdatePlanningActivity = (itemId: string, activityIndex: number, field: string, value: any) => {
    setAnnualPlanningItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          activities: item.activities.map((act, idx) => {
            if (idx === activityIndex) {
              return { ...act, [field]: value };
            }
            return act;
          })
        };
      }
      return item;
    }));
  };

  // Generar todas las actividades del año
  const handleGenerateAnnualPlanning = () => {
    let totalActivitiesGenerated = 0;
    const newActivities: MaintenanceActivity[] = [];

    annualPlanningItems.forEach(planningItem => {
      planningItem.activities.forEach(activity => {
        // Calcular cuántas ocurrencias según la frecuencia
        const occurrences = activity.frequency === "mensual" ? 12 
                          : activity.frequency === "trimestral" ? 4 
                          : activity.frequency === "semestral" ? 2 
                          : 1; // anual

        const monthsIncrement = activity.frequency === "mensual" ? 1 
                              : activity.frequency === "trimestral" ? 3 
                              : activity.frequency === "semestral" ? 6 
                              : 12;

        // Generar actividades para cada ocurrencia
        for (let i = 0; i < occurrences; i++) {
          const month = i * monthsIncrement; // 0, 1, 2... o 0, 3, 6... según frecuencia
          const date = new Date(selectedYear, month, activity.dayOfMonth);
          
          // Verificar que la fecha sea válida
          if (date.getFullYear() === selectedYear) {
            const newActivity: MaintenanceActivity = {
              id: `annual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              technicianId: activity.technicianId,
              technicianName: technicians.find(t => t.id === activity.technicianId)?.name || "Sin asignar",
              activity: activity.name,
              client: planningItem.clientName,
              building: planningItem.buildingName,
              location: {
                lat: -0.1807,
                lng: -78.4678,
                address: planningItem.address
              },
              date: date.toISOString().split('T')[0],
              startTime: activity.startTime,
              endTime: activity.endTime,
              duration: calculateDuration(activity.startTime, activity.endTime),
              type: activity.type,
              status: "programado",
              priority: activity.priority,
              recurrence: {
                type: "unica",
              }
            };

            newActivities.push(newActivity);
            totalActivitiesGenerated++;
          }
        }
      });
    });

    // Agregar todas las actividades generadas
    setActivities(prev => [...prev, ...newActivities]);

    // Limpiar planificación
    setAnnualPlanningItems([]);

    // Notificar
    addNotification(
      "Planificación Generada",
      `Se crearon ${totalActivitiesGenerated} actividades para el año ${selectedYear}`,
      "success"
    );
  };

  // Obtener color según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completado": return "success";
      case "en_progreso": return "warning";
      case "programado": return "primary";
      case "retrasado": return "danger";
      default: return "default";
    }
  };

  // Obtener color según el tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case "emergencia": return "danger";
      case "correctivo": return "warning";
      case "preventivo": return "primary";
      default: return "default";
    }
  };

  // Obtener color según la prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "danger";
      case "media": return "warning";
      case "baja": return "success";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Cronograma de Mantenimientos</h1>
          <p className="text-slate-600">Gestión inteligente de actividades y horarios de técnicos</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <Button 
            color="success"
            className="btn-modern font-semibold"
            startContent={<Icon icon="lucide:calendar-plus" width={16} />}
            onPress={onAnnualPlanningOpen}
            size="lg"
          >
            📋 Planificar Año Completo
          </Button>
          <Button 
            color="primary"
            className="btn-modern"
            startContent={<Icon icon="lucide:plus" width={16} />}
            onPress={onAddActivityOpen}
          >
            Nueva Actividad
          </Button>
          <Button 
            color="secondary"
            className="btn-modern"
            startContent={<Icon icon="lucide:calendar-check" width={16} />}
            onPress={onHolidayModalOpen}
          >
            Gestionar Feriados
          </Button>
          <Button 
            color={emergencyMode ? "danger" : "warning"}
            className="btn-modern"
            startContent={<Icon icon="lucide:alert-triangle" width={16} />}
            onPress={handleEmergencyMode}
          >
            {emergencyMode ? "Desactivar" : "Modo"} Emergencia
          </Button>
          <Button 
            color="secondary" 
            className="btn-modern"
            startContent={<Icon icon="lucide:refresh-cw" width={16} />}
            onPress={handleOptimizeSchedule}
          >
            Optimizar
          </Button>
        </div>
      </div>

      {/* Notificaciones Panel */}
      {notifications.length > 0 && (
        <Card className="card-modern border-l-4 border-l-blue-500">
          <CardBody className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:bell" width={20} className="text-blue-600" />
                <h3 className="font-semibold text-slate-800">Notificaciones Recientes</h3>
                <Badge color="primary" size="sm">{notifications.filter(n => !n.read).length}</Badge>
              </div>
              <Button 
                size="sm" 
                variant="light"
                onPress={() => setNotifications([])}
              >
                Limpiar Todo
              </Button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {notifications.slice(0, 3).map(notif => (
                <div key={notif.id} className="flex items-start gap-3 p-2 bg-slate-50 rounded-lg">
                  <Icon 
                    icon={
                      notif.type === "success" ? "lucide:check-circle" :
                      notif.type === "warning" ? "lucide:alert-triangle" :
                      notif.type === "error" ? "lucide:x-circle" :
                      "lucide:info"
                    }
                    width={16}
                    className={
                      notif.type === "success" ? "text-green-600" :
                      notif.type === "warning" ? "text-orange-600" :
                      notif.type === "error" ? "text-red-600" :
                      "text-blue-600"
                    }
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                    <p className="text-xs text-slate-600">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tabs para cambiar vista */}
      <Card className="card-modern">
        <CardBody className="p-4">
          <Tabs 
            selectedKey={viewMode}
            onSelectionChange={(key) => setViewMode(key as "dia" | "semana" | "mes" | "anual")}
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-6",
              cursor: "w-full bg-[#07ADDB]",
              tab: "max-w-fit px-4 h-12",
              tabContent: "group-data-[selected=true]:text-[#07ADDB]"
            }}
          >
            <Tab
              key="dia"
              title={
                <div className="flex items-center space-x-2">
                  <Icon icon="lucide:calendar-days" width={18} />
                  <span>Vista Diaria</span>
                </div>
              }
            />
            <Tab
              key="semana"
              title={
                <div className="flex items-center space-x-2">
                  <Icon icon="lucide:calendar-range" width={18} />
                  <span>Vista Semanal</span>
                </div>
              }
            />
            <Tab
              key="mes"
              title={
                <div className="flex items-center space-x-2">
                  <Icon icon="lucide:calendar" width={18} />
                  <span>Vista Mensual</span>
                </div>
              }
            />
            <Tab
              key="anual"
              title={
                <div className="flex items-center space-x-2">
                  <Icon icon="lucide:calendar-check" width={18} />
                  <span>Vista Anual</span>
                </div>
              }
            />
          </Tabs>
        </CardBody>
      </Card>

      {/* Controles de navegación según la vista */}
      <Card className="card-modern">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              {viewMode === "dia" && (
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-modern"
                  startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
                />
              )}
              {(viewMode === "mes" || viewMode === "anual") && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    isIconOnly
                    onPress={() => {
                      if (viewMode === "mes") {
                        if (selectedMonth === 0) {
                          setSelectedMonth(11);
                          setSelectedYear(selectedYear - 1);
                        } else {
                          setSelectedMonth(selectedMonth - 1);
                        }
                      } else {
                        setSelectedYear(selectedYear - 1);
                      }
                    }}
                  >
                    <Icon icon="lucide:chevron-left" width={18} />
                  </Button>
                  <span className="text-lg font-semibold min-w-[150px] text-center">
                    {viewMode === "mes" 
                      ? `${new Date(selectedYear, selectedMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
                      : selectedYear
                    }
                  </span>
                  <Button
                    size="sm"
                    variant="flat"
                    isIconOnly
                    onPress={() => {
                      if (viewMode === "mes") {
                        if (selectedMonth === 11) {
                          setSelectedMonth(0);
                          setSelectedYear(selectedYear + 1);
                        } else {
                          setSelectedMonth(selectedMonth + 1);
                        }
                      } else {
                        setSelectedYear(selectedYear + 1);
                      }
                    }}
                  >
                    <Icon icon="lucide:chevron-right" width={18} />
                  </Button>
                </div>
              )}
            </div>
            <Select 
              label="Filtrar por Técnico"
              selectedKeys={[selectedTechnician]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedTechnician(selected);
              }}
              className="input-modern max-w-[250px]"
              startContent={<Icon icon="lucide:user" width={16} className="text-slate-400" />}
            >
              <SelectItem key="todos">Todos los Técnicos</SelectItem>
              <SelectItem key="T001">Juan Pérez</SelectItem>
              <SelectItem key="T002">María López</SelectItem>
              <SelectItem key="T003">Carlos Mendez</SelectItem>
              <SelectItem key="T004">Ana Gómez</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Alerta de modo emergencia */}
      {emergencyMode && (
        <Card className="bg-red-50 border-2 border-red-200 animate-pulse">
          <CardBody>
            <div className="flex items-center gap-3">
              <Icon icon="lucide:alert-triangle" width={24} className="text-red-600" />
              <div>
                <p className="font-semibold text-red-800">Modo Emergencia Activo</p>
                <p className="text-sm text-red-600">
                  El sistema reorganizará automáticamente las actividades para atender emergencias prioritarias
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#07ADDB]">
              <Icon icon="lucide:list" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total</p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-green-500">
              <Icon icon="lucide:check-circle" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Completadas</p>
              <p className="text-2xl font-bold text-slate-800">{stats.completadas}</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-orange-500">
              <Icon icon="lucide:clock" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">En Progreso</p>
              <p className="text-2xl font-bold text-slate-800">{stats.enProgreso}</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#4F90DB]">
              <Icon icon="lucide:calendar" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Programadas</p>
              <p className="text-2xl font-bold text-slate-800">{stats.programadas}</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-red-500">
              <Icon icon="lucide:alert-triangle" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Emergencias</p>
              <p className="text-2xl font-bold text-slate-800">{stats.emergencias}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Vista de Cronograma según el modo seleccionado */}
      <Card className="card-modern">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#07ADDB]">
              <Icon icon="lucide:calendar-clock" className="text-white" width={20} />
            </div>
            <h2 className="text-xl font-semibold">
              {viewMode === "dia" && "Vista Diaria"}
              {viewMode === "semana" && "Vista Semanal"}
              {viewMode === "mes" && "Vista Mensual"}
              {viewMode === "anual" && "Vista Anual"}
            </h2>
          </div>
        </CardHeader>
        <CardBody>
          {/* VISTA SEMANAL */}
          {viewMode === "semana" && (
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                {/* Encabezados de Días */}
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="w-20"></div>
                  {daysOfWeek.map((day) => (
                    <div 
                      key={day.id}
                      className="bg-blue-100 border-2 border-blue-600 rounded-lg p-3 text-center"
                    >
                      <div className="text-sm font-bold text-blue-800">{day.short}</div>
                      <div className="text-xs text-blue-600">{day.name}</div>
                    </div>
                  ))}
                </div>

                {/* Cuadrícula de Horarios */}
                <div className="grid grid-cols-8 gap-2">
                  {/* Columna de Horas */}
                  <div className="space-y-2">
                    {timeSlots.map((time) => (
                      <div 
                        key={time}
                        className="bg-blue-100 border-2 border-blue-600 rounded-lg p-2 h-[60px] flex items-center justify-center"
                      >
                        <span className="text-sm font-medium text-blue-800">{time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Columnas de Días */}
                  {daysOfWeek.map((day) => (
                    <div key={day.id} className="space-y-2 relative">
                      {timeSlots.map((time) => (
                        <div 
                          key={`${day.id}-${time}`}
                          className="bg-blue-50 border border-blue-200 rounded-lg h-[60px]"
                        />
                      ))}
                      
                      {/* Actividades */}
                      {filteredActivities
                        .filter(activity => activity.dayOfWeek === day.id)
                        .map((activity) => (
                          <div
                            key={activity.id}
                            onClick={() => handleActivityClick(activity)}
                            className={`absolute left-2 right-2 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${getBlockColor(activity.type, activity.status)} ${getBlockBorderColor(activity.type)}`}
                            style={{
                              top: `${getBlockTopPosition(activity.startTime)}px`,
                              height: `${getBlockHeight(activity.duration)}px`,
                              zIndex: 10
                            }}
                          >
                            <div className="p-2 text-white">
                              <div className="text-xs font-bold truncate">{activity.technicianName.split(' ')[0]}</div>
                              <div className="text-xs truncate">{activity.activity}</div>
                              <div className="text-xs truncate opacity-90">{activity.client}</div>
                              <div className="text-xs font-medium">{activity.startTime} - {activity.endTime}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VISTA MENSUAL */}
          {viewMode === "mes" && (
            <div className="p-4">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day} className="text-center font-semibold text-sm text-slate-700 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
                  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                  const days = [];
                  
                  // Días vacíos antes del primer día
                  for (let i = 0; i < firstDay; i++) {
                    days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50 rounded-lg" />);
                  }
                  
                  // Días del mes
                  for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayActivities = filteredActivities.filter(a => a.date === dateStr);
                    const holiday = isHoliday(dateStr);
                    
                    days.push(
                      <div 
                        key={day}
                        className={`h-24 rounded-lg border-2 p-2 ${holiday ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'} hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-sm font-semibold ${holiday ? 'text-red-600' : 'text-slate-700'}`}>
                            {day}
                          </span>
                          {dayActivities.length > 0 && (
                            <Badge size="sm" color="primary">{dayActivities.length}</Badge>
                          )}
                        </div>
                        {holiday && (
                          <div className="text-xs text-red-600 font-medium truncate mb-1">
                            🎉 {holiday.name}
                          </div>
                        )}
                        <div className="space-y-1">
                          {dayActivities.slice(0, 2).map((act) => (
                            <div
                              key={act.id}
                              onClick={() => handleActivityClick(act)}
                              className={`text-xs p-1 rounded cursor-pointer ${getBlockColor(act.type, act.status)}`}
                            >
                              <div className="text-white truncate font-medium">{act.startTime} {act.activity}</div>
                            </div>
                          ))}
                          {dayActivities.length > 2 && (
                            <div className="text-xs text-slate-600">+{dayActivities.length - 2} más</div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  return days;
                })()}
              </div>
            </div>
          )}

          {/* VISTA ANUAL - 12 meses en cuadrícula */}
          {viewMode === "anual" && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }, (_, monthIndex) => {
                  const monthActivities = filteredActivities.filter(act => {
                    if (!act.date) return false;
                    const actDate = new Date(act.date);
                    return actDate.getMonth() === monthIndex && actDate.getFullYear() === selectedYear;
                  });
                  
                  const monthHolidays = holidays.filter(h => {
                    const hDate = new Date(h.date);
                    return hDate.getMonth() === monthIndex && hDate.getFullYear() === selectedYear && h.isActive;
                  });

                  return (
                    <Card key={monthIndex} className="border-2 border-slate-200">
                      <CardHeader className="pb-2">
                        <h3 className="text-sm font-semibold text-slate-800">
                          {new Date(selectedYear, monthIndex).toLocaleDateString('es-ES', { month: 'long' })}
                        </h3>
                      </CardHeader>
                      <CardBody className="pt-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:calendar" width={14} className="text-blue-600" />
                            <span className="text-xs text-slate-700">
                              {monthActivities.length} actividad{monthActivities.length !== 1 ? 'es' : ''}
                            </span>
                          </div>
                          {monthHolidays.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Icon icon="lucide:party-popper" width={14} className="text-red-600" />
                              <span className="text-xs text-red-600">
                                {monthHolidays.length} feriado{monthHolidays.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge size="sm" color="success">{monthActivities.filter(a => a.status === "completado").length} completadas</Badge>
                            <Badge size="sm" color="warning">{monthActivities.filter(a => a.type === "emergencia").length} emergencias</Badge>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* VISTA DIARIA */}
          {viewMode === "dia" && (
            <div className="p-4">
              {(() => {
                const holiday = isHoliday(selectedDate);
                const dayActivities = filteredActivities;
                
                return (
                  <div className="space-y-4">
                    {holiday && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Icon icon="lucide:party-popper" width={24} className="text-red-600" />
                          <div>
                            <p className="font-semibold text-red-800">Feriado: {holiday.name}</p>
                            <p className="text-sm text-red-600">Este día no se programan actividades normales</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {dayActivities.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon icon="lucide:calendar-x" width={48} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600">No hay actividades programadas para este día</p>
                        <Button 
                          color="primary" 
                          className="mt-4"
                          startContent={<Icon icon="lucide:plus" width={16} />}
                          onPress={onAddActivityOpen}
                        >
                          Agregar Actividad
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dayActivities.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((activity) => (
                          <Card 
                            key={activity.id}
                            className="border-l-4 cursor-pointer hover:shadow-lg transition-shadow"
                            style={{ borderLeftColor: technicians.find(t => t.id === activity.technicianId)?.color }}
                            isPressable
                            onPress={() => handleActivityClick(activity)}
                          >
                            <CardBody className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge color={getTypeColor(activity.type)} size="sm">{activity.type}</Badge>
                                    <Badge color={getPriorityColor(activity.priority)} size="sm">{activity.priority}</Badge>
                                    <Badge color={getStatusColor(activity.status)} size="sm">{activity.status}</Badge>
                                  </div>
                                  <h3 className="font-semibold text-slate-800 mb-1">{activity.activity}</h3>
                                  <p className="text-sm text-slate-600 mb-2">{activity.client} - {activity.building}</p>
                                  <div className="flex items-center gap-4 text-xs text-slate-600">
                                    <div className="flex items-center gap-1">
                                      <Icon icon="lucide:user" width={14} />
                                      <span>{activity.technicianName}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Icon icon="lucide:clock" width={14} />
                                      <span>{activity.startTime} - {activity.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Icon icon="lucide:map-pin" width={14} />
                                      <span>{activity.location.address}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Leyenda de Colores */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Estado de las Actividades</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-600"></div>
                <span className="text-sm text-slate-600">Preventivo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded border-2 border-orange-600"></div>
                <span className="text-sm text-slate-600">Correctivo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded border-2 border-red-600"></div>
                <span className="text-sm text-slate-600">Emergencia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded border-2 border-blue-600"></div>
                <span className="text-sm text-slate-600">Completado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 rounded border-2 border-red-300"></div>
                <span className="text-sm text-slate-600">Feriado</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modal de Detalles de Actividad */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="lg"
        placement="center"
        classNames={{
          base: "bg-white/95 backdrop-blur-md border border-white/20 max-w-md",
          header: "border-b border-slate-200 pb-4",
          body: "py-4",
          footer: "border-t border-slate-200 pt-4"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#07ADDB]">
                    <Icon icon="lucide:info" className="text-white" width={18} />
                  </div>
                  <h3 className="text-lg font-semibold">Detalles de la Actividad</h3>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedActivity && (
                  <div className="space-y-4">
                    {/* Información del Técnico */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                        style={{ 
                          backgroundColor: technicians.find(t => t.id === selectedActivity.technicianId)?.color || "#07ADDB" 
                        }}
                      >
                        <Icon icon="lucide:user" width={16} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{selectedActivity.technicianName}</p>
                        <p className="text-sm text-slate-600">
                          Zona: {technicians.find(t => t.id === selectedActivity.technicianId)?.zone}
                        </p>
                      </div>
                    </div>

                    {/* Información de la Actividad */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Cliente</p>
                        <p className="text-sm font-medium text-slate-800">{selectedActivity.client}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Edificio</p>
                        <p className="text-sm font-medium text-slate-800">{selectedActivity.building}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Tipo</p>
                        <Badge color={getTypeColor(selectedActivity.type)} variant="flat" size="sm">
                          {selectedActivity.type}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Prioridad</p>
                        <Badge color={getPriorityColor(selectedActivity.priority)} variant="flat" size="sm">
                          {selectedActivity.priority}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Estado</p>
                        <Badge color={getStatusColor(selectedActivity.status)} variant="flat" size="sm">
                          {selectedActivity.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    {/* Ubicación */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="lucide:map-pin" width={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Ubicación</span>
                      </div>
                      <p className="text-xs text-slate-700 mb-3">{selectedActivity.location.address}</p>
                      <Button
                        color="primary"
                        size="sm"
                        className="btn-modern text-xs"
                        startContent={<Icon icon="lucide:navigation" width={14} />}
                        onPress={handleNavigateToMap}
                      >
                        Ver en Mapa
                      </Button>
                    </div>

                    {/* Horarios */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="lucide:clock" width={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-800">Horarios</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-slate-600">Entrada</p>
                          <p className="text-sm font-medium text-slate-800">{selectedActivity.startTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Salida</p>
                          <p className="text-sm font-medium text-slate-800">{selectedActivity.endTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Duración</p>
                          <p className="text-sm font-medium text-slate-800">{selectedActivity.duration} min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="pt-2">
                <Button 
                  color="danger" 
                  variant="light" 
                  size="sm"
                  className="btn-modern"
                  onPress={onClose}
                  startContent={<Icon icon="lucide:x" width={14} />}
                >
                  Cerrar
                </Button>
                <Button 
                  color="primary" 
                  size="sm"
                  className="btn-modern"
                  startContent={<Icon icon="lucide:edit" width={14} />}
                >
                  Editar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal para Agregar Nueva Actividad */}
      <Modal 
        isOpen={isAddActivityOpen} 
        onOpenChange={onAddActivityOpenChange}
        size="2xl"
        placement="center"
        scrollBehavior="inside"
        classNames={{
          base: "bg-white/95 backdrop-blur-md border border-white/20",
          header: "border-b border-slate-200 pb-4",
          body: "py-4",
          footer: "border-t border-slate-200 pt-4"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#07ADDB]">
                    <Icon icon="lucide:plus" className="text-white" width={18} />
                  </div>
                  <h3 className="text-lg font-semibold">Agregar Nueva Actividad</h3>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Técnico Asignado"
                      placeholder="Seleccionar técnico"
                      selectedKeys={newActivityForm.technicianId ? [newActivityForm.technicianId] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setNewActivityForm(prev => ({ ...prev, technicianId: selected }));
                      }}
                      startContent={<Icon icon="lucide:user" width={16} className="text-slate-400" />}
                    >
                      <SelectItem key="T001">Juan Pérez</SelectItem>
                      <SelectItem key="T002">María López</SelectItem>
                      <SelectItem key="T003">Carlos Mendez</SelectItem>
                      <SelectItem key="T004">Ana Gómez</SelectItem>
                    </Select>

                    <Input
                      label="Nombre de la Actividad"
                      placeholder="Ej: Mantenimiento Preventivo"
                      value={newActivityForm.activity}
                      onChange={(e) => setNewActivityForm(prev => ({ ...prev, activity: e.target.value }))}
                      startContent={<Icon icon="lucide:clipboard" width={16} className="text-slate-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Cliente"
                      placeholder="Nombre del cliente"
                      value={newActivityForm.client}
                      onChange={(e) => setNewActivityForm(prev => ({ ...prev, client: e.target.value }))}
                      startContent={<Icon icon="lucide:building" width={16} className="text-slate-400" />}
                    />

                    <Input
                      label="Edificio/Ubicación"
                      placeholder="Edificio o área específica"
                      value={newActivityForm.building}
                      onChange={(e) => setNewActivityForm(prev => ({ ...prev, building: e.target.value }))}
                      startContent={<Icon icon="lucide:map-pin" width={16} className="text-slate-400" />}
                    />
                  </div>

                  <Input
                    label="Dirección"
                    placeholder="Dirección completa"
                    value={newActivityForm.address}
                    onChange={(e) => setNewActivityForm(prev => ({ ...prev, address: e.target.value }))}
                    startContent={<Icon icon="lucide:map" width={16} className="text-slate-400" />}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      type="date"
                      label="Fecha"
                      value={newActivityForm.date}
                      onChange={(e) => setNewActivityForm(prev => ({ ...prev, date: e.target.value }))}
                      startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
                    />

                    <Input
                      type="time"
                      label="Hora Inicio"
                      value={newActivityForm.startTime}
                      onChange={(e) => setNewActivityForm(prev => ({ ...prev, startTime: e.target.value }))}
                      startContent={<Icon icon="lucide:clock" width={16} className="text-slate-400" />}
                    />

                    <Input
                      type="time"
                      label="Hora Fin"
                      value={newActivityForm.endTime}
                      onChange={(e) => setNewActivityForm(prev => ({ ...prev, endTime: e.target.value }))}
                      startContent={<Icon icon="lucide:clock" width={16} className="text-slate-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                      label="Tipo de Actividad"
                      selectedKeys={[newActivityForm.type]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as "preventivo" | "correctivo" | "emergencia";
                        setNewActivityForm(prev => ({ ...prev, type: selected }));
                      }}
                    >
                      <SelectItem key="preventivo">Preventivo</SelectItem>
                      <SelectItem key="correctivo">Correctivo</SelectItem>
                      <SelectItem key="emergencia">Emergencia</SelectItem>
                    </Select>

                    <Select
                      label="Prioridad"
                      selectedKeys={[newActivityForm.priority]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as "baja" | "media" | "alta";
                        setNewActivityForm(prev => ({ ...prev, priority: selected }));
                      }}
                    >
                      <SelectItem key="baja">Baja</SelectItem>
                      <SelectItem key="media">Media</SelectItem>
                      <SelectItem key="alta">Alta</SelectItem>
                    </Select>

                    <Select
                      label="Recurrencia"
                      selectedKeys={[newActivityForm.recurrenceType]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as typeof newActivityForm.recurrenceType;
                        setNewActivityForm(prev => ({ ...prev, recurrenceType: selected }));
                      }}
                    >
                      <SelectItem key="unica">Única vez</SelectItem>
                      <SelectItem key="diaria">Diaria</SelectItem>
                      <SelectItem key="semanal">Semanal</SelectItem>
                      <SelectItem key="mensual">Mensual</SelectItem>
                      <SelectItem key="trimestral">Trimestral</SelectItem>
                      <SelectItem key="anual">Anual</SelectItem>
                    </Select>
                  </div>

                  {newActivityForm.recurrenceType !== "unica" && (
                    <Input
                      type="date"
                      label="Fecha de Fin de Recurrencia"
                      value={newActivityForm.recurrenceEndDate}
                      onChange={(e) => setNewActivityForm(prev => ({ ...prev, recurrenceEndDate: e.target.value }))}
                      startContent={<Icon icon="lucide:calendar-check" width={16} className="text-slate-400" />}
                    />
                  )}

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Icon icon="lucide:info" width={20} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Sobre las actividades recurrentes</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Las actividades recurrentes se crearán automáticamente según la frecuencia seleccionada hasta la fecha de fin especificada.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light"
                  onPress={onClose}
                  startContent={<Icon icon="lucide:x" width={16} />}
                >
                  Cancelar
                </Button>
                <Button 
                  color="primary"
                  onPress={() => {
                    handleAddActivity();
                    onClose();
                  }}
                  startContent={<Icon icon="lucide:check" width={16} />}
                >
                  Guardar Actividad
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal para Gestionar Feriados */}
      <Modal 
        isOpen={isHolidayModalOpen} 
        onOpenChange={onHolidayModalOpenChange}
        size="2xl"
        placement="center"
        scrollBehavior="inside"
        classNames={{
          base: "bg-white/95 backdrop-blur-md border border-white/20",
          header: "border-b border-slate-200 pb-4",
          body: "py-4",
          footer: "border-t border-slate-200 pt-4"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500">
                    <Icon icon="lucide:calendar-check" className="text-white" width={18} />
                  </div>
                  <h3 className="text-lg font-semibold">Gestión de Feriados - Ecuador 2025</h3>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Icon icon="lucide:lightbulb" width={20} className="text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-800">Información Importante</p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Los feriados se cargan automáticamente según el calendario oficial de Ecuador. Puedes modificar las fechas si hay cambios (puentes) o desactivar feriados que no apliquen a tu empresa.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {holidays.map((holiday) => (
                      <Card key={holiday.id} className={`${!holiday.isActive ? 'opacity-50' : ''} border-2 ${holiday.isActive ? 'border-red-200' : 'border-slate-200'}`}>
                        <CardBody className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Icon 
                                icon={holiday.isActive ? "lucide:party-popper" : "lucide:x-circle"} 
                                width={24} 
                                className={holiday.isActive ? "text-red-600" : "text-slate-400"} 
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-slate-800">{holiday.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Input
                                    type="date"
                                    value={holiday.date}
                                    onChange={(e) => handleModifyHoliday(holiday.id, e.target.value)}
                                    size="sm"
                                    className="max-w-[160px]"
                                    disabled={!holiday.isActive}
                                  />
                                  <Chip 
                                    size="sm" 
                                    color={holiday.type === "nacional" ? "danger" : holiday.type === "regional" ? "warning" : "default"}
                                    variant="flat"
                                  >
                                    {holiday.type}
                                  </Chip>
                                  {holiday.isMovable && (
                                    <Chip size="sm" variant="flat">
                                      Movible
                                    </Chip>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tooltip content={holiday.isActive ? "Desactivar feriado" : "Activar feriado"}>
                                <Button
                                  size="sm"
                                  variant="light"
                                  color={holiday.isActive ? "danger" : "success"}
                                  isIconOnly
                                  onPress={() => handleToggleHoliday(holiday.id)}
                                >
                                  <Icon icon={holiday.isActive ? "lucide:eye-off" : "lucide:eye"} width={18} />
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>

                  <div className="pt-4 border-t-2 border-slate-200">
                    <p className="text-sm font-semibold text-slate-700 mb-3">Agregar Feriado Personalizado</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Nombre del feriado"
                        id="custom-holiday-name"
                        startContent={<Icon icon="lucide:tag" width={16} className="text-slate-400" />}
                      />
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          id="custom-holiday-date"
                          startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
                        />
                        <Button
                          color="primary"
                          onPress={() => {
                            const nameInput = document.getElementById('custom-holiday-name') as HTMLInputElement;
                            const dateInput = document.getElementById('custom-holiday-date') as HTMLInputElement;
                            if (nameInput.value && dateInput.value) {
                              handleAddCustomHoliday(nameInput.value, dateInput.value);
                              nameInput.value = '';
                              dateInput.value = '';
                            }
                          }}
                          startContent={<Icon icon="lucide:plus" width={16} />}
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="primary"
                  onPress={onClose}
                  startContent={<Icon icon="lucide:check" width={16} />}
                >
                  Guardar Cambios
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal para Planificación Anual Completa */}
      <Modal 
        isOpen={isAnnualPlanningOpen} 
        onOpenChange={onAnnualPlanningOpenChange}
        size="5xl"
        placement="center"
        scrollBehavior="inside"
        classNames={{
          base: "bg-white/95 backdrop-blur-md border border-white/20",
          header: "border-b border-slate-200 pb-4",
          body: "py-4",
          footer: "border-t border-slate-200 pt-4"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                    <Icon icon="lucide:calendar-plus" className="text-white" width={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Planificación Anual Completa - {selectedYear}</h3>
                    <p className="text-sm text-slate-600 font-normal">Ingresa todos los edificios y sus actividades del año en un solo lugar</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Instrucciones */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon icon="lucide:info" width={24} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800 mb-2">¿Cómo funciona?</p>
                        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                          <li>Agrega cada edificio/cliente con su información</li>
                          <li>Define las actividades que se realizarán en cada edificio</li>
                          <li>Especifica la frecuencia (mensual, trimestral, etc.)</li>
                          <li>Al hacer clic en "Generar Planificación", el sistema creará automáticamente TODAS las actividades del año</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Lista de edificios/clientes planificados */}
                  {annualPlanningItems.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                      <Icon icon="lucide:building-2" width={64} className="text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 mb-4">No has agregado ningún edificio todavía</p>
                      <Button 
                        color="primary" 
                        startContent={<Icon icon="lucide:plus" width={18} />}
                        onPress={handleAddPlanningItem}
                      >
                        Agregar Primer Edificio
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {annualPlanningItems.map((item, itemIndex) => (
                        <Card key={item.id} className="border-2 border-slate-200 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                            <div className="flex items-start justify-between w-full">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 rounded-lg bg-blue-500">
                                  <Icon icon="lucide:building-2" className="text-white" width={20} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-800">
                                    Edificio #{itemIndex + 1}
                                    {item.clientName && ` - ${item.clientName}`}
                                  </h4>
                                  <p className="text-xs text-slate-600">
                                    {item.activities.length} actividad{item.activities.length !== 1 ? 'es' : ''} programada{item.activities.length !== 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                              <Tooltip content="Eliminar edificio">
                                <Button
                                  size="sm"
                                  color="danger"
                                  variant="light"
                                  isIconOnly
                                  onPress={() => handleRemovePlanningItem(item.id)}
                                >
                                  <Icon icon="lucide:trash-2" width={18} />
                                </Button>
                              </Tooltip>
                            </div>
                          </CardHeader>
                          <CardBody className="p-4 space-y-4">
                            {/* Información del Edificio */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <Input
                                label="Nombre del Cliente"
                                placeholder="Ej: Torre Empresarial"
                                value={item.clientName}
                                onChange={(e) => handleUpdatePlanningItem(item.id, 'clientName', e.target.value)}
                                startContent={<Icon icon="lucide:user" width={16} className="text-slate-400" />}
                                size="sm"
                              />
                              <Input
                                label="Edificio/Área"
                                placeholder="Ej: Torre Norte, Piso 5"
                                value={item.buildingName}
                                onChange={(e) => handleUpdatePlanningItem(item.id, 'buildingName', e.target.value)}
                                startContent={<Icon icon="lucide:building" width={16} className="text-slate-400" />}
                                size="sm"
                              />
                              <Input
                                label="Dirección"
                                placeholder="Dirección completa"
                                value={item.address}
                                onChange={(e) => handleUpdatePlanningItem(item.id, 'address', e.target.value)}
                                startContent={<Icon icon="lucide:map-pin" width={16} className="text-slate-400" />}
                                size="sm"
                              />
                            </div>

                            {/* Actividades del Edificio */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-semibold text-slate-700">Actividades Programadas</h5>
                                <Button
                                  size="sm"
                                  color="primary"
                                  variant="flat"
                                  startContent={<Icon icon="lucide:plus" width={16} />}
                                  onPress={() => handleAddActivityToPlanningItem(item.id)}
                                >
                                  Agregar Actividad
                                </Button>
                              </div>

                              {item.activities.length === 0 ? (
                                <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                  <p className="text-sm text-slate-600">No hay actividades. Haz clic en "Agregar Actividad"</p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {item.activities.map((activity, actIndex) => (
                                    <Card key={actIndex} className="bg-slate-50 border border-slate-200">
                                      <CardBody className="p-3">
                                        <div className="flex items-start gap-2">
                                          <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-2">
                                            <Input
                                              label="Actividad"
                                              placeholder="Ej: Mantenimiento Preventivo"
                                              value={activity.name}
                                              onChange={(e) => handleUpdatePlanningActivity(item.id, actIndex, 'name', e.target.value)}
                                              size="sm"
                                              classNames={{ base: "md:col-span-2" }}
                                            />
                                            <Select
                                              label="Técnico"
                                              placeholder="Asignar"
                                              selectedKeys={activity.technicianId ? [activity.technicianId] : []}
                                              onSelectionChange={(keys) => {
                                                const selected = Array.from(keys)[0] as string;
                                                handleUpdatePlanningActivity(item.id, actIndex, 'technicianId', selected);
                                              }}
                                              size="sm"
                                            >
                                              <SelectItem key="T001">Juan Pérez</SelectItem>
                                              <SelectItem key="T002">María López</SelectItem>
                                              <SelectItem key="T003">Carlos Mendez</SelectItem>
                                              <SelectItem key="T004">Ana Gómez</SelectItem>
                                            </Select>
                                            <Select
                                              label="Frecuencia"
                                              selectedKeys={[activity.frequency]}
                                              onSelectionChange={(keys) => {
                                                const selected = Array.from(keys)[0] as "mensual" | "trimestral" | "semestral" | "anual";
                                                handleUpdatePlanningActivity(item.id, actIndex, 'frequency', selected);
                                              }}
                                              size="sm"
                                            >
                                              <SelectItem key="mensual">Mensual (12 veces)</SelectItem>
                                              <SelectItem key="trimestral">Trimestral (4 veces)</SelectItem>
                                              <SelectItem key="semestral">Semestral (2 veces)</SelectItem>
                                              <SelectItem key="anual">Anual (1 vez)</SelectItem>
                                            </Select>
                                            <Input
                                              type="number"
                                              label="Día del mes"
                                              placeholder="1-31"
                                              value={activity.dayOfMonth.toString()}
                                              onChange={(e) => handleUpdatePlanningActivity(item.id, actIndex, 'dayOfMonth', parseInt(e.target.value) || 1)}
                                              min={1}
                                              max={31}
                                              size="sm"
                                            />
                                            <div className="flex gap-1">
                                              <Input
                                                type="time"
                                                label="Inicio"
                                                value={activity.startTime}
                                                onChange={(e) => handleUpdatePlanningActivity(item.id, actIndex, 'startTime', e.target.value)}
                                                size="sm"
                                              />
                                              <Input
                                                type="time"
                                                label="Fin"
                                                value={activity.endTime}
                                                onChange={(e) => handleUpdatePlanningActivity(item.id, actIndex, 'endTime', e.target.value)}
                                                size="sm"
                                              />
                                            </div>
                                          </div>
                                          <div className="flex flex-col gap-1">
                                            <Select
                                              label="Tipo"
                                              selectedKeys={[activity.type]}
                                              onSelectionChange={(keys) => {
                                                const selected = Array.from(keys)[0] as "preventivo" | "correctivo";
                                                handleUpdatePlanningActivity(item.id, actIndex, 'type', selected);
                                              }}
                                              size="sm"
                                              className="w-32"
                                            >
                                              <SelectItem key="preventivo">Preventivo</SelectItem>
                                              <SelectItem key="correctivo">Correctivo</SelectItem>
                                            </Select>
                                            <Select
                                              label="Prioridad"
                                              selectedKeys={[activity.priority]}
                                              onSelectionChange={(keys) => {
                                                const selected = Array.from(keys)[0] as "baja" | "media" | "alta";
                                                handleUpdatePlanningActivity(item.id, actIndex, 'priority', selected);
                                              }}
                                              size="sm"
                                              className="w-32"
                                            >
                                              <SelectItem key="baja">Baja</SelectItem>
                                              <SelectItem key="media">Media</SelectItem>
                                              <SelectItem key="alta">Alta</SelectItem>
                                            </Select>
                                          </div>
                                          <Tooltip content="Eliminar actividad">
                                            <Button
                                              size="sm"
                                              color="danger"
                                              variant="light"
                                              isIconOnly
                                              onPress={() => handleRemoveActivityFromPlanningItem(item.id, actIndex)}
                                            >
                                              <Icon icon="lucide:x" width={18} />
                                            </Button>
                                          </Tooltip>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      ))}

                      {/* Botón para agregar más edificios */}
                      <Button
                        color="primary"
                        variant="bordered"
                        className="w-full"
                        startContent={<Icon icon="lucide:building-2" width={18} />}
                        onPress={handleAddPlanningItem}
                      >
                        Agregar Otro Edificio
                      </Button>
                    </div>
                  )}

                  {/* Resumen */}
                  {annualPlanningItems.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Icon icon="lucide:check-circle" width={24} className="text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-800 mb-2">Resumen de Planificación</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-green-700">Total Edificios</p>
                              <p className="text-2xl font-bold text-green-900">{annualPlanningItems.length}</p>
                            </div>
                            <div>
                              <p className="text-xs text-green-700">Total Actividades Definidas</p>
                              <p className="text-2xl font-bold text-green-900">
                                {annualPlanningItems.reduce((sum, item) => sum + item.activities.length, 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-green-700">Se Generarán (aprox.)</p>
                              <p className="text-2xl font-bold text-green-900">
                                {annualPlanningItems.reduce((sum, item) => {
                                  return sum + item.activities.reduce((actSum, act) => {
                                    const occurrences = act.frequency === "mensual" ? 12 
                                                      : act.frequency === "trimestral" ? 4 
                                                      : act.frequency === "semestral" ? 2 : 1;
                                    return actSum + occurrences;
                                  }, 0);
                                }, 0)} actividades
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-green-700">Para el Año</p>
                              <p className="text-2xl font-bold text-green-900">{selectedYear}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light"
                  onPress={onClose}
                  startContent={<Icon icon="lucide:x" width={16} />}
                >
                  Cancelar
                </Button>
                {annualPlanningItems.length > 0 && (
                  <Button 
                    color="success"
                    className="font-semibold"
                    onPress={() => {
                      handleGenerateAnnualPlanning();
                      onClose();
                    }}
                    startContent={<Icon icon="lucide:rocket" width={16} />}
                  >
                    🎯 Generar Planificación Completa del Año
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};