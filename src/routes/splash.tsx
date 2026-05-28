import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import logo from "@/assets/logo-mark.png";

export const Route = createFileRoute("/splash")({
  head: () => ({ meta: [{ title: "Acento Accesible" }] }),
  component: SplashPage,
});

function SplashPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const onboarded = typeof window !== "undefined" && localStorage.getItem("aa.onboarded");
    const t = setTimeout(() => {
      navigate({ to: onboarded ? "/" : "/onboarding" });
    }, 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="absolute inset-0 grid place-items-center bg-background">
      <div className="flex flex-col items-center animate-splash">
        <img src={logo} alt="Logo Acento Accesible" className="size-28" width={256} height={256} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          Acento <span className="text-brand">Accesible</span>
        </h1>
        <p className="mt-2 text-base text-muted-foreground">La ciudad sin barreras.</p>
      </div>
    </div>
  );
}
