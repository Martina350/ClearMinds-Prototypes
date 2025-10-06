import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";

export const ClientsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("clientes");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // Sample data for clients
  const clientsData = [
    { 
      id: 1, 
      name: "Edificio Torre Norte", 
      address: "Av. Principal 123, Ciudad", 
      contact: "Juan Martínez", 
      phone: "+1 234 567 890", 
      email: "contacto@torrenorte.com", 
      elevators: 4,
      status: "Activo"
    },
    { 
      id: 2, 
      name: "Ministerio de Salud", 
      address: "Calle Gobierno 456, Ciudad", 
      contact: "María Rodríguez", 
      phone: "+1 234 567 891", 
      email: "contacto@ministeriosalud.gov", 
      elevators: 6,
      status: "Activo"
    },
    { 
      id: 3, 
      name: "Centro Comercial Plaza", 
      address: "Av. Comercio 789, Ciudad", 
      contact: "Carlos López", 
      phone: "+1 234 567 892", 
      email: "contacto@ccplaza.com", 
      elevators: 8,
      status: "Activo"
    },
    { 
      id: 4, 
      name: "Hospital Central", 
      address: "Av. Salud 321, Ciudad", 
      contact: "Ana Gómez", 
      phone: "+1 234 567 893", 
      email: "contacto@hospitalcentral.com", 
      elevators: 5,
      status: "Activo"
    },
  ];

  // Sample data for elevators
  const elevatorsData = [
    { 
      id: "A101", 
      client: "Edificio Torre Norte", 
      location: "Torre Norte, Piso 1", 
      model: "JBA-2000", 
      installDate: "15/03/2020", 
      lastMaintenance: "10/10/2023",
      status: "Operativo"
    },
    { 
      id: "A102", 
      client: "Edificio Torre Norte", 
      location: "Torre Norte, Piso 2", 
      model: "JBA-2000", 
      installDate: "15/03/2020", 
      lastMaintenance: "05/10/2023",
      status: "Alerta"
    },
    { 
      id: "B205", 
      client: "Ministerio de Salud", 
      location: "Torre Sur, Piso 5", 
      model: "JBA-3000", 
      installDate: "20/06/2021", 
      lastMaintenance: "12/10/2023",
      status: "En mantenimiento"
    },
    { 
      id: "C310", 
      client: "Centro Comercial Plaza", 
      location: "Torre Este, Piso 10", 
      model: "JBA-2500", 
      installDate: "10/01/2022", 
      lastMaintenance: "08/10/2023",
      status: "Operativo"
    },
    { 
      id: "D405", 
      client: "Hospital Central", 
      location: "Torre Oeste, Piso 5", 
      model: "JBA-3500", 
      installDate: "05/05/2022", 
      lastMaintenance: "15/09/2023",
      status: "Fuera de servicio"
    },
  ];

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        <Button color="primary" startContent={<Icon icon="lucide:plus" />} onPress={onOpen}>
          Nuevo Cliente
        </Button>
      </div>
      
      <Tabs 
        aria-label="Opciones de clientes" 
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
        className="w-full"
      >
        <Tab key="clientes" title="Clientes">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Directorio de Clientes</h2>
            </CardHeader>
            <CardBody>
              <Input
                placeholder="Buscar cliente..."
                startContent={<Icon icon="lucide:search" className="text-default-400" width={16} />}
                className="mb-4 max-w-md"
              />
              
              <Table 
                aria-label="Directorio de clientes"
                removeWrapper
              >
                <TableHeader>
                  <TableColumn>CLIENTE</TableColumn>
                  <TableColumn>DIRECCIÓN</TableColumn>
                  <TableColumn>CONTACTO</TableColumn>
                  <TableColumn>ASCENSORES</TableColumn>
                  <TableColumn>ESTADO</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                  {clientsData.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-tiny text-default-500">{client.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{client.address}</TableCell>
                      <TableCell>
                        <div>
                          <p>{client.contact}</p>
                          <p className="text-tiny text-default-500">{client.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{client.elevators}</TableCell>
                      <TableCell>
                        <Badge color="success">{client.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button isIconOnly size="sm" variant="light" aria-label="Ver detalles">
                            <Icon icon="lucide:eye" width={16} />
                          </Button>
                          <Button isIconOnly size="sm" variant="light" aria-label="Editar">
                            <Icon icon="lucide:edit" width={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="ascensores" title="Ascensores">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Inventario de Ascensores</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <Input
                  placeholder="Buscar ascensor..."
                  startContent={<Icon icon="lucide:search" className="text-default-400" width={16} />}
                  className="flex-1"
                />
                <Select
                  placeholder="Filtrar por cliente"
                  className="w-full md:w-64"
                >
                  <SelectItem key="all" value="all">Todos los clientes</SelectItem>
                  <SelectItem key="1" value="1">Edificio Torre Norte</SelectItem>
                  <SelectItem key="2" value="2">Ministerio de Salud</SelectItem>
                  <SelectItem key="3" value="3">Centro Comercial Plaza</SelectItem>
                  <SelectItem key="4" value="4">Hospital Central</SelectItem>
                </Select>
                <Select
                  placeholder="Filtrar por estado"
                  className="w-full md:w-48"
                >
                  <SelectItem key="all" value="all">Todos</SelectItem>
                  <SelectItem key="Operativo" value="Operativo">Operativo</SelectItem>
                  <SelectItem key="Alerta" value="Alerta">Alerta</SelectItem>
                  <SelectItem key="En mantenimiento" value="En mantenimiento">En mantenimiento</SelectItem>
                  <SelectItem key="Fuera de servicio" value="Fuera de servicio">Fuera de servicio</SelectItem>
                </Select>
              </div>
              
              <Table 
                aria-label="Inventario de ascensores"
                removeWrapper
              >
                <TableHeader>
                  <TableColumn>ID</TableColumn>
                  <TableColumn>CLIENTE</TableColumn>
                  <TableColumn>UBICACIÓN</TableColumn>
                  <TableColumn>MODELO</TableColumn>
                  <TableColumn>INSTALACIÓN</TableColumn>
                  <TableColumn>ÚLTIMO MANT.</TableColumn>
                  <TableColumn>ESTADO</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                  {elevatorsData.map((elevator) => (
                    <TableRow key={elevator.id}>
                      <TableCell>{elevator.id}</TableCell>
                      <TableCell>{elevator.client}</TableCell>
                      <TableCell>{elevator.location}</TableCell>
                      <TableCell>{elevator.model}</TableCell>
                      <TableCell>{elevator.installDate}</TableCell>
                      <TableCell>{elevator.lastMaintenance}</TableCell>
                      <TableCell>
                        <Badge color={getStatusColor(elevator.status) as any}>{elevator.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button isIconOnly size="sm" variant="light" aria-label="Ver detalles">
                            <Icon icon="lucide:eye" width={16} />
                          </Button>
                          <Button isIconOnly size="sm" variant="light" aria-label="Editar">
                            <Icon icon="lucide:edit" width={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="restricciones" title="Restricciones">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Restricciones de Clientes</h2>
            </CardHeader>
            <CardBody>
              <Select
                label="Cliente"
                placeholder="Seleccione un cliente"
                className="mb-4 max-w-md"
              >
                <SelectItem key="1" value="1">Edificio Torre Norte</SelectItem>
                <SelectItem key="2" value="2">Ministerio de Salud</SelectItem>
                <SelectItem key="3" value="3">Centro Comercial Plaza</SelectItem>
                <SelectItem key="4" value="4">Hospital Central</SelectItem>
              </Select>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-medium font-semibold mb-4">Horarios Permitidos</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Lunes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          defaultValue="09:00"
                          className="w-24"
                        />
                        <span>a</span>
                        <Input
                          type="time"
                          defaultValue="17:00"
                          className="w-24"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Martes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          defaultValue="09:00"
                          className="w-24"
                        />
                        <span>a</span>
                        <Input
                          type="time"
                          defaultValue="17:00"
                          className="w-24"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Miércoles</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          defaultValue="09:00"
                          className="w-24"
                        />
                        <span>a</span>
                        <Input
                          type="time"
                          defaultValue="17:00"
                          className="w-24"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Jueves</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          defaultValue="09:00"
                          className="w-24"
                        />
                        <span>a</span>
                        <Input
                          type="time"
                          defaultValue="17:00"
                          className="w-24"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Viernes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          defaultValue="09:00"
                          className="w-24"
                        />
                        <span>a</span>
                        <Input
                          type="time"
                          defaultValue="15:00"
                          className="w-24"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Sábado</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          defaultValue="10:00"
                          className="w-24"
                        />
                        <span>a</span>
                        <Input
                          type="time"
                          defaultValue="13:00"
                          className="w-24"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Domingo</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-default-500">No disponible</span>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-medium font-semibold mb-4">Otras Restricciones</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">Tiempo estimado por visita</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="60"
                          className="w-24"
                        />
                        <span>minutos</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Periodicidad del mantenimiento preventivo</p>
                      <Select defaultSelectedKeys={["30"]}>
                        <SelectItem key="15" value="15">Quincenal</SelectItem>
                        <SelectItem key="30" value="30">Mensual</SelectItem>
                        <SelectItem key="60" value="60">Bimestral</SelectItem>
                        <SelectItem key="90" value="90">Trimestral</SelectItem>
                      </Select>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Ventana de tiempo preferida</p>
                      <Select defaultSelectedKeys={["morning"]}>
                        <SelectItem key="morning" value="morning">Mañana (9:00 - 12:00)</SelectItem>
                        <SelectItem key="afternoon" value="afternoon">Tarde (13:00 - 17:00)</SelectItem>
                        <SelectItem key="any" value="any">Cualquier horario</SelectItem>
                      </Select>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Notificación previa requerida</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="24"
                          className="w-24"
                        />
                        <span>horas</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Permitir reprogramación de última hora</p>
                      </div>
                      <Switch defaultSelected />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Cliente prioritario</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="flex justify-end mt-4 gap-2">
                <Button color="danger" variant="light">
                  Cancelar
                </Button>
                <Button color="primary">
                  Guardar Restricciones
                </Button>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
      
      {/* New Client Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Nuevo Cliente</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre del Cliente"
                    placeholder="Ingrese el nombre del cliente"
                    className="col-span-full"
                  />
                  <Input
                    label="Dirección"
                    placeholder="Ingrese la dirección"
                    className="col-span-full"
                  />
                  <Input
                    label="Nombre de Contacto"
                    placeholder="Ingrese el nombre de contacto"
                  />
                  <Input
                    label="Teléfono"
                    placeholder="Ingrese el teléfono de contacto"
                  />
                  <Input
                    label="Correo Electrónico"
                    placeholder="Ingrese el correo electrónico"
                    type="email"
                    className="col-span-full"
                  />
                  <Input
                    label="Número de Ascensores"
                    placeholder="Ingrese el número de ascensores"
                    type="number"
                  />
                  <Select label="Tipo de Cliente">
                    <SelectItem key="residencial" value="residencial">Residencial</SelectItem>
                    <SelectItem key="comercial" value="comercial">Comercial</SelectItem>
                    <SelectItem key="gubernamental" value="gubernamental">Gubernamental</SelectItem>
                    <SelectItem key="salud" value="salud">Salud</SelectItem>
                  </Select>
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