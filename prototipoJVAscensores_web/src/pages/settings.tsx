import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Input, Select, SelectItem, Switch, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/react";

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("general");
  
  const handleSaveSettings = () => {
    addToast({
      title: "Configuración guardada",
      description: "Los cambios han sido guardados correctamente",
      severity: "success",
    });
  };

  return (
    <div className="space-y-8 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Configuración del Sistema</h1>
          <p className="text-slate-600">Administre la configuración general y parámetros del sistema</p>
        </div>
        <Button 
          color="primary" 
          className="btn-modern"
          startContent={<Icon icon="lucide:save" width={16} />} 
          onPress={handleSaveSettings}
        >
          Guardar Cambios
        </Button>
      </div>
      
      <Tabs 
        aria-label="Opciones de configuración" 
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
        className="w-full"
        classNames={{
          tabList: "bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-1",
          tab: "data-[selected=true]:bg-[#07ADDB] data-[selected=true]:text-white",
          cursor: "hidden"
        }}
      >
        <Tab 
          key="general" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:settings" width={16} />
              <span>General</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#07ADDB]">
                  <Icon icon="lucide:settings" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Configuración General</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    label="Nombre de la Empresa"
                    defaultValue="JBA ASENSORES"
                    className="input-modern"
                    startContent={<Icon icon="lucide:building" width={16} className="text-slate-400" />}
                  />
                  <Input
                    label="Correo Electrónico Principal"
                    defaultValue="contacto@jbaasensores.com"
                    type="email"
                    className="input-modern"
                    startContent={<Icon icon="lucide:mail" width={16} className="text-slate-400" />}
                  />
                  <Input
                    label="Teléfono"
                    defaultValue="+1 234 567 890"
                    className="input-modern"
                    startContent={<Icon icon="lucide:phone" width={16} className="text-slate-400" />}
                  />
                  <Input
                    label="Dirección"
                    defaultValue="Av. Principal 123, Ciudad"
                    className="input-modern"
                    startContent={<Icon icon="lucide:map-pin" width={16} className="text-slate-400" />}
                  />
                  <Select
                    label="Zona Horaria"
                    defaultSelectedKeys={["utc-5"]}
                  >
                    <SelectItem key="utc-5">UTC-5 (Hora del Este)</SelectItem>
                    <SelectItem key="utc-6">UTC-6 (Hora Central)</SelectItem>
                    <SelectItem key="utc-7">UTC-7 (Hora de la Montaña)</SelectItem>
                    <SelectItem key="utc-8">UTC-8 (Hora del Pacífico)</SelectItem>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Notificaciones por correo</p>
                      <p className="text-tiny text-default-500">Enviar notificaciones por correo electrónico</p>
                    </div>
                    <Switch defaultSelected />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Notificaciones push</p>
                      <p className="text-tiny text-default-500">Enviar notificaciones push a la aplicación móvil</p>
                    </div>
                    <Switch defaultSelected />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Enviar reportes a clientes</p>
                      <p className="text-tiny text-default-500">Enviar automáticamente reportes a los clientes</p>
                    </div>
                    <Switch defaultSelected />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Modo oscuro</p>
                      <p className="text-tiny text-default-500">Activar modo oscuro en la interfaz</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Modo de mantenimiento</p>
                      <p className="text-tiny text-default-500">Activar modo de mantenimiento del sistema</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab 
          key="usuarios" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:users" width={16} />
              <span>Usuarios y Permisos</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#ABD9D3]">
                    <Icon icon="lucide:users" className="text-white" width={20} />
                  </div>
                  <h2 className="text-xl font-semibold">Usuarios y Permisos</h2>
                </div>
                <Button 
                  color="primary" 
                  className="btn-modern"
                  startContent={<Icon icon="lucide:user-plus" width={16} />}
                >
                  Nuevo Usuario
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="table-modern">
                <Table 
                  aria-label="Usuarios y permisos"
                  removeWrapper
                  classNames={{
                    wrapper: "min-h-[400px]",
                    th: "bg-slate-50 text-slate-700 font-semibold",
                    td: "border-b border-slate-100"
                  }}
                >
                <TableHeader>
                  <TableColumn>USUARIO</TableColumn>
                  <TableColumn>CORREO</TableColumn>
                  <TableColumn>ROL</TableColumn>
                  <TableColumn>ÚLTIMO ACCESO</TableColumn>
                  <TableColumn>ESTADO</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <Icon icon="lucide:user" width={16} />
                        </div>
                        <span>Admin</span>
                      </div>
                    </TableCell>
                    <TableCell>admin@jbaasensores.com</TableCell>
                    <TableCell><Badge color="primary">Administrador</Badge></TableCell>
                    <TableCell>Hoy, 10:30</TableCell>
                    <TableCell><Badge color="success">Activo</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button isIconOnly size="sm" variant="light" aria-label="Editar">
                          <Icon icon="lucide:edit" width={16} />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" aria-label="Eliminar">
                          <Icon icon="lucide:trash" width={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <Icon icon="lucide:user" width={16} />
                        </div>
                        <span>Supervisor</span>
                      </div>
                    </TableCell>
                    <TableCell>supervisor@jbaasensores.com</TableCell>
                    <TableCell><Badge color="secondary">Supervisor</Badge></TableCell>
                    <TableCell>Ayer, 15:45</TableCell>
                    <TableCell><Badge color="success">Activo</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button isIconOnly size="sm" variant="light" aria-label="Editar">
                          <Icon icon="lucide:edit" width={16} />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" aria-label="Eliminar">
                          <Icon icon="lucide:trash" width={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <Icon icon="lucide:user" width={16} />
                        </div>
                        <span>Operador</span>
                      </div>
                    </TableCell>
                    <TableCell>operador@jbaasensores.com</TableCell>
                    <TableCell><Badge color="default">Operador</Badge></TableCell>
                    <TableCell>15/10/2023, 09:20</TableCell>
                    <TableCell><Badge color="success">Activo</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button isIconOnly size="sm" variant="light" aria-label="Editar">
                          <Icon icon="lucide:edit" width={16} />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" aria-label="Eliminar">
                          <Icon icon="lucide:trash" width={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab 
          key="notificaciones" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:bell" width={16} />
              <span>Notificaciones</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-orange-500">
                  <Icon icon="lucide:bell" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Configuración de Notificaciones</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-modern p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#07ADDB]">
                      <Icon icon="lucide:mail" className="text-white" width={16} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Notificaciones por Correo</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Nuevos mantenimientos</p>
                        <p className="text-tiny text-default-500">Notificar cuando se crea un nuevo mantenimiento</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Mantenimientos completados</p>
                        <p className="text-tiny text-default-500">Notificar cuando se completa un mantenimiento</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Alertas de emergencia</p>
                        <p className="text-tiny text-default-500">Notificar cuando se registra una emergencia</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Reportes diarios</p>
                        <p className="text-tiny text-default-500">Enviar resumen diario de actividades</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Reportes semanales</p>
                        <p className="text-tiny text-default-500">Enviar resumen semanal de actividades</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-medium font-semibold mb-4">Notificaciones Push</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Nuevas asignaciones</p>
                        <p className="text-tiny text-default-500">Notificar cuando se asigna un nuevo mantenimiento</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Cambios de horario</p>
                        <p className="text-tiny text-default-500">Notificar cuando cambia el horario de un mantenimiento</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Emergencias</p>
                        <p className="text-tiny text-default-500">Notificar cuando se registra una emergencia</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Recordatorios</p>
                        <p className="text-tiny text-default-500">Enviar recordatorios de mantenimientos próximos</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Actualizaciones del sistema</p>
                        <p className="text-tiny text-default-500">Notificar sobre actualizaciones del sistema</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 md:col-span-2">
                  <h3 className="text-medium font-semibold mb-4">Plantillas de Correo</h3>
                  <div className="space-y-4">
                    <Select
                      label="Plantilla"
                      className="mb-4"
                    >
                      <SelectItem key="new_maintenance">Nuevo Mantenimiento</SelectItem>
                      <SelectItem key="completed_maintenance">Mantenimiento Completado</SelectItem>
                      <SelectItem key="emergency_alert">Alerta de Emergencia</SelectItem>
                      <SelectItem key="daily_report">Reporte Diario</SelectItem>
                      <SelectItem key="weekly_report">Reporte Semanal</SelectItem>
                    </Select>
                    <Input
                      label="Asunto"
                      defaultValue="Reporte de Mantenimiento - JBA ASENSORES"
                    />
                    <div>
                      <p className="text-small mb-2">Contenido</p>
                      <div className="border border-divider rounded-medium p-4 min-h-[200px]">
                        <p>Estimado/a [NOMBRE_CLIENTE],</p>
                        <br />
                        <p>Adjunto encontrará el reporte del mantenimiento realizado en su ascensor [ID_ASCENSOR] el día [FECHA_MANTENIMIENTO].</p>
                        <br />
                        <p>El técnico [NOMBRE_TECNICO] realizó las siguientes actividades:</p>
                        <br />
                        <p>[LISTA_ACTIVIDADES]</p>
                        <br />
                        <p>Observaciones: [OBSERVACIONES]</p>
                        <br />
                        <p>Atentamente,</p>
                        <p>Equipo de JBA ASENSORES</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button color="default" variant="flat">
                        Restablecer
                      </Button>
                      <Button color="primary">
                        Guardar Plantilla
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="sistema" title="Sistema">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Configuración del Sistema</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-medium font-semibold mb-4">Parámetros Generales</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">Radio de geolocalización</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="100"
                          className="w-24"
                        />
                        <span>metros</span>
                      </div>
                      <p className="text-tiny text-default-500 mt-1">Radio para validar la presencia en el sitio</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Tiempo mínimo entre mantenimientos</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="30"
                          className="w-24"
                        />
                        <span>días</span>
                      </div>
                      <p className="text-tiny text-default-500 mt-1">Tiempo mínimo entre mantenimientos preventivos</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Tiempo de respuesta para emergencias</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="60"
                          className="w-24"
                        />
                        <span>minutos</span>
                      </div>
                      <p className="text-tiny text-default-500 mt-1">Tiempo máximo de respuesta para emergencias</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Días de anticipación para notificaciones</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="3"
                          className="w-24"
                        />
                        <span>días</span>
                      </div>
                      <p className="text-tiny text-default-500 mt-1">Días de anticipación para notificar mantenimientos programados</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-medium font-semibold mb-4">Optimización de Rutas</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">Prioridad de optimización</p>
                      <Select defaultSelectedKeys={["distance"]}>
                        <SelectItem key="distance">Distancia (minimizar desplazamientos)</SelectItem>
                        <SelectItem key="time">Tiempo (minimizar tiempo total)</SelectItem>
                        <SelectItem key="priority">Prioridad del cliente</SelectItem>
                      </Select>
                      <p className="text-tiny text-default-500 mt-1">Factor principal para optimizar rutas</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Máximo de mantenimientos por día</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="8"
                          className="w-24"
                        />
                        <span>mantenimientos</span>
                      </div>
                      <p className="text-tiny text-default-500 mt-1">Número máximo de mantenimientos por técnico al día</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Tiempo de desplazamiento estimado</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="30"
                          className="w-24"
                        />
                        <span>minutos</span>
                      </div>
                      <p className="text-tiny text-default-500 mt-1">Tiempo promedio de desplazamiento entre ubicaciones</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Considerar tráfico en tiempo real</p>
                        <p className="text-tiny text-default-500">Utilizar datos de tráfico para optimizar rutas</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 md:col-span-2">
                  <h3 className="text-medium font-semibold mb-4">Copias de Seguridad y Mantenimiento</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Copias de seguridad automáticas</p>
                        <p className="text-tiny text-default-500">Realizar copias de seguridad automáticas</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Frecuencia de copias de seguridad</p>
                      <Select defaultSelectedKeys={["daily"]}>
                        <SelectItem key="daily">Diaria</SelectItem>
                        <SelectItem key="weekly">Semanal</SelectItem>
                        <SelectItem key="monthly">Mensual</SelectItem>
                      </Select>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Retención de datos</p>
                      <Select defaultSelectedKeys={["1year"]}>
                        <SelectItem key="6months">6 meses</SelectItem>
                        <SelectItem key="1year">1 año</SelectItem>
                        <SelectItem key="2years">2 años</SelectItem>
                        <SelectItem key="5years">5 años</SelectItem>
                      </Select>
                      <p className="text-tiny text-default-500 mt-1">Tiempo de retención de datos históricos</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button color="primary" startContent={<Icon icon="lucide:download" />}>
                        Descargar Copia de Seguridad
                      </Button>
                      <Button color="danger" variant="flat" startContent={<Icon icon="lucide:refresh-cw" />}>
                        Restaurar Sistema
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};