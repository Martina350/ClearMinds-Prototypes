import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Select, SelectItem, Input, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { MapView } from "../components/map-view";
// @ts-ignore - tipos de react-leaflet se omiten hasta instalar dependencias
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const MapPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("tiempo-real");
  const [selectedTechRoute, setSelectedTechRoute] = React.useState<string>("all");
  const [selectedTechHistory, setSelectedTechHistory] = React.useState<string>("all");

  // Coordenadas base Quito
  const quitoCenter: [number, number] = [-0.1807, -78.4678];

  // Rutas de ejemplo por técnico (Rutas Optimizadas)
  const technicianRoutes: Record<string, Array<[number, number]>> = {
    E001: [
      [-0.19, -78.49],
      [-0.185, -78.48],
      [-0.178, -78.472],
      [-0.17, -78.465],
    ],
    E002: [
      [-0.2, -78.46],
      [-0.195, -78.47],
      [-0.188, -78.475],
      [-0.182, -78.48],
    ],
    E003: [
      [-0.165, -78.45],
      [-0.168, -78.463],
      [-0.172, -78.472],
      [-0.18, -78.482],
    ],
    E004: [
      [-0.175, -78.49],
      [-0.17, -78.48],
      [-0.165, -78.47],
      [-0.16, -78.465],
    ],
  };

  // Historial de ubicaciones por técnico
  const technicianHistory: Record<string, Array<[number, number]>> = {
    E001: [
      [-0.19, -78.49],
      [-0.188, -78.487],
      [-0.185, -78.483],
      [-0.182, -78.479],
      [-0.179, -78.474],
    ],
    E002: [
      [-0.2, -78.46],
      [-0.198, -78.465],
      [-0.195, -78.47],
      [-0.192, -78.475],
      [-0.19, -78.48],
    ],
    E003: [
      [-0.165, -78.45],
      [-0.167, -78.456],
      [-0.169, -78.462],
      [-0.171, -78.468],
      [-0.173, -78.474],
    ],
    E004: [
      [-0.175, -78.49],
      [-0.172, -78.485],
      [-0.17, -78.48],
      [-0.167, -78.475],
      [-0.165, -78.47],
    ],
  };

  const openGoogleMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };
  
  return (
    <div className="space-y-8 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Mapa de Ascensores</h1>
          <p className="text-slate-600">Monitoreo en tiempo real y gestión de rutas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            placeholder="Filtrar por zona"
            className="input-modern w-48"
            startContent={<Icon icon="lucide:map-pin" width={16} className="text-slate-400" />}
          >
            <SelectItem key="all">Todas las zonas</SelectItem>
            <SelectItem key="norte">Norte</SelectItem>
            <SelectItem key="sur">Sur</SelectItem>
            <SelectItem key="este">Este</SelectItem>
            <SelectItem key="oeste">Oeste</SelectItem>
          </Select>
          <Button 
            color="primary" 
            className="btn-modern"
            startContent={<Icon icon="lucide:refresh-cw" width={16} />}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#07ADDB]">
              <Icon icon="lucide:elevator" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Ascensores Activos</p>
              <p className="text-2xl font-bold text-slate-800">24</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#ABD9D3]">
              <Icon icon="lucide:users" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Técnicos Activos</p>
              <p className="text-2xl font-bold text-slate-800">6</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-orange-500">
              <Icon icon="lucide:route" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Rutas Optimizadas</p>
              <p className="text-2xl font-bold text-slate-800">12</p>
            </div>
          </div>
        </Card>
        <Card className="card-modern p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#4F90DB]">
              <Icon icon="lucide:clock" className="text-white" width={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-slate-800">45m</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Tabs 
        aria-label="Opciones de mapa" 
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
          key="tiempo-real" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:activity" width={16} />
              <span>Tiempo Real</span>
              <Badge color="primary" size="sm">24</Badge>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#ABD9D3]">
                  <Icon icon="lucide:activity" className="text-white" width={20} />
                </div>
                <h2 className="text-xl font-semibold">Monitoreo en Tiempo Real</h2>
              </div>
            </CardHeader>
            <CardBody>
              <MapView />
            </CardBody>
          </Card>
        </Tab>
        <Tab 
          key="rutas" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:route" width={16} />
              <span>Rutas Optimizadas</span>
              <Badge color="secondary" size="sm">12</Badge>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#07ADDB]">
                    <Icon icon="lucide:route" className="text-white" width={20} />
                    </div>
                  <h2 className="text-xl font-semibold">Rutas Optimizadas</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <Select 
                    label="Técnico" 
                    selectedKeys={[selectedTechRoute]} 
                    onSelectionChange={(k)=>setSelectedTechRoute(Array.from(k as Set<string>)[0] || "all")} 
                    className="input-modern min-w-52"
                    startContent={<Icon icon="lucide:user" width={16} className="text-slate-400" />}
                  >
                    <SelectItem key="all">Todos los técnicos</SelectItem>
                    <SelectItem key="E001">Juan Pérez</SelectItem>
                    <SelectItem key="E002">María López</SelectItem>
                    <SelectItem key="E003">Carlos Mendez</SelectItem>
                    <SelectItem key="E004">Ana Gómez</SelectItem>
                  </Select>
                  <Button 
                    color="primary" 
                    className="btn-modern"
                    startContent={<Icon icon="lucide:route" width={16} />}
                  >
                          Optimizar Ruta
                        </Button>
                      </div>
                    </div>
            </CardHeader>
            <CardBody>
              <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-white/20">
                <MapContainer center={quitoCenter} zoom={13} className="w-full h-full">
                  <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Mapa">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satélite">
                      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" />
                    </LayersControl.BaseLayer>
                  </LayersControl>

                  {Object.entries(technicianRoutes)
                    .filter(([id]) => selectedTechRoute === "all" || id === selectedTechRoute)
                    .map(([id, points]) => (
                      <React.Fragment key={id}>
                        <Polyline 
                          positions={points} 
                          pathOptions={{ 
                            color: id === selectedTechRoute || selectedTechRoute === "all" ? "#2563eb" : "#94a3b8", 
                            weight: 5,
                            opacity: 0.8
                          }} 
                        />
                        {points.map(([lat, lng], idx) => (
                          <CircleMarker 
                            key={`${id}-${idx}`} 
                            center={[lat, lng]} 
                            radius={idx === 0 ? 8 : 6} 
                            pathOptions={{ 
                              color: idx === 0 ? "#22c55e" : idx === points.length - 1 ? "#ef4444" : "#2563eb", 
                              fillOpacity: 0.9,
                              weight: 2
                            }} 
                            eventHandlers={{ click: () => openGoogleMaps(lat, lng) }}
                          >
                            <Popup>
                              <div className="p-2">
                                <p className="font-medium text-slate-800">{id} - Punto {idx + 1}</p>
                                <p className="text-sm text-slate-600 mb-2">
                                  {idx === 0 ? "Punto de inicio" : idx === points.length - 1 ? "Punto final" : "Punto intermedio"}
                                </p>
                                <Button 
                                  size="sm" 
                                  variant="flat" 
                                  color="primary"
                                  className="btn-modern"
                                  onPress={() => openGoogleMaps(lat, lng)}
                                >
                                  <Icon icon="lucide:map-pin" className="mr-1" /> Abrir en Google Maps
                                </Button>
                  </div>
                            </Popup>
                          </CircleMarker>
                        ))}
                      </React.Fragment>
                  ))}
                </MapContainer>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab 
          key="historico" 
          title={
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:history" width={16} />
              <span>Histórico</span>
              <Badge color="warning" size="sm">48h</Badge>
            </div>
          }
        >
          <Card className="card-modern mt-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-orange-500">
                    <Icon icon="lucide:history" className="text-white" width={20} />
                  </div>
                  <h2 className="text-xl font-semibold">Histórico de Ubicaciones</h2>
                </div>
                <Select 
                  label="Técnico" 
                  selectedKeys={[selectedTechHistory]} 
                  onSelectionChange={(k)=>setSelectedTechHistory(Array.from(k as Set<string>)[0] || "all")} 
                  className="input-modern min-w-52"
                  startContent={<Icon icon="lucide:user" width={16} className="text-slate-400" />}
                >
                  <SelectItem key="all">Todos los técnicos</SelectItem>
                  <SelectItem key="E001">Juan Pérez</SelectItem>
                  <SelectItem key="E002">María López</SelectItem>
                  <SelectItem key="E003">Carlos Mendez</SelectItem>
                  <SelectItem key="E004">Ana Gómez</SelectItem>
                </Select>
              </div>
            </CardHeader>
            <CardBody>
              <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-white/20">
                <MapContainer center={quitoCenter} zoom={13} className="w-full h-full">
                  <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Mapa">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satélite">
                      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" />
                    </LayersControl.BaseLayer>
                  </LayersControl>

                  {Object.entries(technicianHistory)
                    .filter(([id]) => selectedTechHistory === "all" || id === selectedTechHistory)
                    .map(([id, points]) => (
                      <React.Fragment key={id}>
                        <Polyline 
                          positions={points} 
                          pathOptions={{ 
                            color: "#0ea5e9", 
                            dashArray: "6 8", 
                            weight: 4,
                            opacity: 0.7
                          }} 
                        />
                        {points.map(([lat, lng], idx) => (
                          <CircleMarker 
                            key={`${id}-h-${idx}`} 
                            center={[lat, lng]} 
                            radius={6} 
                            pathOptions={{ 
                              color: idx === 0 ? "#3b82f6" : idx === points.length - 1 ? "#22c55e" : "#0ea5e9", 
                              fillOpacity: 0.9,
                              weight: 2
                            }} 
                            eventHandlers={{ click: () => openGoogleMaps(lat, lng) }}
                          >
                            <Popup>
                              <div className="p-2">
                                <p className="font-medium text-slate-800">{id} - Historial {idx + 1}</p>
                                <p className="text-sm text-slate-600 mb-2">
                                  {idx === 0 ? "Ubicación inicial" : idx === points.length - 1 ? "Última ubicación" : "Punto intermedio"}
                                </p>
                                <Button 
                                  size="sm" 
                                  variant="flat" 
                                  color="primary"
                                  className="btn-modern"
                                  onPress={() => openGoogleMaps(lat, lng)}
                                >
                                  <Icon icon="lucide:map-pin" className="mr-1" /> Abrir en Google Maps
                          </Button>
                        </div>
                            </Popup>
                          </CircleMarker>
                        ))}
                      </React.Fragment>
                  ))}
                </MapContainer>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};