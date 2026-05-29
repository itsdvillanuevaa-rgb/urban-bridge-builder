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
import { PhoneFrame } from "@/components/phone-frame";
import { BottomNav } from "@/components/bottom-nav";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="max-w-sm text-center">
        <p className="text-sm font-semibold text-brand uppercase tracking-widest">Error 404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Esta calle no existe</h1>
        <p className="mt-3 text-base text-muted-foreground">
          La página que buscas no está en el mapa.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-brand text-brand-foreground font-semibold"
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
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="max-w-sm text-center">
        <h1 className="text-xl font-semibold">No pudimos cargar esta vista</h1>
        <p className="mt-2 text-base text-muted-foreground">Intenta de nuevo o regresa al mapa.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="h-12 px-6 rounded-2xl bg-brand text-brand-foreground font-semibold"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="h-12 px-6 grid place-items-center rounded-2xl bg-muted font-semibold"
          >
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
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0e7490" },
      { title: "Acento Accesible — Movilidad urbana inclusiva" },
      {
        name: "description",
        content:
          "App ciudadana de rutas accesibles, reportes en tiempo real y alertas cercanas para una movilidad sin barreras.",
      },
      { property: "og:title", content: "Acento Accesible" },
      {
        property: "og:description",
        content: "Movilidad urbana inclusiva impulsada por la comunidad.",
      },
      { property: "og:type", content: "website" },
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
      <PhoneFrame>
        <main className="min-h-full">
          <Outlet />
        </main>
        <BottomNav />
      </PhoneFrame>
      <Toaster />
    </QueryClientProvider>
  );
}
