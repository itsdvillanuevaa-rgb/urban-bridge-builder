import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { profile } from "@/data/mock";
import { Award, ChevronRight, Settings, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Mi perfil" }] }),
  component: PerfilPage,
});

const statusBadge = {
  activo: { label: "Activo", cls: "text-warning-foreground bg-warning/15" },
  verificado: { label: "Verificado", cls: "text-success bg-success/10" },
  resuelto: { label: "Resuelto", cls: "text-muted-foreground bg-muted" },
} as const;

function PerfilPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh flex flex-col bg-background pb-8">
      <TopBar
        title="Mi perfil"
        back
        right={
          <button
            type="button"
            aria-label="Ajustes"
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
          {profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <h2 className="mt-3 text-2xl font-bold">{profile.name}</h2>
        <p className="text-sm text-muted-foreground">
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

      {/* Impact metrics */}
      <section className="px-4">
        <div className="bg-card rounded-3xl ring-1 ring-border p-4 grid grid-cols-3 divide-x divide-border">
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
              className="bg-card rounded-2xl ring-1 ring-border p-3 flex gap-3 items-center"
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
        <div className="bg-card rounded-2xl ring-1 ring-border divide-y divide-border overflow-hidden">
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
    </div>
  );
}
