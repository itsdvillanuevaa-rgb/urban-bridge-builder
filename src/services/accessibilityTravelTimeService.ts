/**
 * AccessibilityTravelTimeService computes realistic travel durations for users with
 * accessibility needs based on their mobility profile, average slope, obstacle count,
 * and ramp availability.
 */

export interface TravelTimeCalculationInput {
  distanceKm: number;
  mobilityMode: string;
  pendiente: "suave" | "moderada" | "alta";
  warningsCount: number;
  rampasCount: number;
}

// Configurable speed profile registry (in km/h)
export const MOBILITY_SPEEDS: Record<string, number> = {
  "sin-ayuda": 4.5,        // Standard walking speed (about 4.5 km/h)
  "silla-electrica": 5.5,   // Electric wheelchair speed (5.0 - 6.0 km/h range)
  "silla-manual": 2.5,     // Manual wheelchair speed (2.0 - 3.0 km/h range)
  "andador": 1.75,          // Walker user speed (1.5 - 2.0 km/h range)
  "baston": 2.5,           // Cane user speed (2.0 - 3.0 km/h range)
  "baja-vision": 3.0,      // Low-vision walker speed (about 3.0 km/h)
};

export function calculateTravelTime({
  distanceKm,
  mobilityMode,
  pendiente,
  warningsCount,
  rampasCount,
}: TravelTimeCalculationInput): number {
  // 1. Get base speed (defaulting to standard walking)
  const speed = MOBILITY_SPEEDS[mobilityMode] || MOBILITY_SPEEDS["sin-ayuda"];

  // 2. Compute base duration in minutes
  const baseTimeMin = (distanceKm / speed) * 60;

  let totalTime = baseTimeMin;

  // 3. Apply slope modifier (steeper terrain creates fatigue and reduces velocity)
  if (pendiente === "alta") {
    if (["silla-manual", "andador", "baston"].includes(mobilityMode)) {
      totalTime += baseTimeMin * 0.50; // +50% time for manual mobility on steep inclines
    } else if (["silla-electrica", "baja-vision"].includes(mobilityMode)) {
      totalTime += baseTimeMin * 0.25; // +25% time
    } else {
      totalTime += baseTimeMin * 0.15; // +15% time for standard walking
    }
  } else if (pendiente === "moderada") {
    if (["silla-manual", "andador", "baston"].includes(mobilityMode)) {
      totalTime += baseTimeMin * 0.20; // +20% time
    } else {
      totalTime += baseTimeMin * 0.10; // +10% time
    }
  }

  // 4. Apply obstacle penalties (maneuvering around broken sidewalks, blocks, or curbs takes time)
  if (warningsCount > 0) {
    let penaltyPerObstacle = 0.5; // Default for standard walking
    if (["silla-manual", "andador"].includes(mobilityMode)) {
      penaltyPerObstacle = 2.0; // 2 minutes delay per obstacle
    } else if (["silla-electrica", "baston", "baja-vision"].includes(mobilityMode)) {
      penaltyPerObstacle = 1.0; // 1 minute delay per obstacle
    }
    totalTime += warningsCount * penaltyPerObstacle;
  }

  // 5. Apply ramp adjustments
  // Wheelchair and walker users face difficulties when crossings lack ramps.
  if (["silla-manual", "silla-electrica", "andador"].includes(mobilityMode)) {
    if (rampasCount < 5) {
      // Penalty: Add 1.5 minutes per missing ramp (assuming a threshold of 5 minimum ramps)
      totalTime += (5 - rampasCount) * 1.5;
    }
  }

  // High ramp counts reward accessible pathways with smooth rolling
  if (rampasCount >= 8) {
    const discount = Math.min(3, totalTime * 0.1); // Up to 10% discount, max 3 minutes
    totalTime -= discount;
  }

  // 6. Ensure minimum duration of at least 1 minute
  return Math.max(1, Math.round(totalTime));
}
