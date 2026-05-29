import { AccessibilityPoint } from "@/types/accessibility";

// Mock fallback helper to prevent empty UI in regions with sparse OSM coverage
function getMockPoints(
  latitude: number,
  longitude: number,
  category: "rampas" | "sin-escaleras" | "baños" | "descanso"
): AccessibilityPoint[] {
  const offset = 0.00055;
  const cat = category.toLowerCase();
  switch (cat) {
    case "baños":
      return [
        {
          id: "POI-WC-1",
          position: [latitude + offset, longitude + offset],
          title: "Baño Accesible (Simulado) — Centro Cultural",
          description: "Baño amplio con barras de apoyo y rampa de acceso.",
          category: "baños",
        },
        {
          id: "POI-WC-2",
          position: [latitude - offset / 2, longitude - offset],
          title: "Sanitario Inclusivo (Simulado) — Plaza Central",
          description: "Ubicado en planta baja, acceso sin escalones.",
          category: "baños",
        },
      ];
    case "rampas":
      return [
        {
          id: "POI-RMP-1",
          position: [latitude - offset, longitude + offset],
          title: "Rampa Nivelada (Simulado) — Esquina Av. Juárez",
          description: "Pendiente suave de 6%, rampa recién remodelada.",
          category: "rampas",
        },
        {
          id: "POI-RMP-2",
          position: [latitude + offset * 1.2, longitude - offset * 0.5],
          title: "Cruce Accesible (Simulado) — Calle Madero",
          description: "Paso peatonal con rampa de descenso a nivel de asfalto.",
          category: "rampas",
        },
      ];
    case "sin-escaleras":
      return [
        {
          id: "POI-STF-1",
          position: [latitude + offset / 1.5, longitude - offset / 2],
          title: "Sendero Plano (Simulado) — Andador Juárez",
          description: "Camino 100% peatonal libre de escalones y desniveles.",
          category: "sin-escaleras",
        },
      ];
    case "descanso":
      return [
        {
          id: "POI-RST-1",
          position: [latitude + offset * 0.7, longitude + offset * 0.7],
          title: "Zona de Descanso (Simulado) — Bancas Juárez",
          description: "Bancas con sombra y espacio lateral para silla de ruedas.",
          category: "descanso",
        },
      ];
    default:
      return [];
  }
}

export async function getNearbyAccessibilityPoints(
  latitude: number,
  longitude: number,
  category: "rampas" | "sin-escaleras" | "baños" | "descanso",
  radiusM: number = 500
): Promise<AccessibilityPoint[]> {
  const cat = category.toLowerCase();

  // 1. Build Overpass QL Query
  let queryTypes = "";
  if (cat === "baños") {
    queryTypes = `
      node["amenity"="toilets"](around:${radiusM},${latitude},${longitude});
      way["amenity"="toilets"](around:${radiusM},${latitude},${longitude});
    `;
  } else if (cat === "rampas") {
    queryTypes = `
      node["highway"="crossing"](around:${radiusM},${latitude},${longitude});
      node["kerb"~"lowered|flush"](around:${radiusM},${latitude},${longitude});
      node["barrier"="kerb"]["kerb"~"lowered|flush"](around:${radiusM},${latitude},${longitude});
      node["ramp"="yes"](around:${radiusM},${latitude},${longitude});
    `;
  } else if (cat === "sin-escaleras") {
    queryTypes = `
      node["highway"="elevator"](around:${radiusM},${latitude},${longitude});
      node["wheelchair"="yes"](around:${radiusM},${latitude},${longitude});
      way["wheelchair"="yes"](around:${radiusM},${latitude},${longitude});
    `;
  } else if (cat === "descanso") {
    queryTypes = `
      node["amenity"="bench"](around:${radiusM},${latitude},${longitude});
      node["leisure"="outdoor_seating"](around:${radiusM},${latitude},${longitude});
    `;
  } else {
    return [];
  }

  const query = `[out:json][timeout:15];( ${queryTypes} ); out center;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(`Overpass API responded with code ${response.status}`);
    }

    const data = await response.json();
    if (!data.elements || data.elements.length === 0) {
      console.warn("Overpass API returned 0 elements, falling back to mock data.");
      return getMockPoints(latitude, longitude, category);
    }

    const points: AccessibilityPoint[] = [];

    for (const elem of data.elements) {
      const lat = elem.lat ?? elem.center?.lat;
      const lon = elem.lon ?? elem.center?.lon;
      if (lat === undefined || lon === undefined) continue;

      let title = "";
      let description = "";

      if (cat === "baños") {
        title = elem.tags?.name || "Baño Accesible";
        const wc = elem.tags?.wheelchair;
        if (wc === "yes") {
          description = "Baño público con accesibilidad total confirmada.";
        } else if (wc === "limited") {
          description = "Baño público con accesibilidad limitada (barras o rampa).";
        } else if (wc === "no") {
          description = "Baño público (sin adaptaciones para silla de ruedas).";
        } else {
          description = "Sanitario público de acceso general.";
        }
      } else if (cat === "rampas") {
        const kerb = elem.tags?.kerb;
        const ramp = elem.tags?.ramp;
        title = elem.tags?.name || (kerb ? `Cruce rebajado (${kerb})` : "Rampa Peatonal");
        if (kerb === "lowered") {
          description = "Banqueta rebajada (cruce accesible a nivel de asfalto).";
        } else if (kerb === "flush") {
          description = "Cruce peatonal continuo y plano al ras de calle.";
        } else if (ramp === "yes") {
          description = "Rampa accesible instalada en cruce.";
        } else {
          description = "Paso peatonal y rampa de acceso.";
        }
      } else if (cat === "sin-escaleras") {
        const isElevator = elem.tags?.highway === "elevator" || elem.tags?.amenity === "elevator";
        title = elem.tags?.name || (isElevator ? "Elevador Público" : "Ruta Peatonal Plana");
        description = isElevator
          ? "Elevador disponible para superar desniveles en vía pública."
          : "Sendero o vía accesible adaptado y libre de barreras escalonadas.";
      } else if (cat === "descanso") {
        title = elem.tags?.name || "Banca de Descanso";
        const backrest = elem.tags?.backrest;
        description = backrest === "yes"
          ? "Banca pública de descanso con respaldo."
          : "Asiento o punto de reposo en vía pública.";
      }

      points.push({
        id: `OSM-POI-${elem.id}`,
        position: [lat, lon],
        title,
        description,
        category,
      });
    }

    return points;
  } catch (error) {
    console.error("Overpass API failed, falling back to mock points:", error);
    return getMockPoints(latitude, longitude, category);
  }
}
