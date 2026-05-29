import { LocationSuggestion } from "@/types/location";

export async function searchLocations(
  query: string,
  userCoords?: [number, number] | null
): Promise<LocationSuggestion[]> {
  if (query.trim().length < 3) {
    return [];
  }

  try {
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=5&countrycodes=mx&accept-language=es`;

    if (userCoords) {
      const [lat, lon] = userCoords;
      // Define a 0.15 degree bounding box around the user (approx 15-20km radius)
      const lon1 = lon - 0.15;
      const lat1 = lat + 0.15;
      const lon2 = lon + 0.15;
      const lat2 = lat - 0.15;
      url += `&viewbox=${lon1},${lat1},${lon2},${lat2}&bounded=0`;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "UrbanBridgeBuilder/1.0 (Accessibility Route Planner)",
      },
    });

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
