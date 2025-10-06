import React from "react";
import { Card, CardHeader, CardBody, Button, Badge, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/react";

// Sample elevator locations
const elevatorLocations = [
  { id: "A101", lat: 25, lng: 35, status: "Operativo", building: "Torre Norte" },
  { id: "A102", lat: 25, lng: 75, status: "Alerta", building: "Torre Norte" },
  { id: "B205", lat: 65, lng: 45, status: "En mantenimiento", building: "Torre Sur" },
  { id: "C310", lat: 45, lng: 65, status: "Operativo", building: "Torre Este" },
  { id: "D405", lat: 75, lng: 25, status: "Fuera de servicio", building: "Torre Oeste" },
];

// Sample technician locations
const technicianLocations = [
  { id: "E001", name: "Juan Pérez", lat: 30, lng: 40, status: "Activo" },
  { id: "E002", name: "María López", lat: 60, lng: 50, status: "Activo" },
  { id: "E004", name: "Ana Gómez", lat: 50, lng: 70, status: "Activo" },
];

export const MapView: React.FC = () => {
  const [mapType, setMapType] = React.useState<"satellite" | "roadmap">("roadmap");
  
  const handleViewDetails = (id: string) => {
    addToast({
      title: "Detalles del ascensor",
      description: `Mostrando detalles del ascensor ${id}`,
      severity: "primary",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operativo":
        return "success";
      case "Alerta":
        return "warning";
      case "En mantenimiento":
        return "primary";
      case "Fuera de servicio":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Mapa de Ascensores</h2>
          <p className="text-small text-default-500">Ubicación y estado en tiempo real</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mapType === "roadmap" ? "solid" : "flat"}
            color="primary"
            onPress={() => setMapType("roadmap")}
          >
            Mapa
          </Button>
          <Button
            size="sm"
            variant={mapType === "satellite" ? "solid" : "flat"}
            color="primary"
            onPress={() => setMapType("satellite")}
          >
            Satélite
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
          {/* Map container */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: mapType === "satellite" 
                ? "url(https://img.heroui.chat/image/landscape?w=800&h=400&u=1)" 
                : "url(https://img.heroui.chat/image/dashboard?w=800&h=400&u=2)"
            }}
          >
            {/* Elevator markers */}
            {elevatorLocations.map((elevator) => (
              <Tooltip 
                key={elevator.id}
                content={
                  <div className="p-2">
                    <p className="font-medium">{elevator.id}</p>
                    <p className="text-small">{elevator.building}</p>
                    <Badge color={getStatusColor(elevator.status) as any} size="sm">{elevator.status}</Badge>
                  </div>
                }
              >
                <div 
                  className={`absolute cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-${getStatusColor(elevator.status)}`}
                  style={{ 
                    left: `${elevator.lng}%`, 
                    top: `${elevator.lat}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleViewDetails(elevator.id)}
                >
                  <Icon icon="lucide:elevator" className="text-white" width={16} />
                </div>
              </Tooltip>
            ))}

            {/* Technician markers */}
            {technicianLocations.map((tech) => (
              <Tooltip 
                key={tech.id}
                content={
                  <div className="p-2">
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-small">ID: {tech.id}</p>
                    <Badge color="success" size="sm">{tech.status}</Badge>
                  </div>
                }
              >
                <div 
                  className="absolute cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-primary border-2 border-white"
                  style={{ 
                    left: `${tech.lng}%`, 
                    top: `${tech.lat}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Icon icon="lucide:user" className="text-white" width={16} />
                </div>
              </Tooltip>
            ))}
          </div>

          {/* Map controls */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button isIconOnly size="sm" variant="flat" className="bg-white/80 backdrop-blur-sm">
              <Icon icon="lucide:plus" width={16} />
            </Button>
            <Button isIconOnly size="sm" variant="flat" className="bg-white/80 backdrop-blur-sm">
              <Icon icon="lucide:minus" width={16} />
            </Button>
            <Button isIconOnly size="sm" variant="flat" className="bg-white/80 backdrop-blur-sm">
              <Icon icon="lucide:locate" width={16} />
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-2 left-2 p-2 bg-white/80 backdrop-blur-sm rounded-md">
            <div className="text-tiny font-medium mb-1">Leyenda</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-tiny">Operativo</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span className="text-tiny">Alerta</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-tiny">En mantenimiento</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-danger"></div>
                <span className="text-tiny">Fuera de servicio</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};