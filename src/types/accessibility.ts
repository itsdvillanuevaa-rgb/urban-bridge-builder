export interface AccessibilityPoint {
  id: string;
  position: [number, number];
  title: string;
  description: string;
  category: "rampas" | "sin-escaleras" | "baños" | "descanso";
}

export interface SearchHistoryEntry {
  query: string;
  lat: number;
  lon: number;
}
