import { categoryMeta, type Report } from "@/data/mock";
import { CheckCircle2, Clock } from "lucide-react";

const toneClass = {
  warning: "bg-warning/15 text-warning-foreground ring-warning/30",
  success: "bg-success/10 text-success ring-success/30",
  muted: "bg-muted text-muted-foreground ring-black/5",
} as const;

function timeAgo(min: number) {
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  return `Hace ${h} h`;
}

export function ReportRow({ report }: { report: Report }) {
  const meta = categoryMeta[report.category];
  return (
    <div className="p-4 hover:bg-muted/40 transition-colors cursor-pointer">
      <div className="flex gap-4">
        <div
          className={[
            "size-10 shrink-0 rounded-lg ring-1 flex items-center justify-center text-lg",
            toneClass[meta.tone],
          ].join(" ")}
          aria-hidden
        >
          {meta.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground truncate">{report.title}</p>
            {report.status === "verificado" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success uppercase tracking-wider">
                <CheckCircle2 className="size-3" aria-hidden /> Verificado
              </span>
            )}
            {report.status === "resuelto" && (
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Resuelto
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">{report.location} · {meta.label}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden /> {timeAgo(report.minutesAgo)}
            </span>
            <span>·</span>
            <span>{report.verifications} validaciones</span>
            <span>·</span>
            <span>#{report.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
