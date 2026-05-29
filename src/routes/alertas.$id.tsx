import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { categoryMeta, type Report, type Alert } from "@/data/mock";
import { MapPin, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

const severityClass = {
  baja: "bg-success/10 text-success ring-success/30",
  media: "bg-warning/15 text-warning-foreground ring-warning/30",
  alta: "bg-destructive/10 text-destructive ring-destructive/20",
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

function timeAgoFromMinutes(min: number) {
  if (min < 60) return `Hace ${min} min`;
  return `Hace ${Math.floor(min / 60)} h`;
}

export const Route = createFileRoute("/alertas/$id")({
  head: () => ({ meta: [{ title: "Detalle de alerta" }] }),
  component: AlertDetailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    item: search.item as Report | Alert | null,
  }),
});

function AlertDetailPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const search = Route.useSearch();
  
  const item = search.item as Report | Alert | null;
  
  if (!item) {
    return (
      <div className="min-h-dvh flex flex-col bg-background">
        <TopBar title="Detalle" back />
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <p className="text-base text-muted-foreground">No se encontró la alerta.</p>
        </div>
      </div>
    );
  }

  const isReport = "photo" in item;
  const meta = categoryMeta[item.category];
  const severityKey = item.severity as keyof typeof severityClass;
  
  const title = isReport ? meta.label : (item as Alert).title;
  const location = isReport ? (item as Report).address || "Ubicación detectada" : (item as Alert).location;
  const description = isReport ? (item as Report).description : null;
  const photo = isReport ? (item as Report).photo : null;
  const timeDisplay = isReport ? timeAgo((item as Report).createdAt) : timeAgoFromMinutes((item as Alert).minutesAgo);
  const verifications = isReport ? 0 : (item as Alert).verifications;
  const status = isReport ? (item as Report).status : (item as Alert).status;

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <TopBar title="Detalle" back />

      <div className="flex-1 overflow-y-auto">
        {/* Photo or Icon Fallback */}
        <div className="relative aspect-[4/3] bg-muted">
          {photo ? (
            <img
              src={photo}
              alt={`Foto de ${title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div
                className={[
                  "size-32 rounded-3xl grid place-items-center text-6xl ring-2",
                  severityClass[severityKey],
                ].join(" ")}
              >
                {meta.icon}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 py-6 space-y-5">
          {/* Title and Status */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold leading-tight flex-1">{title}</h1>
            {status === "verificado" && (
              <CheckCircle2 className="size-6 text-success shrink-0" aria-label="Verificado" />
            )}
            {status === "nuevo" && (
              <span className="text-xs font-semibold text-brand bg-brand/10 px-2.5 py-1 rounded-full shrink-0">Nuevo</span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="size-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden />
            <p className="text-base text-foreground">{location}</p>
          </div>

          {/* Description */}
          {description && (
            <div className="bg-card rounded-2xl ring-1 ring-border p-4">
              <p className="text-sm text-muted-foreground mb-2">Descripción</p>
              <p className="text-base text-foreground leading-relaxed">{description}</p>
            </div>
          )}

          {/* Severity Badge */}
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-muted-foreground shrink-0" aria-hidden />
            <span className="text-sm text-muted-foreground">Nivel de gravedad:</span>
            <span className={[
              "text-sm font-semibold px-3 py-1 rounded-full capitalize",
              severityClass[severityKey]
            ].join(" ")}>
              {item.severity}
            </span>
          </div>

          {/* Time and Verifications */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden />
              {timeDisplay}
            </span>
            {!isReport && verifications > 0 && (
              <>
                <span>·</span>
                <span>{verifications} validaciones</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
