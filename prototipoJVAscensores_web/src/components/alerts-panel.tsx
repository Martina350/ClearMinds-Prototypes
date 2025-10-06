import React from "react";
import { Card, CardHeader, CardBody, Badge, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/react";

// Sample data
const alertsData = [
  { 
    id: "A001", 
    elevator: "A101", 
    location: "Torre Norte, Piso 1", 
    type: "Falla mecánica", 
    severity: "Alta", 
    timestamp: "2023-10-15 14:30", 
    status: "Pendiente" 
  },
  { 
    id: "A002", 
    elevator: "B205", 
    location: "Torre Sur, Piso 5", 
    type: "Falla eléctrica", 
    severity: "Crítica", 
    timestamp: "2023-10-15 13:15", 
    status: "En atención" 
  },
  { 
    id: "A003", 
    elevator: "C310", 
    location: "Torre Este, Piso 10", 
    type: "Mantenimiento programado", 
    severity: "Baja", 
    timestamp: "2023-10-16 09:00", 
    status: "Programado" 
  },
  { 
    id: "A004", 
    elevator: "A102", 
    location: "Torre Norte, Piso 2", 
    type: "Persona atrapada", 
    severity: "Crítica", 
    timestamp: "2023-10-15 15:45", 
    status: "Pendiente" 
  },
];

export const AlertsPanel: React.FC = () => {
  const handleResolveAlert = (id: string) => {
    addToast({
      title: "Alerta resuelta",
      description: `La alerta ${id} ha sido marcada como resuelta`,
      severity: "success",
    });
  };

  const handleAssignTechnician = (id: string) => {
    addToast({
      title: "Técnico asignado",
      description: `Se ha asignado un técnico a la alerta ${id}`,
      severity: "success",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Baja":
        return "success";
      case "Media":
        return "warning";
      case "Alta":
        return "danger";
      case "Crítica":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "warning";
      case "En atención":
        return "primary";
      case "Programado":
        return "secondary";
      case "Resuelto":
        return "success";
      default:
        return "default";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "Falla mecánica":
        return "lucide:wrench";
      case "Falla eléctrica":
        return "lucide:zap";
      case "Mantenimiento programado":
        return "lucide:calendar";
      case "Persona atrapada":
        return "lucide:user";
      default:
        return "lucide:alert-triangle";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Alertas de Ascensores</h2>
          <p className="text-small text-default-500">Monitoreo en tiempo real</p>
        </div>
        <Badge content={alertsData.length} color="danger" size="md">
          <Button isIconOnly variant="light" aria-label="Refrescar alertas">
            <Icon icon="lucide:refresh-cw" width={20} />
          </Button>
        </Badge>
      </CardHeader>
      <CardBody>
        <div className="space-y-4 max-h-[400px] overflow-auto">
          {alertsData.map((alert) => (
            <Card key={alert.id} className="w-full p-3 border border-divider">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-md bg-${getSeverityColor(alert.severity)}-100`}>
                  <Icon 
                    icon={getAlertIcon(alert.type)} 
                    className={`text-${getSeverityColor(alert.severity)}`} 
                    width={24} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{alert.elevator} - {alert.type}</h3>
                      <p className="text-small text-default-500">{alert.location}</p>
                    </div>
                    <Chip color={getStatusColor(alert.status) as any} size="sm">{alert.status}</Chip>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Icon icon="lucide:clock" className="text-default-500" width={14} />
                    <span className="text-tiny text-default-500">{alert.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Icon icon="lucide:alert-triangle" className="text-default-500" width={14} />
                    <span className="text-tiny text-default-500">Severidad: </span>
                    <Badge color={getSeverityColor(alert.severity) as any} size="sm">{alert.severity}</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="flat" color="primary" onPress={() => handleAssignTechnician(alert.id)}>
                      Asignar técnico
                    </Button>
                    <Button size="sm" color="success" onPress={() => handleResolveAlert(alert.id)}>
                      Resolver
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};