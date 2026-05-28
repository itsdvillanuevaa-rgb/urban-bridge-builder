import { Link, useRouterState } from "@tanstack/react-router";
import avatar from "@/assets/avatar-user.jpg";

const navItems = [
  { to: "/", label: "Mapa Ciudadano" },
  { to: "/reportar", label: "Reportar" },
  { to: "/comercios", label: "Comercios" },
  { to: "/inteligencia", label: "Inteligencia Urbana" },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md ring-1 ring-black/5"
      aria-label="Navegación principal"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="inline-block size-2.5 rounded-full bg-brand" aria-hidden />
              <span className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                Acento <span className="text-brand">Accesible</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={[
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-soft text-brand"
                        : "text-muted-foreground hover:bg-black/5 hover:text-foreground",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-card ring-1 ring-black/5 rounded-full">
              <span className="size-2 bg-success rounded-full animate-pulse-soft" aria-hidden />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                CDMX · En vivo
              </span>
            </div>
            <Link
              to="/perfil"
              aria-label="Ir a mi perfil"
              className="size-9 rounded-full overflow-hidden ring-1 ring-black/10 hover:ring-brand transition-all"
            >
              <img src={avatar} alt="" className="w-full h-full object-cover" width={36} height={36} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
