import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton } from "@/components/big-button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/encuesta")({
  head: () => ({ meta: [{ title: "Personaliza tu mapa" }] }),
  component: EncuestaPage,
});

const mobility = [
  { id: "silla-manual", label: "Silla manual", icon: "♿" },
  { id: "silla-electrica", label: "Silla eléctrica", icon: "🛞" },
  { id: "andador", label: "Andador", icon: "🦯" },
  { id: "baston", label: "Bastón", icon: "🚶" },
  { id: "baja-vision", label: "Baja visión", icon: "👁️" },
  { id: "sin-ayuda", label: "Sin ayuda", icon: "🧍" },
];

const avoid = [
  { id: "escaleras", label: "Escaleras" },
  { id: "pendientes", label: "Pendientes" },
  { id: "banquetas", label: "Banquetas rotas" },
  { id: "ruido", label: "Ruido excesivo" },
  { id: "trafico", label: "Tráfico intenso" },
  { id: "construccion", label: "Zonas en construcción" },
];

const autonomyLevels = [
  { id: "independiente", label: "Independiente" },
  { id: "asistencia-parcial", label: "Asistencia parcial" },
  { id: "asistencia-total", label: "Asistencia total" },
];

const routePreferences = [
  { id: "corto", label: "Ruta más corta" },
  { id: "accesible", label: "Más accesible" },
  { id: "seguro", label: "Más seguro" },
  { id: "sombreado", label: "Con sombra" },
];

const civicParticipation = [
  { id: "reportar", label: "Reportar obstáculos" },
  { id: "votar", label: "Votar en mejoras" },
  { id: "compartir", label: "Compartir rutas" },
  { id: "colaborar", label: "Colaborar con la comunidad" },
];

function EncuestaPage() {
  const [mob, setMob] = useState<string[]>([]);
  const [av, setAv] = useState<string[]>([]);
  const [autonomy, setAutonomy] = useState<string>("");
  const [routes, setRoutes] = useState<string[]>([]);
  const [civic, setCivic] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggle = (set: string[], setSet: (v: string[]) => void, id: string) => {
    setSet(set.includes(id) ? set.filter((x) => x !== id) : [...set, id]);
  };

  const submit = () => {
    if (mob.length === 0) {
      alert("Por favor selecciona al menos una opción de movilidad");
      return;
    }
    if (av.length === 0) {
      alert("Por favor selecciona al menos un obstáculo a evitar");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("aa.onboarded", "1");
      localStorage.setItem("aa.profile", JSON.stringify({ 
        mobility: mob, 
        avoid: av,
        autonomy,
        routePreferences: routes,
        civicParticipation: civic
      }));
    }
    navigate({ to: "/" });
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-background overflow-y-auto">
      <div className="px-6 pt-10 pb-4 safe-top">
        <p className="text-sm font-semibold text-brand uppercase tracking-wider">Paso final</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Cuéntanos sobre ti</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Personalizaremos tus rutas y alertas según tus necesidades.
        </p>
      </div>

      <div className="flex-1 px-6 space-y-8 pb-6">
        <section>
          <h3 className="text-lg font-semibold mb-3">¿Cómo te mueves?</h3>
          <div className="grid grid-cols-2 gap-3">
            {mobility.map((m) => {
              const sel = mob.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggle(mob, setMob, m.id)}
                  aria-pressed={sel}
                  className={[
                    "relative h-24 rounded-2xl ring-1 flex flex-col items-center justify-center gap-1 transition-all",
                    sel
                      ? "bg-brand-soft ring-brand text-brand"
                      : "bg-card ring-border text-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  {sel && (
                    <span className="absolute top-2 right-2 size-5 rounded-full bg-brand text-brand-foreground grid place-items-center">
                      <Check className="size-3" aria-hidden />
                    </span>
                  )}
                  <span className="text-2xl" aria-hidden>{m.icon}</span>
                  <span className="text-sm font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">¿Qué prefieres evitar?</h3>
          <div className="flex flex-wrap gap-2">
            {avoid.map((a) => {
              const sel = av.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggle(av, setAv, a.id)}
                  aria-pressed={sel}
                  className={[
                    "h-12 px-5 rounded-full ring-1 font-semibold text-sm transition-all",
                    sel
                      ? "bg-brand text-brand-foreground ring-brand"
                      : "bg-card text-foreground ring-border hover:bg-muted",
                  ].join(" ")}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Nivel de autonomía</h3>
          <div className="grid grid-cols-1 gap-2">
            {autonomyLevels.map((a) => {
              const sel = autonomy === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAutonomy(a.id)}
                  aria-pressed={sel}
                  className={[
                    "h-12 px-5 rounded-xl ring-1 font-semibold text-sm transition-all text-left",
                    sel
                      ? "bg-brand text-brand-foreground ring-brand"
                      : "bg-card text-foreground ring-border hover:bg-muted",
                  ].join(" ")}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Preferencias de ruta</h3>
          <div className="flex flex-wrap gap-2">
            {routePreferences.map((r) => {
              const sel = routes.includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggle(routes, setRoutes, r.id)}
                  aria-pressed={sel}
                  className={[
                    "h-12 px-5 rounded-full ring-1 font-semibold text-sm transition-all",
                    sel
                      ? "bg-brand text-brand-foreground ring-brand"
                      : "bg-card text-foreground ring-border hover:bg-muted",
                  ].join(" ")}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Participación cívica</h3>
          <div className="flex flex-wrap gap-2">
            {civicParticipation.map((c) => {
              const sel = civic.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(civic, setCivic, c.id)}
                  aria-pressed={sel}
                  className={[
                    "h-12 px-5 rounded-full ring-1 font-semibold text-sm transition-all",
                    sel
                      ? "bg-brand text-brand-foreground ring-brand"
                      : "bg-card text-foreground ring-border hover:bg-muted",
                  ].join(" ")}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="px-6 pb-8 safe-bottom bg-background sticky bottom-0">
        <BigButton onClick={submit}>Personalizar mi mapa</BigButton>
      </div>
    </div>
  );
}
