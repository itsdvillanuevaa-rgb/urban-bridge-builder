import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { AlertCard } from "@/components/alert-card";
import { alerts } from "@/data/mock";

export const Route = createFileRoute("/alertas")({
  head: () => ({ meta: [{ title: "Alertas cercanas" }] }),
  component: AlertasPage,
});

const filters = ["Todas", "Alta", "Media", "Baja"] as const;
type FilterType = (typeof filters)[number];

function AlertasPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Todas");

  // Dynamically filter alerts by selected severity level
  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === "Todas") return true;
    return alert.severity.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24">
      <TopBar title="Alertas" />

      <div className="px-4 pt-2">
        <p className="text-base text-muted-foreground">
          <span className="font-bold text-foreground">{filteredAlerts.length}</span>{" "}
          alertas activas a menos de 1 km
        </p>
      </div>

      <div className="px-4 pt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={[
                "h-10 px-4 rounded-full text-sm font-semibold whitespace-nowrap ring-1 transition-all cursor-pointer",
                active
                  ? "bg-foreground text-background ring-foreground scale-105"
                  : "bg-card text-foreground ring-border hover:bg-muted",
              ].join(" ")}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="px-4 pt-4 space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))
        ) : (
          <div className="bg-card rounded-2xl ring-1 ring-border p-6 text-center text-sm text-muted-foreground">
            No hay alertas con gravedad "{activeFilter}" en la zona.
          </div>
        )}
      </div>
    </div>
  );
}
