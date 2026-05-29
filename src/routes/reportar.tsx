import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/top-bar";
import { BigButton } from "@/components/big-button";
import { MapCanvas } from "@/components/map-canvas";
import { Camera, Check, MapPin } from "lucide-react";
import type { ReportCategory } from "@/data/mock";

export const Route = createFileRoute("/reportar")({
  head: () => ({ meta: [{ title: "Reportar barrera" }] }),
  component: ReportarPage,
});

const categories: { id: ReportCategory; label: string; icon: string }[] = [
  { id: "rampa-faltante", label: "Rampa faltante", icon: "♿" },
  { id: "banqueta-rota", label: "Banqueta rota", icon: "⚠️" },
  { id: "obstaculo", label: "Obstáculo", icon: "🚧" },
  { id: "semaforo", label: "Semáforo", icon: "🚦" },
  { id: "bano", label: "Baño accesible", icon: "🚻" },
  { id: "otro", label: "Otro", icon: "📍" },
];

function ReportarPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cat, setCat] = useState<ReportCategory | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"Baja" | "Media" | "Alta" | "Crítica">("Media");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocalización no soportada en este navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationError(null);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Permiso de ubicación denegado");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Ubicación no disponible");
            break;
          case error.TIMEOUT:
            setLocationError("Tiempo de espera agotado");
            break;
          default:
            setLocationError("Error al obtener ubicación");
        }
      }
    );
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24">
      <TopBar title={step === 3 ? "¡Listo!" : "Nuevo reporte"} back={step < 3} />

      {/* Stepper */}
      {step < 3 && (
        <div className="px-6 pt-4 flex gap-2">
          {[1, 2].map((n) => (
            <div
              key={n}
              className={[
                "h-1.5 flex-1 rounded-full transition-colors",
                step >= n ? "bg-brand" : "bg-muted",
              ].join(" ")}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 px-6 pt-6">
          <h2 className="text-2xl font-bold tracking-tight">¿Qué encontraste?</h2>
          <p className="mt-1 text-base text-muted-foreground">Elige el tipo de barrera.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {categories.map((c) => {
              const sel = cat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  aria-pressed={sel}
                  className={[
                    "h-32 rounded-3xl ring-1 flex flex-col items-center justify-center gap-2 transition-all",
                    sel
                      ? "bg-brand-soft ring-brand text-brand"
                      : "bg-card ring-border text-foreground",
                  ].join(" ")}
                >
                  <span className="text-3xl" aria-hidden>{c.icon}</span>
                  <span className="text-sm font-semibold text-center px-2">{c.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <BigButton onClick={() => setStep(2)} disabled={!cat}>
              Continuar
            </BigButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 px-6 pt-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Confirma ubicación</h2>
            <p className="mt-1 text-base text-muted-foreground">Tu reporte se enviará desde aquí.</p>
          </div>

          <div className="relative h-48 rounded-3xl overflow-hidden ring-1 ring-border">
            <MapCanvas />
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <MapPin className="size-10 text-brand drop-shadow-lg" strokeWidth={2.5} aria-hidden />
            </div>
          </div>

          <div className="bg-card rounded-2xl ring-1 ring-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dirección</p>
            {latitude !== null && longitude !== null ? (
              <>
                <p className="mt-1 text-base font-semibold">
                  Lat: {latitude.toFixed(6)}, Lon: {longitude.toFixed(6)}
                </p>
                <p className="text-sm text-muted-foreground">Ubicación actual detectada</p>
              </>
            ) : locationError ? (
              <>
                <p className="mt-1 text-base font-semibold">Av. Juárez 30, Centro</p>
                <p className="text-sm text-muted-foreground">Ciudad de México</p>
                <p className="mt-2 text-sm text-destructive">{locationError}</p>
              </>
            ) : (
              <>
                <p className="mt-1 text-base font-semibold">Av. Juárez 30, Centro</p>
                <p className="text-sm text-muted-foreground">Ciudad de México</p>
                <p className="mt-2 text-sm text-muted-foreground">Obteniendo ubicación...</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handlePhotoClick}
            className={[
              "w-full h-32 rounded-3xl ring-1 border-dashed flex flex-col items-center justify-center gap-2 transition-all overflow-hidden relative",
              photo
                ? "bg-success/10 ring-success border-success text-success"
                : "bg-muted ring-border border text-muted-foreground",
            ].join(" ")}
          >
            {photo ? (
              <>
                <img
                  src={photo}
                  alt="Vista previa"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2">
                  <Check className="size-8 text-white" aria-hidden />
                  <span className="text-sm font-semibold text-white">Foto añadida</span>
                </div>
              </>
            ) : (
              <>
                <Camera className="size-8" aria-hidden />
                <span className="text-sm font-semibold">Agregar foto (opcional)</span>
              </>
            )}
          </button>

          <div>
            <label className="text-sm font-semibold">Descripción del problema</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 300))}
              placeholder="Describe brevemente el obstáculo encontrado..."
              maxLength={300}
              className="mt-2 w-full h-24 rounded-2xl ring-1 ring-border bg-card p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">
              {description.length}/300
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold">Severidad</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {(["Baja", "Media", "Alta", "Crítica"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  aria-pressed={severity === level}
                  className={[
                    "h-12 rounded-xl ring-1 text-sm font-semibold transition-all",
                    severity === level
                      ? "bg-brand ring-brand text-brand-foreground"
                      : "bg-card ring-border text-foreground",
                  ].join(" ")}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <BigButton onClick={() => setStep(3)}>Enviar reporte</BigButton>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="size-24 rounded-full bg-success grid place-items-center animate-pop-in">
            <Check className="size-12 text-success-foreground" strokeWidth={3} aria-hidden />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">¡Gracias!</h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xs">
            Tu reporte ayudará a más de <span className="font-bold text-brand">12 personas</span> hoy a moverse mejor.
          </p>
          <div className="mt-10 w-full space-y-3">
            <BigButton onClick={() => navigate({ to: "/" })}>Volver al mapa</BigButton>
            <BigButton variant="ghost" onClick={() => { setStep(1); setCat(null); setPhoto(null); }}>
              Hacer otro reporte
            </BigButton>
          </div>
        </div>
      )}
    </div>
  );
}
