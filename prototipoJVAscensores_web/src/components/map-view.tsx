import React from "react";
import { Card, CardHeader, CardBody, Button, Badge, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
// @ts-ignore - tipos de react-leaflet se omiten hasta instalar dependencias
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl, LayerGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type ElevatorStatus = "Operativo" | "Alerta" | "En mantenimiento" | "Fuera de servicio";

type ElevatorLocation = {
  id: string;
  lat: number;
  lng: number;
  status: ElevatorStatus;
  building: string;
};

type TechnicianLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "Activo" | "Inactivo";
};

// Coordenadas base de Quito, Ecuador
const quitoCenter: [number, number] = [-0.1807, -78.4678];

// Datos de ejemplo (coordenadas alrededor de Quito)
const elevatorLocations: ElevatorLocation[] = [
  { id: "A101", lat: -0.185, lng: -78.49, status: "Operativo", building: "Torre Norte" },
  { id: "A102", lat: -0.17, lng: -78.47, status: "Alerta", building: "Torre La Mariscal" },
  { id: "B205", lat: -0.2, lng: -78.45, status: "En mantenimiento", building: "Torre Sur" },
  { id: "C310", lat: -0.155, lng: -78.48, status: "Operativo", building: "Torre Este" },
  { id: "D405", lat: -0.19, lng: -78.44, status: "Fuera de servicio", building: "Torre Oeste" },
];

const technicianLocations: TechnicianLocation[] = [
  { id: "E001", name: "Juan Pérez", lat: -0.176, lng: -78.48, status: "Activo" },
  { id: "E002", name: "María López", lat: -0.19, lng: -78.47, status: "Activo" },
  { id: "E004", name: "Ana Gómez", lat: -0.168, lng: -78.46, status: "Activo" },
];

export const MapView: React.FC = () => {
  const [mapType, setMapType] = React.useState<"satellite" | "roadmap">("roadmap");

  const openGoogleMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const statusColorHex = (status: ElevatorStatus): string => {
    switch (status) {
      case "Operativo":
        return "#22c55e"; // success
      case "Alerta":
        return "#f59e0b"; // warning
      case "En mantenimiento":
        return "#3b82f6"; // primary
      case "Fuera de servicio":
        return "#ef4444"; // danger
      default:
        return "#6b7280"; // default gray
    }
  };

  const statusBadgeColor = (status: ElevatorStatus): "success" | "warning" | "primary" | "danger" | "default" => {
    switch (status) {
      case "Operativo":
        return "success";
      case "Alerta":
        return "warning";
      case "En mantenimiento":
        return "primary";
      case "Fuera de servicio":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Mapa de Ascensores</h2>
          <p className="text-small text-default-500">Ubicación y estado en tiempo real</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mapType === "roadmap" ? "solid" : "flat"}
            color="primary"
            onPress={() => setMapType("roadmap")}
          >
            Mapa
          </Button>
          <Button
            size="sm"
            variant={mapType === "satellite" ? "solid" : "flat"}
            color="primary"
            onPress={() => setMapType("satellite")}
          >
            Satélite
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
          <MapContainer center={quitoCenter} zoom={13} className="w-full h-full">
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked={mapType === "roadmap"} name="Mapa">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer checked={mapType === "satellite"} name="Satélite">
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" />
              </LayersControl.BaseLayer>
            </LayersControl>

            <LayerGroup>
              {elevatorLocations.map((e) => (
                <CircleMarker
                  key={e.id}
                  center={[e.lat, e.lng]}
                  radius={10}
                  color={statusColorHex(e.status)}
                  fillColor={statusColorHex(e.status)}
                  fillOpacity={0.9}
                  eventHandlers={{ click: () => openGoogleMaps(e.lat, e.lng) }}
                >
                  <Popup>
                    <div className="space-y-1">
                      <p className="font-medium">{e.id}</p>
                      <p className="text-small">{e.building}</p>
                      <Badge color={statusBadgeColor(e.status)} size="sm">{e.status}</Badge>
                      <Button size="sm" variant="flat" className="mt-2" onPress={() => openGoogleMaps(e.lat, e.lng)}>
                        <Icon icon="lucide:map-pin" className="mr-1" /> Abrir en Google Maps
                      </Button>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </LayerGroup>

            <LayerGroup>
              {technicianLocations.map((t) => (
                <CircleMarker
                  key={t.id}
                  center={[t.lat, t.lng]}
                  radius={8}
                  color="#0ea5e9"
                  fillColor="#0ea5e9"
                  fillOpacity={0.9}
                  eventHandlers={{ click: () => openGoogleMaps(t.lat, t.lng) }}
                >
                  <Popup>
                    <div className="space-y-1">
                      <p className="font-medium">{t.name}</p>
                      <p className="text-small">ID: {t.id}</p>
                      <Badge color="success" size="sm">{t.status}</Badge>
                      <Button size="sm" variant="flat" className="mt-2" onPress={() => openGoogleMaps(t.lat, t.lng)}>
                        <Icon icon="lucide:map-pin" className="mr-1" /> Abrir en Google Maps
                      </Button>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </LayerGroup>
          </MapContainer>

          {/* Leyenda */}
          <div className="absolute bottom-2 left-2 p-2 bg-white/80 backdrop-blur-sm rounded-md">
            <div className="text-tiny font-medium mb-1">Leyenda</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#22c55e" }}></span>
                <span className="text-tiny">Operativo</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f59e0b" }}></span>
                <span className="text-tiny">Alerta</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3b82f6" }}></span>
                <span className="text-tiny">En mantenimiento</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ef4444" }}></span>
                <span className="text-tiny">Fuera de servicio</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#0ea5e9" }}></span>
                <span className="text-tiny">Técnico</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};