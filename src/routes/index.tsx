import { createFileRoute, Link } from "@tanstack/react-router";
import { MapShell } from "@/components/map-shell";
import { ReportRow } from "@/components/report-row";
import { BusinessCard } from "@/components/business-card";
import { KpiCard } from "@/components/kpi-card";
import { businesses, cityKpis, reports } from "@/data/mock";
import { Circle, Square, Search } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa Ciudadano — Acento Accesible" },
      {
        name: "description",
        content:
          "Encuentra rutas accesibles en tiempo real con reportes validados por la comunidad en la Ciudad de México.",
      },
      { property: "og:title", content: "Mapa Ciudadano — Acento Accesible" },
      {
        property: "og:description",
        content: "Rutas accesibles validadas por la comunidad.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-28 md:pb-12">
      {/* Hero strip */}
      <section className="mb-6">
        <p className="text-xs font-semibold text-brand uppercase tracking-widest">Mapa Ciudadano</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
          La ciudad sin barreras, en tiempo real.
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          El motor de ruteo prioriza accesibilidad —no distancia— y recalcula al instante con cada reporte
          ciudadano validado.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left panel */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-card rounded-3xl ring-1 ring-black/5 p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">¿A dónde vamos hoy?</h2>
            <div className="space-y-3">
              <div className="relative">
                <Circle className="absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden />
                <input
                  type="text"
                  defaultValue="Mi ubicación"
                  aria-label="Origen"
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/60 ring-1 ring-black/5 rounded-lg text-sm focus:ring-brand focus:bg-card transition-all outline-none"
                />
              </div>
              <div className="relative">
                <Square className="absolute left-3 top-3 size-4 text-brand fill-brand" aria-hidden />
                <input
                  type="text"
                  placeholder="Destino: ¿a dónde quieres ir?"
                  aria-label="Destino"
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/60 ring-1 ring-black/5 rounded-lg text-sm focus:ring-brand focus:bg-card transition-all outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              className="mt-4 w-full bg-brand text-brand-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              <Search className="size-4" aria-hidden />
              Buscar ruta accesible
            </button>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { k: "Pendiente", v: "Suave" },
                { k: "Rampas", v: "8/8" },
                { k: "Tiempo", v: "22 min" },
              ].map((s) => (
                <div key={s.k} className="rounded-lg bg-muted/50 ring-1 ring-black/5 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</p>
                  <p className="text-sm font-semibold text-foreground">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Reportes cercanos
              </h2>
              <Link to="/reportar" className="text-xs font-semibold text-brand hover:underline">
                + Nuevo
              </Link>
            </div>
            <div className="divide-y divide-black/5 bg-card rounded-3xl ring-1 ring-black/5 overflow-hidden">
              {reports.slice(0, 4).map((r) => (
                <ReportRow key={r.id} report={r} />
              ))}
            </div>
          </div>
        </aside>

        {/* Right column */}
        <section className="lg:col-span-8 space-y-6">
          <MapShell />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businesses.slice(0, 2).map((b) => (
              <BusinessCard key={b.id} business={b} compact />
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cityKpis.map((k) => (
              <KpiCard key={k.label} kpi={k} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
