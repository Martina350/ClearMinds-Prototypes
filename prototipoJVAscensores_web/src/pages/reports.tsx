import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/react";

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const exportDisc = useDisclosure();
  
  const handleGenerateReport = () => {
    exportDisc.onOpen();
  };

  return (
    <div className="space-y-8 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Reportes y Análisis</h1>
          <p className="text-slate-600">Visualiza y genera reportes descargables</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="flat" 
            className="btn-modern"
            startContent={<Icon icon="lucide:filter" width={16} />}
          >
            Filtros
          </Button>
          <Button 
            color="primary" 
            className="btn-modern"
            startContent={<Icon icon="lucide:download" width={16} />} 
            onPress={handleGenerateReport}
          >
          Exportar Reportes
        </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#07ADDB]">
              <Icon icon="lucide:trending-up" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Eficiencia General</p>
              <p className="text-2xl font-bold text-slate-800">87%</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#ABD9D3]">
              <Icon icon="lucide:check-circle" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Mantenimientos Completados</p>
              <p className="text-2xl font-bold text-slate-800">156</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-orange-500">
              <Icon icon="lucide:clock" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-slate-800">45m</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#4F90DB]">
              <Icon icon="lucide:users" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Técnicos Activos</p>
              <p className="text-2xl font-bold text-slate-800">12</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Tabs 
        aria-label="Opciones de reportes" 
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
          key="dashboard" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:bar-chart-3" width={16} />
              <span>Dashboard</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#07ADDB]">
                  <Icon icon="lucide:bar-chart-3" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Dashboard de Rendimiento</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  type="date"
                  label="Fecha desde"
                  className="input-modern w-full md:w-48"
                  startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
                />
                <Input
                  type="date"
                  label="Fecha hasta"
                  className="input-modern w-full md:w-48"
                  startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
                />
                <Select
                  label="Cliente"
                  placeholder="Todos los clientes"
                  className="input-modern w-full md:w-64"
                  startContent={<Icon icon="lucide:building" width={16} className="text-slate-400" />}
                >
                  <SelectItem key="all">Todos los clientes</SelectItem>
                  <SelectItem key="1">Edificio Torre Norte</SelectItem>
                  <SelectItem key="2">Ministerio de Salud</SelectItem>
                  <SelectItem key="3">Centro Comercial Plaza</SelectItem>
                </Select>
                <Button 
                  color="primary" 
                  className="btn-modern self-end"
                  startContent={<Icon icon="lucide:filter" width={16} />}
                >
                  Aplicar Filtros
                </Button>
              </div>
              
              {/* KPIs principales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-modern p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#07ADDB]">
                      <Icon icon="lucide:check-circle" className="text-white" width={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Cumplimiento de Mantenimientos</h3>
                  </div>
                  <div className="flex justify-center items-center h-64">
                    {/* Donut SVG con progreso */}
                    <svg viewBox="0 0 140 140" className="w-48 h-48">
                      <defs>
                        <linearGradient id="gradRing" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                      </defs>
                      <circle cx="70" cy="70" r="55" stroke="#cfe0ff" strokeWidth="12" fill="none" />
                      {(() => {
                        const percent = 85;
                        const radius = 55;
                        const circumference = 2 * Math.PI * radius;
                        const offset = circumference * (1 - percent / 100);
                        return (
                          <circle cx="70" cy="70" r={radius} stroke="url(#gradRing)" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={`${circumference}`} strokeDashoffset={`${offset}`} transform="rotate(-90 70 70)" />
                        );
                      })()}
                      <text x="70" y="76" textAnchor="middle" style={{ fontSize: '28px', fontWeight: 700 }}>
                        85%
                      </text>
                    </svg>
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
                
                <Card className="p-4 bg-orange-50">
                  <h3 className="text-medium font-semibold mb-4">Tipos de Mantenimiento</h3>
                  {/* Barras horizontales limpias con porcentajes */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-small mb-1">
                        <span className="font-medium">Preventivos</span>
                        <span className="text-default-500">60%</span>
                      </div>
                      <div className="h-3 rounded-full bg-default-200 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="mt-1 text-small text-default-600">72 mantenimientos</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-small mb-1">
                        <span className="font-medium">Correctivos</span>
                        <span className="text-default-500">25%</span>
                      </div>
                      <div className="h-3 rounded-full bg-default-200 overflow-hidden">
                        <div className="h-full bg-warning rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <p className="mt-1 text-small text-default-600">30 mantenimientos</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-small mb-1">
                        <span className="font-medium">Emergencias</span>
                        <span className="text-default-500">15%</span>
                      </div>
                      <div className="h-3 rounded-full bg-default-200 overflow-hidden">
                        <div className="h-full bg-danger rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <p className="mt-1 text-small text-default-600">18 mantenimientos</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-slate-50">
                  <h3 className="text-medium font-semibold mb-4">Tiempo Promedio en Sitio</h3>
                  <div className="flex justify-center items-center h-64">
                    {/* Mini gráfico de líneas/área usando SVG (sin librerías) */}
                    <svg viewBox="0 0 300 160" className="w-full h-48 rounded-lg bg-white/60">
                      {/* línea objetivo 45 min */}
                      <line x1="0" y1="85" x2="300" y2="85" strokeDasharray="6 6" stroke="#a3a3a3" />
                      {/* área */}
                      <defs>
                        <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <path d="M0,110 L40,70 L80,95 L120,60 L160,90 L200,78 L240,88 L280,72 L300,72 L300,160 L0,160 Z" fill="url(#areaFill)" />
                      {/* línea */}
                      <path d="M0,110 L40,70 L80,95 L120,60 L160,90 L200,78 L240,88 L280,72 L300,72" stroke="#2563eb" strokeWidth="3" fill="none" />
                      {/* puntos */}
                      <g fill="#2563eb">
                        <circle cx="40" cy="70" r="3" />
                        <circle cx="80" cy="95" r="3" />
                        <circle cx="120" cy="60" r="3" />
                        <circle cx="160" cy="90" r="3" />
                        <circle cx="200" cy="78" r="3" />
                        <circle cx="240" cy="88" r="3" />
                        <circle cx="280" cy="72" r="3" />
                      </g>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Tiempo promedio</p>
                    <p className="text-2xl font-bold">48 minutos</p>
                    <p className="text-small text-default-500">Objetivo: 45 minutos (línea punteada)</p>
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
        <Tab 
          key="mantenimientos" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:wrench" width={16} />
              <span>Mantenimientos</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#ABD9D3]">
                  <Icon icon="lucide:wrench" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Reporte de Mantenimientos</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  type="date"
                  label="Fecha desde"
                  className="input-modern w-full md:w-48"
                  startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
                />
                <Input
                  type="date"
                  label="Fecha hasta"
                  className="input-modern w-full md:w-48"
                  startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
                />
                <Select
                  label="Tipo"
                  placeholder="Todos los tipos"
                  className="input-modern w-full md:w-48"
                  startContent={<Icon icon="lucide:filter" width={16} className="text-slate-400" />}
                >
                  <SelectItem key="all">Todos los tipos</SelectItem>
                  <SelectItem key="preventivo">Preventivo</SelectItem>
                  <SelectItem key="correctivo">Correctivo</SelectItem>
                  <SelectItem key="emergencia">Emergencia</SelectItem>
                </Select>
                <Select
                  label="Estado"
                  placeholder="Todos los estados"
                  className="w-full md:w-48"
                >
                  <SelectItem key="all">Todos los estados</SelectItem>
                  <SelectItem key="pendiente">Pendiente</SelectItem>
                  <SelectItem key="en_progreso">En Progreso</SelectItem>
                  <SelectItem key="completado">Completado</SelectItem>
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
        <Tab 
          key="tecnicos" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:users" width={16} />
              <span>Técnicos</span>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-orange-500">
                  <Icon icon="lucide:users" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Rendimiento de Técnicos</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  type="date"
                  label="Fecha desde"
                  className="input-modern w-full md:w-48"
                  startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
                />
                <Input
                  type="date"
                  label="Fecha hasta"
                  className="input-modern w-full md:w-48"
                  startContent={<Icon icon="lucide:calendar" width={16} className="text-slate-400" />}
                />
                <Select
                  label="Técnico"
                  placeholder="Todos los técnicos"
                  className="input-modern w-full md:w-64"
                  startContent={<Icon icon="lucide:user" width={16} className="text-slate-400" />}
                >
                  <SelectItem key="all">Todos los técnicos</SelectItem>
                  <SelectItem key="E001">Juan Pérez</SelectItem>
                  <SelectItem key="E002">María López</SelectItem>
                  <SelectItem key="E003">Carlos Mendez</SelectItem>
                  <SelectItem key="E004">Ana Gómez</SelectItem>
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

      {/* Modal de Exportación */}
      <Modal 
        isOpen={exportDisc.isOpen} 
        onOpenChange={exportDisc.onOpenChange} 
        size="lg"
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
                    <Icon icon="lucide:download" className="text-white" width={20} />
                  </div>
                  <h3 className="text-xl font-semibold">Exportar Reportes</h3>
                </div>
                <p className="text-sm text-slate-600">Configure los parámetros para generar el reporte</p>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select 
                    label="Formato"
                    className="input-modern"
                    startContent={<Icon icon="lucide:file" width={16} className="text-slate-400" />}
                  >
                    <SelectItem key="pdf">PDF</SelectItem>
                    <SelectItem key="xlsx">Excel (.xlsx)</SelectItem>
                    <SelectItem key="csv">CSV</SelectItem>
                  </Select>
                  <Select 
                    label="Rango de datos"
                    className="input-modern"
                    startContent={<Icon icon="lucide:filter" width={16} className="text-slate-400" />}
                  >
                    <SelectItem key="visible">Solo lo visible</SelectItem>
                    <SelectItem key="filtros">Aplicando filtros</SelectItem>
                    <SelectItem key="completo">Todo el periodo</SelectItem>
                  </Select>
                  <Input 
                    type="email" 
                    label="Enviar copia a" 
                    placeholder="correo@dominio.com" 
                    className="input-modern md:col-span-2"
                    startContent={<Icon icon="lucide:mail" width={16} className="text-slate-400" />}
                  />
                  <div className="flex items-center gap-4 md:col-span-2 p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center space-x-2">
                      <Icon icon="lucide:pie-chart" width={16} className="text-blue-600" />
                      <Switch defaultSelected size="sm">Incluir gráficos</Switch>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon icon="lucide:archive" width={16} className="text-orange-600" />
                      <Switch size="sm">Comprimir en ZIP</Switch>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="pt-4">
                <Button 
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
                  onPress={()=> { 
                    addToast({ 
                      title: "Reporte en cola", 
                      description: "Te avisaremos al finalizar", 
                      severity: "success" 
                    }); 
                    onClose(); 
                  }} 
                  startContent={<Icon icon="lucide:download" width={16} />}
                >
                  Exportar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};