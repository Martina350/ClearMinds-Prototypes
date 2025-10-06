import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/react";

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  
  const handleGenerateReport = () => {
    addToast({
      title: "Reporte generado",
      description: "El reporte ha sido generado y enviado por correo",
      severity: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Reportes y Análisis</h1>
        <Button color="primary" startContent={<Icon icon="lucide:download" />} onPress={handleGenerateReport}>
          Exportar Reportes
        </Button>
      </div>
      
      <Tabs 
        aria-label="Opciones de reportes" 
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
        className="w-full"
      >
        <Tab key="dashboard" title="Dashboard">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Dashboard de Rendimiento</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  type="date"
                  label="Fecha desde"
                  className="w-full md:w-48"
                />
                <Input
                  type="date"
                  label="Fecha hasta"
                  className="w-full md:w-48"
                />
                <Select
                  label="Cliente"
                  placeholder="Todos los clientes"
                  className="w-full md:w-64"
                >
                  <SelectItem key="all" value="all">Todos los clientes</SelectItem>
                  <SelectItem key="1" value="1">Edificio Torre Norte</SelectItem>
                  <SelectItem key="2" value="2">Ministerio de Salud</SelectItem>
                  <SelectItem key="3" value="3">Centro Comercial Plaza</SelectItem>
                </Select>
                <Button color="primary" className="self-end">
                  Aplicar Filtros
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4">
                  <h3 className="text-medium font-semibold mb-4">Cumplimiento de Mantenimientos</h3>
                  <div className="flex justify-center items-center h-64">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">85%</span>
                      </div>
                      {/* This would be a chart in a real implementation */}
                      <div className="absolute inset-0 border-8 border-primary rounded-full opacity-25"></div>
                      <div className="absolute inset-0 border-8 border-primary rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 85%)' }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-small">
                    <div>
                      <p className="font-medium">Total Programados</p>
                      <p className="text-2xl font-bold">120</p>
                    </div>
                    <div>
                      <p className="font-medium">Completados</p>
                      <p className="text-2xl font-bold">102</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-medium font-semibold mb-4">Tipos de Mantenimiento</h3>
                  <div className="flex justify-center items-center h-64">
                    {/* This would be a chart in a real implementation */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-64 bg-gray-100 rounded-t-lg relative">
                          <div className="absolute bottom-0 w-full bg-primary rounded-t-lg" style={{ height: '60%' }}></div>
                        </div>
                        <p className="mt-2 text-small">Preventivos</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-64 bg-gray-100 rounded-t-lg relative">
                          <div className="absolute bottom-0 w-full bg-warning rounded-t-lg" style={{ height: '25%' }}></div>
                        </div>
                        <p className="mt-2 text-small">Correctivos</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-64 bg-gray-100 rounded-t-lg relative">
                          <div className="absolute bottom-0 w-full bg-danger rounded-t-lg" style={{ height: '15%' }}></div>
                        </div>
                        <p className="mt-2 text-small">Emergencias</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-small">
                    <div>
                      <p className="font-medium">Preventivos</p>
                      <p className="text-xl font-bold">72 <span className="text-small font-normal text-default-500">(60%)</span></p>
                    </div>
                    <div>
                      <p className="font-medium">Correctivos</p>
                      <p className="text-xl font-bold">30 <span className="text-small font-normal text-default-500">(25%)</span></p>
                    </div>
                    <div>
                      <p className="font-medium">Emergencias</p>
                      <p className="text-xl font-bold">18 <span className="text-small font-normal text-default-500">(15%)</span></p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-medium font-semibold mb-4">Tiempo Promedio en Sitio</h3>
                  <div className="flex justify-center items-center h-64">
                    {/* This would be a chart in a real implementation */}
                    <div className="w-full h-48 bg-gray-100 rounded-lg relative">
                      <div className="absolute bottom-0 left-0 w-1/5 h-1/2 bg-primary rounded-t-lg ml-4"></div>
                      <div className="absolute bottom-0 left-0 w-1/5 h-3/4 bg-primary rounded-t-lg ml-16"></div>
                      <div className="absolute bottom-0 left-0 w-1/5 h-1/3 bg-primary rounded-t-lg ml-28"></div>
                      <div className="absolute bottom-0 left-0 w-1/5 h-2/3 bg-primary rounded-t-lg ml-40"></div>
                      <div className="absolute bottom-0 left-0 w-1/5 h-2/5 bg-primary rounded-t-lg ml-52"></div>
                      <div className="absolute bottom-0 left-0 w-1/5 h-3/5 bg-primary rounded-t-lg ml-64"></div>
                      <div className="absolute bottom-0 left-0 w-1/5 h-1/2 bg-primary rounded-t-lg ml-76"></div>
                      <div className="absolute inset-x-0 bottom-1/2 border-b border-dashed border-default-300"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Tiempo promedio</p>
                    <p className="text-2xl font-bold">48 minutos</p>
                    <p className="text-small text-default-500">Objetivo: 45 minutos</p>
                  </div>
                </Card>
              </div>
              
              <Card className="mt-6 p-4">
                <h3 className="text-medium font-semibold mb-4">Causas Frecuentes de Fallas</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge color="primary" size="lg">Falla eléctrica (32%)</Badge>
                  <Badge color="warning" size="lg">Falla mecánica (28%)</Badge>
                  <Badge color="secondary" size="lg">Desgaste de piezas (18%)</Badge>
                  <Badge color="danger" size="lg">Sobrecarga (12%)</Badge>
                  <Badge color="success" size="lg">Falla de sensor (6%)</Badge>
                  <Badge color="default" size="lg">Otros (4%)</Badge>
                </div>
              </Card>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="mantenimientos" title="Mantenimientos">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Reporte de Mantenimientos</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  type="date"
                  label="Fecha desde"
                  className="w-full md:w-48"
                />
                <Input
                  type="date"
                  label="Fecha hasta"
                  className="w-full md:w-48"
                />
                <Select
                  label="Tipo"
                  placeholder="Todos los tipos"
                  className="w-full md:w-48"
                >
                  <SelectItem key="all" value="all">Todos los tipos</SelectItem>
                  <SelectItem key="preventivo" value="preventivo">Preventivo</SelectItem>
                  <SelectItem key="correctivo" value="correctivo">Correctivo</SelectItem>
                  <SelectItem key="emergencia" value="emergencia">Emergencia</SelectItem>
                </Select>
                <Select
                  label="Estado"
                  placeholder="Todos los estados"
                  className="w-full md:w-48"
                >
                  <SelectItem key="all" value="all">Todos los estados</SelectItem>
                  <SelectItem key="pendiente" value="pendiente">Pendiente</SelectItem>
                  <SelectItem key="en_progreso" value="en_progreso">En Progreso</SelectItem>
                  <SelectItem key="completado" value="completado">Completado</SelectItem>
                </Select>
                <Button color="primary" className="self-end">
                  Generar Reporte
                </Button>
              </div>
              
              <Table 
                aria-label="Reporte de mantenimientos"
                removeWrapper
              >
                <TableHeader>
                  <TableColumn>ID</TableColumn>
                  <TableColumn>ASCENSOR</TableColumn>
                  <TableColumn>CLIENTE</TableColumn>
                  <TableColumn>TIPO</TableColumn>
                  <TableColumn>FECHA</TableColumn>
                  <TableColumn>TÉCNICO</TableColumn>
                  <TableColumn>ESTADO</TableColumn>
                  <TableColumn>TIEMPO</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>M001</TableCell>
                    <TableCell>A101</TableCell>
                    <TableCell>Edificio Torre Norte</TableCell>
                    <TableCell>Preventivo</TableCell>
                    <TableCell>15/10/2023</TableCell>
                    <TableCell>Carlos Mendez</TableCell>
                    <TableCell><Badge color="success">Completado</Badge></TableCell>
                    <TableCell>45 min</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:file-text" width={16} />}>
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M002</TableCell>
                    <TableCell>B205</TableCell>
                    <TableCell>Ministerio de Salud</TableCell>
                    <TableCell>Correctivo</TableCell>
                    <TableCell>12/10/2023</TableCell>
                    <TableCell>Maria Lopez</TableCell>
                    <TableCell><Badge color="success">Completado</Badge></TableCell>
                    <TableCell>1h 15min</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:file-text" width={16} />}>
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M003</TableCell>
                    <TableCell>C310</TableCell>
                    <TableCell>Centro Comercial Plaza</TableCell>
                    <TableCell>Preventivo</TableCell>
                    <TableCell>10/10/2023</TableCell>
                    <TableCell>Juan Perez</TableCell>
                    <TableCell><Badge color="success">Completado</Badge></TableCell>
                    <TableCell>50 min</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:file-text" width={16} />}>
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M004</TableCell>
                    <TableCell>A102</TableCell>
                    <TableCell>Edificio Torre Norte</TableCell>
                    <TableCell>Emergencia</TableCell>
                    <TableCell>16/10/2023</TableCell>
                    <TableCell>Sin asignar</TableCell>
                    <TableCell><Badge color="warning">Pendiente</Badge></TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary" disabled startContent={<Icon icon="lucide:file-text" width={16} />}>
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="tecnicos" title="Técnicos">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold">Rendimiento de Técnicos</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  type="date"
                  label="Fecha desde"
                  className="w-full md:w-48"
                />
                <Input
                  type="date"
                  label="Fecha hasta"
                  className="w-full md:w-48"
                />
                <Select
                  label="Técnico"
                  placeholder="Todos los técnicos"
                  className="w-full md:w-64"
                >
                  <SelectItem key="all" value="all">Todos los técnicos</SelectItem>
                  <SelectItem key="E001" value="E001">Juan Pérez</SelectItem>
                  <SelectItem key="E002" value="E002">María López</SelectItem>
                  <SelectItem key="E003" value="E003">Carlos Mendez</SelectItem>
                  <SelectItem key="E004" value="E004">Ana Gómez</SelectItem>
                </Select>
                <Button color="primary" className="self-end">
                  Generar Reporte
                </Button>
              </div>
              
              <Table 
                aria-label="Rendimiento de técnicos"
                removeWrapper
              >
                <TableHeader>
                  <TableColumn>TÉCNICO</TableColumn>
                  <TableColumn>MANTENIMIENTOS ASIGNADOS</TableColumn>
                  <TableColumn>COMPLETADOS</TableColumn>
                  <TableColumn>CUMPLIMIENTO</TableColumn>
                  <TableColumn>TIEMPO PROMEDIO</TableColumn>
                  <TableColumn>EMERGENCIAS ATENDIDAS</TableColumn>
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
                    <TableCell>30</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>93%</span>
                        <Progress value={93} color="primary" className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>45 min</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:file-text" width={16} />}>
                        Detalle
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
                    <TableCell>28</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>89%</span>
                        <Progress value={89} color="primary" className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>50 min</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:file-text" width={16} />}>
                        Detalle
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
                    <TableCell>26</TableCell>
                    <TableCell>22</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>85%</span>
                        <Progress value={85} color="warning" className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>55 min</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:file-text" width={16} />}>
                        Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <Icon icon="lucide:user" width={16} />
                        </div>
                        <span>Ana Gómez</span>
                      </div>
                    </TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>90%</span>
                        <Progress value={90} color="primary" className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>48 min</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>
                      <Button size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:file-text" width={16} />}>
                        Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};