import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/react";
import { MaintenanceTable } from "../components/maintenance-table";
// @ts-ignore - tipos omitidos hasta instalar dependencias
import { MapContainer, TileLayer, Polyline, CircleMarker, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const MaintenancePage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("programados");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTech, setSelectedTech] = React.useState<string>("E001");
  const [routesByTech, setRoutesByTech] = React.useState<Record<string, Array<[number, number]>>>({
    E001: [],
    E002: [],
    E003: [],
    E004: [],
  });
  const [techStatusById, setTechStatusById] = React.useState<Record<string, "Disponible" | "Ocupado">>({
    E001: "Disponible",
    E002: "Ocupado",
    E003: "Disponible",
    E004: "Disponible",
  });
  
  // Sample data for maintenance planning
  const technicians = [
    { id: "E001", name: "Juan Pérez", zone: "Norte", availability: "Disponible", color: "blue" },
    { id: "E002", name: "María López", zone: "Sur", availability: "Ocupado", color: "red" },
    { id: "E003", name: "Carlos Mendez", zone: "Este", availability: "Disponible", color: "green" },
    { id: "E004", name: "Ana Gómez", zone: "Oeste", availability: "Disponible", color: "purple" },
  ];

  const handleOptimizeRoute = () => {
    addToast({
      title: "Rutas optimizadas",
      description: "Se han optimizado las rutas de mantenimiento",
      severity: "success",
    });
  };

  // Quito center
  const quitoCenter: [number, number] = [-0.1807, -78.4678];

  const addWaypoint = (lat: number, lng: number) => {
    setRoutesByTech((prev) => ({
      ...prev,
      [selectedTech]: [...(prev[selectedTech] || []), [lat, lng]],
    }));
    setTechStatusById((prev) => ({ ...prev, [selectedTech]: "Ocupado" }));
  };

  const clearRoute = () => {
    setRoutesByTech((prev) => ({ ...prev, [selectedTech]: [] }));
    setTechStatusById((prev) => ({ ...prev, [selectedTech]: "Disponible" }));
  };

  const saveRoute = () => {
    const points = routesByTech[selectedTech] || [];
    addToast({
      title: "Ruta guardada",
      description: `${selectedTech} con ${points.length} puntos` ,
      severity: "success",
    });
  };

  return (
    <div className="space-y-8 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Planificación de Mantenimientos</h1>
          <p className="text-slate-600">Gestión de rutas, asignaciones y plantillas de mantenimiento</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            color="primary" 
            className="btn-modern"
            startContent={<Icon icon="lucide:plus" width={16} />} 
            onPress={onOpen}
          >
            Nuevo Mantenimiento
          </Button>
          <Button 
            color="secondary" 
            className="btn-modern"
            startContent={<Icon icon="lucide:route" width={16} />} 
            onPress={handleOptimizeRoute}
          >
            Optimizar Rutas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#07ADDB]">
              <Icon icon="lucide:calendar" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Programados</p>
              <p className="text-2xl font-bold text-slate-800">24</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#ABD9D3]">
              <Icon icon="lucide:check-circle" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Completados</p>
              <p className="text-2xl font-bold text-slate-800">18</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-orange-500">
              <Icon icon="lucide:users" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Técnicos Activos</p>
              <p className="text-2xl font-bold text-slate-800">6</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#4F90DB]">
              <Icon icon="lucide:route" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Rutas Activas</p>
              <p className="text-2xl font-bold text-slate-800">12</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Tabs 
        aria-label="Opciones de mantenimiento" 
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
          key="programados" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:calendar" width={16} />
              <span>Programados</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#07ADDB]">
                  <Icon icon="lucide:calendar" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Mantenimientos Programados</h2>
              </div>
            </CardHeader>
            <CardBody>
              <MaintenanceTable />
            </CardBody>
          </Card>
        </Tab>
        <Tab 
          key="rutas" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:route" width={16} />
              <span>Rutas y Asignaciones</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#ABD9D3]">
                    <Icon icon="lucide:route" className="text-white" width={20} />
                  </div>
                  <h2 className="text-xl font-semibold">Asignación de Técnicos y Rutas</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Select 
                    label="Técnico" 
                    selectedKeys={[selectedTech]} 
                    onSelectionChange={(k)=>setSelectedTech(Array.from(k as Set<string>)[0] || "E001")} 
                    className="input-modern min-w-48"
                    startContent={<Icon icon="lucide:user" width={16} className="text-slate-400" />}
                  >
                    {technicians.map((t)=> (
                      <SelectItem key={t.id}>{t.name}</SelectItem>
                    ))}
                  </Select>
                  <Button 
                    variant="flat" 
                    className="btn-modern"
                    onPress={clearRoute} 
                    startContent={<Icon icon="lucide:eraser" width={16} />}
                  >
                    Limpiar
                  </Button>
                  <Button 
                    color="primary" 
                    className="btn-modern"
                    onPress={saveRoute} 
                    startContent={<Icon icon="lucide:save" width={16} />}
                  >
                    Guardar Ruta
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <h3 className="text-lg font-semibold mb-4 text-slate-800">Técnicos Disponibles</h3>
                  <div className="space-y-3">
                    {technicians.map((tech, index) => (
                      <Card 
                        key={tech.id} 
                        className={`card-modern p-4 cursor-pointer transition-all duration-200 hover:scale-105 animate-fade-in-up ${
                          selectedTech === tech.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-slate-50"
                        }`} 
                        onClick={()=>setSelectedTech(tech.id)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${
                              tech.color === 'blue' ? 'bg-[#07ADDB]' :
                              tech.color === 'red' ? 'bg-red-500' :
                              tech.color === 'green' ? 'bg-[#ABD9D3]' :
                              'bg-[#4F90DB]'
                            }`}>
                              <Icon icon="lucide:user" width={18} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{tech.name}</p>
                              <p className="text-sm text-slate-600">Zona: {tech.zone}</p>
                            </div>
                          </div>
                          <Badge 
                            color={techStatusById[tech.id] === "Disponible" ? "success" : "warning"}
                            className="font-medium"
                          >
                            {techStatusById[tech.id]}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <h3 className="text-lg font-semibold mb-4 text-slate-800">Planificación de Rutas</h3>
                  <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-white/20">
                    <MapContainer center={quitoCenter} zoom={13} className="w-full h-full">
                      {(() => {
                        const Clicker: React.FC = () => {
                          // @ts-ignore
                          useMapEvent('click', (e:any) => addWaypoint(e.latlng.lat, e.latlng.lng));
                          return null;
                        };
                        return <Clicker />;
                      })()}
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                      {Object.entries(routesByTech).map(([id, points])=> (
                        <>
                          {points.length > 1 && (
                            <Polyline 
                              key={`pl-${id}`} 
                              positions={points} 
                              pathOptions={{ 
                                color: id === selectedTech ? "#2563eb" : "#94a3b8", 
                                weight: 5,
                                opacity: 0.8
                              }} 
                            />
                          )}
                          {points.map(([lat,lng], idx)=> (
                            <CircleMarker 
                              key={`pt-${id}-${idx}`} 
                              center={[lat,lng]} 
                              radius={8} 
                              pathOptions={{ 
                                color: id === selectedTech ? "#2563eb" : "#94a3b8", 
                                fillOpacity: 0.9,
                                weight: 2
                              }} 
                            />
                          ))}
                        </>
                      ))}
                    </MapContainer>
                    <div className="absolute bottom-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:info" width={16} className="text-blue-600" />
                        <div className="text-sm text-slate-700">
                          <p className="font-medium">Clic en el mapa para agregar puntos</p>
                          <p className="text-xs text-slate-500">Técnico seleccionado: {technicians.find(t => t.id === selectedTech)?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab 
          key="plantillas" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:file-text" width={16} />
              <span>Plantillas</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#4F90DB]">
                    <Icon icon="lucide:file-text" className="text-white" width={20} />
                  </div>
                  <h2 className="text-xl font-semibold">Plantillas de Actividades</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    placeholder="Buscar plantilla..." 
                    startContent={<Icon icon="lucide:search" className="text-slate-400" width={16} />}
                    className="input-modern w-full sm:w-64"
                  />
                  <Button 
                    color="primary" 
                    className="btn-modern"
                    startContent={<Icon icon="lucide:plus" width={16} />}
                  >
                    Nueva Plantilla
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="table-modern">
                <Table 
                  aria-label="Plantillas de actividades"
                  removeWrapper
                  classNames={{
                    wrapper: "min-h-[400px]",
                    th: "bg-slate-50 text-slate-700 font-semibold",
                    td: "border-b border-slate-100"
                  }}
                >
                  <TableHeader>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>CLIENTE</TableColumn>
                    <TableColumn>ITEMS</TableColumn>
                    <TableColumn>ÚLTIMA MODIFICACIÓN</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:file-text" className="text-blue-600" width={16} />
                          <span className="font-medium">Mantenimiento Preventivo Estándar</span>
                        </div>
                      </TableCell>
                      <TableCell>General</TableCell>
                      <TableCell>
                        <Badge color="primary" variant="flat">12 items</Badge>
                      </TableCell>
                      <TableCell>10/05/2023</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="hover:bg-blue-100"
                            aria-label="Editar"
                          >
                            <Icon icon="lucide:edit" width={16} className="text-blue-600" />
                          </Button>
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="hover:bg-green-100"
                            aria-label="Ver plantilla"
                            onPress={() => window.open('/archive/REPORTE VACIO 2025 (1).pdf', '_blank')}
                          >
                            <Icon icon="lucide:eye" width={16} className="text-green-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:file-text" className="text-orange-600" width={16} />
                          <span className="font-medium">Mantenimiento Ministerio</span>
                        </div>
                      </TableCell>
                      <TableCell>Ministerio de Salud</TableCell>
                      <TableCell>
                        <Badge color="warning" variant="flat">18 items</Badge>
                      </TableCell>
                      <TableCell>15/04/2023</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="hover:bg-blue-100"
                            aria-label="Editar"
                          >
                            <Icon icon="lucide:edit" width={16} className="text-blue-600" />
                          </Button>
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="hover:bg-green-100"
                            aria-label="Ver plantilla"
                          >
                            <Icon icon="lucide:eye" width={16} className="text-green-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:file-text" className="text-red-600" width={16} />
                          <span className="font-medium">Mantenimiento Correctivo</span>
                        </div>
                      </TableCell>
                      <TableCell>General</TableCell>
                      <TableCell>
                        <Badge color="danger" variant="flat">8 items</Badge>
                      </TableCell>
                      <TableCell>22/03/2023</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="hover:bg-blue-100"
                            aria-label="Editar"
                          >
                            <Icon icon="lucide:edit" width={16} className="text-blue-600" />
                          </Button>
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="hover:bg-green-100"
                            aria-label="Ver plantilla"
                          >
                            <Icon icon="lucide:eye" width={16} className="text-green-600" />
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
      </Tabs>
      
      {/* New Maintenance Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="2xl"
        classNames={{
          base: "bg-white/95 backdrop-blur-md border border-white/20",
          header: "border-b border-slate-200",
          body: "py-6",
          footer: "border-t border-slate-200"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#07ADDB]">
                    <Icon icon="lucide:plus" className="text-white" width={20} />
                  </div>
                  <h3 className="text-xl font-semibold">Nuevo Mantenimiento</h3>
                </div>
                <p className="text-sm text-slate-600">Complete la información para programar un nuevo mantenimiento</p>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select 
                    label="Tipo de Mantenimiento"
                    className="input-modern"
                    startContent={<Icon icon="lucide:wrench" width={16} className="text-slate-400" />}
                  >
                    <SelectItem key="preventivo">Preventivo</SelectItem>
                    <SelectItem key="correctivo">Correctivo</SelectItem>
                    <SelectItem key="emergencia">Emergencia</SelectItem>
                  </Select>
                  <Select 
                    label="Cliente"
                    className="input-modern"
                    startContent={<Icon icon="lucide:building" width={16} className="text-slate-400" />}
                  >
                    <SelectItem key="1">Edificio Torre Norte</SelectItem>
                    <SelectItem key="2">Ministerio de Salud</SelectItem>
                    <SelectItem key="3">Centro Comercial Plaza</SelectItem>
                  </Select>
                  <Select 
                    label="Ascensor"
                    className="input-modern"
                    startContent={<Icon icon="lucide:elevator" width={16} className="text-slate-400" />}
                  >
                    <SelectItem key="A101">A101</SelectItem>
                    <SelectItem key="B205">B205</SelectItem>
                    <SelectItem key="C310">C310</SelectItem>
                  </Select>
                  <Select 
                    label="Técnico"
                    className="input-modern"
                    startContent={<Icon icon="lucide:user" width={16} className="text-slate-400" />}
                  >
                    <SelectItem key="E001">Juan Pérez</SelectItem>
                    <SelectItem key="E002">María López</SelectItem>
                    <SelectItem key="E003">Carlos Mendez</SelectItem>
                  </Select>
                  <Input
                    type="date"
                    label="Fecha"
                    className="input-modern"
                    startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
                  />
                  <Input
                    type="time"
                    label="Hora"
                    className="input-modern"
                    startContent={<Icon icon="lucide:clock" width={16} className="text-slate-400" />}
                  />
                  <Select 
                    label="Plantilla de Actividades" 
                    className="input-modern col-span-full"
                    startContent={<Icon icon="lucide:file-text" width={16} className="text-slate-400" />}
                  >
                    <SelectItem key="1">Mantenimiento Preventivo Estándar</SelectItem>
                    <SelectItem key="2">Mantenimiento Ministerio</SelectItem>
                    <SelectItem key="3">Mantenimiento Correctivo</SelectItem>
                  </Select>
                  <Input
                    label="Observaciones"
                    placeholder="Ingrese observaciones adicionales"
                    className="input-modern col-span-full"
                    startContent={<Icon icon="lucide:message-square" width={16} className="text-slate-400" />}
                  />
                </div>
              </ModalBody>
              <ModalFooter className="pt-4">
                <Button 
                  color="danger" 
                  variant="light" 
                  className="btn-modern"
                  onPress={onClose}
                  startContent={<Icon icon="lucide:x" width={16} />}
                >
                  Cancelar
                </Button>
                <Button 
                  color="primary" 
                  className="btn-modern"
                  onPress={onClose}
                  startContent={<Icon icon="lucide:save" width={16} />}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};