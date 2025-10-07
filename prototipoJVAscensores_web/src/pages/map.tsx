import React from "react";
import { Card, CardHeader, CardBody, Tabs, Tab, Button, Select, SelectItem, Input } from "@heroui/react";
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Mapa de Ascensores</h1>
        <div className="flex gap-2">
          <Select
            placeholder="Filtrar por zona"
            className="w-40"
          >
            <SelectItem key="all">Todas las zonas</SelectItem>
            <SelectItem key="norte">Norte</SelectItem>
            <SelectItem key="sur">Sur</SelectItem>
            <SelectItem key="este">Este</SelectItem>
            <SelectItem key="oeste">Oeste</SelectItem>
          </Select>
          <Button color="primary" startContent={<Icon icon="lucide:refresh-cw" />}>
            Actualizar
          </Button>
        </div>
      </div>
      
      <Tabs 
        aria-label="Opciones de mapa" 
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
        className="w-full"
      >
        <Tab key="tiempo-real" title="Tiempo Real">
          <Card className="mt-4">
            <CardBody>
              <MapView />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="rutas" title="Rutas Optimizadas">
          <Card className="mt-4">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Rutas Optimizadas</h2>
              <div className="flex gap-3 items-center">
                <Select label="Técnico" selectedKeys={[selectedTechRoute]} onSelectionChange={(k)=>setSelectedTechRoute(Array.from(k as Set<string>)[0] || "all")} className="min-w-52">
                  <SelectItem key="all">Todos los técnicos</SelectItem>
                  <SelectItem key="E001">Juan Pérez</SelectItem>
                  <SelectItem key="E002">María López</SelectItem>
                  <SelectItem key="E003">Carlos Mendez</SelectItem>
                  <SelectItem key="E004">Ana Gómez</SelectItem>
                </Select>
                <Button color="primary" startContent={<Icon icon="lucide:route" />}>Optimizar Ruta</Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="w-full h-[600px] rounded-lg overflow-hidden">
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
                        <Polyline positions={points} pathOptions={{ color: id === selectedTechRoute || selectedTechRoute === "all" ? "#2563eb" : "#94a3b8", weight: 5 }} />
                        {points.map(([lat, lng], idx) => (
                          <CircleMarker key={`${id}-${idx}`} center={[lat, lng]} radius={idx === 0 ? 6 : 5} pathOptions={{ color: idx === 0 ? "#22c55e" : idx === points.length - 1 ? "#ef4444" : "#2563eb", fillOpacity: 0.9 }} eventHandlers={{ click: () => openGoogleMaps(lat, lng) }}>
                            <Popup>
                              <div>
                                <p className="font-medium">{id} - Punto {idx + 1}</p>
                                <Button size="sm" variant="flat" onPress={() => openGoogleMaps(lat, lng)}>
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
        <Tab key="historico" title="Histórico de Ubicaciones">
          <Card className="mt-4">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Histórico de Ubicaciones</h2>
              <Select label="Técnico" selectedKeys={[selectedTechHistory]} onSelectionChange={(k)=>setSelectedTechHistory(Array.from(k as Set<string>)[0] || "all")} className="min-w-52">
                <SelectItem key="all">Todos los técnicos</SelectItem>
                <SelectItem key="E001">Juan Pérez</SelectItem>
                <SelectItem key="E002">María López</SelectItem>
                <SelectItem key="E003">Carlos Mendez</SelectItem>
                <SelectItem key="E004">Ana Gómez</SelectItem>
              </Select>
            </CardHeader>
            <CardBody>
              <div className="w-full h-[600px] rounded-lg overflow-hidden">
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
                        <Polyline positions={points} pathOptions={{ color: "#0ea5e9", dashArray: "6 8", weight: 4 }} />
                        {points.map(([lat, lng], idx) => (
                          <CircleMarker key={`${id}-h-${idx}`} center={[lat, lng]} radius={5} pathOptions={{ color: idx === 0 ? "#3b82f6" : idx === points.length - 1 ? "#22c55e" : "#0ea5e9", fillOpacity: 0.9 }} eventHandlers={{ click: () => openGoogleMaps(lat, lng) }}>
                            <Popup>
                              <div>
                                <p className="font-medium">{id} - Historial {idx + 1}</p>
                                <Button size="sm" variant="flat" onPress={() => openGoogleMaps(lat, lng)}>
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