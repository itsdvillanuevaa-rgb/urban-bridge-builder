import { Link, useRouterState } from "@tanstack/react-router";
import { Map, FilePlus, Store, BarChart3, User } from "lucide-react";

const items = [
  { to: "/", label: "Mapa", icon: Map },
  { to: "/reportar", label: "Reportar", icon: FilePlus },
  { to: "/comercios", label: "Comercios", icon: Store },
  { to: "/inteligencia", label: "Datos", icon: BarChart3 },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function MobileTabbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 md:hidden"
      aria-label="Navegación móvil"
    >
      <div className="flex items-center gap-1 bg-foreground/95 text-background backdrop-blur px-2 py-2 rounded-full shadow-xl ring-1 ring-white/10">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                active ? "bg-brand text-white" : "text-white/70 hover:text-white",
              ].join(" ")}
            >
              <Icon className="size-4" aria-hidden />
              {active && <span>{label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
