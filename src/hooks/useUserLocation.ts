import { useState, useEffect } from "react";
import { UserLocation } from "@/types/location";

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setError("Geolocalización no soportada en este navegador.");
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setError(null);
      setPermissionDenied(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      console.warn("Geolocation watch error:", err);
      if (err.code === err.PERMISSION_DENIED) {
        setPermissionDenied(true);
        setError("Permiso de geolocalización denegado.");
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        setError("Señal GPS no disponible.");
      } else if (err.code === err.TIMEOUT) {
        setError("Tiempo de espera agotado.");
      } else {
        setError("Error al obtener ubicación.");
      }
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 15000,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error, permissionDenied };
}
