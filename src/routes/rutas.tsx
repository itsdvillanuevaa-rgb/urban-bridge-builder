import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { routes } from "@/data/mock";
import { Circle, Square, Clock, Mountain, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/rutas")({
  head: () => ({ meta: [{ title: "Buscar ruta accesible" }] }),
  component: RutasPage,
});

function scoreColor(s: number) {
  if (s >= 90) return "text-success";
  if (s >= 75) return "text-brand";
  return "text-warning-foreground";
}

function RutasPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24">
      <TopBar title="Buscar ruta" back />

      <div className="px-4 pt-4 space-y-3">
        <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
          <label className="flex items-center gap-3 px-4 h-14 border-b border-border">
            <Circle className="size-4 text-muted-foreground" aria-hidden />
            <input
              type="text"
              defaultValue="Mi ubicación"
              aria-label="Origen"
              className="flex-1 bg-transparent text-base outline-none"
            />
          </label>
          <label className="flex items-center gap-3 px-4 h-14">
            <Square className="size-4 text-brand fill-brand" aria-hidden />
            <input
              type="text"
              placeholder="¿A dónde vamos?"
              aria-label="Destino"
              autoFocus
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
          Rutas sugeridas
        </h2>
        {routes.map((r, i) => (
          <button
            key={r.id}
            type="button"
            className={[
              "w-full text-left bg-card rounded-3xl ring-1 p-5 transition-all hover:shadow-md",
              i === 0 ? "ring-brand ring-2" : "ring-border",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold truncate">{r.summary}</h3>
                  {i === 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-brand bg-brand-soft px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="size-3" aria-hidden /> Mejor
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{r.via}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={["text-2xl font-bold", scoreColor(r.score)].join(" ")}>{r.score}</p>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                  Accesibilidad
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-muted-foreground" aria-hidden />
                <span className="font-semibold">{r.durationMin} min</span>
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="font-semibold">{r.rampas} rampas</span>
              <span className="text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Mountain className="size-4 text-muted-foreground" aria-hidden />
                <span className="capitalize">{r.pendiente}</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
