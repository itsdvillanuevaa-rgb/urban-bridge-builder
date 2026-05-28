import { categoryMeta, type Alert } from "@/data/mock";
import { CheckCircle2, Clock, MapPin } from "lucide-react";

const severityClass = {
  alta: "bg-destructive/10 text-destructive ring-destructive/20",
  media: "bg-warning/15 text-warning-foreground ring-warning/30",
  baja: "bg-success/10 text-success ring-success/30",
} as const;

function timeAgo(min: number) {
  if (min < 60) return `Hace ${min} min`;
  return `Hace ${Math.floor(min / 60)} h`;
}

function distance(m: number) {
  if (m < 1000) return `${m} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

export function AlertCard({ alert, compact = false }: { alert: Alert; compact?: boolean }) {
  const meta = categoryMeta[alert.category];
  return (
    <article className="bg-card rounded-2xl ring-1 ring-border p-4 flex gap-3 items-start">
      <div
        className={[
          "size-12 shrink-0 rounded-2xl grid place-items-center text-xl ring-1",
          severityClass[alert.severity],
        ].join(" ")}
        aria-hidden
      >
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-tight text-foreground">{alert.title}</h3>
          {alert.status === "verificado" && (
            <CheckCircle2 className="size-5 text-success shrink-0" aria-label="Verificado" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden />
          <span className="truncate">{alert.location}</span>
        </p>
        {!compact && (
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span className="font-semibold text-brand">{distance(alert.distanceM)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden /> {timeAgo(alert.minutesAgo)}
            </span>
            <span>·</span>
            <span>{alert.verifications} validaciones</span>
          </div>
        )}
      </div>
    </article>
  );
}
