import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

const markers: {
  position: [number, number];
  title: string;
  color: string;
}[] = [
  {
    position: [19.4345, -99.1405],
    title: "Obstáculo",
    color: "var(--warning)",
  },
  {
    position: [19.4298, -99.1285],
    title: "Rampa verificada",
    color: "var(--success)",
  },
  {
    position: [19.436, -99.1375],
    title: "Baño accesible",
    color: "var(--success)",
  },
  {
    position: [19.4285, -99.125],
    title: "Banqueta rota",
    color: "var(--destructive)",
  },
];

const routePath: [number, number][] = [
  [19.4285, -99.1405],
  [19.431, -99.137],
  [19.4335, -99.1335],
  [19.436, -99.128],
];

function createCircleIcon(color: string, size: number) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};box-shadow:0 0 0 3px white, 0 2px 6px rgba(0,0,0,.3);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

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

export default function LeafletMap() {
  return (
    <MapContainer
      center={CDMX_CENTER}
      zoom={15}
      scrollWheelZoom={true}
      zoomControl={false}
      attributionControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Polyline
        positions={routePath}
        pathOptions={{
          color: "oklch(0.55 0.09 220)",
          weight: 4,
          dashArray: "8 6",
          opacity: 0.8,
        }}
      />

      <Marker position={routePath[0]} icon={originIcon}>
        <Popup>Tu ubicación</Popup>
      </Marker>

      <Marker position={routePath[routePath.length - 1]} icon={destIcon}>
        <Popup>Destino</Popup>
      </Marker>

      {markers.map((m) => (
        <Marker key={m.title} position={m.position} icon={createCircleIcon(m.color, 16)}>
          <Popup>{m.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}