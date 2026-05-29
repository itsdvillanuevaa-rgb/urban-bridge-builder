import { AccessibilityPoint } from "@/types/accessibility";

/**
 * nearbyAccessibilityService retrieves nearby points of interest based on location.
 * Currently uses mock calculations to offset user location within a radius,
 * structured to be replaced with real OpenStreetMap Overpass API queries.
 *
 * INTEGRATION POINTS FOR OPENSTREETMAP OVERPASS API:
 *
 * 1. Overpass API Endpoint:
 *    - POST https://overpass-api.de/api/interpreter
 *
 * 2. Overpass QL Query Examples:
 *    - To query accessible bathrooms:
 *      [out:json][timeout:25];
 *      (
 *        node["amenity"="toilets"]["wheelchair"="yes"](around:{radius},{lat},{lon});
 *        way["amenity"="toilets"]["wheelchair"="yes"](around:{radius},{lat},{lon});
 *      );
 *      out body; >; out skel qt;
 *
 *    - To query benches (resting places):
 *      node["amenity"="bench"](around:{radius},{lat},{lon});
 *
 *    - To query ramp entrances:
 *      node["ramp"="yes"](around:{radius},{lat},{lon});
 */

export async function getNearbyAccessibilityPoints(
  latitude: number,
  longitude: number,
  category: "rampas" | "sin-escaleras" | "baños" | "descanso",
  radiusM: number = 100
): Promise<AccessibilityPoint[]> {
  const cat = category.toLowerCase();

  // Simulate minimal API latency for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Base coordinate offsets to simulate points within the selected radius
  // (0.0009 degrees is approximately 100 meters)
  const offset = 0.00055;

  switch (cat) {
    case "baños":
      return [
        {
          id: "POI-WC-1",
          position: [latitude + offset, longitude + offset],
          title: "Baño Accesible — Centro Cultural",
          description: "Baño amplio con barras de apoyo y rampa de acceso.",
          category: "baños",
        },
        {
          id: "POI-WC-2",
          position: [latitude - offset / 2, longitude - offset],
          title: "Sanitario Inclusivo — Plaza Central",
          description: "Ubicado en planta baja, acceso sin escalones.",
          category: "baños",
        },
      ];
    case "rampas":
      return [
        {
          id: "POI-RMP-1",
          position: [latitude - offset, longitude + offset],
          title: "Rampa Nivelada — Esquina Av. Juárez",
          description: "Pendiente suave de 6%, rampa recién remodelada.",
          category: "rampas",
        },
        {
          id: "POI-RMP-2",
          position: [latitude + offset * 1.2, longitude - offset * 0.5],
          title: "Cruce Accesible — Calle Madero",
          description: "Paso peatonal con rampa de descenso a nivel de asfalto.",
          category: "rampas",
        },
        {
          id: "POI-RMP-3",
          position: [latitude - offset * 0.8, longitude - offset * 0.8],
          title: "Acceso Rampa — Estación de Metro",
          description: "Entrada oeste equipada con rampa metálica antideslizante.",
          category: "rampas",
        },
      ];
    case "sin-escaleras":
      return [
        {
          id: "POI-STF-1",
          position: [latitude + offset / 1.5, longitude - offset / 2],
          title: "Sendero Plano — Andador Juárez",
          description: "Camino 100% peatonal libre de escalones y desniveles.",
          category: "sin-escaleras",
        },
        {
          id: "POI-STF-2",
          position: [latitude - offset, longitude + offset * 0.8],
          title: "Elevador Operativo — Puente Peatonal",
          description: "Acceso alternativo de elevador para cruzar la avenida.",
          category: "sin-escaleras",
        },
      ];
    case "descanso":
      return [
        {
          id: "POI-RST-1",
          position: [latitude + offset * 0.7, longitude + offset * 0.7],
          title: "Zona de Descanso — Bancas Juárez",
          description: "Bancas con sombra y espacio lateral para silla de ruedas.",
          category: "descanso",
        },
        {
          id: "POI-RST-2",
          position: [latitude - offset * 1.1, longitude + offset * 0.3],
          title: "Punto de Reposo — Corredor Madero",
          description: "Área sombreada con asientos accesibles de descanso.",
          category: "descanso",
        },
      ];
    default:
      return [];
  }
}
