import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { AlertCard } from "@/components/alert-card";
import { alerts } from "@/data/mock";

export const Route = createFileRoute("/alertas")({
  head: () => ({ meta: [{ title: "Alertas cercanas" }] }),
  component: AlertasPage,
});

const filters = ["Todas", "Alta", "Media", "Baja"];

function AlertasPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24">
      <TopBar title="Alertas" />

      <div className="px-4 pt-2">
        <p className="text-base text-muted-foreground">
          <span className="font-bold text-foreground">{alerts.length}</span> alertas activas a menos
          de 1 km
        </p>
      </div>

      <div className="px-4 pt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map((f, i) => (
          <button
            key={f}
            type="button"
            className={[
              "h-10 px-4 rounded-full text-sm font-semibold whitespace-nowrap ring-1 transition-colors",
              i === 0
                ? "bg-foreground text-background ring-foreground"
                : "bg-card text-foreground ring-border",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 space-y-3">
        {alerts.map((a) => (
          <AlertCard key={a.id} alert={a} />
        ))}
      </div>
    </div>
  );
}
