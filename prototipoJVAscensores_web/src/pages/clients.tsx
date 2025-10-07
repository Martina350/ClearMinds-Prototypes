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
    <div className="space-y-8 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Gestión de Clientes</h1>
          <p className="text-slate-600">Administración de clientes, ascensores y contratos</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            color="primary" 
            className="btn-modern"
            startContent={<Icon icon="lucide:plus" width={16} />} 
            onPress={onOpen}
          >
          Nuevo Cliente
        </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#07ADDB]">
              <Icon icon="lucide:building" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Clientes</p>
              <p className="text-2xl font-bold text-slate-800">24</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#ABD9D3]">
              <Icon icon="lucide:elevator" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Ascensores</p>
              <p className="text-2xl font-bold text-slate-800">156</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-orange-500">
              <Icon icon="lucide:file-text" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Contratos Activos</p>
              <p className="text-2xl font-bold text-slate-800">18</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#4F90DB]">
              <Icon icon="lucide:trending-up" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Crecimiento</p>
              <p className="text-2xl font-bold text-slate-800">+12%</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Tabs 
        aria-label="Opciones de clientes" 
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
          key="clientes" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:building" width={16} />
              <span>Clientes</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#07ADDB]">
                    <Icon icon="lucide:building" className="text-white" width={20} />
                  </div>
                  <h2 className="text-xl font-semibold">Directorio de Clientes</h2>
                </div>
                <Input
                  placeholder="Buscar cliente..."
                  startContent={<Icon icon="lucide:search" className="text-slate-400" width={16} />}
                  className="input-modern w-full sm:w-64"
                />
              </div>
            </CardHeader>
            <CardBody>
              <div className="table-modern">
              <Table 
                aria-label="Directorio de clientes"
                removeWrapper
                  classNames={{
                    wrapper: "min-h-[400px]",
                    th: "bg-slate-50 text-slate-700 font-semibold",
                    td: "border-b border-slate-100"
                  }}
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
                  {clientsData.map((client, index) => (
                    <TableRow key={client.id} className="hover:bg-slate-50 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#07ADDB] flex items-center justify-center text-white">
                            <Icon icon="lucide:building" width={16} />
                          </div>
                        <div>
                            <p className="font-semibold text-slate-800">{client.name}</p>
                            <p className="text-sm text-slate-500">{client.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:map-pin" width={14} className="text-slate-400" />
                          <span className="text-sm">{client.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-800">{client.contact}</p>
                          <p className="text-sm text-slate-500">{client.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:elevator" width={14} className="text-slate-400" />
                          <Badge color="primary" variant="flat">{client.elevators}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge color="success" className="font-medium">{client.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="hover:bg-blue-100"
                            aria-label="Ver detalles"
                          >
                            <Icon icon="lucide:eye" width={16} className="text-blue-600" />
                          </Button>
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="hover:bg-green-100"
                            aria-label="Editar"
                          >
                            <Icon icon="lucide:edit" width={16} className="text-green-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab 
          key="ascensores" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:elevator" width={16} />
              <span>Ascensores</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#ABD9D3]">
                  <Icon icon="lucide:elevator" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Inventario de Ascensores</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <Input
                  placeholder="Buscar ascensor..."
                  startContent={<Icon icon="lucide:search" className="text-slate-400" width={16} />}
                  className="input-modern flex-1"
                />
                <Select
                  placeholder="Filtrar por cliente"
                  className="input-modern w-full lg:w-64"
                  startContent={<Icon icon="lucide:building" width={16} className="text-slate-400" />}
                >
                  <SelectItem key="all">Todos los clientes</SelectItem>
                  <SelectItem key="1">Edificio Torre Norte</SelectItem>
                  <SelectItem key="2">Ministerio de Salud</SelectItem>
                  <SelectItem key="3">Centro Comercial Plaza</SelectItem>
                  <SelectItem key="4">Hospital Central</SelectItem>
                </Select>
                <Select
                  placeholder="Filtrar por estado"
                  className="input-modern w-full lg:w-48"
                  startContent={<Icon icon="lucide:filter" width={16} className="text-slate-400" />}
                >
                  <SelectItem key="all">Todos</SelectItem>
                  <SelectItem key="Operativo">Operativo</SelectItem>
                  <SelectItem key="Alerta">Alerta</SelectItem>
                  <SelectItem key="En mantenimiento">En mantenimiento</SelectItem>
                  <SelectItem key="Fuera de servicio">Fuera de servicio</SelectItem>
                </Select>
              </div>
              
              <div className="table-modern">
              <Table 
                aria-label="Inventario de ascensores"
                removeWrapper
                  classNames={{
                    wrapper: "min-h-[400px]",
                    th: "bg-slate-50 text-slate-700 font-semibold",
                    td: "border-b border-slate-100"
                  }}
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
                  {elevatorsData.map((elevator, index) => (
                    <TableRow key={elevator.id} className="hover:bg-slate-50 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#ABD9D3] flex items-center justify-center text-white">
                            <Icon icon="lucide:elevator" width={14} />
                          </div>
                          <span className="font-semibold text-slate-800">{elevator.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:building" width={14} className="text-slate-400" />
                          <span className="text-sm">{elevator.client}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:map-pin" width={14} className="text-slate-400" />
                          <span className="text-sm">{elevator.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge color="secondary" variant="flat">{elevator.model}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:calendar" width={14} className="text-slate-400" />
                          <span className="text-sm">{elevator.installDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:wrench" width={14} className="text-slate-400" />
                          <span className="text-sm">{elevator.lastMaintenance}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge color={getStatusColor(elevator.status) as any} className="font-medium">{elevator.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="hover:bg-blue-100"
                            aria-label="Ver detalles"
                          >
                            <Icon icon="lucide:eye" width={16} className="text-blue-600" />
                          </Button>
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="hover:bg-green-100"
                            aria-label="Editar"
                          >
                            <Icon icon="lucide:edit" width={16} className="text-green-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab 
          key="restricciones" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:shield" width={16} />
              <span>Restricciones</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-orange-500">
                    <Icon icon="lucide:shield" className="text-white" width={20} />
                  </div>
                  <h2 className="text-xl font-semibold">Restricciones de Clientes</h2>
                </div>
                <Select
                  label="Cliente"
                  placeholder="Seleccione un cliente"
                  className="input-modern w-full sm:w-64"
                  startContent={<Icon icon="lucide:building" width={16} className="text-slate-400" />}
                >
                  <SelectItem key="1">Edificio Torre Norte</SelectItem>
                  <SelectItem key="2">Ministerio de Salud</SelectItem>
                  <SelectItem key="3">Centro Comercial Plaza</SelectItem>
                  <SelectItem key="4">Hospital Central</SelectItem>
                </Select>
              </div>
            </CardHeader>
            <CardBody>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-modern p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 rounded-lg bg-[#07ADDB]">
                      <Icon icon="lucide:clock" className="text-white" width={18} />
                    </div>
                    <h3 className="text-lg font-semibold">Horarios Permitidos</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:calendar" width={16} className="text-slate-500" />
                        <p className="font-medium text-slate-700">Lunes</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="time"
                          defaultValue="09:00"
                          className="input-modern w-28"
                          size="sm"
                        />
                        <span className="text-slate-500">a</span>
                        <Input
                          type="time"
                          defaultValue="17:00"
                          className="input-modern w-28"
                          size="sm"
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
                
                <Card className="card-modern p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 rounded-lg bg-[#4F90DB]">
                      <Icon icon="lucide:settings" className="text-white" width={18} />
                    </div>
                    <h3 className="text-lg font-semibold">Otras Restricciones</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon icon="lucide:clock" width={16} className="text-slate-500" />
                        <p className="font-semibold text-slate-700">Tiempo estimado por visita</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          defaultValue="60"
                          className="input-modern w-24"
                          size="sm"
                        />
                        <span className="text-slate-600">minutos</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon icon="lucide:calendar" width={16} className="text-slate-500" />
                        <p className="font-semibold text-slate-700">Periodicidad del mantenimiento preventivo</p>
                      </div>
                      <Select 
                        defaultSelectedKeys={["30"]}
                        className="input-modern"
                        startContent={<Icon icon="lucide:repeat" width={16} className="text-slate-400" />}
                      >
                        <SelectItem key="15">Quincenal</SelectItem>
                        <SelectItem key="30">Mensual</SelectItem>
                        <SelectItem key="60">Bimestral</SelectItem>
                        <SelectItem key="90">Trimestral</SelectItem>
                      </Select>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon icon="lucide:clock" width={16} className="text-slate-500" />
                        <p className="font-semibold text-slate-700">Ventana de tiempo preferida</p>
                      </div>
                      <Select 
                        defaultSelectedKeys={["morning"]}
                        className="input-modern"
                        startContent={<Icon icon="lucide:sun" width={16} className="text-slate-400" />}
                      >
                        <SelectItem key="morning">Mañana (9:00 - 12:00)</SelectItem>
                        <SelectItem key="afternoon">Tarde (13:00 - 17:00)</SelectItem>
                        <SelectItem key="any">Cualquier horario</SelectItem>
                      </Select>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon icon="lucide:bell" width={16} className="text-slate-500" />
                        <p className="font-semibold text-slate-700">Notificación previa requerida</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          defaultValue="24"
                          className="input-modern w-24"
                          size="sm"
                        />
                        <span className="text-slate-600">horas</span>
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
                    <SelectItem key="residencial">Residencial</SelectItem>
                    <SelectItem key="comercial">Comercial</SelectItem>
                    <SelectItem key="gubernamental">Gubernamental</SelectItem>
                    <SelectItem key="salud">Salud</SelectItem>
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