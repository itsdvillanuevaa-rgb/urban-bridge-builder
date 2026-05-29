import React, { useEffect, useState } from "react";
import { getRouteRecommendations } from "@/services/routeRecommendationService";
import { RouteSuggestion, RoutePreferenceProfile } from "@/types/route";
import { RouteCard } from "./RouteCard";
import { mainTijuanaRoute, alternativeTijuanaRoute } from "@/data/mock";

interface RouteOptionsPanelProps {
  originCoords: [number, number] | null;
  destinationCoords: [number, number] | null;
  onRouteSelect: (geometry: [number, number][] | null) => void;
  isDemoMode?: boolean;
}

export function RouteOptionsPanel({
  originCoords,
  destinationCoords,
  onRouteSelect,
  isDemoMode = false,
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

    // Use mock data for demo mode
    if (isDemoMode) {
      const demoRoutes: RouteSuggestion[] = [
        {
          id: "RT-TIJ-ALT",
          summary: "Ruta recomendada: evita banqueta obstruida",
          durationMin: alternativeTijuanaRoute.durationMin,
          distanceKm: 0.6,
          score: alternativeTijuanaRoute.score,
          rampas: alternativeTijuanaRoute.rampas,
          pendiente: alternativeTijuanaRoute.pendiente,
          via: alternativeTijuanaRoute.via,
          explanations: ["Más accesible", "Evita barreras", "Ruta segura"],
          geometry: alternativeTijuanaRoute.geometry,
        },
        {
          id: "RT-TIJ-MAIN",
          summary: "Ruta directa por Av. Constitución",
          durationMin: mainTijuanaRoute.durationMin,
          distanceKm: 0.5,
          score: mainTijuanaRoute.score,
          rampas: mainTijuanaRoute.rampas,
          pendiente: mainTijuanaRoute.pendiente,
          via: mainTijuanaRoute.via,
          warnings: [
            {
              id: "W-TIJ-1",
              message: "Banqueta obstruida por obras temporales",
              severity: "alta",
            },
          ],
          geometry: mainTijuanaRoute.geometry,
        },
      ];
      setRoutes(demoRoutes);
      setSelectedRouteId("RT-TIJ-ALT");
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
  }, [originLat, originLon, destLat, destLon, isDemoMode]);

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
      {routes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          isSelected={route.id === selectedRouteId}
          onSelect={() => setSelectedRouteId(route.id)}
        />
      ))}
    </div>
  );
}
