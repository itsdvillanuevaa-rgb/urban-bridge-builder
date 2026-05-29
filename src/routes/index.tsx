import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MapCanvas } from "@/components/map-canvas";
import { AlertCard } from "@/components/alert-card";
import { BigButton } from "@/components/big-button";
import { alerts } from "@/data/mock";
import { Search, Locate, SlidersHorizontal, Route as RouteIcon } from "lucide-react";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("aa.onboarded")) navigate({ to: "/splash" });
  }, [navigate]);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Map fills the screen */}
      <div className="absolute inset-0 bottom-[260px]">
        <MapCanvas />
      </div>

      {/* Top floating search */}
      <div className="relative z-10 px-4 pt-4 safe-top space-y-3 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <Link
            to="/rutas"
            className="flex-1 h-14 rounded-2xl bg-card shadow-lg ring-1 ring-border flex items-center gap-3 px-4 text-left hover:bg-card/95 transition-colors"
            aria-label="Buscar destino"
          >
            <Search className="size-5 text-muted-foreground shrink-0" aria-hidden />
            <span className="text-base text-muted-foreground truncate">¿A dónde vamos?</span>
          </Link>
          <button
            type="button"
            aria-label="Filtros de accesibilidad"
            className="size-14 shrink-0 rounded-2xl bg-card shadow-lg ring-1 ring-border grid place-items-center"
          >
            <SlidersHorizontal className="size-5 text-foreground" aria-hidden />
          </button>
        </div>

        <div className="flex gap-2 pointer-events-auto overflow-x-auto -mx-1 px-1 no-scrollbar">
          {["Rampas", "Sin escaleras", "Baños", "Descanso"].map((c, i) => (
            <button
              key={c}
              type="button"
              className={[
                "h-10 px-4 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm ring-1",
                i === 0
                  ? "bg-brand text-brand-foreground ring-brand"
                  : "bg-card text-foreground ring-border",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Locate FAB */}
      <button
        type="button"
        aria-label="Centrar en mi ubicación"
        className="absolute right-4 bottom-[280px] z-10 size-14 rounded-full bg-card shadow-xl ring-1 ring-border grid place-items-center"
      >
        <Locate className="size-6 text-brand" aria-hidden />
      </button>

      {/* Floating bottom sheet (peek) */}
      <div className="absolute left-0 right-0 bottom-[88px] z-10 bg-card rounded-t-3xl shadow-2xl ring-1 ring-border pb-2">
        <div className="flex justify-center pt-2 pb-3">
          <span className="h-1.5 w-12 rounded-full bg-muted-foreground/30" aria-hidden />
        </div>
        <div className="px-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold leading-tight">Cerca de ti</h2>
            <p className="text-xs text-muted-foreground">
              {alerts.length} alertas activas en tu zona
            </p>
          </div>
          <Link to="/alertas" className="text-sm font-semibold text-brand">
            Ver todas
          </Link>
        </div>

        <div className="px-4 space-y-2 max-h-[160px] overflow-hidden">
          {alerts.slice(0, 2).map((a) => (
            <AlertCard key={a.id} alert={a} compact />
          ))}
        </div>

        <div className="px-4 pt-3 pb-1">
          <BigButton
            onClick={() => navigate({ to: "/rutas" })}
            icon={<RouteIcon className="size-5" />}
          >
            Buscar ruta accesible
          </BigButton>
        </div>
      </div>
    </div>
  );
}
