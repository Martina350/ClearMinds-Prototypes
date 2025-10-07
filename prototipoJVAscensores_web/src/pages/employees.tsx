import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Badge, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Switch, Progress, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { EmployeeTracking } from "../components/employee-tracking";

export const EmployeesPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("registro");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="space-y-8 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Gestión de Empleados</h1>
          <p className="text-slate-600">Administración de técnicos, rendimiento y seguimiento</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            color="primary" 
            className="btn-modern"
            startContent={<Icon icon="lucide:user-plus" width={16} />} 
            onPress={onOpen}
          >
            Nuevo Empleado
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#07ADDB]">
              <Icon icon="lucide:users" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Empleados</p>
              <p className="text-2xl font-bold text-slate-800">24</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#ABD9D3]">
              <Icon icon="lucide:user-check" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Activos</p>
              <p className="text-2xl font-bold text-slate-800">18</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-orange-500">
              <Icon icon="lucide:clock" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">En Trabajo</p>
              <p className="text-2xl font-bold text-slate-800">12</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#4F90DB]">
              <Icon icon="lucide:trending-up" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Promedio Rendimiento</p>
              <p className="text-2xl font-bold text-slate-800">87%</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Tabs 
        aria-label="Opciones de empleados" 
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
          key="registro" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:clock" width={16} />
              <span>Registro</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#ABD9D3]">
                  <Icon icon="lucide:clock" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Registro de Entrada/Salida</h2>
              </div>
            </CardHeader>
            <CardBody>
              <EmployeeTracking />
            </CardBody>
          </Card>
        </Tab>
        <Tab 
          key="rendimiento" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:trending-up" width={16} />
              <span>Rendimiento</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#07ADDB]">
                  <Icon icon="lucide:trending-up" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Rendimiento de Técnicos</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="card-modern p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#07ADDB] flex items-center justify-center text-white shadow-lg">
                        <Icon icon="lucide:user" width={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Juan Pérez</p>
                        <p className="text-sm text-slate-500">Técnico Senior</p>
                      </div>
                    </div>
                    <Badge color="success" className="font-medium">95%</Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Mantenimientos</span>
                        <span className="font-semibold text-slate-800">28/30</span>
                      </div>
                      <Progress 
                        value={93} 
                        color="primary" 
                        className="h-2"
                        classNames={{
                          track: "bg-blue-100",
                          indicator: "bg-[#07ADDB]"
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Puntualidad</span>
                        <span className="font-semibold text-slate-800">98%</span>
                      </div>
                      <Progress 
                        value={98} 
                        color="success" 
                        className="h-2"
                        classNames={{
                          track: "bg-green-100",
                          indicator: "bg-[#ABD9D3]"
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Tiempo promedio</span>
                        <span className="font-semibold text-slate-800">45 min</span>
                      </div>
                      <Progress 
                        value={85} 
                        color="warning" 
                        className="h-2"
                        classNames={{
                          track: "bg-orange-100",
                          indicator: "bg-orange-500"
                        }}
                      />
                    </div>
                  </div>
                </Card>
                
                <Card className="card-modern p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#ABD9D3] flex items-center justify-center text-white shadow-lg">
                        <Icon icon="lucide:user" width={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">María López</p>
                        <p className="text-sm text-slate-500">Técnico</p>
                      </div>
                    </div>
                    <Badge color="success" className="font-medium">92%</Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Mantenimientos</span>
                        <span className="font-semibold text-slate-800">25/28</span>
                      </div>
                      <Progress 
                        value={89} 
                        color="primary" 
                        className="h-2"
                        classNames={{
                          track: "bg-blue-100",
                          indicator: "bg-[#07ADDB]"
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Puntualidad</span>
                        <span className="font-semibold text-slate-800">95%</span>
                      </div>
                      <Progress 
                        value={95} 
                        color="success" 
                        className="h-2"
                        classNames={{
                          track: "bg-green-100",
                          indicator: "bg-[#ABD9D3]"
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Tiempo promedio</span>
                        <span className="font-semibold text-slate-800">50 min</span>
                      </div>
                      <Progress 
                        value={80} 
                        color="warning" 
                        className="h-2"
                        classNames={{
                          track: "bg-orange-100",
                          indicator: "bg-orange-500"
                        }}
                      />
                    </div>
                  </div>
                </Card>
                
                <Card className="card-modern p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg">
                        <Icon icon="lucide:user" width={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Carlos Mendez</p>
                        <p className="text-sm text-slate-500">Técnico</p>
                      </div>
                    </div>
                    <Badge color="warning" className="font-medium">85%</Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Mantenimientos</span>
                        <span className="font-semibold text-slate-800">22/26</span>
                      </div>
                      <Progress 
                        value={85} 
                        color="primary" 
                        className="h-2"
                        classNames={{
                          track: "bg-blue-100",
                          indicator: "bg-[#07ADDB]"
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Puntualidad</span>
                        <span className="font-semibold text-slate-800">88%</span>
                      </div>
                      <Progress 
                        value={88} 
                        color="success" 
                        className="h-2"
                        classNames={{
                          track: "bg-green-100",
                          indicator: "bg-[#ABD9D3]"
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Tiempo promedio</span>
                        <span className="font-semibold text-slate-800">55 min</span>
                      </div>
                      <Progress 
                        value={75} 
                        color="warning" 
                        className="h-2"
                        classNames={{
                          track: "bg-orange-100",
                          indicator: "bg-orange-500"
                        }}
                      />
                    </div>
                  </div>
                </Card>
                
                <Card className="card-modern p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#4F90DB] flex items-center justify-center text-white shadow-lg">
                        <Icon icon="lucide:user" width={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Ana Gómez</p>
                        <p className="text-sm text-slate-500">Técnico</p>
                      </div>
                    </div>
                    <Badge color="success" className="font-medium">90%</Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Mantenimientos</span>
                        <span className="font-semibold text-slate-800">18/20</span>
                      </div>
                      <Progress 
                        value={90} 
                        color="primary" 
                        className="h-2"
                        classNames={{
                          track: "bg-blue-100",
                          indicator: "bg-[#07ADDB]"
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Puntualidad</span>
                        <span className="font-semibold text-slate-800">92%</span>
                      </div>
                      <Progress 
                        value={92} 
                        color="success" 
                        className="h-2"
                        classNames={{
                          track: "bg-green-100",
                          indicator: "bg-[#ABD9D3]"
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Tiempo promedio</span>
                        <span className="font-semibold text-slate-800">48 min</span>
                      </div>
                      <Progress 
                        value={82} 
                        color="warning" 
                        className="h-2"
                        classNames={{
                          track: "bg-orange-100",
                          indicator: "bg-orange-500"
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab 
          key="capacitacion" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:graduation-cap" width={16} />
              <span>Capacitación</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#ABD9D3]">
                  <Icon icon="lucide:graduation-cap" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Capacitación y Certificaciones</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="table-modern">
                <Table 
                  aria-label="Capacitaciones y certificaciones"
                  removeWrapper
                  classNames={{
                    wrapper: "min-h-[400px]",
                    th: "bg-slate-50 text-slate-700 font-semibold",
                    td: "border-b border-slate-100"
                  }}
                >
                <TableHeader>
                  <TableColumn>EMPLEADO</TableColumn>
                  <TableColumn>CERTIFICACIONES</TableColumn>
                  <TableColumn>ÚLTIMA CAPACITACIÓN</TableColumn>
                  <TableColumn>PRÓXIMA CAPACITACIÓN</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <Icon icon="lucide:user" width={16} />
                        </div>
                        <span>Juan Pérez</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge color="primary">Técnico Senior</Badge>
                        <Badge color="secondary">Emergencias</Badge>
                      </div>
                    </TableCell>
                    <TableCell>15/03/2023</TableCell>
                    <TableCell>15/09/2023</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary">
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <Icon icon="lucide:user" width={16} />
                        </div>
                        <span>María López</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge color="primary">Técnico</Badge>
                      </div>
                    </TableCell>
                    <TableCell>10/04/2023</TableCell>
                    <TableCell>10/10/2023</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary">
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <Icon icon="lucide:user" width={16} />
                        </div>
                        <span>Carlos Mendez</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge color="primary">Técnico Senior</Badge>
                        <Badge color="secondary">Emergencias</Badge>
                        <Badge color="success">Instructor</Badge>
                      </div>
                    </TableCell>
                    <TableCell>05/02/2023</TableCell>
                    <TableCell>05/08/2023</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary">
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
      
      {/* New Employee Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Nuevo Empleado</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Nombre completo"
                    placeholder="Ingrese el nombre completo"
                  />
                  <Input
                    label="ID de Empleado"
                    placeholder="Ej. E005"
                  />
                  <Select label="Rol">
                    <SelectItem key="tecnico">Técnico</SelectItem>
                    <SelectItem key="tecnico_senior">Técnico Senior</SelectItem>
                    <SelectItem key="supervisor">Supervisor</SelectItem>
                  </Select>
                  <Input
                    label="Teléfono"
                    placeholder="Ingrese el número de teléfono"
                  />
                  <Input
                    label="Correo electrónico"
                    placeholder="Ingrese el correo electrónico"
                    type="email"
                  />
                  <Select label="Zona asignada">
                    <SelectItem key="norte">Norte</SelectItem>
                    <SelectItem key="sur">Sur</SelectItem>
                    <SelectItem key="este">Este</SelectItem>
                    <SelectItem key="oeste">Oeste</SelectItem>
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