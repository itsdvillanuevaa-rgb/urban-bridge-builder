import React, { useEffect, useState } from "react";
import { getRouteRecommendations } from "@/services/routeRecommendationService";
import { RouteSuggestion, RoutePreferenceProfile } from "@/types/route";
import { RouteCard } from "./RouteCard";

interface RouteOptionsPanelProps {
  originCoords: [number, number] | null;
  destinationCoords: [number, number] | null;
  onRouteSelect: (geometry: [number, number][] | null) => void;
}

export function RouteOptionsPanel({
  originCoords,
  destinationCoords,
  onRouteSelect,
}: RouteOptionsPanelProps) {
  const [routes, setRoutes] = useState<RouteSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");

  const getProfile = (): RoutePreferenceProfile => {
    if (typeof window === "undefined") {
      return { mobilityMode: "sin-ayuda", avoidBarriers: [] };
    }
    try {
      const raw = localStorage.getItem("aa.profile");
      if (!raw) return { mobilityMode: "sin-ayuda", avoidBarriers: [] };
      const parsed = JSON.parse(raw);
      return {
        mobilityMode: parsed.mobility?.[0] || "sin-ayuda",
        avoidBarriers: parsed.avoid || [],
      };
    } catch {
      return { mobilityMode: "sin-ayuda", avoidBarriers: [] };
    }
  };

  const originLat = originCoords ? originCoords[0] : null;
  const originLon = originCoords ? originCoords[1] : null;
  const destLat = destinationCoords ? destinationCoords[0] : null;
  const destLon = destinationCoords ? destinationCoords[1] : null;

  useEffect(() => {
    if (originLat === null || originLon === null || destLat === null || destLon === null) {
      setRoutes([]);
      setSelectedRouteId("");
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const profile = getProfile();

    getRouteRecommendations([originLat, originLon], [destLat, destLon], profile)
      .then((data) => {
        if (!isMounted) return;
        setRoutes(data);
        if (data.length > 0) {
          setSelectedRouteId(data[0].id);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError("Error al cargar rutas recomendadas.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [originLat, originLon, destLat, destLon]);

  useEffect(() => {
    const selected = routes.find((r) => r.id === selectedRouteId);
    onRouteSelect(selected?.geometry || null);
  }, [selectedRouteId, routes, onRouteSelect]);

  if (loading) {
    return (
      <div className="px-4 pt-6 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
          Buscando rutas...
        </h2>
        <div className="bg-card rounded-3xl ring-1 ring-border p-6 text-center text-sm text-muted-foreground animate-pulse">
          Calculando trayectos y evaluando rampas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 pt-6">
        <div className="bg-card rounded-3xl ring-1 ring-border p-6 text-center text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pt-6 space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
        Rutas sugeridas
      </h2>
      {routes.map((route, index) => (
        <RouteCard
          key={route.id}
          route={route}
          isSelected={route.id === selectedRouteId}
          isBest={index === 0}
          onSelect={() => setSelectedRouteId(route.id)}
        />
      ))}
    </div>
  );
}
