import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { categoryMeta, type Report, type Alert, type ReportCategory, alerts } from "@/data/mock";
import { getReports } from "@/data/storage";
import { MapPin, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";

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

function getAffectedProfiles(category: ReportCategory): string[] {
  if (category === "rampa-faltante" || category === "banqueta-rota" || category === "obstaculo") {
    return ["Silla de ruedas", "Andadores", "Carriolas infantiles"];
  }
  if (category === "semaforo") {
    return ["Personas ciegas", "Baja visión", "Adultos mayores"];
  }
  if (category === "bano") {
    return ["Silla de ruedas", "Movilidad reducida", "Asistencia de marcha"];
  }
  return ["Peatones con movilidad asistida"];
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
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);
  
  let item = search.item as Report | Alert | null;

  // Fallback lookup when state is not passed (e.g. direct URL link entry or page refresh)
  if (!item) {
    const loadedReports = typeof window !== "undefined" ? getReports() : [];
    const allAlerts = [...loadedReports, ...alerts];
    item = allAlerts.find((a) => a.id === id) || null;
  }
  
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
  const description = isReport ? (item as Report).description : (item as Alert).description;
  const photo = isReport ? (item as Report).photo : null;
  const timeDisplay = isReport ? timeAgo((item as Report).createdAt) : timeAgoFromMinutes((item as Alert).minutesAgo);
  const verifications = isReport ? 0 : (item as Alert).verifications;
  const status = isReport ? (item as Report).status : (item as Alert).status;

  // Evidence Gallery images array assembly
  const rawImages: string[] = [];
  if (isReport && photo) {
    rawImages.push(photo);
  }
  if (item.image) {
    rawImages.push(item.image);
  }
  if (item.images && item.images.length > 0) {
    rawImages.push(...item.images);
  }
  const images = Array.from(new Set(rawImages));

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-8 relative">
      <TopBar title="Detalle de Alerta" back />

      {/* Swipeable Evidence Gallery or Fallback Icon */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden shadow-sm">
        {images.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory h-full no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePreviewImage(img)}
                className="w-full h-full shrink-0 snap-center focus:outline-none relative block cursor-zoom-in"
              >
                <img
                  src={img}
                  alt={`Evidencia ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <span className="absolute bottom-4 right-4 bg-background/85 backdrop-blur-md text-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm ring-1 ring-border">
                    {idx + 1} / {images.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/60">
            <div
              className={[
                "size-32 rounded-3xl grid place-items-center text-6xl ring-2 shadow-sm animate-pop-in",
                severityClass[severityKey],
              ].join(" ")}
            >
              {meta.icon}
            </div>
          </div>
        )}
      </div>

      {/* Tap-to-Expand Fullscreen Image Modal */}
      {activePreviewImage && (
        <div
          onClick={() => setActivePreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActivePreviewImage(null);
            }}
            className="absolute top-6 right-6 size-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
          <img
            src={activePreviewImage}
            alt="Vista ampliada de evidencia"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl transition-transform"
          />
        </div>
      )}

      {/* Detail Content */}
      <div className="px-5 py-6 space-y-6 flex-1 overflow-y-auto">
        
        {/* Header Block: Title, Category, and Severity */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={[
              "text-[10px] font-bold px-2.5 py-0.5 rounded-full ring-1 uppercase tracking-wider",
              severityClass[severityKey]
            ].join(" ")}>
              Prioridad {item.severity === "alta" ? "Alta" : item.severity === "media" ? "Media" : "Baja"}
            </span>
            {status && (
              <span className={[
                "text-[10px] font-bold px-2.5 py-0.5 rounded-full ring-1 uppercase tracking-wider",
                status === "verificado" || status === "activo"
                  ? "bg-success/15 text-success-foreground ring-success/30"
                  : "bg-brand-soft text-brand ring-brand/20"
              ].join(" ")}>
                {status === "verificado" ? "Verificado" : status === "activo" ? "Activo" : status}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-bold leading-tight text-foreground">{title}</h1>
        </div>

        {/* Location & Time Info Card */}
        <div className="bg-card rounded-3xl border border-border p-5 space-y-3.5">
          <div className="flex items-start gap-3">
            <MapPin className="size-5 text-brand shrink-0 mt-0.5" aria-hidden />
            <div>
              <span className="text-[10px] font-bold text-muted-foreground block uppercase">Ubicación</span>
              <p className="text-base text-foreground font-semibold">{location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="size-5 text-brand shrink-0 mt-0.5" aria-hidden />
            <div>
              <span className="text-[10px] font-bold text-muted-foreground block uppercase">Reportado</span>
              <p className="text-base text-foreground font-semibold">{timeDisplay}</p>
            </div>
          </div>
        </div>

        {/* Description Block */}
        {description && (
          <div className="bg-card rounded-3xl border border-border p-5 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <HelpCircle className="size-4 text-brand" /> Detalle del Reporte
            </h3>
            <p className="text-base text-foreground leading-relaxed">{description}</p>
          </div>
        )}

        {/* Accessibility Impact Card */}
        <div className="bg-card rounded-3xl border border-border p-5 space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <AlertTriangle className="size-4 text-brand" /> Impacto en Accesibilidad
            </h3>
            <p className="text-base text-foreground leading-relaxed">
              {item.accessibilityImpact || (isReport ? "Obstáculo detectado en la acera que limita el tránsito seguro de peatones con movilidad asistida." : "Afecta la libre circulación y autonomía de personas en la vía.")}
            </p>
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            <span className="text-xs font-bold text-muted-foreground block uppercase">Perfiles Críticamente Afectados:</span>
            <div className="flex flex-wrap gap-1.5">
              {getAffectedProfiles(item.category).map((profile) => (
                <span
                  key={profile}
                  className="inline-flex items-center text-xs font-semibold bg-destructive/5 border border-destructive/15 text-destructive px-3 py-1 rounded-full"
                >
                  {profile}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Community Validation Card */}
        <div className="bg-card rounded-3xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-brand" /> Validación Comunitaria
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-muted-foreground block uppercase">Estatus</span>
              <span className="text-base font-bold text-foreground capitalize">
                {status === "verificado" ? "Verificado" : "Activo"}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-muted-foreground block uppercase">Validaciones</span>
              <span className="text-base font-bold text-foreground">
                {verifications} {verifications === 1 ? "voto" : "votos"}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <span className="text-xs font-bold text-muted-foreground block uppercase mb-1.5">Confianza de Reporte:</span>
            <span className={[
              "inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border shadow-sm",
              verifications >= 8
                ? "bg-success/10 border-success/20 text-success"
                : verifications >= 3
                ? "bg-brand-soft border-brand/20 text-brand"
                : "bg-muted border-border text-muted-foreground"
            ].join(" ")}>
              <CheckCircle2 className="size-3.5" />
              {verifications >= 8
                ? "Alta Confianza Comunitaria"
                : verifications >= 3
                ? "Validado por la Comunidad"
                : "Pendiente de Validación"}
            </span>
          </div>
        </div>

        {/* Accessibility Route Recommendations Card */}
        <div className="bg-card rounded-3xl border border-border p-5 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-4 text-brand" /> Recomendaciones e Instrucciones
          </h3>
          {item.recommendations && item.recommendations.length > 0 ? (
            <ul className="space-y-2 text-base text-foreground pl-1">
              {item.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-brand shrink-0 font-bold select-none">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base text-foreground leading-relaxed">
              Extreme precauciones al circular cerca de la zona reportada. Busque vías alternativas si viaja de forma autónoma.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
