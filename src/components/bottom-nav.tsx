import { Link, useRouterState } from "@tanstack/react-router";
import { Map, Route as RouteIcon, Bell, User, Plus } from "lucide-react";

const items: {
  to: "/" | "/rutas" | "/reportar" | "/alertas" | "/perfil";
  label: string;
  icon: typeof Map;
  primary?: boolean;
}[] = [
  { to: "/", label: "Mapa", icon: Map },
  { to: "/rutas", label: "Rutas", icon: RouteIcon },
  { to: "/reportar", label: "Reportar", icon: Plus, primary: true },
  { to: "/alertas", label: "Alertas", icon: Bell },
  { to: "/perfil", label: "Perfil", icon: User },
];

const hiddenOn = new Set(["/splash", "/onboarding", "/encuesta", "/reportar"]);

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (hiddenOn.has(pathname)) return null;

  return (
    <nav
      aria-label="Navegación principal"
      className="absolute bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border safe-bottom"
    >
      <ul className="flex items-end justify-around px-2 pt-2">
        {items.map(({ to, label, icon: Icon, primary }) => {
          const active = pathname === to;
          if (primary) {
            return (
              <li key={to} className="-mt-6">
                <Link
                  to={to}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="grid place-items-center size-14 rounded-full bg-brand text-brand-foreground shadow-lg ring-4 ring-background">
                    <Icon className="size-7" aria-hidden strokeWidth={2.5} />
                  </span>
                  <span className="text-[11px] font-semibold text-foreground">{label}</span>
                </Link>
              </li>
            );
          }
          return (
            <li key={to}>
              <Link
                to={to}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1 px-3 py-2 min-w-[60px]"
              >
                <Icon
                  className={["size-6", active ? "text-brand" : "text-muted-foreground"].join(" ")}
                  strokeWidth={active ? 2.5 : 2}
                  aria-hidden
                />
                <span
                  className={[
                    "text-[11px] font-medium",
                    active ? "text-brand" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
