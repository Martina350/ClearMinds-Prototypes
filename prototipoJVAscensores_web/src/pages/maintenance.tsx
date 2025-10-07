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
    { id: "E001", name: "Juan Pérez", zone: "Norte", availability: "Disponible" },
    { id: "E002", name: "María López", zone: "Sur", availability: "Ocupado" },
    { id: "E003", name: "Carlos Mendez", zone: "Este", availability: "Disponible" },
    { id: "E004", name: "Ana Gómez", zone: "Oeste", availability: "Disponible" },
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Planificación de Mantenimientos</h1>
        <div className="flex gap-2">
          <Button color="primary" startContent={<Icon icon="lucide:plus" />} onPress={onOpen}>
            Nuevo Mantenimiento
          </Button>
          <Button color="secondary" startContent={<Icon icon="lucide:route" />} onPress={handleOptimizeRoute}>
            Optimizar Rutas
          </Button>
        </div>
      </div>
      
      <Tabs 
        aria-label="Opciones de mantenimiento" 
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
        className="w-full"
      >
        <Tab key="programados" title="Programados">
          <Card className="mt-4">
            <CardBody>
              <MaintenanceTable />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="rutas" title="Rutas y Asignaciones">
          <Card className="mt-4">
            <CardHeader className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Asignación de Técnicos y Rutas</h2>
              <div className="flex items-center gap-2">
                <Select label="Técnico" selectedKeys={[selectedTech]} onSelectionChange={(k)=>setSelectedTech(Array.from(k as Set<string>)[0] || "E001")} className="min-w-48">
                  {technicians.map((t)=> (
                    <SelectItem key={t.id}>{t.name}</SelectItem>
                  ))}
                </Select>
                <Button variant="flat" onPress={clearRoute} startContent={<Icon icon="lucide:eraser" />}>Limpiar</Button>
                <Button color="primary" onPress={saveRoute} startContent={<Icon icon="lucide:save" />}>Guardar Ruta</Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3">
                  <h3 className="text-medium font-semibold mb-2">Técnicos Disponibles</h3>
                  <div className="space-y-2">
                    {technicians.map((tech) => (
                      <Card key={tech.id} className={`p-3 ${selectedTech === tech.id ? "ring-1 ring-primary" : ""}`} onClick={()=>setSelectedTech(tech.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                              <Icon icon="lucide:user" width={16} />
                            </div>
                            <div>
                              <p className="font-medium">{tech.name}</p>
                              <p className="text-tiny text-default-500">Zona: {tech.zone}</p>
                            </div>
                          </div>
                          <Badge color={techStatusById[tech.id] === "Disponible" ? "success" : "warning"}>
                            {techStatusById[tech.id]}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h3 className="text-medium font-semibold mb-2">Planificación de Rutas</h3>
                  <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
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
                            <Polyline key={`pl-${id}`} positions={points} pathOptions={{ color: id === selectedTech ? "#2563eb" : "#94a3b8", weight: 5 }} />
                          )}
                          {points.map(([lat,lng], idx)=> (
                            <CircleMarker key={`pt-${id}-${idx}`} center={[lat,lng]} radius={6} pathOptions={{ color: id === selectedTech ? "#2563eb" : "#94a3b8", fillOpacity: 0.9 }} />
                          ))}
                        </>
                      ))}
                    </MapContainer>
                    <div className="absolute bottom-2 left-2 p-2 bg-white/80 backdrop-blur-sm rounded-md">
                      <div className="text-tiny">Clic en el mapa para agregar puntos a la ruta del técnico seleccionado</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="plantillas" title="Plantillas de Actividades">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Plantillas de Actividades</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <Input 
                    placeholder="Buscar plantilla..." 
                    startContent={<Icon icon="lucide:search" className="text-default-400" width={16} />}
                    className="w-full max-w-xs"
                  />
                  <Button color="primary" startContent={<Icon icon="lucide:plus" />}>
                    Nueva Plantilla
                  </Button>
                </div>
                
                <Table 
                  aria-label="Plantillas de actividades"
                  removeWrapper
                >
                  <TableHeader>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>CLIENTE</TableColumn>
                    <TableColumn>ITEMS</TableColumn>
                    <TableColumn>ÚLTIMA MODIFICACIÓN</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Mantenimiento Preventivo Estándar</TableCell>
                      <TableCell>General</TableCell>
                      <TableCell>12 items</TableCell>
                      <TableCell>10/05/2023</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button isIconOnly size="sm" variant="light" aria-label="Editar">
                            <Icon icon="lucide:edit" width={16} />
                          </Button>
                          <Button isIconOnly size="sm" variant="light" aria-label="Duplicar">
                            <Icon icon="lucide:copy" width={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Mantenimiento Ministerio</TableCell>
                      <TableCell>Ministerio de Salud</TableCell>
                      <TableCell>18 items</TableCell>
                      <TableCell>15/04/2023</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button isIconOnly size="sm" variant="light" aria-label="Editar">
                            <Icon icon="lucide:edit" width={16} />
                          </Button>
                          <Button isIconOnly size="sm" variant="light" aria-label="Duplicar">
                            <Icon icon="lucide:copy" width={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Mantenimiento Correctivo</TableCell>
                      <TableCell>General</TableCell>
                      <TableCell>8 items</TableCell>
                      <TableCell>22/03/2023</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button isIconOnly size="sm" variant="light" aria-label="Editar">
                            <Icon icon="lucide:edit" width={16} />
                          </Button>
                          <Button isIconOnly size="sm" variant="light" aria-label="Duplicar">
                            <Icon icon="lucide:copy" width={16} />
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Nuevo Mantenimiento</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select label="Tipo de Mantenimiento">
                    <SelectItem key="preventivo">Preventivo</SelectItem>
                    <SelectItem key="correctivo">Correctivo</SelectItem>
                    <SelectItem key="emergencia">Emergencia</SelectItem>
                  </Select>
                  <Select label="Cliente">
                    <SelectItem key="1">Edificio Torre Norte</SelectItem>
                    <SelectItem key="2">Ministerio de Salud</SelectItem>
                    <SelectItem key="3">Centro Comercial Plaza</SelectItem>
                  </Select>
                  <Select label="Ascensor">
                    <SelectItem key="A101">A101</SelectItem>
                    <SelectItem key="B205">B205</SelectItem>
                    <SelectItem key="C310">C310</SelectItem>
                  </Select>
                  <Select label="Técnico">
                    <SelectItem key="E001">Juan Pérez</SelectItem>
                    <SelectItem key="E002">María López</SelectItem>
                    <SelectItem key="E003">Carlos Mendez</SelectItem>
                  </Select>
                  <Input
                    type="date"
                    label="Fecha"
                  />
                  <Input
                    type="time"
                    label="Hora"
                  />
                  <Select label="Plantilla de Actividades" className="col-span-full">
                    <SelectItem key="1">Mantenimiento Preventivo Estándar</SelectItem>
                    <SelectItem key="2">Mantenimiento Ministerio</SelectItem>
                    <SelectItem key="3">Mantenimiento Correctivo</SelectItem>
                  </Select>
                  <Input
                    label="Observaciones"
                    placeholder="Ingrese observaciones adicionales"
                    className="col-span-full"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={onClose}>
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