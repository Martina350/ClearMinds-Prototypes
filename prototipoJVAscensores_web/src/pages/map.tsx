import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Select, SelectItem, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { MapView } from "../components/map-view";

export const MapPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("tiempo-real");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Mapa de Ascensores</h1>
        <div className="flex gap-2">
          <Select
            placeholder="Filtrar por zona"
            className="w-40"
          >
            <SelectItem key="all" value="all">Todas las zonas</SelectItem>
            <SelectItem key="norte" value="norte">Norte</SelectItem>
            <SelectItem key="sur" value="sur">Sur</SelectItem>
            <SelectItem key="este" value="este">Este</SelectItem>
            <SelectItem key="oeste" value="oeste">Oeste</SelectItem>
          </Select>
          <Button color="primary" startContent={<Icon icon="lucide:refresh-cw" />}>
            Actualizar
          </Button>
        </div>
      </div>
      
      <Tabs 
        aria-label="Opciones de mapa" 
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
        className="w-full"
      >
        <Tab key="tiempo-real" title="Tiempo Real">
          <Card className="mt-4">
            <CardBody>
              <MapView />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="rutas" title="Rutas Optimizadas">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Rutas Optimizadas</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/4">
                  <Card className="p-4">
                    <h3 className="text-medium font-semibold mb-2">Filtros de Ruta</h3>
                    <div className="space-y-4">
                      <Select label="Técnico">
                        <SelectItem key="all" value="all">Todos los técnicos</SelectItem>
                        <SelectItem key="E001" value="E001">Juan Pérez</SelectItem>
                        <SelectItem key="E002" value="E002">María López</SelectItem>
                        <SelectItem key="E003" value="E003">Carlos Mendez</SelectItem>
                        <SelectItem key="E004" value="E004">Ana Gómez</SelectItem>
                      </Select>
                      <Select label="Fecha">
                        <SelectItem key="today" value="today">Hoy</SelectItem>
                        <SelectItem key="tomorrow" value="tomorrow">Mañana</SelectItem>
                        <SelectItem key="week" value="week">Esta semana</SelectItem>
                      </Select>
                      <Select label="Tipo de mantenimiento">
                        <SelectItem key="all" value="all">Todos</SelectItem>
                        <SelectItem key="preventivo" value="preventivo">Preventivo</SelectItem>
                        <SelectItem key="correctivo" value="correctivo">Correctivo</SelectItem>
                        <SelectItem key="emergencia" value="emergencia">Emergencia</SelectItem>
                      </Select>
                      <Button color="primary" fullWidth>
                        Aplicar Filtros
                      </Button>
                      <Button color="default" variant="flat" fullWidth>
                        Restablecer
                      </Button>
                    </div>
                  </Card>
                </div>
                
                <div className="md:w-3/4">
                  <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: "url(https://img.heroui.chat/image/dashboard?w=1200&h=600&u=4)"
                      }}
                    >
                      {/* Route visualization would go here */}
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
                      
                      <div className="absolute bottom-2 left-2 p-2 bg-white/80 backdrop-blur-sm rounded-md">
                        <div className="text-tiny font-medium mb-1">Leyenda</div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-tiny">Ruta actual</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-success"></div>
                            <span className="text-tiny">Completado</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-warning"></div>
                            <span className="text-tiny">Pendiente</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-danger"></div>
                            <span className="text-tiny">Emergencia</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-md">
                        <Button color="primary" startContent={<Icon icon="lucide:route" />}>
                          Optimizar Ruta
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="historico" title="Histórico de Ubicaciones">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Histórico de Ubicaciones</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/4">
                  <Card className="p-4">
                    <h3 className="text-medium font-semibold mb-2">Filtros de Histórico</h3>
                    <div className="space-y-4">
                      <Select label="Técnico">
                        <SelectItem key="all" value="all">Todos los técnicos</SelectItem>
                        <SelectItem key="E001" value="E001">Juan Pérez</SelectItem>
                        <SelectItem key="E002" value="E002">María López</SelectItem>
                        <SelectItem key="E003" value="E003">Carlos Mendez</SelectItem>
                        <SelectItem key="E004" value="E004">Ana Gómez</SelectItem>
                      </Select>
                      <Input
                        type="date"
                        label="Fecha desde"
                      />
                      <Input
                        type="date"
                        label="Fecha hasta"
                      />
                      <Select label="Tipo de evento">
                        <SelectItem key="all" value="all">Todos</SelectItem>
                        <SelectItem key="llegada" value="llegada">Llegada</SelectItem>
                        <SelectItem key="salida" value="salida">Salida</SelectItem>
                        <SelectItem key="emergencia" value="emergencia">Emergencia</SelectItem>
                      </Select>
                      <Button color="primary" fullWidth>
                        Buscar
                      </Button>
                    </div>
                  </Card>
                </div>
                
                <div className="md:w-3/4">
                  <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: "url(https://img.heroui.chat/image/dashboard?w=1200&h=600&u=5)"
                      }}
                    >
                      {/* Historical map visualization would go here */}
                      <div className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-md">
                        <div className="flex items-center gap-2">
                          <Button size="sm" color="primary">
                            Reproducir
                          </Button>
                          <Button isIconOnly size="sm" variant="flat">
                            <Icon icon="lucide:pause" width={16} />
                          </Button>
                          <Button isIconOnly size="sm" variant="flat">
                            <Icon icon="lucide:skip-forward" width={16} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-2 left-2 p-2 bg-white/80 backdrop-blur-sm rounded-md">
                        <div className="text-tiny font-medium mb-1">Leyenda</div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-tiny">Ubicación inicial</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-success"></div>
                            <span className="text-tiny">Llegada</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-warning"></div>
                            <span className="text-tiny">Salida</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-danger"></div>
                            <span className="text-tiny">Emergencia</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-md">
                        <Button color="primary" startContent={<Icon icon="lucide:download" />}>
                          Exportar Datos
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};