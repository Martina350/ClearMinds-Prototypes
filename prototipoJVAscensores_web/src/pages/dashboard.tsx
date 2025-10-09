import React from "react";
import { Card, CardHeader, CardBody, Progress, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export const DashboardPage: React.FC = () => {
  // Sample data for dashboard
  const stats = [
    { 
      title: "Mantenimientos Programados", 
      value: 24, 
      icon: "lucide:calendar", 
      color: "blue",
      bgColor: "#07ADDB",
      change: "+12%",
      changeType: "positive"
    },
    { 
      title: "Mantenimientos Completados", 
      value: 18, 
      icon: "lucide:check-circle", 
      color: "green",
      bgColor: "#ABD9D3",
      change: "+8%",
      changeType: "positive"
    },
    { 
      title: "Alertas Activas", 
      value: 7, 
      icon: "lucide:alert-triangle", 
      color: "orange",
      bgColor: "#f59e0b",
      change: "-3%",
      changeType: "negative"
    },
    { 
      title: "Técnicos Activos", 
      value: 6, 
      icon: "lucide:users", 
      color: "purple",
      bgColor: "#4F90DB",
      change: "+2%",
      changeType: "positive"
    },
  ];

  const recentActivities = [
    { id: 1, action: "Mantenimiento completado", elevator: "A101", technician: "Juan Pérez", time: "Hace 30 minutos", type: "success" },
    { id: 2, action: "Nueva alerta", elevator: "B205", technician: "-", time: "Hace 1 hora", type: "warning" },
    { id: 3, action: "Técnico asignado", elevator: "C310", technician: "María López", time: "Hace 2 horas", type: "info" },
    { id: 4, action: "Mantenimiento reprogramado", elevator: "D405", technician: "Carlos Mendez", time: "Hace 3 horas", type: "secondary" },
  ];

  const quickActions = [
    { title: "Nuevo Mantenimiento", icon: "lucide:plus", color: "blue", bgColor: "#07ADDB" },
    { title: "Registrar Emergencia", icon: "lucide:alert-triangle", color: "orange", bgColor: "#f59e0b" },
    { title: "Generar Reporte", icon: "lucide:file-text", color: "green", bgColor: "#ABD9D3" },
    { title: "Asignar Técnico", icon: "lucide:users", color: "purple", bgColor: "#4F90DB" },
  ];

  return (
    <div className="space-y-8 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Dashboard</h1>
          <p className="text-slate-600">Resumen general del sistema de mantenimiento</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="btn-modern bg-[#07ADDB] text-white hover:bg-[#076ADB]"
            startContent={<Icon icon="lucide:refresh-cw" width={16} />}
          >
            Actualizar
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="card-modern p-6 animate-fade-in-up" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</p>
                <div className="flex items-center">
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl shadow-lg" style={{ backgroundColor: stat.bgColor }}>
                <Icon icon={stat.icon} className="text-white" width={28} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="card-modern">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#07ADDB]">
                <Icon icon="lucide:trending-up" className="text-white" width={20} />
              </div>
              <h2 className="text-xl font-semibold">Cumplimiento de Mantenimientos</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Preventivos</span>
                  <span className="text-sm font-bold text-blue-600">85%</span>
                </div>
                <Progress 
                  value={85} 
                  color="primary" 
                  className="h-3"
                  classNames={{
                    track: "bg-blue-100",
                    indicator: "bg-[#07ADDB]"
                  }}
                />
                <p className="text-xs text-slate-500 mt-1">68 de 80 completados</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Correctivos</span>
                  <span className="text-sm font-bold text-orange-600">70%</span>
                </div>
                <Progress 
                  value={70} 
                  color="warning" 
                  className="h-3"
                  classNames={{
                    track: "bg-orange-100",
                    indicator: "bg-orange-500"
                  }}
                />
                <p className="text-xs text-slate-500 mt-1">21 de 30 completados</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Emergencias</span>
                  <span className="text-sm font-bold text-green-600">95%</span>
                </div>
                <Progress 
                  value={95} 
                  color="success" 
                  className="h-3"
                  classNames={{
                    track: "bg-green-100",
                    indicator: "bg-green-500"
                  }}
                />
                <p className="text-xs text-slate-500 mt-1">19 de 20 completados</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="card-modern">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#ABD9D3]">
                <Icon icon="lucide:activity" className="text-white" width={20} />
              </div>
              <h2 className="text-xl font-semibold">Actividad Reciente</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`p-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-100' :
                    activity.type === 'warning' ? 'bg-orange-100' :
                    activity.type === 'info' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <Icon 
                      icon="lucide:activity" 
                      className={`${
                        activity.type === 'success' ? 'text-green-600' :
                        activity.type === 'warning' ? 'text-orange-600' :
                        activity.type === 'info' ? 'text-blue-600' : 'text-purple-600'
                      }`} 
                      width={16} 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Ascensor: {activity.elevator} {activity.technician !== "-" && `• Técnico: ${activity.technician}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};