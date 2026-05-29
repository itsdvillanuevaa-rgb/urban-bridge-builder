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

export function generateRouteGeometry(
  start: [number, number],
  end: [number, number],
  routeIndex: number = 0
): [number, number][] {
  const [lat1, lon1] = start;
  const [lat2, lon2] = end;

  // Manhattan-style grid path to avoid crossing diagonal blocks and buildings:
  // routeIndex 0: L-shape starting with latitude change, then longitude
  // routeIndex 1: L-shape starting with longitude change, then latitude
  // routeIndex 2: Staircase zig-zag: start -> mid-lat -> mid-lon -> end
  if (routeIndex === 0) {
    return [
      [lat1, lon1],
      [lat2, lon1],
      [lat2, lon2],
    ];
  } else if (routeIndex === 1) {
    return [
      [lat1, lon1],
      [lat1, lon2],
      [lat2, lon2],
    ];
  } else {
    const latMid = (lat1 + lat2) / 2;
    const lonMid = (lon1 + lon2) / 2;
    return [
      [lat1, lon1],
      [latMid, lon1],
      [latMid, lon2],
      [lat2, lon2],
    ];
  }
}

export interface OSRMRouteResult {
  geometry: [number, number][];
  distanceKm: number;
  durationMin: number;
}

async function fetchOSRMRouteWithWaypoints(
  points: [number, number][]
): Promise<OSRMRouteResult | null> {
  const coordString = points.map((p) => `${p[1]},${p[0]}`).join(";");
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/foot/${coordString}?overview=full&geometries=geojson`,
      {
        headers: {
          "User-Agent": "UrbanBridgeBuilder/1.0 (Accessibility Route Planner)",
        },
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) return null;
    const route = data.routes[0];
    const geometry: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]] as [number, number]
    );
    const distanceKm = parseFloat((route.distance / 1000).toFixed(2));
    const durationMin = Math.max(1, Math.round(route.duration / 60));
    return { geometry, distanceKm, durationMin };
  } catch {
    return null;
  }
}

export async function fetchOSRMRoutes(
  start: [number, number],
  end: [number, number]
): Promise<OSRMRouteResult[]> {
  const [latStart, lonStart] = start;
  const [latEnd, lonEnd] = end;

  // Haversine fallback helper
  const getFallbackRoute = (index: number): OSRMRouteResult => {
    const dist = calculateDistance(start, end);
    const geom = generateRouteGeometry(start, end, index);
    return {
      geometry: geom,
      distanceKm: dist,
      durationMin: Math.max(1, Math.round(dist * 12)),
    };
  };

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

    // Map initial OSRM alternatives
    const routes: OSRMRouteResult[] = data.routes.map((route: any) => {
      const geometry: [number, number][] = route.geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] as [number, number]
      );
      const distanceKm = parseFloat((route.distance / 1000).toFixed(2));
      const durationMin = Math.max(1, Math.round(route.duration / 60));
      return { geometry, distanceKm, durationMin };
    });

    // If we have fewer than 3 routes, let's query detour routes using mathematical midpoints
    if (routes.length < 3) {
      const latDelta = latEnd - latStart;
      const lonDelta = lonEnd - lonStart;

      // Detour A: perpendicular offset to the "right" of midpoint
      const detour1: [number, number] = [
        latStart + latDelta * 0.5 + lonDelta * 0.15,
        lonStart + lonDelta * 0.5 - latDelta * 0.15,
      ];

      // Detour B: perpendicular offset to the "left" of midpoint
      const detour2: [number, number] = [
        latStart + latDelta * 0.5 - lonDelta * 0.15,
        lonStart + lonDelta * 0.5 + latDelta * 0.15,
      ];

      const [r1, r2] = await Promise.all([
        fetchOSRMRouteWithWaypoints([start, detour1, end]),
        fetchOSRMRouteWithWaypoints([start, detour2, end]),
      ]);

      if (r1) routes.push(r1);
      if (routes.length < 3 && r2) routes.push(r2);
    }

    // Ensure we have exactly 3 unique routes
    while (routes.length < 3) {
      routes.push(getFallbackRoute(routes.length));
    }

    return routes.slice(0, 3);
  } catch (error) {
    console.error("OSRM fetch failed, using fallback grid geometries:", error);
    return [
      getFallbackRoute(0),
      getFallbackRoute(1),
      getFallbackRoute(2),
    ];
  }
}

