import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TopBar } from "@/components/top-bar";
import { AlertCard } from "@/components/alert-card";
import { alerts, type Report } from "@/data/mock";
import { getReports } from "@/data/storage";
import { categoryMeta } from "@/data/mock";
import { CheckCircle2, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/alertas")({
  head: () => ({ meta: [{ title: "Alertas cercanas" }] }),
  component: AlertasPage,
});

const filters = ["Todas", "Alta", "Media", "Baja"];

const severityClass = {
  "Baja": "bg-success/10 text-success ring-success/30",
  "Media": "bg-warning/15 text-warning-foreground ring-warning/30",
  "Alta": "bg-destructive/10 text-destructive ring-destructive/20",
  "Crítica": "bg-destructive/20 text-destructive ring-destructive/30",
} as const;

function timeAgo(isoString: string) {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  
  if (diffMin < 1) return "Hace un momento";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffMin < 1440) return `Hace ${Math.floor(diffMin / 60)} h`;
  return `Hace ${Math.floor(diffMin / 1440)} d`;
}

function ReportCard({ report }: { report: Report }) {
  const meta = categoryMeta[report.category];
  const severityKey = report.severity as keyof typeof severityClass;
  
  return (
    <article className="bg-card rounded-2xl ring-1 ring-border p-4 flex gap-3 items-start">
      <div
        className={[
          "size-12 shrink-0 rounded-2xl grid place-items-center text-xl ring-1",
          severityClass[severityKey],
        ].join(" ")}
        aria-hidden
      >
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-tight text-foreground">{meta.label}</h3>
          {report.status === "nuevo" && (
            <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full">Nuevo</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden />
          <span className="truncate">{report.address || "Ubicación detectada"}</span>
        </p>
        {report.description && (
          <p className="text-sm text-foreground mt-1 line-clamp-2">{report.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span className="font-semibold text-brand">{report.severity}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden /> {timeAgo(report.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

function AlertasPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const loadedReports = getReports();
    setReports(loadedReports);
  }, []);

  const allAlerts = [...reports, ...alerts];
  const hasAlerts = allAlerts.length > 0;

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24">
      <TopBar title="Alertas" />

      <div className="px-4 pt-2">
        <p className="text-base text-muted-foreground">
          <span className="font-bold text-foreground">{allAlerts.length}</span> alertas activas a menos
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
        {hasAlerts ? (
          <>
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
            {alerts.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-base text-muted-foreground">Aún no hay alertas reportadas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
