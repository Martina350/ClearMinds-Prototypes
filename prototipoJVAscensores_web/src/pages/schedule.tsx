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
  Input
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory } from "react-router-dom";

// Tipos de datos para el cronograma
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
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  startTime: string;
  endTime: string;
  duration: number; // en minutos
  type: "preventivo" | "correctivo" | "emergencia";
  status: "programado" | "en_progreso" | "completado" | "retrasado";
  priority: "baja" | "media" | "alta";
}

interface Technician {
  id: string;
  name: string;
  zone: string;
  availability: "disponible" | "ocupado" | "en_ruta";
  color: string;
}

export const SchedulePage: React.FC = () => {
  const history = useHistory();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTechnician, setSelectedTechnician] = React.useState<string>("T001");
  const [selectedActivity, setSelectedActivity] = React.useState<MaintenanceActivity | null>(null);
  const [emergencyMode, setEmergencyMode] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);

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

  // Filtrar actividades según el técnico seleccionado
  const filteredActivities = activities.filter(act => act.technicianId === selectedTechnician);

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
    
    // Mostrar notificación (podrías usar un toast aquí)
    alert("Cronograma optimizado correctamente");
  };

  // Función para activar modo emergencia
  const handleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode);
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
    <div className="space-y-8 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Cronograma de Mantenimientos</h1>
          <p className="text-slate-600">Gestión inteligente de actividades y horarios de técnicos</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-modern w-full sm:w-auto"
            startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
          />
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
            Optimizar Cronograma
          </Button>
        </div>
      </div>

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

      {/* Filtros y Vista de Cronograma */}
      <Card className="card-modern">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#07ADDB]">
                <Icon icon="lucide:calendar-clock" className="text-white" width={20} />
              </div>
              <h2 className="text-xl font-semibold">Horario de Actividades</h2>
            </div>
            <div className="flex items-center gap-3">
              <Select 
                label="Filtrar por Técnico"
                selectedKeys={[selectedTechnician]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedTechnician(selected);
                }}
                className="input-modern min-w-[200px]"
                startContent={<Icon icon="lucide:user" width={16} className="text-slate-400" />}
              >
                <SelectItem key="T001">Juan Pérez</SelectItem>
                <SelectItem key="T002">María López</SelectItem>
                <SelectItem key="T003">Carlos Mendez</SelectItem>
                <SelectItem key="T004">Ana Gómez</SelectItem>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            {/* Cronograma Semanal - Estilo Cuadrícula */}
            <div className="min-w-[1200px]">
              {/* Encabezados de Días */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="w-20"></div> {/* Columna vacía para las horas */}
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
                  {timeSlots.map((time, index) => (
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
                    {timeSlots.map((time, timeIndex) => (
                      <div 
                        key={`${day.id}-${time}`}
                        className="bg-blue-50 border border-blue-200 rounded-lg h-[60px] flex items-center justify-center"
                      >
                      </div>
                    ))}
                    
                    {/* Renderizar actividades de este día con posicionamiento absoluto */}
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
                          <div className="p-3 text-white">
                            <div className="text-sm font-bold truncate mb-1">
                              {activity.technicianName.split(' ')[0]}
                            </div>
                            <div className="text-xs truncate mb-1 leading-tight">
                              {activity.activity}
                            </div>
                            <div className="text-xs truncate opacity-90 mb-1">
                              {activity.client}
                            </div>
                            <div className="text-xs font-medium">
                              {activity.startTime} - {activity.endTime}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>

              {/* Leyenda de Colores */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Leyenda de Colores</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-600"></div>
                    <span className="text-sm text-slate-600">Preventivo Programado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded border-2 border-blue-600"></div>
                    <span className="text-sm text-slate-600">Preventivo en Progreso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded border-2 border-blue-600"></div>
                    <span className="text-sm text-slate-600">Preventivo Completado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded border-2 border-orange-600"></div>
                    <span className="text-sm text-slate-600">Correctivo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded border-2 border-red-600"></div>
                    <span className="text-sm text-slate-600">Emergencia</span>
                  </div>
                </div>
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
    </div>
  );
};