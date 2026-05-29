import { useState, useEffect, useRef } from "react";
import { discoverPlaces } from "@/services/placeDiscoveryService";
import { LocationSuggestion } from "@/types/location";
import { useUserLocation } from "@/hooks/useUserLocation";

export function useLocationSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Obtain and track user's geolocated coordinates
  const { location: userCoords } = useUserLocation();
  const userCoordsRef = useRef(userCoords);

  useEffect(() => {
    userCoordsRef.current = userCoords;
  }, [userCoords]);

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    setLoading(true);
    setError(null);

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const coords: [number, number] | null = userCoordsRef.current
          ? [userCoordsRef.current.latitude, userCoordsRef.current.longitude]
          : null;
        const results = await discoverPlaces(query, coords);
        setSuggestions(results);
      } catch (err: any) {
        setError(err.message || "Error al buscar ubicaciones");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query]);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    clearSearch: () => {
      setQuery("");
      setSuggestions([]);
    },
  };
}
