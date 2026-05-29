import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapCanvas } from "@/components/map-canvas";
import { Search, Locate, SlidersHorizontal, Bell } from "lucide-react";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { getNearbyAccessibilityPoints } from "@/services/nearbyAccessibilityService";
import { AccessibilityPoint } from "@/types/accessibility";

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa — Acento Accesible" },
      {
        name: "description",
        content: "Mapa accesible en tiempo real con alertas validadas por la comunidad.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<"rampas" | "sin-escaleras" | "baños" | "descanso" | null>(null);
  const [discoveryPoints, setDiscoveryPoints] = useState<AccessibilityPoint[]>([]);

  // Hook for tracking continuous real-time user location
  const { location: userCoords, error: gpsError } = useUserLocation();
  const scrollProps = useHorizontalScroll();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("aa.onboarded")) navigate({ to: "/splash" });
  }, [navigate]);

  // Reactively fetch nearby accessibility discovery points when location or category changes
  useEffect(() => {
    if (!selectedCategory) {
      setDiscoveryPoints([]);
      return;
    }

    const lat = userCoords?.latitude ?? CDMX_CENTER[0];
    const lon = userCoords?.longitude ?? CDMX_CENTER[1];

    let isMounted = true;
    getNearbyAccessibilityPoints(lat, lon, selectedCategory)
      .then((points) => {
        if (isMounted) {
          setDiscoveryPoints(points);
        }
      })
      .catch((err) => {
        console.error("Error fetching nearby POIs:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, userCoords]);

  const userMapLocation: [number, number] | null = userCoords
    ? [userCoords.latitude, userCoords.longitude]
    : null;

  const handleRecenter = () => {
    setRecenterTrigger((prev) => prev + 1);
  };

  const chips = [
    { label: "Rampas", id: "rampas" as const },
    { label: "Sin escaleras", id: "sin-escaleras" as const },
    { label: "Baños", id: "baños" as const },
    { label: "Descanso", id: "descanso" as const },
  ];

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Map fills the screen area completely */}
      <div className="absolute inset-0 z-0">
        <MapCanvas
          userLocation={userMapLocation}
          recenterTrigger={recenterTrigger}
          discoveryPoints={discoveryPoints}
        />
      </div>

      {/* Top floating search and Discovery filter chips */}
      <div className="relative z-10 px-4 pt-4 safe-top space-y-3 pointer-events-none">
        {gpsError && (
          <div className="pointer-events-auto bg-warning/90 backdrop-blur-md text-warning-foreground text-xs p-3 rounded-2xl border border-warning/20 shadow-md">
            Aviso GPS: {gpsError}. Usando ubicación de simulación.
          </div>
        )}
        <div className="flex gap-2 pointer-events-auto">
          <Link
            to="/rutas"
            className="flex-1 h-14 rounded-2xl bg-card shadow-lg ring-1 ring-border flex items-center gap-3 px-4 text-left hover:bg-card/95 transition-colors"
            aria-label="Buscar destino"
          >
            <Search className="size-5 text-muted-foreground shrink-0" aria-hidden />
            <span className="text-base text-muted-foreground truncate">¿A dónde vamos?</span>
          </Link>
          <Link
            to="/alertas"
            className="size-14 shrink-0 rounded-2xl bg-card shadow-lg ring-1 ring-border grid place-items-center hover:bg-muted/50 transition-colors"
            aria-label="Alertas"
          >
            <Bell className="size-5 text-foreground" aria-hidden />
          </Link>
          <button
            type="button"
            aria-label="Filtros de accesibilidad"
            className="size-14 shrink-0 rounded-2xl bg-card shadow-lg ring-1 ring-border grid place-items-center"
          >
            <SlidersHorizontal className="size-5 text-foreground" aria-hidden />
          </button>
        </div>

        <div
          ref={scrollProps.ref}
          onMouseDown={scrollProps.onMouseDown}
          className="flex gap-2 pointer-events-auto overflow-x-auto -mx-4 px-4 py-1 no-scrollbar mask-fade"
        >
          {chips.map((c) => {
            const active = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(active ? null : c.id)}
                className={[
                  "h-10 px-4 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm ring-1 transition-all",
                  active
                    ? "bg-brand text-brand-foreground ring-brand scale-105"
                    : "bg-card text-foreground ring-border hover:bg-muted",
                ].join(" ")}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Locate FAB repositioned just above the navigation bar */}
      <button
        type="button"
        onClick={handleRecenter}
        aria-label="Centrar en mi ubicación"
        className="absolute right-4 bottom-24 z-10 size-14 rounded-full bg-card shadow-xl ring-1 ring-border grid place-items-center active:scale-95 transition-transform"
      >
        <Locate className="size-6 text-brand" aria-hidden />
      </button>
    </div>
  );
}
