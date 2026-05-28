import mapCity from "@/assets/map-city.jpg";
import { Layers, Navigation } from "lucide-react";

export function MapShell() {
  return (
    <div className="relative h-[480px] sm:h-[540px] w-full bg-muted rounded-3xl ring-1 ring-black/5 overflow-hidden">
      <img
        src={mapCity}
        alt="Mapa de la Ciudad de México con rutas accesibles"
        className="w-full h-full object-cover"
        width={1600}
        height={1024}
      />

      {/* Overlay top */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none gap-3">
        <div className="bg-white/95 backdrop-blur shadow-sm ring-1 ring-black/5 px-4 py-2.5 rounded-2xl pointer-events-auto">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Índice de Accesibilidad
          </p>
          <p className="text-2xl font-semibold text-brand leading-tight">
            84<span className="text-sm text-muted-foreground font-normal">/100</span>
          </p>
        </div>
        <div className="flex gap-2 pointer-events-auto">
          <button
            type="button"
            className="bg-white/95 backdrop-blur shadow-sm ring-1 ring-black/5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-white transition-colors inline-flex items-center gap-1.5"
          >
            <Layers className="size-3.5" aria-hidden /> Capas
          </button>
          <button
            type="button"
            className="bg-white/95 backdrop-blur shadow-sm ring-1 ring-black/5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-white transition-colors inline-flex items-center gap-1.5"
          >
            <Navigation className="size-3.5" aria-hidden /> Tráfico
          </button>
        </div>
      </div>

      {/* Route line (decorative SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 28 62 Q 40 52 48 50 T 68 38"
          stroke="oklch(0.62 0.11 192)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="2 1.5"
        />
      </svg>

      {/* Markers */}
      <div className="absolute top-[58%] left-[28%] -translate-x-1/2 -translate-y-1/2">
        <div className="size-6 bg-brand ring-4 ring-brand/25 rounded-full flex items-center justify-center shadow-lg">
          <div className="size-2 bg-white rounded-full" />
        </div>
        <div className="mt-1 bg-white px-2 py-0.5 rounded text-[10px] font-semibold shadow ring-1 ring-black/5 whitespace-nowrap">
          Origen
        </div>
      </div>
      <div className="absolute top-[36%] left-[68%] -translate-x-1/2 -translate-y-1/2">
        <div className="size-6 bg-foreground ring-4 ring-foreground/15 rounded-full flex items-center justify-center shadow-lg">
          <div className="size-2 bg-white rounded-sm" />
        </div>
        <div className="mt-1 bg-foreground text-background px-2 py-0.5 rounded text-[10px] font-semibold shadow whitespace-nowrap">
          Destino
        </div>
      </div>
      <div className="absolute top-[40%] left-[44%] size-4 bg-warning ring-2 ring-white rounded-full shadow animate-pulse-soft" title="Obstáculo reportado" />
      <div className="absolute top-[55%] left-[55%] size-3 bg-success ring-2 ring-white rounded-full shadow" title="Rampa verificada" />
      <div className="absolute top-[28%] left-[36%] size-3 bg-success ring-2 ring-white rounded-full shadow" title="Punto de descanso" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur ring-1 ring-black/5 rounded-xl px-3 py-2 flex flex-wrap gap-3 text-[11px]">
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-brand" /> Ruta accesible</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-warning" /> Obstáculo</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" /> Verificado</span>
      </div>
    </div>
  );
}
