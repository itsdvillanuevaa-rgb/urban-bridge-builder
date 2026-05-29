import { LocationSuggestion } from "@/types/location";
import { calculateDistance } from "./routingService";

export function parseAddress(displayName: string): { name: string; city: string; state: string } {
  const parts = displayName.split(",").map((p) => p.trim());
  const name = parts[0] || "";
  let city = "";
  let state = "";

  if (parts.length > 2) {
    // The last part is typically country (e.g. "México" or "United States")
    // Second to last is typically state (e.g. "Baja California" or "Jalisco" or "B.C.")
    state = parts[parts.length - 2] || "";
    // Third to last is typically city/municipality (e.g. "Tijuana" or "Guadalajara")
    city = parts[parts.length - 3] || "";

    // Normalize and clean state abbreviations for standard Mexican states
    const cleanState = state.toLowerCase().replace(/\./g, "").trim();
    if (cleanState === "bc" || cleanState === "baja california") {
      state = "Baja California";
    } else if (cleanState === "jal" || cleanState === "jalisco") {
      state = "Jalisco";
    } else if (cleanState === "df" || cleanState === "cdmx" || cleanState === "ciudad de mexico") {
      state = "Ciudad de México";
    } else if (cleanState === "nl" || cleanState === "nuevo leon") {
      state = "Nuevo León";
    }
  }

  return { name, city, state };
}

export function rankSuggestions(
  suggestions: LocationSuggestion[],
  userCoords: [number, number] | null,
  query: string
): LocationSuggestion[] {
  const normQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // 1. Process, annotate, and score each suggestion
  const scored = suggestions.map((item) => {
    // Extract or parse name, city, state
    let name = item.name;
    let city = item.city;
    let state = item.state;

    if (!name || !city || !state) {
      const parsed = parseAddress(item.display_name);
      name = name || parsed.name;
      city = city || parsed.city;
      state = state || parsed.state;
    }

    const itemLat = parseFloat(item.lat);
    const itemLon = parseFloat(item.lon);
    
    let distance: number | undefined = undefined;
    let priorityWeight = 0;

    // Calculate distance and proximity priority
    if (userCoords && !isNaN(itemLat) && !isNaN(itemLon)) {
      distance = calculateDistance(userCoords, [itemLat, itemLon]);
      
      const normName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const isExactOrFuzzyNameMatch = normName.includes(normQuery) || normQuery.includes(normName);

      if (isExactOrFuzzyNameMatch && distance < 25) {
        // Priority 1: Exact/Fuzzy name match + nearby (< 25 km)
        priorityWeight = 10000 - distance;
      } else if (distance < 25) {
        // Priority 2: Nearby matches (0 - 25 km)
        priorityWeight = 8000 - distance;
      } else if (distance < 100) {
        // Priority 3: Regional matches (25 - 100 km)
        priorityWeight = 6000 - distance;
      } else if (distance < 350) {
        // Priority 4: State-level matches (100 - 350 km)
        priorityWeight = 4000 - distance;
      } else {
        // Priority 5: National matches
        priorityWeight = 2000 - distance;
      }

      // Priority 6: Penalize international matches if query specifies Mexico context but OSM returns overseas
      const isMexico = item.display_name.toLowerCase().includes("méxico") || item.display_name.toLowerCase().includes("mexico");
      if (!isMexico && suggestions.some(s => s.display_name.toLowerCase().includes("mex"))) {
        priorityWeight = Math.max(0, priorityWeight - 2000);
      }
    } else {
      // Fallback ranking when userCoords is not available
      const normName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normName === normQuery) {
        priorityWeight = 1000;
      } else if (normName.startsWith(normQuery)) {
        priorityWeight = 800;
      } else if (normName.includes(normQuery)) {
        priorityWeight = 600;
      } else {
        priorityWeight = 400;
      }
    }

    const suggestion: LocationSuggestion = {
      ...item,
      name,
      city,
      state,
      distance,
    };

    return { suggestion, priorityWeight };
  });

  // 2. Sort candidates by priority weight descending
  const sorted = scored.sort((a, b) => b.priorityWeight - a.priorityWeight);

  // 3. De-duplicate suggestions within ~11 meters (0.0001 lat/lon bounds)
  const unique: typeof sorted = [];
  for (const item of sorted) {
    const latNum = parseFloat(item.suggestion.lat);
    const lonNum = parseFloat(item.suggestion.lon);

    const isDuplicate = unique.some((existing) => {
      const exLat = parseFloat(existing.suggestion.lat);
      const exLon = parseFloat(existing.suggestion.lon);
      return Math.abs(exLat - latNum) < 0.0001 && Math.abs(exLon - lonNum) < 0.0001;
    });

    if (!isDuplicate) {
      unique.push(item);
    }
  }

  // 4. Return top 5 suggestions
  return unique.map((item) => item.suggestion).slice(0, 5);
}
