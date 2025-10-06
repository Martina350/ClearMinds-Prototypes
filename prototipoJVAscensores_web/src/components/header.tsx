import React from "react";
import { Icon } from "@iconify/react";
import { Button, Input, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-content1 border-b border-divider py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            isIconOnly
            variant="light"
            aria-label="Toggle Sidebar"
            onPress={toggleSidebar}
          >
            <Icon icon="lucide:menu" width={20} />
          </Button>
          <div className="ml-4 hidden md:block">
            <h1 className="text-lg font-semibold">Sistema de Mantenimiento</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:block max-w-md">
            <Input
              placeholder="Buscar..."
              startContent={<Icon icon="lucide:search" width={16} />}
              size="sm"
              className="max-w-xs"
            />
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                aria-label="Notifications"
                className="relative"
              >
                <Badge content="3" color="danger" size="sm" className="absolute top-1 right-1">
                  <Icon icon="lucide:bell" width={20} />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Notificaciones">
              <DropdownItem key="alert1" description="Ascensor #A102 requiere mantenimiento urgente">
                Alerta de mantenimiento
              </DropdownItem>
              <DropdownItem key="alert2" description="Técnico Juan Pérez ha iniciado sesión">
                Registro de empleado
              </DropdownItem>
              <DropdownItem key="alert3" description="Ascensor #B205 reporta falla en el sistema eléctrico">
                Alerta de falla
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                aria-label="User Menu"
              >
                <Icon icon="lucide:user" width={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
              <DropdownItem key="profile">Mi Perfil</DropdownItem>
              <DropdownItem key="settings">Configuración</DropdownItem>
              <DropdownItem key="logout" color="danger">Cerrar Sesión</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};