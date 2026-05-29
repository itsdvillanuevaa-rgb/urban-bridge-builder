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
  { id: "sin-ayuda", label: "Sin ayuda", icon: "🧍" },
];

const avoid = [
  { id: "escaleras", label: "Escaleras" },
  { id: "pendientes", label: "Pendientes" },
  { id: "banquetas", label: "Banquetas rotas" },
  { id: "cruces-sin-semaforo", label: "Cruces sin semáforo" },
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

const restStopsOptions = [
  { id: "si", label: "Sí" },
  { id: "no", label: "No" },
];

const travelCompanionOptions = [
  { id: "solo", label: "Solo" },
  { id: "con-acompanante", label: "Con acompañante" },
  { id: "depende", label: "Depende de la situación" },
];

const appInteractionPreferences = [
  { id: "tactil", label: "Táctil sin dificultad" },
  { id: "botones-grandes", label: "Prefiero botones grandes" },
  { id: "comandos-voz", label: "Prefiero usar comandos de voz" },
  { id: "apoyo-persona", label: "Uso apoyo de otra persona" },
  { id: "tecnologia-asistiva", label: "Uso tecnología asistiva" },
];

function EncuestaPage() {
  const [mob, setMob] = useState<string[]>([]);
  const [av, setAv] = useState<string[]>([]);
  const [autonomy, setAutonomy] = useState<string>("");
  const [routes, setRoutes] = useState<string[]>([]);
  const [needsRest, setNeedsRest] = useState<string>("");
  const [travelCompanion, setTravelCompanion] = useState<string>("");
  const [appInteraction, setAppInteraction] = useState<string>("");

  const navigate = useNavigate();

  // Retrieve user session dynamically for greeting
  const session =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("aa.session") || "{}") : {};
  const nombre = session.firstName || "Te damos la bienvenida";

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
    if (autonomy === "") {
      alert("Por favor selecciona tu nivel de autonomía");
      return;
    }
    if (needsRest === "") {
      alert("Por favor indica si necesitas zonas de descanso");
      return;
    }
    if (travelCompanion === "") {
      alert("Por favor indica cómo sueles desplazarte");
      return;
    }
    if (appInteraction === "") {
      alert("Por favor indica cómo prefieres interactuar con la aplicación");
      return;
    }

    if (typeof window !== "undefined") {
      const userProfile = {
        firstName: session.firstName || "",
        lastName: session.lastName || "",
        email: session.email || "",
        mobilityType: mob,
        avoidedBarriers: av,
        routePreference: routes,
        autonomyLevel: autonomy,
        needsRestStops: needsRest === "si",
        travelCompanionType: travelCompanion,
        appInteractionPreference: appInteraction,
      };

      localStorage.setItem("aa.profile", JSON.stringify(userProfile));
      localStorage.setItem("aa.onboarded", "1");
    }
    navigate({ to: "/" });
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-background overflow-y-auto">
      <div className="px-6 pt-10 pb-4 safe-top animate-fade-up">
        <p className="text-sm font-semibold text-brand uppercase tracking-wider">Paso final</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">¡Hola, {nombre}!</h2>
        <p className="mt-2 text-lg font-semibold text-foreground">
          Terminemos de personalizar tu experiencia.
        </p>
        <p className="mt-2 text-base text-muted-foreground">
          Tus respuestas nos ayudarán a ofrecer rutas y alertas más relevantes para ti.
        </p>
      </div>

      <div className="flex-1 px-6 space-y-8 pb-6 animate-fade-up">
        {/* Mobility Mode */}
        <section>
          <h3 className="text-lg font-bold mb-3">¿Cómo te mueves?</h3>
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
                    <span className="absolute top-2 right-2 size-5 rounded-full bg-brand text-brand-foreground grid place-items-center animate-pop-in">
                      <Check className="size-3" aria-hidden />
                    </span>
                  )}
                  <span className="text-2xl" aria-hidden>
                    {m.icon}
                  </span>
                  <span className="text-sm font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Barriers to Avoid */}
        <section>
          <h3 className="text-lg font-bold mb-3">¿Qué prefieres evitar?</h3>
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
                    "h-12 px-5 rounded-full ring-1 font-semibold text-sm transition-all shadow-sm",
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

        {/* Autonomy Level */}
        <section>
          <h3 className="text-lg font-bold mb-3">Nivel de autonomía</h3>
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
                    "h-12 px-5 rounded-xl ring-1 font-semibold text-sm transition-all text-left flex items-center justify-between shadow-sm",
                    sel
                      ? "bg-brand text-brand-foreground ring-brand"
                      : "bg-card text-foreground ring-border hover:bg-muted",
                  ].join(" ")}
                >
                  <span>{a.label}</span>
                  {sel && <Check className="size-4 shrink-0 text-brand-foreground" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Rest Stops Need */}
        <section>
          <h3 className="text-lg font-bold mb-3">
            ¿Necesitas lugares de descanso durante tus recorridos?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {restStopsOptions.map((o) => {
              const sel = needsRest === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setNeedsRest(o.id)}
                  aria-pressed={sel}
                  className={[
                    "h-12 px-5 rounded-xl ring-1 font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2",
                    sel
                      ? "bg-brand text-brand-foreground ring-brand"
                      : "bg-card text-foreground ring-border hover:bg-muted",
                  ].join(" ")}
                >
                  <span>{o.label}</span>
                  {sel && <Check className="size-4 text-brand-foreground" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Travel Companion */}
        <section>
          <h3 className="text-lg font-bold mb-3">¿Cómo sueles desplazarte?</h3>
          <div className="grid grid-cols-1 gap-2">
            {travelCompanionOptions.map((o) => {
              const sel = travelCompanion === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setTravelCompanion(o.id)}
                  aria-pressed={sel}
                  className={[
                    "h-12 px-5 rounded-xl ring-1 font-semibold text-sm transition-all text-left flex items-center justify-between shadow-sm",
                    sel
                      ? "bg-brand text-brand-foreground ring-brand"
                      : "bg-card text-foreground ring-border hover:bg-muted",
                  ].join(" ")}
                >
                  <span>{o.label}</span>
                  {sel && <Check className="size-4 shrink-0 text-brand-foreground" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* App Interaction Preference */}
        <section>
          <h3 className="text-lg font-bold mb-3">¿Cómo prefieres interactuar con la aplicación?</h3>
          <div className="grid grid-cols-1 gap-2">
            {appInteractionPreferences.map((p) => {
              const sel = appInteraction === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAppInteraction(p.id)}
                  aria-pressed={sel}
                  className={[
                    "h-12 px-5 rounded-xl ring-1 font-semibold text-sm transition-all text-left flex items-center justify-between shadow-sm",
                    sel
                      ? "bg-brand text-brand-foreground ring-brand"
                      : "bg-card text-foreground ring-border hover:bg-muted",
                  ].join(" ")}
                >
                  <span>{p.label}</span>
                  {sel && <Check className="size-4 shrink-0 text-brand-foreground" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Route Preferences */}
        <section>
          <h3 className="text-lg font-bold mb-3">Preferencias de ruta</h3>
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
                    "h-12 px-5 rounded-full ring-1 font-semibold text-sm transition-all shadow-sm",
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
      </div>

      <div className="px-6 pb-8 safe-bottom bg-background sticky bottom-0 border-t border-border pt-3">
        <BigButton onClick={submit}>Personalizar mi mapa</BigButton>
      </div>
    </div>
  );
}
