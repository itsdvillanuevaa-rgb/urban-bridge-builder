import { createFileRoute } from "@tanstack/react-router";
import { profile } from "@/data/mock";
import avatar from "@/assets/avatar-user.jpg";
import { Award, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil — Acento Accesible" },
      {
        name: "description",
        content: "Tu contribución a una ciudad más accesible: reportes, validaciones e impacto en la comunidad.",
      },
      { property: "og:title", content: "Mi perfil — Acento Accesible" },
      {
        property: "og:description",
        content: "Tu impacto en la accesibilidad urbana.",
      },
    ],
  }),
  component: ProfilePage,
});

const statusStyle = {
  activo: "bg-warning/15 text-warning-foreground",
  verificado: "bg-success/10 text-success",
  resuelto: "bg-muted text-muted-foreground",
} as const;

function ProfilePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-28 md:pb-16">
      {/* Profile header */}
      <section className="bg-card rounded-3xl ring-1 ring-black/5 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <img
              src={avatar}
              alt={profile.name}
              width={96}
              height={96}
              className="size-24 rounded-full object-cover ring-4 ring-brand/15"
            />
            <span className="absolute -bottom-1 -right-1 bg-brand text-brand-foreground text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-card">
              Nv {profile.level}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
            <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mt-1">
              <ShieldCheck className="size-4 text-brand" aria-hidden />
              {profile.role} · Reportes con peso ×2
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Progreso al nivel {profile.level + 1}</span>
                <span className="font-semibold text-foreground">{Math.round(profile.nextLevelProgress * 100)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all"
                  style={{ width: `${profile.nextLevelProgress * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
                Próxima recompensa: acceso beta a rutas intermodales
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {profile.metrics.map((m) => (
          <div key={m.label} className="bg-card rounded-2xl ring-1 ring-black/5 p-5">
            <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
            <p className="text-2xl font-semibold tracking-tight mt-1">{m.value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges */}
        <section className="bg-card rounded-3xl ring-1 ring-black/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Insignias desbloqueadas</h2>
            <span className="text-xs text-muted-foreground">{profile.badges.length}/24</span>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profile.badges.map((b) => (
              <li
                key={b.name}
                className="aspect-square rounded-2xl bg-gradient-to-br from-brand/10 to-brand/0 ring-1 ring-brand/15 p-3 flex flex-col items-center justify-center text-center hover:ring-brand/40 transition-all cursor-default"
              >
                <Award className="size-6 text-brand mb-1.5" aria-hidden />
                <p className="text-xs font-semibold text-foreground">{b.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 text-pretty">{b.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline */}
        <section className="bg-card rounded-3xl ring-1 ring-black/5 p-6">
          <h2 className="text-base font-semibold mb-4">Mis reportes recientes</h2>
          <ol className="space-y-3">
            {profile.timeline.map((t) => (
              <li key={t.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.title}</p>
                  <p className="text-[11px] text-muted-foreground">{t.when} · #{t.id}</p>
                </div>
                <span
                  className={[
                    "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                    statusStyle[t.status],
                  ].join(" ")}
                >
                  {t.status}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
