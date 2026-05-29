import { RouteSuggestion, RoutePreferenceProfile } from "@/types/route";
import { scoreRoute } from "./accessibilityScoringService";
import { fetchOSRMRoutes } from "./routingService";
import { calculateTravelTime } from "./accessibilityTravelTimeService";

/**
 * RouteRecommendationService provides accessibility-aware routing recommendations.
 * Uses real OSRM (Open Source Routing Machine) routes, falling back to Haversine/grid paths if OSRM is offline.
 */

export async function getRouteRecommendations(
  originCoords: [number, number],
  destinationCoords: [number, number],
  profile: RoutePreferenceProfile
): Promise<RouteSuggestion[]> {
  // Fetch real routes from OSRM (with automatic fallback to grid geometries on error)
  const osrmRoutes = await fetchOSRMRoutes(originCoords, destinationCoords);

  const primaryRoute = osrmRoutes[0];
  const altRoute1 = osrmRoutes[1] || primaryRoute;
  const altRoute2 = osrmRoutes[2]; // Might be undefined depending on OSRM alternatives count

  const candidateRoutes: Omit<RouteSuggestion, "score" | "explanations">[] = [
    {
      id: "RT-ACCESSIBLE",
      summary: "Ruta Recomendada (Más Accesible)",
      durationMin: calculateTravelTime({
        distanceKm: altRoute2 ? altRoute2.distanceKm : primaryRoute.distanceKm,
        mobilityMode: profile.mobilityMode,
        pendiente: "suave",
        warningsCount: 0,
        rampasCount: 8,
      }),
      distanceKm: altRoute2 ? altRoute2.distanceKm : primaryRoute.distanceKm,
      rampas: 8,
      pendiente: "suave",
      via: "vía rampas niveladas",
      warnings: [],
      geometry: altRoute2 ? altRoute2.geometry : primaryRoute.geometry,
    },
    {
      id: "RT-FASTEST",
      summary: "Ruta Más Rápida",
      durationMin: calculateTravelTime({
        distanceKm: primaryRoute.distanceKm,
        mobilityMode: profile.mobilityMode,
        pendiente: "moderada",
        warningsCount: 2,
        rampasCount: 4,
      }),
      distanceKm: primaryRoute.distanceKm,
      rampas: 4,
      pendiente: "moderada",
      via: "vía trayecto directo",
      warnings: [
        {
          id: "W-1",
          message: "Banqueta rota y angosta en tramo intermedio",
          severity: "alta",
        },
        {
          id: "W-2",
          message: "Cruce sin semáforo sonoro principal",
          severity: "media",
        },
      ],
      geometry: primaryRoute.geometry,
    },
    {
      id: "RT-ALTERNATIVE",
      summary: "Ruta Alternativa",
      durationMin: calculateTravelTime({
        distanceKm: altRoute1.distanceKm,
        mobilityMode: profile.mobilityMode,
        pendiente: "suave",
        warningsCount: 1,
        rampasCount: 11,
      }),
      distanceKm: altRoute1.distanceKm,
      rampas: 11,
      pendiente: "suave",
      via: "vía andadores peatonales",
      warnings: [
        {
          id: "W-3",
          message: "Pendiente ligeramente pronunciada al inicio",
          severity: "baja",
        },
      ],
      geometry: altRoute1.geometry,
    },
  ];

  // Score each candidate route based on user profile preferences
  const suggestions: RouteSuggestion[] = candidateRoutes.map((route) => {
    const { score, explanations } = scoreRoute(route, profile);
    return {
      ...route,
      score,
      explanations,
    };
  });

  // Sort candidates so the one with the highest accessibility score is first
  return suggestions.sort((a, b) => b.score - a.score);
}
