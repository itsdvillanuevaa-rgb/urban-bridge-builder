import { RoutePreferenceProfile, RouteSuggestion } from "@/types/route";

export interface ScoreResult {
  score: number;
  explanations: string[];
}

export function scoreRoute(
  route: Omit<RouteSuggestion, "score">,
  profile: RoutePreferenceProfile
): ScoreResult {
  let score = 90; // Base score
  const explanations: string[] = [];

  const { mobilityMode, avoidBarriers } = profile;
  const avoidsStairs = avoidBarriers.includes("escaleras");
  const avoidsSlopes = avoidBarriers.includes("pendientes");
  const avoidsSidewalks = avoidBarriers.includes("banquetas");

  // 1. Evaluate slope (pendiente)
  if (route.pendiente === "alta") {
    if (avoidsSlopes) {
      score -= 40; // Severe penalty for avoided barrier
    } else {
      score -= 20;
    }
  } else if (route.pendiente === "moderada") {
    if (avoidsSlopes) {
      score -= 15;
    } else {
      score -= 5;
    }
  } else if (route.pendiente === "suave") {
    score += 5;
    if (avoidsSlopes) {
      explanations.push("Pendientes suaves");
    }
  }

  // 2. Evaluate ramps
  if (route.rampas >= 8) {
    score += 10;
    explanations.push("Rampas accesibles");
  } else if (route.rampas < 5) {
    if (
      mobilityMode === "silla-manual" ||
      mobilityMode === "silla-electrica" ||
      mobilityMode === "andador"
    ) {
      score -= 25; // Severe penalty for wheelchair users
    } else {
      score -= 10;
    }
  }

  // 3. Evaluate warnings (obstacles/barriers)
  let obstacleCount = 0;
  let hasSidewalkIssue = false;
  let hasStairIssue = false;

  if (route.warnings && route.warnings.length > 0) {
    route.warnings.forEach((w) => {
      obstacleCount++;
      const msg = w.message.toLowerCase();

      // Sidewalk issues
      if (msg.includes("banqueta") || msg.includes("acera") || msg.includes("ruta rota")) {
        hasSidewalkIssue = true;
        if (avoidsSidewalks) {
          score -= 30; // Severe penalty
        } else {
          score -= 15;
        }
      }

      // Stairs/steps
      if (
        msg.includes("escalera") ||
        msg.includes("escalón") ||
        msg.includes("escalon") ||
        msg.includes("peldaño")
      ) {
        hasStairIssue = true;
        if (avoidsStairs) {
          score -= 40; // Severe penalty
        } else {
          score -= 20;
        }
      }

      // Generic obstacles
      if (!msg.includes("banqueta") && !msg.includes("escalera")) {
        score -= w.severity === "alta" ? 20 : w.severity === "media" ? 10 : 5;
      }
    });
  }

  // Explanations/Reasons
  if (avoidsStairs && !hasStairIssue) {
    explanations.push("Evita escaleras");
  }
  if (avoidsSidewalks && !hasSidewalkIssue) {
    explanations.push("Banqueta en buen estado");
  }
  if (obstacleCount === 0) {
    explanations.push("Libre de obstáculos");
  }

  // Bound score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  return {
    score: finalScore,
    explanations,
  };
}
