import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import logo from "@/assets/Logo_Urbix.jpeg";

export const Route = createFileRoute("/splash")({
  head: () => ({ meta: [{ title: "Acento Accesible" }] }),
  component: SplashPage,
});

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("aa.splashShown", "1");
    }
    const session = typeof window !== "undefined" && localStorage.getItem("aa.session");
    const onboarded = typeof window !== "undefined" && localStorage.getItem("aa.onboarded");

    const t = setTimeout(() => {
      if (session && onboarded) {
        navigate({ to: "/" });
      } else if (session) {
        navigate({ to: "/encuesta" });
      } else if (onboarded) {
        navigate({ to: "/login" });
      } else {
        navigate({ to: "/onboarding" });
      }
    }, 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="absolute inset-0 grid place-items-center bg-background">
      <div className="flex flex-col items-center animate-splash">
        <div className="size-32 rounded-3xl overflow-hidden shadow-2xl border border-border bg-white flex items-center justify-center p-2 ring-4 ring-brand/10">
          <img src={logo} alt="Logo Urbix" className="w-full h-full object-contain rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
