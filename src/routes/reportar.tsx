import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/top-bar";
import { BigButton } from "@/components/big-button";
import { Camera, Check, Mic, MicOff } from "lucide-react";
import type { ReportCategory } from "@/data/mock";
import { addReport, generateReportId } from "@/data/storage";

// Type declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onend: () => void;
  onerror: (event: any) => void;
};

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
  const [isRecording, setIsRecording] = useState(false);
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const summarizeAddress = (fullAddress: string): { main: string; secondary: string | null } => {
    const parts = fullAddress.split(',').map((part) => part.trim());
    
    // Take first 2-3 most relevant parts (street, zone/neighborhood, city)
    const relevantParts = parts.slice(0, 3);
    
    if (relevantParts.length === 0) {
      return { main: 'Ubicación actual detectada', secondary: null };
    }
    
    if (relevantParts.length === 1) {
      return { main: relevantParts[0], secondary: null };
    }
    
    if (relevantParts.length === 2) {
      return { main: relevantParts[0], secondary: relevantParts[1] };
    }
    
    // If we have 3+ parts, show first as main, combine second and third as secondary
    return { main: relevantParts[0], secondary: `${relevantParts[1]}, ${relevantParts[2]}` };
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    setAddressLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=es`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(null);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setAddress(null);
    } finally {
      setAddressLoading(false);
    }
  };

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
        reverseGeocode(position.coords.latitude, position.coords.longitude);
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

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupportsSpeechRecognition(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "es-ES";

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");
        setDescription(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
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

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmitReport = () => {
    if (!cat) return;

    const report = {
      id: generateReportId(),
      category: cat,
      description: description || "",
      address: address || null,
      latitude: latitude,
      longitude: longitude,
      photo: photo,
      severity: severity,
      createdAt: new Date().toISOString(),
      status: "nuevo" as const,
    };

    addReport(report);
    setStep(3);
  };
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <TopBar title={step === 3 ? "" : "Nuevo reporte"} back={step < 3} />

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
        <div className="flex-1 flex flex-col justify-center px-5 pt-4 pb-8 safe-bottom">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold tracking-tight">¿Qué encontraste?</h2>
            <p className="mt-1.5 text-base text-muted-foreground">Elige el tipo de barrera.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((c) => {
              const sel = cat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  aria-pressed={sel}
                  className={[
                    "h-28 rounded-2xl ring-1 flex flex-col items-center justify-center gap-1.5 transition-all",
                    sel
                      ? "bg-brand-soft ring-brand text-brand"
                      : "bg-card ring-border text-foreground",
                  ].join(" ")}
                >
                  <span className="text-3xl" aria-hidden>
                    {c.icon}
                  </span>
                  <span className="text-sm font-semibold text-center px-2">{c.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <BigButton onClick={() => setStep(2)} disabled={!cat}>
              Continuar
            </BigButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col justify-center px-6 pt-4 pb-8 safe-bottom overflow-y-auto">
          <div className="flex-shrink-0">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Confirma ubicación</h2>
              <p className="mt-1 text-base text-muted-foreground">
                Tu reporte se enviará desde aquí.
              </p>
            </div>

            <div className="bg-card rounded-2xl ring-1 ring-border p-5 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Dirección</p>
              {addressLoading ? (
                <>
                  <p className="text-base font-semibold">Obteniendo dirección...</p>
                  <p className="text-sm text-muted-foreground">Ubicación actual detectada</p>
                </>
              ) : address ? (
                (() => {
                  const { main, secondary } = summarizeAddress(address);
                  return (
                    <>
                      <p className="text-base font-semibold leading-tight">{main}</p>
                      {secondary && (
                        <p className="text-sm text-muted-foreground mt-1">{secondary}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Ubicación actual detectada</p>
                    </>
                  );
                })()
              ) : latitude !== null && longitude !== null ? (
                <>
                  <p className="text-base font-semibold">Ubicación actual detectada</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                </>
              ) : locationError ? (
                <>
                  <p className="text-base font-semibold">Ubicación no disponible</p>
                  <p className="text-sm text-destructive mt-1">{locationError}</p>
                </>
              ) : (
                <>
                  <p className="text-base font-semibold">Obteniendo ubicación...</p>
                </>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Descripción del reporte</label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escribe aquí…"
                  className="w-full min-h-24 p-4 pb-12 pr-12 rounded-2xl ring-1 ring-border bg-card text-base resize-none focus:outline-none focus:ring-2 focus:ring-brand"
                  rows={3}
                />
                {supportsSpeechRecognition && (
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={[
                      "absolute right-3 bottom-3 p-2 rounded-full transition-all",
                      isRecording
                        ? "bg-destructive/10 text-destructive animate-pulse"
                        : "bg-brand-soft text-brand hover:bg-brand/20",
                    ].join(" ")}
                    aria-label={isRecording ? "Detener grabación" : "Iniciar dictado por voz"}
                  >
                    {isRecording ? <MicOff className="size-5" /> : <Mic className="size-5" />}
                  </button>
                )}
              </div>
              {isRecording && (
                <p className="mt-2 text-sm text-brand font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-brand rounded-full animate-pulse" />
                  Escuchando…
                </p>
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
                "w-full h-24 rounded-2xl ring-1 flex flex-col items-center justify-center gap-2 transition-all",
                photo
                  ? "bg-success/10 ring-success text-success"
                  : "bg-brand-soft ring-brand text-brand",
              ].join(" ")}
            >
              {photo ? (
                <>
                  <Check className="size-6" aria-hidden />
                  <span className="text-sm font-semibold">Foto añadida</span>
                </>
              ) : (
                <>
                  <Camera className="size-6" aria-hidden />
                  <span className="text-sm font-semibold">Tomar foto</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-shrink-0 mt-6">
            <BigButton onClick={handleSubmitReport}>Enviar reporte</BigButton>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-6 safe-bottom">
          <div className="size-24 rounded-full bg-success grid place-items-center animate-pop-in">
            <Check className="size-12 text-success-foreground" strokeWidth={3} aria-hidden />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">¡Gracias!</h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xs">
            Tu reporte fue realizado con éxito.
          </p>
          <div className="mt-10 w-full space-y-3">
            <BigButton onClick={() => navigate({ to: "/" })}>Volver al mapa</BigButton>
            <BigButton
              variant="ghost"
              onClick={() => {
                setStep(1);
                setCat(null);
                setPhoto(null);
              }}
            >
              Hacer otro reporte
            </BigButton>
          </div>
        </div>
      )}
    </div>
  );
}
