import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Badge, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Switch, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { EmployeeTracking } from "../components/employee-tracking";

export const EmployeesPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("registro");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Gestión de Empleados</h1>
        <Button color="primary" startContent={<Icon icon="lucide:user-plus" />} onPress={onOpen}>
          Nuevo Empleado
        </Button>
      </div>
      
      <Tabs 
        aria-label="Opciones de empleados" 
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
        className="w-full"
      >
        <Tab key="registro" title="Registro de Entrada/Salida">
          <Card className="mt-4">
            <CardBody>
              <EmployeeTracking />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="rendimiento" title="Rendimiento">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Rendimiento de Técnicos</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <Icon icon="lucide:user" width={16} />
                      </div>
                      <span className="font-medium">Juan Pérez</span>
                    </div>
                    <Badge color="success">95%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Mantenimientos</span>
                        <span>28/30</span>
                      </div>
                      <Progress value={93} color="primary" className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Puntualidad</span>
                        <span>98%</span>
                      </div>
                      <Progress value={98} color="success" className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Tiempo promedio</span>
                        <span>45 min</span>
                      </div>
                      <Progress value={85} color="warning" className="h-1" />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <Icon icon="lucide:user" width={16} />
                      </div>
                      <span className="font-medium">María López</span>
                    </div>
                    <Badge color="success">92%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Mantenimientos</span>
                        <span>25/28</span>
                      </div>
                      <Progress value={89} color="primary" className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Puntualidad</span>
                        <span>95%</span>
                      </div>
                      <Progress value={95} color="success" className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Tiempo promedio</span>
                        <span>50 min</span>
                      </div>
                      <Progress value={80} color="warning" className="h-1" />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <Icon icon="lucide:user" width={16} />
                      </div>
                      <span className="font-medium">Carlos Mendez</span>
                    </div>
                    <Badge color="warning">85%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Mantenimientos</span>
                        <span>22/26</span>
                      </div>
                      <Progress value={85} color="primary" className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Puntualidad</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} color="success" className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Tiempo promedio</span>
                        <span>55 min</span>
                      </div>
                      <Progress value={75} color="warning" className="h-1" />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <Icon icon="lucide:user" width={16} />
                      </div>
                      <span className="font-medium">Ana Gómez</span>
                    </div>
                    <Badge color="success">90%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Mantenimientos</span>
                        <span>18/20</span>
                      </div>
                      <Progress value={90} color="primary" className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Puntualidad</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} color="success" className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-tiny">
                        <span>Tiempo promedio</span>
                        <span>48 min</span>
                      </div>
                      <Progress value={82} color="warning" className="h-1" />
                    </div>
                  </div>
                </Card>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="capacitacion" title="Capacitación">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Capacitación y Certificaciones</h2>
            </CardHeader>
            <CardBody>
              <Table 
                aria-label="Capacitaciones y certificaciones"
                removeWrapper
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
                    <SelectItem key="tecnico" value="tecnico">Técnico</SelectItem>
                    <SelectItem key="tecnico_senior" value="tecnico_senior">Técnico Senior</SelectItem>
                    <SelectItem key="supervisor" value="supervisor">Supervisor</SelectItem>
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
                    <SelectItem key="norte" value="norte">Norte</SelectItem>
                    <SelectItem key="sur" value="sur">Sur</SelectItem>
                    <SelectItem key="este" value="este">Este</SelectItem>
                    <SelectItem key="oeste" value="oeste">Oeste</SelectItem>
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