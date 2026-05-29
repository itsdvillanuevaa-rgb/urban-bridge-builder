import { LocationSuggestion } from "@/types/location";

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  if (query.trim().length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&countrycodes=mx&accept-language=es`,
      {
        headers: {
          "User-Agent": "UrbanBridgeBuilder/1.0 (Accessibility Route Planner)",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API responded with status ${response.status}`);
    }

    const data = await response.json();

    return data.map((item: any) => ({
      place_id: item.place_id,
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error("Error fetching locations from Nominatim:", error);
    throw error;
  }
}
