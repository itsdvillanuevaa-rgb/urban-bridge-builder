import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { RouteAlert } from "@/data/mock";

const severityClass = {
  alta: "bg-destructive/10 text-destructive border-destructive/20",
  media: "bg-warning/15 text-warning-foreground border-warning/30",
  baja: "bg-success/10 text-success border-success/30",
} as const;

interface RouteAlertBannerProps {
  alert: RouteAlert;
  onDismiss?: () => void;
}

export function RouteAlertBanner({ alert, onDismiss }: RouteAlertBannerProps) {
  return (
    <div className="mx-4 mt-4 bg-card rounded-2xl ring-1 ring-border p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={[
            "size-12 shrink-0 rounded-xl grid place-items-center text-2xl ring-1",
            severityClass[alert.severity],
          ].join(" ")}
          aria-hidden
        >
          🚧
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" aria-hidden />
              {alert.title}
            </h3>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cerrar alerta"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
          <div className="mt-3 p-3 bg-brand/5 rounded-xl border border-brand/10">
            <p className="text-sm font-medium text-brand flex items-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden />
              {alert.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
