import React from "react";
import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Badge, Input, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/react";

// Sample data
const employeeData = [
  { 
    id: "E001", 
    name: "Juan Pérez", 
    role: "Técnico Senior", 
    status: "Activo", 
    checkIn: "08:30", 
    checkOut: "17:45",
    location: "Torre Norte"
  },
  { 
    id: "E002", 
    name: "María López", 
    role: "Técnico", 
    status: "Activo", 
    checkIn: "08:15", 
    checkOut: "-",
    location: "Torre Sur"
  },
  { 
    id: "E003", 
    name: "Carlos Mendez", 
    role: "Técnico Senior", 
    status: "Inactivo", 
    checkIn: "-", 
    checkOut: "-",
    location: "-"
  },
  { 
    id: "E004", 
    name: "Ana Gómez", 
    role: "Técnico", 
    status: "Activo", 
    checkIn: "09:00", 
    checkOut: "-",
    location: "Torre Este"
  },
];

export const EmployeeTracking: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredData = employeeData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = () => {
    addToast({
      title: "Registro de entrada",
      description: "Se ha registrado la entrada del empleado",
      severity: "success",
    });
  };

  const handleCheckOut = () => {
    addToast({
      title: "Registro de salida",
      description: "Se ha registrado la salida del empleado",
      severity: "success",
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Activo":
        return <Badge color="success">{status}</Badge>;
      case "Inactivo":
        return <Badge color="danger">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Control de Empleados</h2>
          <p className="text-small text-default-500">Registro de entrada y salida</p>
        </div>
        <div className="flex gap-2">
          <Button color="primary" startContent={<Icon icon="lucide:log-in" />} onPress={handleCheckIn}>
            Entrada
          </Button>
          <Button color="danger" variant="flat" startContent={<Icon icon="lucide:log-out" />} onPress={handleCheckOut}>
            Salida
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <Input
          placeholder="Buscar empleado..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          startContent={<Icon icon="lucide:search" className="text-default-400" width={16} />}
          className="mb-4"
        />

        <Table 
          aria-label="Tabla de empleados"
          removeWrapper
          classNames={{
            base: "max-h-[400px] overflow-auto",
          }}
        >
          <TableHeader>
            <TableColumn>EMPLEADO</TableColumn>
            <TableColumn className="hidden md:table-cell">ROL</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn className="hidden md:table-cell">ENTRADA</TableColumn>
            <TableColumn className="hidden md:table-cell">SALIDA</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay empleados registrados">
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar 
                      name={item.name} 
                      size="sm" 
                      src={`https://img.heroui.chat/image/avatar?w=200&h=200&u=${item.id}`} 
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-tiny text-default-500">{item.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{item.role}</TableCell>
                <TableCell>{renderStatusBadge(item.status)}</TableCell>
                <TableCell className="hidden md:table-cell">{item.checkIn}</TableCell>
                <TableCell className="hidden md:table-cell">{item.checkOut}</TableCell>
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