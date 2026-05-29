import { LocationSuggestion } from "@/types/location";
import { searchLocations } from "./nominatimService";
import { rankSuggestions } from "./searchRankingService";

export interface CuratedPOI {
  name: string;
  display_name: string;
  lat: number;
  lon: number;
  category: "landmark" | "business" | "building" | "university" | "shopping";
  aliases: string[];
  city: string;
  state: string;
}

const CURATED_POIS: CuratedPOI[] = [
  {
    name: "Torre MIND",
    display_name: "Torre MIND, Avenida Faro 2350, Verde Valle, 44550 Guadalajara, Jal.",
    lat: 20.662706,
    lon: -103.391741,
    category: "building",
    aliases: ["torre mind", "mind", "mind guadalajara", "edificio mind"],
    city: "Guadalajara",
    state: "Jalisco",
  },
  {
    name: "UABC Campus Tijuana",
    display_name: "UABC Campus Tijuana, Calzada Universidad 14418, Parque Industrial Internacional Tijuana, 22390 Tijuana, B.C.",
    lat: 32.532321,
    lon: -116.963283,
    category: "university",
    aliases: ["uabc", "uabc tijuana", "universidad autonoma de baja california", "uabc campus tijuana"],
    city: "Tijuana",
    state: "Baja California",
  },
  {
    name: "Las Pulgas Club",
    display_name: "Las Pulgas, Avenida Revolución 1012, Zona Centro, 22000 Tijuana, B.C.",
    lat: 32.535805,
    lon: -117.034502,
    category: "business",
    aliases: ["las pulgas", "las pulgas bar", "club las pulgas", "pulgas tijuana"],
    city: "Tijuana",
    state: "Baja California",
  },
  {
    name: "Plaza Río Tijuana",
    display_name: "Plaza Río, Paseo de los Héroes 95, Zona Urbana Rio Tijuana, 22010 Tijuana, B.C.",
    lat: 32.529813,
    lon: -117.023245,
    category: "shopping",
    aliases: ["plaza rio", "plaza rio tijuana", "plaza del rio"],
    city: "Tijuana",
    state: "Baja California",
  },
  {
    name: "Macroplaza Insurgentes",
    display_name: "Macroplaza, Boulevard de los Insurgentes 18015, Río Tijuana 3a. Etapa, 22226 Tijuana, B.C.",
    lat: 32.507412,
    lon: -116.924849,
    category: "shopping",
    aliases: ["macroplaza", "macroplaza tijuana", "macro plaza"],
    city: "Tijuana",
    state: "Baja California",
  },
  {
    name: "Estadio Caliente",
    display_name: "Estadio Caliente (Xolos), Boulevard Agua Caliente 12027, Hipódromo, 22420 Tijuana, B.C.",
    lat: 32.502854,
    lon: -116.978235,
    category: "landmark",
    aliases: ["estadio caliente", "xolos", "estadio de xolos", "caliente estadio"],
    city: "Tijuana",
    state: "Baja California",
  },
  {
    name: "Starbucks Zona Río",
    display_name: "Starbucks Coffee, Boulevard General Rodolfo Sánchez Taboada 9351, Zona Urbana Rio Tijuana, 22010 Tijuana, B.C.",
    lat: 32.528432,
    lon: -117.021541,
    category: "business",
    aliases: ["starbucks", "starbucks tijuana", "starbucks rio", "cafe starbucks"],
    city: "Tijuana",
    state: "Baja California",
  },
  {
    name: "Costco Wholesale Tijuana",
    display_name: "Costco, Vía Rápida Poniente 1351, Zona Urbana Rio Tijuana, 22010 Tijuana, B.C.",
    lat: 32.524672,
    lon: -117.028912,
    category: "business",
    aliases: ["costco", "costco tijuana", "costco wholesale"],
    city: "Tijuana",
    state: "Baja California",
  },
];

function getFuzzyMatchScore(query: string, poi: CuratedPOI): number {
  const normQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (!normQuery) return 0;

  let bestScore = 0;
  const targets = [poi.name, ...poi.aliases];

  for (const target of targets) {
    const normTarget = target.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    
    // Exact match
    if (normQuery === normTarget) {
      bestScore = Math.max(bestScore, 1.0);
      continue;
    }

    // Prefix match
    if (normTarget.startsWith(normQuery)) {
      const ratio = normQuery.length / normTarget.length;
      bestScore = Math.max(bestScore, 0.8 + ratio * 0.15);
      continue;
    }

    // Substring match
    if (normTarget.includes(normQuery)) {
      const ratio = normQuery.length / normTarget.length;
      bestScore = Math.max(bestScore, 0.6 + ratio * 0.15);
      continue;
    }

    // Token word match
    const queryTokens = normQuery.split(/\s+/).filter(Boolean);
    const targetTokens = normTarget.split(/\s+/).filter(Boolean);
    
    let matchedTokens = 0;
    for (const qToken of queryTokens) {
      if (targetTokens.some(tToken => tToken.includes(qToken) || qToken.includes(tToken))) {
        matchedTokens++;
      }
    }

    if (matchedTokens > 0) {
      const tokenRatio = matchedTokens / Math.max(queryTokens.length, targetTokens.length);
      bestScore = Math.max(bestScore, 0.3 + tokenRatio * 0.3);
    }
  }

  return bestScore;
}

export async function discoverPlaces(
  query: string,
  userCoords?: [number, number] | null
): Promise<LocationSuggestion[]> {
  if (query.trim().length < 3) {
    return [];
  }

  // 1. Fetch from Nominatim
  let nominatimResults: LocationSuggestion[] = [];
  try {
    nominatimResults = await searchLocations(query);
  } catch (err) {
    console.error("Nominatim search failed during discoverPlaces:", err);
  }

  // 2. Score and filter curated POIs
  const matchedCurated: LocationSuggestion[] = CURATED_POIS.map((poi) => {
    const score = getFuzzyMatchScore(query, poi);
    return { poi, score };
  })
    .filter((item) => item.score > 0.3)
    .map((item) => ({
      place_id: Math.round(item.poi.lat * 100000 + item.poi.lon * 100000),
      display_name: item.poi.display_name,
      lat: item.poi.lat.toString(),
      lon: item.poi.lon.toString(),
      name: item.poi.name,
      city: item.poi.city,
      state: item.poi.state,
    }));

  // 3. Combine curated POIs with global Nominatim results
  const combined = [...matchedCurated, ...nominatimResults];

  // 4. Delegate to searchRankingService for parsing, proximity sorting, de-duplication, and limiting
  return rankSuggestions(combined, userCoords || null, query);
}
