/**
 * routingService provides tools for distance calculations and route geometry generation.
 * Currently uses Haversine calculations and mock grid offsets, structured to be replaced
 * with a real OSRM or OpenRouteService API.
 *
 * INTEGRATION POINTS FOR REAL ROUTING ENGINES:
 *
 * 1. OSRM (Open Source Routing Machine):
 *    - To implement, make a request to: GET http://router.project-osrm.org/route/v1/foot/{lon_start},{lat_start};{lon_end},{lat_end}?overview=full&geometries=geojson
 *    - The response returns "routes" with a "geometry" object containing coordinates and "distance" in meters.
 *
 * 2. OpenRouteService (ORS):
 *    - Endpoint: POST https://api.openrouteservice.org/v2/directions/foot-wheelchair/geojson
 *    - Body: {"coordinates": [[lon_start, lat_start], [lon_end, lat_end]]}
 */

export function calculateDistance(start: [number, number], end: [number, number]): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((end[0] - start[0]) * Math.PI) / 180;
  const dLon = ((end[1] - start[1]) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((start[0] * Math.PI) / 180) *
      Math.cos((end[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Round to 2 decimal places
  return parseFloat(distance.toFixed(2));
}

export function generateRouteGeometry(start: [number, number], end: [number, number]): [number, number][] {
  const [lat1, lon1] = start;
  const [lat2, lon2] = end;

  // Create a 4-point zig-zag path to simulate navigating city streets rather than a straight line
  return [
    [lat1, lon1],
    [lat1 + (lat2 - lat1) * 0.35, lon1 + (lon2 - lon1) * 0.1],
    [lat1 + (lat2 - lat1) * 0.7, lon1 + (lon2 - lon1) * 0.75],
    [lat2, lon2],
  ];
}

export interface OSRMRouteResult {
  geometry: [number, number][];
  distanceKm: number;
  durationMin: number;
}

export async function fetchOSRMRoutes(
  start: [number, number],
  end: [number, number]
): Promise<OSRMRouteResult[]> {
  const [latStart, lonStart] = start;
  const [latEnd, lonEnd] = end;

  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/foot/${lonStart},${latStart};${lonEnd},${latEnd}?overview=full&geometries=geojson&alternatives=true`,
      {
        headers: {
          "User-Agent": "UrbanBridgeBuilder/1.0 (Accessibility Route Planner)",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OSRM API error status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      throw new Error(`OSRM returned no routes or invalid code: ${data.code}`);
    }

    return data.routes.map((route: any) => {
      const geometry: [number, number][] = route.geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] as [number, number]
      );
      const distanceKm = parseFloat((route.distance / 1000).toFixed(2));
      const durationMin = Math.max(1, Math.round(route.duration / 60));
      return {
        geometry,
        distanceKm,
        durationMin,
      };
    });
  } catch (error) {
    console.error("OSRM fetch failed, using fallback geometries:", error);
    
    // Fallback: direct Haversine distance and simulated grid path
    const fallbackDist = calculateDistance(start, end);
    const fallbackGeom = generateRouteGeometry(start, end);
    
    return [
      {
        geometry: fallbackGeom,
        distanceKm: fallbackDist,
        durationMin: Math.max(1, Math.round(fallbackDist * 12)),
      }
    ];
  }
}

