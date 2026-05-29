export interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  city?: string;
  state?: string;
  distance?: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}
