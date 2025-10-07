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
    { path: "/dashboard", icon: "lucide:layout-dashboard", label: "Dashboard", color: "blue" },
    { path: "/maintenance", icon: "lucide:wrench", label: "Mantenimiento", color: "orange" },
    { path: "/employees", icon: "lucide:users", label: "Empleados", color: "green" },
    { path: "/alerts", icon: "lucide:bell", label: "Alertas", color: "red" },
    { path: "/map", icon: "lucide:map-pin", label: "Mapa", color: "purple" },
    { path: "/clients", icon: "lucide:building", label: "Clientes", color: "indigo" },
    { path: "/reports", icon: "lucide:file-text", label: "Reportes", color: "teal" },
    { path: "/settings", icon: "lucide:settings", label: "Configuración", color: "gray" },
  ];

  return (
    <aside
      className={`glass-effect border-r border-white/20 transition-all duration-300 ${
        isOpen ? "w-64" : "w-0 md:w-16"
      } overflow-hidden sticky top-0 h-screen`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-4 flex items-center ${isOpen ? "justify-start" : "justify-center"} animate-fade-in-up`}>
          <div className="bg-[#07ADDB] rounded-xl p-3 text-white shadow-lg">
            <Icon icon="lucide:elevator" width={24} height={24} />
          </div>
          {isOpen && (
            <div className="ml-3 h-8 flex items-center">
              <span className="text-lg font-bold text-gradient tracking-wide">JVASCENSORES</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-3">
          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Button
                    as={Link}
                    to={item.path}
                    variant={isActive ? "solid" : "light"}
                    color={isActive ? "primary" : "default"}
                    className={`w-full justify-start transition-all duration-200 ${
                      !isOpen && "justify-center"
                    } ${
                      isActive 
                        ? "bg-[#07ADDB] text-white shadow-lg" 
                        : "hover:bg-white/20 hover:scale-105"
                    }`}
                    startContent={isOpen ? <Icon icon={item.icon} width={20} /> : undefined}
                    size="md"
                  >
                    {!isOpen ? <Icon icon={item.icon} width={20} /> : item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/20 animate-fade-in-up">
          <div className={`flex items-center ${isOpen ? "justify-start" : "justify-center"}`}>
            <div className="w-10 h-10 rounded-full bg-[#07ADDB] flex items-center justify-center text-white shadow-lg">
              <Icon icon="lucide:user" width={18} />
            </div>
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-semibold text-slate-800">Admin</p>
                <p className="text-xs text-slate-500">admin@jvascensores.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};