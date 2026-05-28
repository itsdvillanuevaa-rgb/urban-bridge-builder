import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { businesses, type Business } from "@/data/mock";
import { BusinessCard } from "@/components/business-card";
import { Award } from "lucide-react";

export const Route = createFileRoute("/comercios")({
  head: () => ({
    meta: [
      { title: "Sello de Ciudad Inclusiva — Acento Accesible" },
      {
        name: "description",
        content:
          "Directorio de comercios, clínicas y espacios culturales certificados por la comunidad como accesibles.",
      },
      { property: "og:title", content: "Sello de Ciudad Inclusiva" },
      {
        property: "og:description",
        content: "Comercios certificados como accesibles por la comunidad.",
      },
    ],
  }),
  component: ComerciosPage,
});

const categories = ["Todos", "Restaurante", "Clínica", "Cultura", "Farmacia", "Comercio"] as const;
const seals = ["Todos", "Oro", "Plata", "Bronce"] as const;

function ComerciosPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>("Todos");
  const [seal, setSeal] = useState<(typeof seals)[number]>("Todos");

  const filtered: Business[] = businesses.filter(
    (b) => (cat === "Todos" || b.category === cat) && (seal === "Todos" || b.seal === seal),
  );

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-28 md:pb-16">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-brand uppercase tracking-widest">Ecosistema comercial</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">Sello de Ciudad Inclusiva</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Negocios evaluados por la comunidad. La accesibilidad como ventaja competitiva, no como obligación.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-3 py-1.5 rounded-full text-xs font-semibold">
          <Award className="size-4" aria-hidden />
          {businesses.filter((b) => b.seal === "Oro").length} con Sello Oro
        </div>
      </header>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <FilterRow label="Categoría" options={categories} value={cat} onChange={setCat} />
        <FilterRow label="Nivel de sello" options={seals} value={seal} onChange={setSeal} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((b) => (
          <BusinessCard key={b.id} business={b} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-card rounded-3xl ring-1 ring-black/5 p-10 text-center">
          <p className="text-sm text-muted-foreground">No hay establecimientos con esos filtros.</p>
        </div>
      )}
    </main>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground w-24 shrink-0">
        {label}
      </span>
      <div className="flex gap-1.5 flex-wrap">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={[
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors ring-1",
                active
                  ? "bg-foreground text-background ring-foreground"
                  : "bg-card text-muted-foreground ring-black/10 hover:ring-black/20 hover:text-foreground",
              ].join(" ")}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
