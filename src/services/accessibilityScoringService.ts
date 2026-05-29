import { RoutePreferenceProfile, RouteSuggestion } from "@/types/route";

export interface ScoreResult {
  score: number;
  explanations: string[];
}

export function scoreRoute(
  route: Omit<RouteSuggestion, "score">,
  profile: RoutePreferenceProfile
): ScoreResult {
  let score = 100; // Start with a perfect score and deduct points for issues
  const explanations: string[] = [];

  const { mobilityMode, avoidBarriers } = profile;
  const avoidsStairs = avoidBarriers.includes("escaleras");
  const avoidsSlopes = avoidBarriers.includes("pendientes");
  const avoidsSidewalks = avoidBarriers.includes("banquetas");
  const avoidsConstruction = avoidBarriers.includes("construccion");

  let hasStairIssue = false;
  let hasSidewalkIssue = false;
  let hasObstacleIssue = false;
  let hasConstructionIssue = false;
  let hasRampIssue = false;

  // Process warnings list
  if (route.warnings && route.warnings.length > 0) {
    route.warnings.forEach((w) => {
      const msg = w.message.toLowerCase();

      // Check stairs
      if (
        msg.includes("escalera") ||
        msg.includes("escalón") ||
        msg.includes("escalon") ||
        msg.includes("peldaño")
      ) {
        hasStairIssue = true;
      }

      // Check sidewalks
      if (
        msg.includes("banqueta") ||
        msg.includes("acera") ||
        msg.includes("calzada levantada") ||
        msg.includes("ruta rota")
      ) {
        hasSidewalkIssue = true;
      }

      // Check construction
      if (msg.includes("construcción") || msg.includes("obra") || msg.includes("construccion")) {
        hasConstructionIssue = true;
      }

      // Check generic obstacles
      if (msg.includes("obstáculo") || msg.includes("bloqueo") || msg.includes("objeto")) {
        hasObstacleIssue = true;
      }

      // Check ramps
      if (msg.includes("rampa")) {
        hasRampIssue = true;
      }
    });
  }

  // 1. SCORING BY MOBILITY PROFILE
  if (mobilityMode === "silla-manual") {
    // Manual Wheelchair User Profile
    // Slope: Highly critical (physical exhaustion)
    if (route.pendiente === "alta") {
      score -= 50;
    } else if (route.pendiente === "moderada") {
      score -= 30; // High penalty for manual rolling
    } else if (route.pendiente === "suave") {
      score += 5;
      explanations.push("Inclinación suave (manual)");
    }

    // Ramps: Crucial for rolling
    if (route.rampas >= 8) {
      score += 15;
      explanations.push("Abundantes rampas");
    } else if (route.rampas < 5) {
      score -= 30;
    }
    if (hasRampIssue) {
      score -= 30;
    }

    // Stairs: absolute barrier (dealbreaker)
    if (hasStairIssue) {
      score -= 60;
    }

    // Sidewalk defects & Continuity
    if (hasSidewalkIssue) {
      score -= 40;
    }
    if (route.surfaceQuality === "excelente") {
      score += 10;
      explanations.push("Superficie muy lisa");
    } else if (route.surfaceQuality === "mala") {
      score -= 30;
    }
    if (route.sidewalkContinuity === "alta") {
      score += 10;
      explanations.push("Excelente continuidad de acera");
    } else if (route.sidewalkContinuity === "baja") {
      score -= 25;
    }

    // Rest areas & Bathrooms
    if (route.nearbyRestAreas && route.nearbyRestAreas > 0) {
      score += Math.min(6, route.nearbyRestAreas * 2);
      explanations.push("Zonas de descanso en ruta");
    }
    if (route.nearbyBathrooms && route.nearbyBathrooms > 0) {
      score += 5;
      explanations.push("Baño accesible cercano");
    }

    // Obstacles
    if (hasObstacleIssue) {
      score -= 25;
    }
  } else if (mobilityMode === "silla-electrica") {
    // Electric Wheelchair User Profile
    // Slope: Moderate tolerance
    if (route.pendiente === "alta") {
      score -= 45;
    } else if (route.pendiente === "moderada") {
      score -= 10;
      explanations.push("Pendiente moderada tolerable");
    } else if (route.pendiente === "suave") {
      score += 5;
      explanations.push("Pendiente suave");
    }

    // Ramps
    if (route.rampas >= 8) {
      score += 15;
      explanations.push("Abundantes rampas");
    } else if (route.rampas < 5) {
      score -= 30;
    }
    if (hasRampIssue) {
      score -= 30;
    }

    // Stairs: absolute barrier
    if (hasStairIssue) {
      score -= 60;
    }

    // Sidewalk defects & Continuity
    if (hasSidewalkIssue) {
      score -= 40;
    }
    if (route.surfaceQuality === "excelente") {
      score += 10;
      explanations.push("Superficie lisa");
    } else if (route.surfaceQuality === "mala") {
      score -= 30;
    }
    if (route.sidewalkContinuity === "alta") {
      score += 10;
    } else if (route.sidewalkContinuity === "baja") {
      score -= 25;
    }

    // Rest areas & Bathrooms
    if (route.nearbyRestAreas && route.nearbyRestAreas > 0) {
      score += Math.min(6, route.nearbyRestAreas * 2);
    }
    if (route.nearbyBathrooms && route.nearbyBathrooms > 0) {
      score += 5;
      explanations.push("Baño accesible cercano");
    }

    // Obstacles
    if (hasObstacleIssue) {
      score -= 25;
    }
  } else if (mobilityMode === "andador") {
    // Walker User Profile
    // Distance / Effort penalty
    if (route.distanceKm > 1.0) {
      score -= Math.round((route.distanceKm - 1.0) * 15);
    }

    // Slope
    if (route.pendiente === "alta") {
      score -= 40;
    } else if (route.pendiente === "moderada") {
      score -= 20;
    } else {
      score += 5;
      explanations.push("Pendientes de bajo esfuerzo");
    }

    // Stairs & Sidewalks
    if (hasStairIssue) {
      score -= 50;
    }
    if (hasSidewalkIssue) {
      score -= 30;
    }
    if (route.surfaceQuality === "excelente") {
      score += 5;
    } else if (route.surfaceQuality === "mala") {
      score -= 20;
    }
    if (route.sidewalkContinuity === "alta") {
      score += 5;
    } else if (route.sidewalkContinuity === "baja") {
      score -= 15;
    }

    // Rest Areas (highly critical for rollators/walkers)
    if (route.nearbyRestAreas && route.nearbyRestAreas > 0) {
      score += Math.min(15, route.nearbyRestAreas * 5);
      explanations.push("Abundante espacio de descanso");
    } else {
      score -= 10; // Penalty if no rest opportunities
    }
    if (route.nearbyBathrooms && route.nearbyBathrooms > 0) {
      score += 5;
      explanations.push("Baño accesible en trayecto");
    }

    // Ramps count
    if (route.rampas < 5) {
      score -= 20;
    } else if (route.rampas >= 8) {
      score += 10;
      explanations.push("Favorable para andadores");
    }
    if (hasRampIssue) {
      score -= 20;
    }
  } else if (mobilityMode === "baja-vision") {
    // Visual Impairment Profile
    if (hasObstacleIssue || hasConstructionIssue) {
      score -= 45;
    }
    if (hasSidewalkIssue) {
      score -= 35;
    }
    if (hasStairIssue) {
      score -= 35;
    }

    // Safe crossings count
    if (route.accessibleCrossings && route.accessibleCrossings > 0) {
      score += Math.min(12, route.accessibleCrossings * 4);
      explanations.push("Cruces con guías o audio");
    }

    // Crossing hazards check
    const hasCrossingIssue = route.warnings?.some((w) => {
      const m = w.message.toLowerCase();
      return m.includes("semáforo") || m.includes("semaforo") || m.includes("cruce");
    });
    if (hasCrossingIssue) {
      score -= 30;
    } else {
      score += 15;
      explanations.push("Cruces peatonales seguros");
    }

    if (route.nearbyBathrooms && route.nearbyBathrooms > 0) {
      score += 5;
    }
  } else if (mobilityMode === "baston") {
    // Cane User Profile
    if (hasStairIssue) {
      score -= 35;
    }
    if (route.pendiente === "alta") {
      score -= 30;
    } else if (route.pendiente === "moderada") {
      score -= 15;
    }
    if (hasSidewalkIssue) {
      score -= 20;
    }
    if (hasObstacleIssue) {
      score -= 15;
    }
    if (route.nearbyRestAreas && route.nearbyRestAreas > 0) {
      score += Math.min(6, route.nearbyRestAreas * 2);
    }
    if (route.nearbyBathrooms && route.nearbyBathrooms > 0) {
      score += 5;
    }
  } else {
    // Able-bodied / Standard walking profile (sin-ayuda)
    if (hasStairIssue) {
      score -= 15;
    }
    if (route.pendiente === "alta") {
      score -= 10;
    }
    if (hasSidewalkIssue) {
      score -= 10;
    }
  }

  // 2. AVOID BARRIERS USER PREFERENCES (Double-down on explicitly avoided barriers)
  if (avoidsStairs && hasStairIssue) {
    score -= 30;
  }
  if (avoidsSlopes && (route.pendiente === "alta" || route.pendiente === "moderada")) {
    score -= 30;
  }
  if (avoidsSidewalks && hasSidewalkIssue) {
    score -= 30;
  }
  if (avoidsConstruction && hasConstructionIssue) {
    score -= 30;
  }

  // 3. EXPLANATIONS & TAGS GENERATION
  if (!hasStairIssue) {
    explanations.push("Ruta sin escalones");
  }
  if (avoidsStairs && !hasStairIssue) {
    explanations.push("Evita escaleras");
  }
  if (avoidsSidewalks && !hasSidewalkIssue) {
    explanations.push("Banqueta transitable");
  }
  if (route.warnings && route.warnings.length === 0) {
    explanations.push("Libre de obstáculos");
  } else if (route.warnings && route.warnings.length <= 1 && !hasStairIssue) {
    explanations.push("Baja densidad de alertas");
  }

  // Bound score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  return {
    score: finalScore,
    explanations,
  };
}
