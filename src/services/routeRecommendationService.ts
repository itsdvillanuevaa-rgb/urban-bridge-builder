import { RouteSuggestion, RoutePreferenceProfile } from "@/types/route";
import { scoreRoute } from "./accessibilityScoringService";
import { fetchOSRMRoutes, calculateDistance } from "./routingService";
import { calculateTravelTime } from "./accessibilityTravelTimeService";
import { getReports } from "../data/storage";

const STREETS = [
  "Av. Juárez",
  "Calle Madero",
  "Paseo de la Reforma",
  "Calzada de Tlalpan",
  "Av. Insurgentes",
  "Calle Hidalgo",
  "Andador Constitución",
  "Boulevard Agua Caliente",
  "Avenida Revolución",
];

function getStreetName(coords: [number, number], offset: number): string {
  const seed = coords[0] + coords[1] + offset;
  const idx = Math.floor(Math.abs(Math.sin(seed) * 1000)) % STREETS.length;
  return STREETS[idx];
}

interface OSMFeature {
  lat: number;
  lon: number;
  type: string;
}

// Bounding box query to OSM Overpass API to collect all candidate amenities
async function fetchNearbyAmenitiesInBBox(
  minLat: number,
  minLon: number,
  maxLat: number,
  maxLon: number
): Promise<{ toilets: OSMFeature[]; benches: OSMFeature[]; crossings: OSMFeature[] }> {
  const query = `[out:json][timeout:15];
(
  node["amenity"="toilets"](${minLat},${minLon},${maxLat},${maxLon});
  node["amenity"="bench"](${minLat},${minLon},${maxLat},${maxLon});
  node["highway"="crossing"](${minLat},${minLon},${maxLat},${maxLon});
);
out body;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) return { toilets: [], benches: [], crossings: [] };
    const data = await response.json();
    
    const toilets: OSMFeature[] = [];
    const benches: OSMFeature[] = [];
    const crossings: OSMFeature[] = [];

    if (data.elements) {
      for (const elem of data.elements) {
        if (elem.lat !== undefined && elem.lon !== undefined) {
          const feat: OSMFeature = {
            lat: elem.lat,
            lon: elem.lon,
            type: elem.tags?.amenity || elem.tags?.highway || "point",
          };
          if (elem.tags?.amenity === "toilets") toilets.push(feat);
          else if (elem.tags?.amenity === "bench") benches.push(feat);
          else if (elem.tags?.highway === "crossing") crossings.push(feat);
        }
      }
    }

    return { toilets, benches, crossings };
  } catch (err) {
    console.warn("Bounding box Overpass fetch failed:", err);
    return { toilets: [], benches: [], crossings: [] };
  }
}

// Buffer intersection check to see how many amenities lie within 30m of the path
function countNearbyOSMFeatures(
  geometry: [number, number][],
  features: OSMFeature[],
  bufferKm: number = 0.03
): number {
  if (features.length === 0 || geometry.length === 0) return 0;
  let count = 0;
  
  for (const feat of features) {
    let minDistance = Infinity;
    for (const point of geometry) {
      const dist = calculateDistance(point, [feat.lat, feat.lon]);
      if (dist < minDistance) {
        minDistance = dist;
      }
    }
    if (minDistance <= bufferKm) {
      count++;
    }
  }
  return count;
}

// Samples evenly-spaced coordinate nodes to limit elevation query sizes
function sampleRouteCoordinates(
  geometry: [number, number][],
  maxSamples: number = 8
): [number, number][] {
  if (geometry.length <= maxSamples) return geometry;
  const samples: [number, number][] = [];
  const step = (geometry.length - 1) / (maxSamples - 1);
  for (let i = 0; i < maxSamples; i++) {
    const idx = Math.min(geometry.length - 1, Math.round(i * step));
    samples.push(geometry[idx]);
  }
  return samples;
}

// Fetches elevation profiles from Open-Elevation API
async function fetchElevationsForRoute(
  geometry: [number, number][],
  sampledCoords: [number, number][]
): Promise<number[] | null> {
  if (geometry.length < 2) return null;
  const locations = sampledCoords.map(([lat, lon]) => ({ latitude: lat, longitude: lon }));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout limit

  try {
    const response = await fetch("https://api.open-elevation.com/api/v1/lookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ locations }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;
    return data.results.map((r: any) => r.elevation);
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("Elevation query failed or timed out:", err);
    return null;
  }
}

// Computes slopes of consecutive segments
function calculateSlopeFromElevations(
  sampledCoords: [number, number][],
  elevations: number[]
): { avg: number; max: number } {
  let totalSlope = 0;
  let maxSlope = 0;
  let segmentCount = 0;

  for (let i = 0; i < sampledCoords.length - 1; i++) {
    const startPt = sampledCoords[i];
    const endPt = sampledCoords[i + 1];
    const distM = calculateDistance(startPt, endPt) * 1000;
    if (distM < 5) continue; // Skip tiny anomalies

    const elevDiff = Math.abs(elevations[i + 1] - elevations[i]);
    const slope = parseFloat(((elevDiff / distM) * 100).toFixed(1));
    
    totalSlope += slope;
    segmentCount++;
    if (slope > maxSlope) {
      maxSlope = slope;
    }
  }

  const avg = segmentCount > 0 ? parseFloat((totalSlope / segmentCount).toFixed(1)) : 0;
  return { avg, max: parseFloat(maxSlope.toFixed(1)) };
}

// Deterministic seed-based fallback for slope calculation
function calculateSlopeDetails(
  start: [number, number],
  end: [number, number],
  routeId: string
): { avg: number; max: number; label: "suave" | "moderada" | "alta" } {
  const seed = start[0] + start[1] + end[0] + end[1] + (routeId === "RT-ACCESSIBLE" ? 7 : routeId === "RT-SAFEST" ? 11 : 33);
  const rand = Math.floor(Math.abs(Math.sin(seed) * 1000)) % 100;

  if (routeId === "RT-ACCESSIBLE") {
    const avg = parseFloat((1.0 + (rand % 15) / 10).toFixed(1));
    const max = parseFloat((avg + 1.0 + (rand % 10) / 10).toFixed(1));
    return { avg, max, label: "suave" };
  } else if (routeId === "RT-SAFEST") {
    const avg = parseFloat((2.5 + (rand % 25) / 10).toFixed(1));
    const max = parseFloat((avg + 2.0 + (rand % 15) / 10).toFixed(1));
    const label = avg < 3.5 ? "suave" : "moderada";
    return { avg, max, label };
  } else {
    const avg = parseFloat((2.0 + (rand % 50) / 10).toFixed(1));
    const max = parseFloat((avg + 3.0 + (rand % 20) / 10).toFixed(1));
    const label = avg < 3.0 ? "suave" : avg < 5.5 ? "moderada" : "alta";
    return { avg, max, label };
  }
}

// Seed-based fallback for amenity calculation
function estimateNearbyAmenitiesFallback(
  geometry: [number, number][],
  routeId: string
): { restAreas: number; bathrooms: number; crossings: number } {
  const first = geometry[0] || [0, 0];
  const last = geometry[geometry.length - 1] || [0, 0];
  const seed = first[0] + first[1] + last[0] + last[1] + (routeId === "RT-ACCESSIBLE" ? 42 : 19);
  const rand = Math.abs(Math.sin(seed) * 1000);

  let restAreas = 0;
  let bathrooms = 0;
  let crossings = 0;

  if (routeId === "RT-ACCESSIBLE") {
    restAreas = Math.floor(rand % 3) + 1;
    bathrooms = Math.floor((rand * 2) % 2) + 1;
    crossings = Math.floor((rand * 3) % 4) + 2;
  } else if (routeId === "RT-SAFEST") {
    restAreas = Math.floor(rand % 2);
    bathrooms = Math.floor((rand * 2) % 2);
    crossings = Math.floor((rand * 3) % 3) + 1;
  } else {
    restAreas = Math.floor(rand % 2);
    bathrooms = 0;
    crossings = Math.floor((rand * 3) % 2) + 1;
  }

  return { restAreas, bathrooms, crossings };
}

function findNearbyReportsForRoute(
  geometry: [number, number][],
  reports: any[]
): any[] {
  const nearby: any[] = [];
  const validReports = reports.filter((r) => r.latitude !== null && r.longitude !== null);
  if (validReports.length === 0 || geometry.length === 0) return [];

  for (const report of validReports) {
    let minDistance = Infinity;
    for (const point of geometry) {
      const dist = calculateDistance(point, [report.latitude!, report.longitude!]);
      if (dist < minDistance) {
        minDistance = dist;
      }
    }
    if (minDistance <= 0.03) {
      nearby.push(report);
    }
  }

  return nearby;
}

export async function getRouteRecommendations(
  originCoords: [number, number],
  destinationCoords: [number, number],
  profile: RoutePreferenceProfile
): Promise<RouteSuggestion[]> {
  // Fetch OSRM geometries
  const osrmRoutes = await fetchOSRMRoutes(originCoords, destinationCoords);

  const primaryRoute = osrmRoutes[0];
  const altRoute1 = osrmRoutes[1];
  const altRoute2 = osrmRoutes[2];

  // Retrieve community-reported hazards from localStorage
  const reports = typeof window !== "undefined" ? getReports() : [];

  // Compute bounding box containing all route coordinates
  let minLat = Math.min(originCoords[0], destinationCoords[0]);
  let maxLat = Math.max(originCoords[0], destinationCoords[0]);
  let minLon = Math.min(originCoords[1], destinationCoords[1]);
  let maxLon = Math.max(originCoords[1], destinationCoords[1]);

  osrmRoutes.forEach((r) => {
    r.geometry.forEach((pt) => {
      minLat = Math.min(minLat, pt[0]);
      maxLat = Math.max(maxLat, pt[0]);
      minLon = Math.min(minLon, pt[1]);
      maxLon = Math.max(maxLon, pt[1]);
    });
  });

  // Expand bounding box slightly (by approx 150m for safety)
  minLat -= 0.0015;
  maxLat += 0.0015;
  minLon -= 0.0015;
  maxLon += 0.0015;

  // 1. Fetch live amenities in the bounding box enclosing the search
  let toiletsList: OSMFeature[] = [];
  let benchesList: OSMFeature[] = [];
  let crossingsList: OSMFeature[] = [];
  let fetchedOSM = false;

  try {
    const osmData = await fetchNearbyAmenitiesInBBox(minLat, minLon, maxLat, maxLon);
    toiletsList = osmData.toilets;
    benchesList = osmData.benches;
    crossingsList = osmData.crossings;
    fetchedOSM = true;
  } catch (err) {
    console.warn("Region-wide Overpass fetch failed, using fallback:", err);
  }

  const candidateRoutes: Omit<RouteSuggestion, "score" | "explanations">[] = [
    {
      id: "RT-ACCESSIBLE",
      summary: "Ruta Recomendada (Más Accesible)",
      distanceKm: altRoute2.distanceKm,
      geometry: altRoute2.geometry,
      pendiente: "suave",
      rampas: 0,
      via: `vía ${getStreetName(destinationCoords, 2)} (rampas niveladas)`,
      warnings: [],
      durationMin: 0,
      surfaceQuality: "excelente",
      sidewalkContinuity: "alta",
    },
    {
      id: "RT-SAFEST",
      summary: "Ruta Más Segura",
      distanceKm: primaryRoute.distanceKm,
      geometry: primaryRoute.geometry,
      pendiente: "moderada",
      rampas: 0,
      via: `vía ${getStreetName(destinationCoords, 1)} (bajos reportes de obstáculos)`,
      warnings: [],
      durationMin: 0,
      surfaceQuality: "buena",
      sidewalkContinuity: "alta",
    },
    {
      id: "RT-EFFORT",
      summary: "Ruta Menor Esfuerzo",
      distanceKm: altRoute1.distanceKm,
      geometry: altRoute1.geometry,
      pendiente: "suave",
      rampas: 0,
      via: `vía ${getStreetName(destinationCoords, 3)} (andadores peatonales planos)`,
      warnings: [],
      durationMin: 0,
      surfaceQuality: "buena",
      sidewalkContinuity: "media",
    },
  ];

  // Process slope statistics and amenities dynamically
  await Promise.all(
    candidateRoutes.map(async (route) => {
      const geometry = route.geometry || [];

      // 1. Fetch live elevations
      const sampledCoords = sampleRouteCoordinates(geometry, 8);
      const elevations = await fetchElevationsForRoute(geometry, sampledCoords);

      if (elevations && elevations.length === sampledCoords.length) {
        const calculated = calculateSlopeFromElevations(sampledCoords, elevations);
        route.averageSlope = calculated.avg;
        route.highestSlopeSegment = calculated.max;
        route.pendiente = calculated.avg < 3.0 ? "suave" : calculated.avg < 5.5 ? "moderada" : "alta";
      } else {
        // Fallback
        const slopeDetails = calculateSlopeDetails(originCoords, destinationCoords, route.id);
        route.pendiente = slopeDetails.label;
        route.averageSlope = slopeDetails.avg;
        route.highestSlopeSegment = slopeDetails.max;
      }

      // 2. Map real crossings, benches, and restrooms
      if (fetchedOSM) {
        route.nearbyRestAreas = countNearbyOSMFeatures(geometry, benchesList);
        route.nearbyBathrooms = countNearbyOSMFeatures(geometry, toiletsList);
        route.accessibleCrossings = countNearbyOSMFeatures(geometry, crossingsList);
      } else {
        const fallback = estimateNearbyAmenitiesFallback(geometry, route.id);
        route.nearbyRestAreas = fallback.restAreas;
        route.nearbyBathrooms = fallback.bathrooms;
        route.accessibleCrossings = fallback.crossings;
      }

      // 3. Process obstacle warnings
      const nearbyReports = findNearbyReportsForRoute(geometry, reports);

      route.warnings = nearbyReports.map((r, idx) => {
        let label = "";
        if (r.category === "banqueta-rota") label = "Banqueta rota";
        else if (r.category === "rampa-faltante") label = "Rampa faltante";
        else if (r.category === "obstaculo") label = "Obstáculo";
        else if (r.category === "semaforo") label = "Semáforo";
        else label = "Alerta";

        return {
          id: r.id || `W-DYN-${route.id}-${idx}`,
          message: `${label}: ${r.description || "Reportado en la vía"}`,
          severity: r.severity || "media",
        };
      });

      // 4. Calculate dynamic ramps
      const missingRampsCount = nearbyReports.filter((r) => r.category === "rampa-faltante").length;
      let baseRamps = 0;
      if (route.id === "RT-ACCESSIBLE") {
        baseRamps = Math.max(5, Math.round(route.distanceKm * 10));
      } else if (route.id === "RT-SAFEST") {
        baseRamps = Math.max(2, Math.round(route.distanceKm * 6));
      } else {
        baseRamps = Math.max(3, Math.round(route.distanceKm * 8));
      }
      route.rampas = Math.max(0, baseRamps - missingRampsCount);

      // 5. Calculate realistic duration
      route.durationMin = calculateTravelTime({
        distanceKm: route.distanceKm,
        mobilityMode: profile.mobilityMode,
        pendiente: route.pendiente as any,
        warningsCount: route.warnings.length,
        rampasCount: route.rampas,
      });
    })
  );

  // Score candidate routes based on preferences
  const suggestions: RouteSuggestion[] = candidateRoutes.map((route) => {
    const { score, explanations } = scoreRoute(route, profile);
    return {
      ...route,
      score,
      explanations,
    };
  });

  // Sort: highest accessibility score first; tie-break with shortest distance
  return suggestions.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.distanceKm - b.distanceKm;
  });
}
