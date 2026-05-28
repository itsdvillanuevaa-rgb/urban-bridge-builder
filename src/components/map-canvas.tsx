import mapCity from "@/assets/map-city.jpg";

export function MapCanvas({ className = "" }: { className?: string }) {
  return (
    <div className={["relative w-full h-full overflow-hidden bg-muted", className].join(" ")}>
      <img
        src={mapCity}
        alt="Mapa de la ciudad con rutas accesibles"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Decorative accessible route */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 24 70 Q 38 58 50 52 T 76 32"
          stroke="oklch(0.55 0.09 220)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="2 1.5"
        />
      </svg>

      {/* Origin */}
      <div className="absolute" style={{ top: "70%", left: "24%" }}>
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="size-5 rounded-full bg-brand ring-4 ring-brand/25 shadow-lg grid place-items-center">
            <div className="size-1.5 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Destination */}
      <div className="absolute" style={{ top: "32%", left: "76%" }}>
        <div className="-translate-x-1/2 -translate-y-full">
          <div className="size-9 rounded-full rounded-bl-none bg-foreground text-background shadow-xl grid place-items-center">
            <span className="text-sm font-bold">B</span>
          </div>
        </div>
      </div>

      {/* Markers */}
      <div className="absolute size-5 rounded-full bg-warning ring-4 ring-white shadow-lg animate-pulse-soft" style={{ top: "44%", left: "46%" }} title="Obstáculo" />
      <div className="absolute size-4 rounded-full bg-success ring-3 ring-white shadow" style={{ top: "58%", left: "55%" }} title="Rampa verificada" />
      <div className="absolute size-4 rounded-full bg-success ring-3 ring-white shadow" style={{ top: "30%", left: "38%" }} title="Baño accesible" />
      <div className="absolute size-4 rounded-full bg-destructive ring-3 ring-white shadow animate-pulse-soft" style={{ top: "62%", left: "70%" }} title="Banqueta rota" />
    </div>
  );
}
