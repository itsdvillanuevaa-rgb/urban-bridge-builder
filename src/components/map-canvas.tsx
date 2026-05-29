import { useEffect, useState, lazy, Suspense } from "react";
import { AccessibilityPoint } from "@/types/accessibility";

const LeafletMap = lazy(() => import("./leaflet-map"));

interface MapCanvasProps {
  className?: string;
  userLocation?: [number, number] | null;
  routeGeometry?: [number, number][] | null;
  recenterTrigger?: number;
  discoveryPoints?: AccessibilityPoint[];
}

export function MapCanvas({
  className = "",
  userLocation,
  routeGeometry,
  recenterTrigger,
  discoveryPoints,
}: MapCanvasProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={["relative w-full h-full overflow-hidden bg-muted", className].join(" ")}>
      {isClient ? (
        <Suspense
          fallback={
            <div className="w-full h-full grid place-items-center text-muted-foreground">
              Cargando mapa…
            </div>
          }
        >
          <LeafletMap
            userLocation={userLocation}
            routeGeometry={routeGeometry}
            recenterTrigger={recenterTrigger}
            discoveryPoints={discoveryPoints}
          />
        </Suspense>
      ) : (
        <div className="w-full h-full grid place-items-center text-muted-foreground">
          Cargando mapa…
        </div>
      )}
    </div>
  );
}