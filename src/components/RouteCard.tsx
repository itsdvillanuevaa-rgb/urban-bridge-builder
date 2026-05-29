import React from "react";
import { Clock, Mountain, CheckCircle2, AlertTriangle, Sparkles, Sofa, Bath, Milestone, Footprints } from "lucide-react";
import { RouteSuggestion } from "@/types/route";

interface RouteCardProps {
  route: RouteSuggestion;
  isSelected: boolean;
  isBest?: boolean;
  onSelect: () => void;
}

function scoreColor(s: number) {
  if (s >= 90) return "text-success";
  if (s >= 75) return "text-brand";
  return "text-warning-foreground";
}

export function RouteCard({ route, isSelected, isBest, onSelect }: RouteCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full text-left bg-card rounded-3xl ring-1 p-5 transition-all hover:shadow-md",
        isSelected ? "ring-brand ring-2 shadow-sm" : "ring-border",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold truncate text-foreground">{route.summary}</h3>
            {isBest && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-brand bg-brand-soft px-2 py-0.5 rounded-full">
                <CheckCircle2 className="size-3" aria-hidden /> Recomendada
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{route.via}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={["text-2xl font-bold", scoreColor(route.score)].join(" ")}>{route.score}</p>
          <p className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
            Accesibilidad
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-foreground">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Clock className="size-4 text-muted-foreground" aria-hidden />
          <span>{route.durationMin} min</span>
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="font-semibold">{route.distanceKm} km</span>
        <span className="text-muted-foreground">·</span>
        <span className="font-semibold">{route.rampas} rampas</span>
        <span className="text-muted-foreground">·</span>
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Mountain className="size-4 text-muted-foreground" aria-hidden />
          <span className="capitalize">{route.pendiente}</span>
        </span>
      </div>

      {/* Explanations as pills (only when NOT selected for cleaner UI) */}
      {!isSelected && route.explanations && route.explanations.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {route.explanations.map((exp, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-[10px] font-semibold bg-brand-soft text-brand px-2 py-0.5 rounded-full"
            >
              {exp}
            </span>
          ))}
        </div>
      )}

      {/* Collapsible Environmental Intelligence Sheet (when selected) */}
      {isSelected && (
        <div className="mt-5 pt-4 border-t border-border space-y-4 animate-fade-up">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Ficha de Inteligencia Ambiental
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Slopes */}
              <div className="bg-muted/40 p-2.5 rounded-2xl flex items-start gap-2.5">
                <Mountain className="size-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-muted-foreground block text-[10px] uppercase">Pendiente</span>
                  <span className="font-bold text-foreground">
                    {route.averageSlope !== undefined ? `${route.averageSlope}% prom` : "N/D"}
                    {route.highestSlopeSegment !== undefined ? ` (${route.highestSlopeSegment}% máx)` : ""}
                  </span>
                </div>
              </div>

              {/* Surface Quality & Sidewalk Continuity */}
              <div className="bg-muted/40 p-2.5 rounded-2xl flex items-start gap-2.5">
                <Footprints className="size-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-muted-foreground block text-[10px] uppercase">Estado de Vía</span>
                  <span className="font-bold text-foreground capitalize">
                    {route.surfaceQuality || "Normal"} (Cont. {route.sidewalkContinuity || "media"})
                  </span>
                </div>
              </div>

              {/* Crossings */}
              <div className="bg-muted/40 p-2.5 rounded-2xl flex items-start gap-2.5">
                <Milestone className="size-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-muted-foreground block text-[10px] uppercase">Cruces Peatonales</span>
                  <span className="font-bold text-foreground">
                    {route.accessibleCrossings !== undefined ? `${route.accessibleCrossings} seguros` : "N/D"}
                  </span>
                </div>
              </div>

              {/* Rest Opportunities & Bathrooms */}
              <div className="bg-muted/40 p-2.5 rounded-2xl flex items-start gap-2.5">
                <Sofa className="size-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-muted-foreground block text-[10px] uppercase">Servicios</span>
                  <span className="font-bold text-foreground">
                    {route.nearbyRestAreas !== undefined ? `${route.nearbyRestAreas} bancos` : "0 bancos"}
                    {route.nearbyBathrooms ? ` / ${route.nearbyBathrooms} baño(s)` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bulleted justifications list */}
          {route.explanations && route.explanations.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-brand" />
                ¿Por qué se recomendó esta ruta?
              </h5>
              <ul className="space-y-1.5 text-xs text-muted-foreground pl-1">
                {route.explanations.map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand shrink-0 font-bold">•</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {route.warnings && route.warnings.length > 0 && (
        <div className="mt-4 space-y-2">
          {route.warnings.map((w) => (
            <div
              key={w.id}
              className={[
                "flex items-start gap-2 text-xs p-2.5 rounded-xl border",
                w.severity === "alta"
                  ? "bg-destructive/5 border-destructive/20 text-destructive font-medium"
                  : w.severity === "media"
                  ? "bg-warning/5 border-warning/20 text-warning-foreground font-medium"
                  : "bg-muted border-border text-muted-foreground",
              ].join(" ")}
            >
              <AlertTriangle className="size-3.5 shrink-0 mt-0.5" aria-hidden />
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
