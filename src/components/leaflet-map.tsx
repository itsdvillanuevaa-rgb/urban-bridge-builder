import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AccessibilityPoint } from "@/types/accessibility";

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];





const originIcon = L.divIcon({
  className: "",
  html: `<div style="width:20px;height:20px;border-radius:50%;background:var(--brand);box-shadow:0 0 0 4px oklch(0.55 0.09 220 / 25%), 0 2px 8px rgba(0,0,0,.25);display:grid;place-items:center;"><div style="width:6px;height:6px;border-radius:50%;background:white;"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const destIcon = L.divIcon({
  className: "",
  html: `<div style="width:36px;height:36px;border-radius:50% 50% 0 50%;background:var(--foreground);color:var(--background);box-shadow:0 4px 12px rgba(0,0,0,.25);display:grid;place-items:center;font-size:14px;font-weight:700;">B</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const locationIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#3b82f6;box-shadow:0 0 0 3px white, 0 0 10px rgba(59,130,246,0.5);display:grid;place-items:center;">
    <div style="width:6px;height:6px;border-radius:50%;background:white;"></div>
  </div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const poiIcons: Record<string, string> = {
  baños: "🚻",
  rampas: "♿",
  "sin-escaleras": "🚶",
  descanso: "🪑",
};

const poiColors: Record<string, string> = {
  baños: "var(--brand)",
  rampas: "var(--success)",
  "sin-escaleras": "oklch(0.62 0.15 152)", // Teal color matching success
  descanso: "var(--warning)",
};

function createPoiIcon(category: string) {
  const icon = poiIcons[category] || "📍";
  const color = poiColors[category] || "var(--brand)";
  return L.divIcon({
    className: "",
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};color:white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:grid;place-items:center;font-size:16px;">${icon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapUpdater({
  userLocation,
  routeGeometry,
  recenterTrigger,
}: {
  userLocation?: [number, number] | null;
  routeGeometry?: [number, number][] | null;
  recenterTrigger?: number;
}) {
  const map = useMap();
  const hasCenteredRef = useRef(false);
  const lastGeometryRef = useRef<string>("");

  useEffect(() => {
    if (!userLocation) {
      hasCenteredRef.current = false;
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      const shouldCenter = !hasCenteredRef.current;
      if (shouldCenter && (!routeGeometry || routeGeometry.length === 0)) {
        map.panTo(userLocation);
        hasCenteredRef.current = true;
      }
    }
  }, [userLocation, map, routeGeometry]);

  useEffect(() => {
    if (userLocation && recenterTrigger) {
      map.panTo(userLocation);
    }
  }, [recenterTrigger, map]);

  useEffect(() => {
    if (routeGeometry && routeGeometry.length > 0) {
      const geomString = JSON.stringify(routeGeometry);
      if (geomString !== lastGeometryRef.current) {
        map.fitBounds(routeGeometry, { padding: [50, 50] });
        lastGeometryRef.current = geomString;
      }
    }
  }, [routeGeometry, map]);

  return null;
}

export interface LeafletMapProps {
  userLocation?: [number, number] | null;
  routeGeometry?: [number, number][] | null;
  recenterTrigger?: number;
  discoveryPoints?: AccessibilityPoint[];
}

export default function LeafletMap({
  userLocation,
  routeGeometry,
  recenterTrigger,
  discoveryPoints,
}: LeafletMapProps) {
  const mapCenter = userLocation || CDMX_CENTER;

  return (
    <MapContainer
      center={mapCenter}
      zoom={15}
      scrollWheelZoom={true}
      zoomControl={false}
      attributionControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapUpdater userLocation={userLocation} routeGeometry={routeGeometry} recenterTrigger={recenterTrigger} />

      {/* Render user location dot */}
      {userLocation && (
        <Marker position={userLocation} icon={locationIcon}>
          <Popup>Tu ubicación actual</Popup>
        </Marker>
      )}

      {/* Render selected route polyline */}
      {routeGeometry && routeGeometry.length > 0 && (
        <>
          <Polyline
            positions={routeGeometry}
            pathOptions={{
              color: "oklch(0.55 0.09 220)",
              weight: 5,
              dashArray: "8 6",
              opacity: 0.85,
            }}
          />
          <Marker position={routeGeometry[0]} icon={originIcon}>
            <Popup>Origen</Popup>
          </Marker>
          <Marker position={routeGeometry[routeGeometry.length - 1]} icon={destIcon}>
            <Popup>Destino</Popup>
          </Marker>
        </>
      )}

      {/* Render nearby accessibility discovery points */}
      {discoveryPoints &&
        discoveryPoints.map((poi) => (
          <Marker key={poi.id} position={poi.position} icon={createPoiIcon(poi.category)}>
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-sm text-foreground leading-tight">{poi.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{poi.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}


    </MapContainer>
  );
}