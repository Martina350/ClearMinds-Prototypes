import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge, Switch, Slider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AlertsPanel } from "../components/alerts-panel";

export const AlertsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("activas");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Alertas y Emergencias</h1>
        <Button color="danger" startContent={<Icon icon="lucide:alert-triangle" />}>
          Nueva Emergencia
        </Button>
      </div>
      
      <Tabs 
        aria-label="Opciones de alertas" 
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
        className="w-full"
      >
        <Tab key="activas" title="Alertas Activas">
          <Card className="mt-4">
            <CardBody>
              <AlertsPanel />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="historial" title="Historial de Alertas">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Historial de Alertas</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <Input
                  placeholder="Buscar por ID, ascensor, ubicación..."
                  startContent={<Icon icon="lucide:search" className="text-default-400" width={16} />}
                  className="flex-1"
                />
                <Select
                  placeholder="Filtrar por tipo"
                  className="w-full md:w-48"
                >
                  <SelectItem key="all" value="all">Todos</SelectItem>
                  <SelectItem key="mecanica" value="mecanica">Falla mecánica</SelectItem>
                  <SelectItem key="electrica" value="electrica">Falla eléctrica</SelectItem>
                  <SelectItem key="atrapado" value="atrapado">Persona atrapada</SelectItem>
                </Select>
                <Input
                  type="date"
                  placeholder="Fecha desde"
                  className="w-full md:w-48"
                />
                <Input
                  type="date"
                  placeholder="Fecha hasta"
                  className="w-full md:w-48"
                />
              </div>
              
              <Table 
                aria-label="Historial de alertas"
                removeWrapper
              >
                <TableHeader>
                  <TableColumn>ID</TableColumn>
                  <TableColumn>ASCENSOR</TableColumn>
                  <TableColumn>TIPO</TableColumn>
                  <TableColumn>SEVERIDAD</TableColumn>
                  <TableColumn>FECHA</TableColumn>
                  <TableColumn>ESTADO</TableColumn>
                  <TableColumn>TIEMPO RESOLUCIÓN</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>A001</TableCell>
                    <TableCell>A101</TableCell>
                    <TableCell>Falla mecánica</TableCell>
                    <TableCell><Badge color="warning">Alta</Badge></TableCell>
                    <TableCell>15/10/2023 14:30</TableCell>
                    <TableCell><Badge color="success">Resuelto</Badge></TableCell>
                    <TableCell>45 min</TableCell>
                    <TableCell>
                      <Button isIconOnly size="sm" variant="light" aria-label="Ver detalles">
                        <Icon icon="lucide:eye" width={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>A002</TableCell>
                    <TableCell>B205</TableCell>
                    <TableCell>Falla eléctrica</TableCell>
                    <TableCell><Badge color="danger">Crítica</Badge></TableCell>
                    <TableCell>15/10/2023 13:15</TableCell>
                    <TableCell><Badge color="success">Resuelto</Badge></TableCell>
                    <TableCell>1h 20min</TableCell>
                    <TableCell>
                      <Button isIconOnly size="sm" variant="light" aria-label="Ver detalles">
                        <Icon icon="lucide:eye" width={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>A005</TableCell>
                    <TableCell>D405</TableCell>
                    <TableCell>Persona atrapada</TableCell>
                    <TableCell><Badge color="danger">Crítica</Badge></TableCell>
                    <TableCell>14/10/2023 09:45</TableCell>
                    <TableCell><Badge color="success">Resuelto</Badge></TableCell>
                    <TableCell>25 min</TableCell>
                    <TableCell>
                      <Button isIconOnly size="sm" variant="light" aria-label="Ver detalles">
                        <Icon icon="lucide:eye" width={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="configuracion" title="Configuración de Alertas">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Configuración de Alertas</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-medium font-semibold mb-4">Notificaciones</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Alertas por correo electrónico</p>
                        <p className="text-tiny text-default-500">Recibir alertas por correo electrónico</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Alertas por SMS</p>
                        <p className="text-tiny text-default-500">Recibir alertas por mensaje de texto</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Notificaciones push</p>
                        <p className="text-tiny text-default-500">Recibir notificaciones en la aplicación</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Alertas de emergencia</p>
                        <p className="text-tiny text-default-500">Recibir alertas de emergencia inmediatamente</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-medium font-semibold mb-4">Umbrales de Alerta</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-small">Tiempo de respuesta (emergencia)</span>
                        <span className="text-small font-semibold">15 min</span>
                      </div>
                      <Slider 
                        defaultValue={15}
                        minValue={5}
                        maxValue={60}
                        step={5}
                        className="max-w-md"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-small">Tiempo de respuesta (alta prioridad)</span>
                        <span className="text-small font-semibold">30 min</span>
                      </div>
                      <Slider 
                        defaultValue={30}
                        minValue={15}
                        maxValue={120}
                        step={15}
                        className="max-w-md"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-small">Tiempo de respuesta (media prioridad)</span>
                        <span className="text-small font-semibold">2 horas</span>
                      </div>
                      <Slider 
                        defaultValue={120}
                        minValue={60}
                        maxValue={480}
                        step={30}
                        className="max-w-md"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-small">Radio de geolocalización</span>
                        <span className="text-small font-semibold">100 m</span>
                      </div>
                      <Slider 
                        defaultValue={100}
                        minValue={50}
                        maxValue={500}
                        step={50}
                        className="max-w-md"
                      />
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