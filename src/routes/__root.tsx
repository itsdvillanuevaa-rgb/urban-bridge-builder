import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { MobileTabbar } from "@/components/mobile-tabbar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold text-brand uppercase tracking-widest">Error 404</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">Esta calle no existe</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          La página que buscas no está en el mapa. Regresa al inicio para seguir explorando rutas accesibles.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 transition-opacity"
        >
          Ir al mapa
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">No pudimos cargar esta vista</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo falló de nuestro lado. Intenta de nuevo o regresa al mapa.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
          <a href="/" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            Ir al mapa
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Acento Accesible — Movilidad urbana inclusiva" },
      {
        name: "description",
        content:
          "Plataforma ciudadana de rutas accesibles, reportes en tiempo real e inteligencia urbana para una ciudad sin barreras.",
      },
      { property: "og:title", content: "Acento Accesible" },
      {
        property: "og:description",
        content: "Movilidad urbana inclusiva impulsada por la comunidad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-dvh bg-surface">
        <SiteHeader />
        <Outlet />
        <MobileTabbar />
      </div>
    </QueryClientProvider>
  );
}
