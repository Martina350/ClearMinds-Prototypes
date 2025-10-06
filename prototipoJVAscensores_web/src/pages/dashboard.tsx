import React from "react";
import { Card, CardHeader, CardBody, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";

export const DashboardPage: React.FC = () => {
  // Sample data for dashboard
  const stats = [
    { title: "Mantenimientos Programados", value: 24, icon: "lucide:calendar", color: "primary" },
    { title: "Mantenimientos Completados", value: 18, icon: "lucide:check-circle", color: "success" },
    { title: "Alertas Activas", value: 7, icon: "lucide:alert-triangle", color: "warning" },
    { title: "Técnicos Activos", value: 6, icon: "lucide:users", color: "secondary" },
  ];

  const recentActivities = [
    { id: 1, action: "Mantenimiento completado", elevator: "A101", technician: "Juan Pérez", time: "Hace 30 minutos" },
    { id: 2, action: "Nueva alerta", elevator: "B205", technician: "-", time: "Hace 1 hora" },
    { id: 3, action: "Técnico asignado", elevator: "C310", technician: "María López", time: "Hace 2 horas" },
    { id: 4, action: "Mantenimiento reprogramado", elevator: "D405", technician: "Carlos Mendez", time: "Hace 3 horas" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-default-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-full bg-${stat.color}-100`}>
                <Icon icon={stat.icon} className={`text-${stat.color}`} width={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Cumplimiento de Mantenimientos</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-small">Preventivos</span>
                  <span className="text-small font-semibold">85%</span>
                </div>
                <Progress value={85} color="primary" className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-small">Correctivos</span>
                  <span className="text-small font-semibold">70%</span>
                </div>
                <Progress value={70} color="secondary" className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-small">Emergencias</span>
                  <span className="text-small font-semibold">95%</span>
                </div>
                <Progress value={95} color="success" className="h-2" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Actividad Reciente</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2 pb-2 border-b border-divider last:border-0">
                  <div className="p-1 rounded-full bg-primary-100">
                    <Icon icon="lucide:activity" className="text-primary" width={16} />
                  </div>
                  <div>
                    <p className="text-small font-medium">{activity.action}</p>
                    <p className="text-tiny text-default-500">
                      Ascensor: {activity.elevator} {activity.technician !== "-" && `• Técnico: ${activity.technician}`}
                    </p>
                    <p className="text-tiny text-default-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Acciones Rápidas</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-default-100">
              <div className="p-2 rounded-full bg-primary-100 mb-2">
                <Icon icon="lucide:plus" className="text-primary" width={20} />
              </div>
              <p className="text-small font-medium text-center">Nuevo Mantenimiento</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-default-100">
              <div className="p-2 rounded-full bg-warning-100 mb-2">
                <Icon icon="lucide:alert-triangle" className="text-warning" width={20} />
              </div>
              <p className="text-small font-medium text-center">Registrar Emergencia</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-default-100">
              <div className="p-2 rounded-full bg-success-100 mb-2">
                <Icon icon="lucide:file-text" className="text-success" width={20} />
              </div>
              <p className="text-small font-medium text-center">Generar Reporte</p>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-default-100">
              <div className="p-2 rounded-full bg-secondary-100 mb-2">
                <Icon icon="lucide:users" className="text-secondary" width={20} />
              </div>
              <p className="text-small font-medium text-center">Asignar Técnico</p>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};