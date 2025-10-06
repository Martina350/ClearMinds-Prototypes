import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/react";
import { MaintenanceTable } from "../components/maintenance-table";

export const MaintenancePage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("programados");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
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
            <CardHeader>
              <h2 className="text-lg font-semibold">Asignación de Técnicos y Rutas</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3">
                  <h3 className="text-medium font-semibold mb-2">Técnicos Disponibles</h3>
                  <div className="space-y-2">
                    {technicians.map((tech) => (
                      <Card key={tech.id} className="p-3">
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
                          <Badge color={tech.availability === "Disponible" ? "success" : "warning"}>
                            {tech.availability}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h3 className="text-medium font-semibold mb-2">Planificación de Rutas</h3>
                  <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: "url(https://img.heroui.chat/image/dashboard?w=800&h=400&u=3)"
                      }}
                    >
                      {/* Route visualization would go here */}
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
                        </div>
                      </div>
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
                    <SelectItem key="preventivo" value="preventivo">Preventivo</SelectItem>
                    <SelectItem key="correctivo" value="correctivo">Correctivo</SelectItem>
                    <SelectItem key="emergencia" value="emergencia">Emergencia</SelectItem>
                  </Select>
                  <Select label="Cliente">
                    <SelectItem key="1" value="1">Edificio Torre Norte</SelectItem>
                    <SelectItem key="2" value="2">Ministerio de Salud</SelectItem>
                    <SelectItem key="3" value="3">Centro Comercial Plaza</SelectItem>
                  </Select>
                  <Select label="Ascensor">
                    <SelectItem key="A101" value="A101">A101</SelectItem>
                    <SelectItem key="B205" value="B205">B205</SelectItem>
                    <SelectItem key="C310" value="C310">C310</SelectItem>
                  </Select>
                  <Select label="Técnico">
                    <SelectItem key="E001" value="E001">Juan Pérez</SelectItem>
                    <SelectItem key="E002" value="E002">María López</SelectItem>
                    <SelectItem key="E003" value="E003">Carlos Mendez</SelectItem>
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
                    <SelectItem key="1" value="1">Mantenimiento Preventivo Estándar</SelectItem>
                    <SelectItem key="2" value="2">Mantenimiento Ministerio</SelectItem>
                    <SelectItem key="3" value="3">Mantenimiento Correctivo</SelectItem>
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