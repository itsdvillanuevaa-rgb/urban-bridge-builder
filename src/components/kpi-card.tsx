import type { Kpi } from "@/data/mock";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const positive = kpi.delta?.startsWith("+");
  const negative = kpi.delta?.startsWith("−") || kpi.delta?.startsWith("-");
  return (
    <div className="bg-card p-5 rounded-2xl ring-1 ring-black/5">
      <p className="text-xs text-muted-foreground font-medium mb-1">{kpi.label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-semibold tracking-tight text-foreground">{kpi.value}</p>
        {kpi.delta && (
          <span
            className={[
              "text-xs font-semibold",
              positive ? "text-success" : negative ? "text-success" : "text-muted-foreground",
            ].join(" ")}
          >
            {kpi.delta}
          </span>
        )}
      </div>
      {kpi.hint && <p className="text-xs text-muted-foreground mt-1">{kpi.hint}</p>}
    </div>
  );
}
