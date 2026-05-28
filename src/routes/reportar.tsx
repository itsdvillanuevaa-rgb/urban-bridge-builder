import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { categoryMeta, type ReportCategory } from "@/data/mock";
import mapCity from "@/assets/map-city.jpg";
import { Camera, Check, ChevronLeft, MapPin, Upload, Users } from "lucide-react";

export const Route = createFileRoute("/reportar")({
  head: () => ({
    meta: [
      { title: "Reportar un obstáculo — Acento Accesible" },
      {
        name: "description",
        content: "Reporta obstáculos urbanos en tres pasos. Tu evidencia mejora las rutas para toda la comunidad.",
      },
      { property: "og:title", content: "Reportar — Acento Accesible" },
      {
        property: "og:description",
        content: "Reporta obstáculos urbanos en tres pasos.",
      },
    ],
  }),
  component: ReportarPage,
});

const categories: ReportCategory[] = [
  "banqueta-bloqueada",
  "rampa-inexistente",
  "obra",
  "punto-descanso",
];

function ReportarPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [note, setNote] = useState("");

  const canNext = step === 1 ? !!category : true;

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 pb-28 md:pb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-brand uppercase tracking-widest">Reporte ciudadano</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">Reportar un obstáculo</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="size-3.5" aria-hidden />
          184 reportes hoy en CDMX
        </div>
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-2 mb-8" aria-label="Progreso">
        {[
          { n: 1, label: "Categoría" },
          { n: 2, label: "Ubicación + evidencia" },
          { n: 3, label: "Confirmar" },
        ].map((s, i) => {
          const active = s.n === step;
          const done = s.n < step;
          return (
            <li key={s.n} className="flex items-center gap-2 flex-1">
              <div
                className={[
                  "size-7 shrink-0 rounded-full ring-1 flex items-center justify-center text-xs font-semibold",
                  done
                    ? "bg-success text-success-foreground ring-success"
                    : active
                    ? "bg-brand text-brand-foreground ring-brand"
                    : "bg-card text-muted-foreground ring-black/10",
                ].join(" ")}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : s.n}
              </div>
              <span className={["text-xs font-medium hidden sm:inline", active ? "text-foreground" : "text-muted-foreground"].join(" ")}>
                {s.label}
              </span>
              {i < 2 && <div className="flex-1 h-px bg-black/10" />}
            </li>
          );
        })}
      </ol>

      <div className="bg-card rounded-3xl ring-1 ring-black/5 p-6 sm:p-8">
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-1">¿Qué tipo de situación estás reportando?</h2>
            <p className="text-sm text-muted-foreground mb-6">Selecciona una categoría para empezar.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => {
                const meta = categoryMeta[c];
                const selected = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={[
                      "text-left p-4 rounded-2xl ring-1 transition-all",
                      selected
                        ? "ring-brand bg-brand/5"
                        : "ring-black/10 hover:ring-black/20 bg-card",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl" aria-hidden>{meta.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{meta.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {c === "banqueta-bloqueada" && "Vehículos, locales o basura impiden el paso."}
                          {c === "rampa-inexistente" && "Cruce sin rampa o con escalón pronunciado."}
                          {c === "obra" && "Trabajos en banqueta o vialidad sin desvío señalizado."}
                          {c === "punto-descanso" && "Banca, sombra o lugar útil para hacer pausa."}
                        </p>
                      </div>
                      {selected && <Check className="size-5 text-brand shrink-0" aria-hidden />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Ubicación exacta</h2>
              <p className="text-sm text-muted-foreground">Mueve el pin para ajustar el punto exacto del incidente.</p>
              <div className="mt-3 relative h-56 rounded-2xl overflow-hidden ring-1 ring-black/5">
                <img src={mapCity} alt="Mini mapa para ubicar el reporte" className="w-full h-full object-cover" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                  <MapPin className="size-9 text-brand drop-shadow" aria-hidden />
                </div>
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur ring-1 ring-black/5 rounded-lg px-3 py-2 text-xs">
                  <p className="font-semibold">Av. Juárez 42</p>
                  <p className="text-muted-foreground">Centro Histórico, CDMX</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-1">Evidencia fotográfica</h2>
              <p className="text-sm text-muted-foreground">Una foto clara aumenta el peso estadístico del reporte.</p>
              <label className="mt-3 flex flex-col items-center justify-center gap-2 h-36 rounded-2xl border-2 border-dashed border-black/15 hover:border-brand hover:bg-brand/5 transition-colors cursor-pointer text-center px-4">
                <Camera className="size-6 text-muted-foreground" aria-hidden />
                <span className="text-sm font-medium">Toca para tomar foto o subir</span>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Upload className="size-3" aria-hidden /> JPG o PNG · hasta 8 MB
                </span>
                <input type="file" accept="image/*" className="sr-only" />
              </label>
            </div>

            <div>
              <label htmlFor="nota" className="block text-sm font-medium mb-2">Comentario (opcional)</label>
              <textarea
                id="nota"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Detalles que ayuden a otros usuarios o al municipio."
                className="w-full px-3 py-2.5 bg-muted/60 ring-1 ring-black/5 rounded-lg text-sm focus:ring-brand focus:bg-card transition-all outline-none resize-none"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto size-16 rounded-full bg-success/15 text-success flex items-center justify-center">
              <Check className="size-8" aria-hidden />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Reporte enviado · #R-{Math.floor(Math.random() * 900 + 100)}</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto text-pretty">
              Tu reporte está en cola de validación cruzada. Ganará peso estadístico cuando otros usuarios lo
              confirmen en la misma ubicación.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="rounded-xl bg-muted/50 ring-1 ring-black/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Categoría</p>
                <p className="text-sm font-semibold">{category ? categoryMeta[category].label : "—"}</p>
              </div>
              <div className="rounded-xl bg-muted/50 ring-1 ring-black/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Validaciones</p>
                <p className="text-sm font-semibold">0/3</p>
              </div>
              <div className="rounded-xl bg-muted/50 ring-1 ring-black/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Puntos</p>
                <p className="text-sm font-semibold text-brand">+15</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden /> Anterior
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="bg-brand text-brand-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {step === 2 ? "Enviar reporte" : "Continuar"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setStep(1); setCategory(null); setNote(""); }}
              className="bg-brand text-brand-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Hacer otro reporte
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
