import type { Business } from "@/data/mock";
import { Check } from "lucide-react";

const sealClass = {
  Oro: "bg-amber-100 text-amber-800 ring-amber-200",
  Plata: "bg-slate-100 text-slate-700 ring-slate-200",
  Bronce: "bg-orange-100 text-orange-800 ring-orange-200",
} as const;

export function BusinessCard({ business, compact = false }: { business: Business; compact?: boolean }) {
  if (compact) {
    return (
      <div className="bg-card p-4 rounded-2xl ring-1 ring-black/5 flex gap-4">
        <img
          src={business.image}
          alt=""
          width={80}
          height={80}
          loading="lazy"
          className="size-20 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-brand/10 text-brand rounded-full uppercase tracking-wider">
              Sello {business.seal}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              {business.neighborhood}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-foreground truncate">{business.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 truncate">{business.features.slice(0, 2).join(" · ")}</p>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-card rounded-2xl ring-1 ring-black/5 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={business.image}
          alt={business.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span
            className={[
              "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ring-1",
              sealClass[business.seal],
            ].join(" ")}
          >
            Sello {business.seal}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg ring-1 ring-black/5">
          <span className="text-sm font-semibold text-brand">{business.score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
          <span>{business.category}</span>
          <span aria-hidden>·</span>
          <span>{business.neighborhood}</span>
        </div>
        <h3 className="text-base font-semibold text-foreground">{business.name}</h3>
        <ul className="mt-3 space-y-1.5">
          {business.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-foreground/80">
              <Check className="size-3.5 text-brand shrink-0" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
