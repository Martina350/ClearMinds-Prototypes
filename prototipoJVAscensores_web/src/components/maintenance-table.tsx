import React from "react";
import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Badge, Input, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/react";

// Sample data
const maintenanceData = [
  { 
    id: "M001", 
    elevator: "A101", 
    location: "Torre Norte, Piso 1", 
    type: "Preventivo", 
    status: "Pendiente", 
    date: "2023-10-15", 
    assignedTo: "Carlos Mendez" 
  },
  { 
    id: "M002", 
    elevator: "B205", 
    location: "Torre Sur, Piso 5", 
    type: "Correctivo", 
    status: "En Progreso", 
    date: "2023-10-12", 
    assignedTo: "Maria Lopez" 
  },
  { 
    id: "M003", 
    elevator: "C310", 
    location: "Torre Este, Piso 10", 
    type: "Preventivo", 
    status: "Completado", 
    date: "2023-10-10", 
    assignedTo: "Juan Perez" 
  },
  { 
    id: "M004", 
    elevator: "A102", 
    location: "Torre Norte, Piso 2", 
    type: "Emergencia", 
    status: "Pendiente", 
    date: "2023-10-16", 
    assignedTo: "Sin asignar" 
  },
];

export const MaintenanceTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  
  const filteredData = maintenanceData.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.elevator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddMaintenance = () => {
    addToast({
      title: "Nuevo mantenimiento",
      description: "Se ha creado un nuevo registro de mantenimiento",
      severity: "success",
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Pendiente":
        return <Badge color="warning">{status}</Badge>;
      case "En Progreso":
        return <Badge color="primary">{status}</Badge>;
      case "Completado":
        return <Badge color="success">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Mantenimientos</h2>
          <p className="text-small text-default-500">Gestión de mantenimientos de ascensores</p>
        </div>
        <Button color="primary" startContent={<Icon icon="lucide:plus" />} onPress={handleAddMaintenance}>
          Nuevo
        </Button>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <Input
            placeholder="Buscar por ID, ascensor, ubicación..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<Icon icon="lucide:search" className="text-default-400" width={16} />}
            className="flex-1"
          />
          <Select
            placeholder="Filtrar por estado"
            selectedKeys={[statusFilter]}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48"
          >
            <SelectItem key="all" value="all">Todos</SelectItem>
            <SelectItem key="Pendiente" value="Pendiente">Pendiente</SelectItem>
            <SelectItem key="En Progreso" value="En Progreso">En Progreso</SelectItem>
            <SelectItem key="Completado" value="Completado">Completado</SelectItem>
          </Select>
        </div>

        <Table 
          aria-label="Tabla de mantenimientos"
          removeWrapper
          classNames={{
            base: "max-h-[400px] overflow-auto",
          }}
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>ASCENSOR</TableColumn>
            <TableColumn className="hidden md:table-cell">UBICACIÓN</TableColumn>
            <TableColumn className="hidden md:table-cell">TIPO</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn className="hidden md:table-cell">FECHA</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay registros de mantenimiento">
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.elevator}</TableCell>
                <TableCell className="hidden md:table-cell">{item.location}</TableCell>
                <TableCell className="hidden md:table-cell">{item.type}</TableCell>
                <TableCell>{renderStatusBadge(item.status)}</TableCell>
                <TableCell className="hidden md:table-cell">{item.date}</TableCell>
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
  );
};