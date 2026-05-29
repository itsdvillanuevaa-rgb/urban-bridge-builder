import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BigButton } from "@/components/big-button";
import { ArrowRight } from "lucide-react";
import onb1 from "@/assets/onb-1.jpg";
import onb2 from "@/assets/onb-2.jpg";
import onb3 from "@/assets/onb-3.jpg";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Bienvenida — Acento Accesible" }] }),
  component: OnboardingPage,
});

const slides = [
  {
    img: onb1,
    title: "Rutas que respetan tu paso",
    desc: "Recibe trayectos priorizando rampas, pendientes suaves y banquetas seguras.",
  },
  {
    img: onb2,
    title: "Reporta barreras en segundos",
    desc: "Toma una foto y ayuda a otras personas a evitar obstáculos en su camino.",
  },
  {
    img: onb3,
    title: "Comunidad que valida",
    desc: "Cada reporte es verificado por personas como tú. Juntos hacemos una ciudad accesible.",
  },
];

function OnboardingPage() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const isLast = i === slides.length - 1;
  const slide = slides[i];

  const next = () => {
    if (isLast) navigate({ to: "/encuesta" });
    else setI(i + 1);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      <div className="flex justify-end p-4 safe-top">
        <button
          type="button"
          onClick={() => navigate({ to: "/encuesta" })}
          className="text-sm font-semibold text-muted-foreground px-3 py-2"
        >
          Saltar
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          className="w-72 h-72 rounded-3xl overflow-hidden bg-muted mb-8 animate-fade-up"
          key={`img-${i}`}
        >
          <img src={slide.img} alt="" className="w-full h-full object-cover" />
        </div>
        <h2
          className="text-3xl font-bold tracking-tight text-balance animate-fade-up"
          key={`t-${i}`}
        >
          {slide.title}
        </h2>
        <p
          className="mt-3 text-base text-muted-foreground text-balance max-w-xs animate-fade-up"
          key={`d-${i}`}
        >
          {slide.desc}
        </p>
      </div>

      <div className="px-6 pb-8 safe-bottom space-y-6">
        <div className="flex justify-center gap-2">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={[
                "h-2 rounded-full transition-all",
                idx === i ? "w-8 bg-brand" : "w-2 bg-muted-foreground/30",
              ].join(" ")}
            />
          ))}
        </div>
        <BigButton onClick={next} icon={<ArrowRight className="size-5" />}>
          {isLast ? "Comenzar" : "Siguiente"}
        </BigButton>
      </div>
    </div>
  );
}
