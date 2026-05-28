import { createFileRoute } from "@tanstack/react-router";
import { accessibilityTrend, intelligenceKpis, priorityZones } from "@/data/mock";
import { KpiCard } from "@/components/kpi-card";
import heatmap from "@/assets/heatmap.jpg";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ArrowUpRight, Building2 } from "lucide-react";

export const Route = createFileRoute("/inteligencia")({
  head: () => ({
    meta: [
      { title: "Inteligencia Urbana — Acento Accesible" },
      {
        name: "description",
        content:
          "Dashboard para gobiernos locales: mapas de calor, zonas prioritarias y KPIs de accesibilidad en tiempo real.",
      },
      { property: "og:title", content: "Inteligencia Urbana — Acento Accesible" },
      {
        property: "og:description",
        content: "Datos para priorizar mantenimiento urbano basado en evidencia.",
      },
    ],
  }),
  component: IntelligencePage,
});

function IntelligencePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-28 md:pb-16">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-brand uppercase tracking-widest">Back-end institucional</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">Inteligencia Urbana</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Vista para IMPLAN y ayuntamientos. Prioriza mantenimiento basándote en demanda real, no en estimaciones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="alc" className="text-xs font-medium text-muted-foreground">Alcaldía:</label>
          <select
            id="alc"
            className="bg-card ring-1 ring-black/10 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-brand outline-none"
            defaultValue="Cuauhtémoc"
          >
            <option>Cuauhtémoc</option>
            <option>Benito Juárez</option>
            <option>Miguel Hidalgo</option>
            <option>Iztapalapa</option>
            <option>Coyoacán</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {intelligenceKpis.map((k) => (
          <KpiCard key={k.label} kpi={k} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Heatmap */}
        <div className="lg:col-span-2 bg-card rounded-3xl ring-1 ring-black/5 p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Mapa de calor · Obstáculos urbanos</h2>
              <p className="text-xs text-muted-foreground">Densidad de reportes en las últimas 4 semanas</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-amber-400" />Media</span>
              <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-red-500" />Alta</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
            <img src={heatmap} alt="Mapa de calor de obstáculos urbanos en CDMX" className="w-full h-72 object-cover" />
          </div>
        </div>

        {/* Trend chart */}
        <div className="bg-card rounded-3xl ring-1 ring-black/5 p-5">
          <h2 className="text-base font-semibold">Índice de accesibilidad</h2>
          <p className="text-xs text-muted-foreground mb-3">Tendencia mensual · Cuauhtémoc</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-semibold text-foreground">84</span>
            <span className="text-xs font-semibold text-success">+20 pts YTD</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accessibilityTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.11 192)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.62 0.11 192)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 260)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} stroke="oklch(0.46 0.012 260)" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} stroke="oklch(0.46 0.012 260)" axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="indice" stroke="oklch(0.62 0.11 192)" strokeWidth={2} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority zones */}
      <div className="bg-card rounded-3xl ring-1 ring-black/5 overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-black/5">
          <div>
            <h2 className="text-base font-semibold">Zonas prioritarias</h2>
            <p className="text-xs text-muted-foreground">Áreas con alta densidad de obstáculos cerca de servicios esenciales</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th scope="col" className="text-left font-semibold px-5 py-3">Zona</th>
                <th scope="col" className="text-left font-semibold px-5 py-3">Servicio impactado</th>
                <th scope="col" className="text-right font-semibold px-5 py-3">Reportes</th>
                <th scope="col" className="text-right font-semibold px-5 py-3">Score</th>
                <th scope="col" className="text-right font-semibold px-5 py-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {priorityZones.map((z) => (
                <tr key={z.zone} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-semibold text-foreground">{z.zone}</td>
                  <td className="px-5 py-3 text-muted-foreground inline-flex items-center gap-2">
                    <Building2 className="size-3.5" aria-hidden /> {z.service}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">{z.reports}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={[
                        "inline-block px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums",
                        z.score >= 85
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/15 text-warning-foreground",
                      ].join(" ")}
                    >
                      {z.score}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                      Priorizar <ArrowUpRight className="size-3" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
