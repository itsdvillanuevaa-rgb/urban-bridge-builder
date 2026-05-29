export interface RouteWarning {
  id: string;
  message: string;
  severity: "alta" | "media" | "baja";
}

export interface RoutePreferenceProfile {
  mobilityMode: string;
  avoidBarriers: string[];
}

export interface RouteAccessibilityMetrics {
  ramps: number;
  obstacles: number;
  averageSlope: number;
  accessibilityScore: number;
}

export interface RouteSuggestion {
  id: string;
  summary: string;
  durationMin: number;
  distanceKm: number;
  score: number;
  rampas: number;
  pendiente: "suave" | "moderada" | "alta";
  via: string;
  warnings?: RouteWarning[];
  explanations?: string[];
  geometry?: [number, number][];
}
