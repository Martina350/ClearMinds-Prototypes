import React from "react";
import { Icon } from "@iconify/react";
import { Button, Input, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="glass-effect border-b border-white/20 py-3 px-6 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Button
            isIconOnly
            variant="light"
            aria-label="Toggle Sidebar"
            onPress={toggleSidebar}
            className="btn-modern hover:bg-white/20"
            size="sm"
          >
            <Icon icon="lucide:menu" width={20} />
          </Button>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gradient">Sistema de Mantenimiento</h1>
            <p className="text-sm text-slate-600">JV Ascensores - Panel de Control</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden lg:block">
            <Input
              placeholder="Buscar ascensores, técnicos, clientes..."
              startContent={<Icon icon="lucide:search" width={16} className="text-slate-400" />}
              size="sm"
              className="input-modern w-80"
              classNames={{
                input: "text-sm",
                inputWrapper: "bg-white/80 backdrop-blur-sm"
              }}
            />
          </div>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                aria-label="Notifications"
                className="btn-modern hover:bg-white/20 relative"
                size="sm"
              >
                <Badge content="3" color="danger" size="sm" className="absolute -top-1 -right-1">
                  <Icon icon="lucide:bell" width={20} />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Notificaciones"
              className="w-80"
              classNames={{
                base: "bg-white/95 backdrop-blur-md border border-white/20 shadow-xl"
              }}
            >
              <DropdownItem 
                key="alert1" 
                description="Ascensor #A102 requiere mantenimiento urgente"
                className="hover:bg-blue-50"
                startContent={<Icon icon="lucide:alert-triangle" className="text-orange-500" />}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Alerta de mantenimiento</span>
                  <span className="text-xs text-slate-500">Hace 5 minutos</span>
                </div>
              </DropdownItem>
              <DropdownItem 
                key="alert2" 
                description="Técnico Juan Pérez ha iniciado sesión"
                className="hover:bg-green-50"
                startContent={<Icon icon="lucide:user-check" className="text-green-500" />}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Registro de empleado</span>
                  <span className="text-xs text-slate-500">Hace 15 minutos</span>
                </div>
              </DropdownItem>
              <DropdownItem 
                key="alert3" 
                description="Ascensor #B205 reporta falla en el sistema eléctrico"
                className="hover:bg-red-50"
                startContent={<Icon icon="lucide:zap" className="text-red-500" />}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Alerta de falla</span>
                  <span className="text-xs text-slate-500">Hace 1 hora</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                aria-label="User Menu"
                className="btn-modern hover:bg-white/20"
                size="sm"
              >
                <div className="w-8 h-8 rounded-full bg-[#07ADDB] flex items-center justify-center">
                  <Icon icon="lucide:user" width={16} className="text-white" />
                </div>
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="User Actions"
              classNames={{
                base: "bg-white/95 backdrop-blur-md border border-white/20 shadow-xl"
              }}
            >
              <DropdownItem 
                key="profile" 
                startContent={<Icon icon="lucide:user" />}
                className="hover:bg-blue-50"
              >
                Mi Perfil
              </DropdownItem>
              <DropdownItem 
                key="settings" 
                startContent={<Icon icon="lucide:settings" />}
                className="hover:bg-blue-50"
              >
                Configuración
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger" 
                startContent={<Icon icon="lucide:log-out" />}
                className="hover:bg-red-50"
              >
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};