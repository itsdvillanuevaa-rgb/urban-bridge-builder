import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { profile } from "@/data/mock";
import {
  Award,
  ChevronRight,
  Settings,
  CheckCircle2,
  Clock,
  LogOut,
  Check,
  User,
} from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Mi perfil" }] }),
  component: PerfilPage,
});

const statusBadge = {
  activo: { label: "Activo", cls: "text-warning-foreground bg-warning/15" },
  verificado: { label: "Verificado", cls: "text-success bg-success/10" },
  resuelto: { label: "Resuelto", cls: "text-muted-foreground bg-muted" },
} as const;

const civicOptions = [
  { id: "reportar", label: "Reportar obstáculos" },
  { id: "votar", label: "Votar en mejoras" },
  { id: "compartir", label: "Compartir rutas" },
  { id: "colaborar", label: "Colaborar con la comunidad" },
];

const companionMap: Record<string, string> = {
  solo: "Solo",
  "con-acompanante": "Con acompañante",
  depende: "Depende de la situación",
};

const interactionMap: Record<string, string> = {
  tactil: "Táctil estándar",
  "botones-grandes": "Botones grandes",
  "comandos-voz": "Comandos de voz",
  "apoyo-persona": "Apoyo de otra persona",
  "tecnologia-asistiva": "Tecnología asistiva",
};

const routePrefMap: Record<string, string> = {
  corto: "Ruta más corta",
  accesible: "Más accesible",
  seguro: "Más seguro",
  sombreado: "Con sombra",
};

const autonomyMap: Record<string, string> = {
  independiente: "Independiente",
  "asistencia-parcial": "Asistencia parcial",
  "asistencia-total": "Asistencia total",
};

function PerfilPage() {
  const navigate = useNavigate();

  // Load persistent credentials & profile preferences
  const session =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("aa.session") || "{}") : null;
  const userProfile =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("aa.profile") || "{}") : null;

  const displayName =
    session && session.firstName ? `${session.firstName} ${session.lastName}` : profile.name;

  const displayEmail = session?.email || "";

  // State for civic participation options relocated to the profile page
  const [civic, setCivic] = useState<string[]>(() => {
    if (userProfile && userProfile.civicParticipation) {
      return userProfile.civicParticipation;
    }
    return ["reportar", "votar"]; // Default mock selections
  });

  const toggleCivic = (id: string) => {
    const updated = civic.includes(id) ? civic.filter((x) => x !== id) : [...civic, id];
    setCivic(updated);
    if (typeof window !== "undefined") {
      const activeProfile = userProfile || {
        firstName: session?.firstName || "",
        lastName: session?.lastName || "",
        email: session?.email || "",
      };
      const newProfile = { ...activeProfile, civicParticipation: updated };
      localStorage.setItem("aa.profile", JSON.stringify(newProfile));
    }
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("aa.session");
    }
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24 overflow-y-auto">
      <TopBar
        title="Mi perfil"
        right={
          <button
            type="button"
            aria-label="Ajustes de accesibilidad"
            className="size-10 grid place-items-center rounded-full hover:bg-muted"
            onClick={() => navigate({ to: "/encuesta" })}
          >
            <Settings className="size-5 text-foreground" aria-hidden />
          </button>
        }
      />

      {/* Hero */}
      <section className="px-6 pt-4 pb-6 text-center">
        <div className="mx-auto size-24 rounded-full bg-gradient-to-br from-brand to-success grid place-items-center text-white text-3xl font-bold shadow-lg">
          {displayName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <h2 className="mt-3 text-2xl font-bold">{displayName}</h2>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">{displayEmail}</p>
        <p className="mt-1 text-sm text-brand font-semibold">
          {profile.role} · Nivel {profile.level}
        </p>

        <div className="mt-4 max-w-xs mx-auto">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: `${profile.nextLevelProgress * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {Math.round((1 - profile.nextLevelProgress) * 100)}% para nivel {profile.level + 1}
          </p>
        </div>
      </section>

      {/* Accessibility Profile Summary Card */}
      {userProfile && (
        <section className="px-4 pb-6 animate-fade-up">
          <div className="bg-card rounded-3xl ring-1 ring-border p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand">
              Tu Perfil de Accesibilidad
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-muted/40 p-3 rounded-xl">
                <span className="block font-bold text-muted-foreground mb-0.5">Movilidad</span>
                <span className="font-semibold text-foreground block capitalize truncate">
                  {userProfile.mobilityType?.join(", ").replace(/-/g, " ") || "No especificado"}
                </span>
              </div>
              <div className="bg-muted/40 p-3 rounded-xl">
                <span className="block font-bold text-muted-foreground mb-0.5">Autonomía</span>
                <span className="font-semibold text-foreground block capitalize">
                  {autonomyMap[userProfile.autonomyLevel] ||
                    userProfile.autonomyLevel ||
                    "No especificado"}
                </span>
              </div>
              <div className="bg-muted/40 p-3 rounded-xl">
                <span className="block font-bold text-muted-foreground mb-0.5">Acompañante</span>
                <span className="font-semibold text-foreground block capitalize">
                  {companionMap[userProfile.travelCompanionType] ||
                    userProfile.travelCompanionType ||
                    "No especificado"}
                </span>
              </div>
              <div className="bg-muted/40 p-3 rounded-xl">
                <span className="block font-bold text-muted-foreground mb-0.5">Interacción</span>
                <span className="font-semibold text-foreground block capitalize truncate">
                  {interactionMap[userProfile.appInteractionPreference] ||
                    userProfile.appInteractionPreference ||
                    "Táctil estándar"}
                </span>
              </div>
              <div className="bg-muted/40 p-3 rounded-xl">
                <span className="block font-bold text-muted-foreground mb-0.5">
                  Zonas de descanso
                </span>
                <span className="font-semibold text-foreground">
                  {userProfile.needsRestStops ? "Sí, requeridas" : "No requeridas"}
                </span>
              </div>
              <div className="bg-muted/40 p-3 rounded-xl">
                <span className="block font-bold text-muted-foreground mb-0.5">
                  Preferencias de ruta
                </span>
                <span className="font-semibold text-foreground flex flex-wrap gap-1">
                  {userProfile.routePreference && userProfile.routePreference.length > 0
                    ? userProfile.routePreference.map((rp: string) => (
                        <span
                          key={rp}
                          className="bg-success/15 text-success px-1.5 py-0.5 rounded-md font-bold text-[9px] capitalize"
                        >
                          {routePrefMap[rp] || rp.replace(/-/g, " ")}
                        </span>
                      ))
                    : "Ninguna"}
                </span>
              </div>
              <div className="bg-muted/40 p-3 rounded-xl col-span-2">
                <span className="block font-bold text-muted-foreground mb-1">Evita en la ruta</span>
                <span className="font-semibold text-foreground flex flex-wrap gap-1">
                  {userProfile.avoidedBarriers && userProfile.avoidedBarriers.length > 0
                    ? userProfile.avoidedBarriers.map((b: string) => (
                        <span
                          key={b}
                          className="bg-brand/10 text-brand px-2 py-0.5 rounded-full capitalize text-[10px] font-bold"
                        >
                          {b.replace(/-/g, " ")}
                        </span>
                      ))
                    : "Ninguno"}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Relocated Civic Participation Toggles */}
      <section className="px-4 pb-6">
        <div className="bg-card rounded-3xl ring-1 ring-border p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Participación Cívica
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Configura cómo prefieres colaborar con la comunidad para hacer la ciudad más
              accesible.
            </p>
          </div>

          <div className="space-y-2">
            {civicOptions.map((o) => {
              const active = civic.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggleCivic(o.id)}
                  aria-pressed={active}
                  className={[
                    "w-full h-12 px-4 rounded-xl ring-1 text-sm font-semibold flex items-center justify-between transition-all",
                    active
                      ? "bg-brand/5 ring-brand text-brand"
                      : "bg-muted/20 ring-border text-foreground hover:bg-muted/50",
                  ].join(" ")}
                >
                  <span>{o.label}</span>
                  <div
                    className={[
                      "size-5 rounded-md border flex items-center justify-center transition-all",
                      active
                        ? "bg-brand border-brand text-brand-foreground"
                        : "border-muted-foreground/30 text-transparent",
                    ].join(" ")}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact metrics */}
      <section className="px-4">
        <div className="bg-card rounded-3xl ring-1 ring-border p-4 grid grid-cols-3 divide-x divide-border shadow-sm">
          {profile.metrics.map((m) => (
            <div key={m.label} className="text-center px-2">
              <p className="text-2xl font-bold text-brand">{m.value}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Badges */}
      <section className="px-4 pt-6">
        <h3 className="text-base font-bold px-1 mb-3">Insignias</h3>
        <div className="grid grid-cols-2 gap-3">
          {profile.badges.map((b) => (
            <div
              key={b.name}
              className="bg-card rounded-2xl ring-1 ring-border p-3 flex gap-3 items-center shadow-sm"
            >
              <div className="size-10 shrink-0 rounded-xl bg-brand-soft text-brand grid place-items-center">
                <Award className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{b.name}</p>
                <p className="text-xs text-muted-foreground truncate">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="px-4 pt-6">
        <h3 className="text-base font-bold px-1 mb-3">Mis reportes</h3>
        <div className="bg-card rounded-2xl ring-1 ring-border divide-y divide-border overflow-hidden shadow-sm">
          {profile.history.map((h) => {
            const s = statusBadge[h.status];
            return (
              <button
                key={h.id}
                type="button"
                className="w-full text-left flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="size-10 shrink-0 rounded-xl bg-muted grid place-items-center">
                  {h.status === "verificado" ? (
                    <CheckCircle2 className="size-5 text-success" aria-hidden />
                  ) : (
                    <Clock className="size-5 text-muted-foreground" aria-hidden />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{h.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.when} · #{h.id}
                  </p>
                </div>
                <span
                  className={["text-[10px] font-bold uppercase px-2 py-1 rounded-full", s.cls].join(
                    " ",
                  )}
                >
                  {s.label}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
              </button>
            );
          })}
        </div>
      </section>

      {/* Log Out Button */}
      <section className="px-4 pt-8">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full h-14 bg-destructive/10 hover:bg-destructive/15 text-destructive rounded-2xl flex items-center justify-center gap-2.5 text-base font-bold transition-all active:scale-[0.98]"
        >
          <LogOut className="size-5" />
          Cerrar sesión
        </button>
      </section>
    </div>
  );
}
