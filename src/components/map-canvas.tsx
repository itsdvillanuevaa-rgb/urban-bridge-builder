import { useEffect, useState, lazy, Suspense } from "react";

const LeafletMap = lazy(() => import("./leaflet-map"));

export function MapCanvas({ className = "" }: { className?: string }) {
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
          <LeafletMap />
        </Suspense>
      ) : (
        <div className="w-full h-full grid place-items-center text-muted-foreground">
          Cargando mapa…
        </div>
      )}
    </div>
  );
}
