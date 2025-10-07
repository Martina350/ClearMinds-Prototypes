import React from "react";
import { Icon } from "@iconify/react";
import { Button, Image } from "@heroui/react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  // Navigation items
  const navItems = [
    { path: "/dashboard", icon: "lucide:layout-dashboard", label: "Dashboard" },
    { path: "/maintenance", icon: "lucide:wrench", label: "Mantenimiento" },
    { path: "/employees", icon: "lucide:users", label: "Empleados" },
    { path: "/alerts", icon: "lucide:bell", label: "Alertas" },
    { path: "/map", icon: "lucide:map-pin", label: "Mapa" },
    { path: "/clients", icon: "lucide:building", label: "Clientes" },
    { path: "/reports", icon: "lucide:file-text", label: "Reportes" },
    { path: "/settings", icon: "lucide:settings", label: "Configuración" },
  ];

  return (
    <aside
      className={`bg-content1 border-r border-divider transition-all duration-300 ${
        isOpen ? "w-64" : "w-0 md:w-16"
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-4 flex items-center ${isOpen ? "justify-start" : "justify-center"}`}>
          <div className="bg-primary rounded-md p-2 text-white">
            <Icon icon="lucide:elevator" width={24} height={24} />
          </div>
          {isOpen && (
            <div className="ml-2 h-8 flex items-center">
              <span className="text-base font-semibold tracking-wide">JVASCENSORES</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Button
                  as={Link}
                  to={item.path}
                  variant="flat"
                  color={location.pathname === item.path ? "primary" : "default"}
                  className={`w-full justify-start ${!isOpen && "justify-center"}`}
                  startContent={isOpen ? <Icon icon={item.icon} width={20} /> : undefined}
                >
                  {!isOpen ? <Icon icon={item.icon} width={20} /> : item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-divider">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <Icon icon="lucide:user" width={16} />
            </div>
            {isOpen && (
              <div className="ml-2">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-default-500">admin@jbaasensores.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};