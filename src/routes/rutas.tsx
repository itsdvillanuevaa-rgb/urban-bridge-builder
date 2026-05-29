import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { TopBar } from "@/components/top-bar";
import { routes } from "@/data/mock";
import { Circle, Square, Clock, Mountain, CheckCircle2, MapPin, History, X } from "lucide-react";

export const Route = createFileRoute("/rutas")({
  head: () => ({ meta: [{ title: "Buscar ruta accesible" }] }),
  component: RutasPage,
});

function scoreColor(s: number) {
  if (s >= 90) return "text-success";
  if (s >= 75) return "text-brand";
  return "text-warning-foreground";
}

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

const HISTORY_KEY = "aa.search-history";
const MAX_HISTORY = 8;

function getHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveToHistory(query: string) {
  if (typeof window === "undefined" || !query.trim()) return;
  const history = getHistory().filter((h) => h !== query);
  history.unshift(query);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

function removeFromHistory(query: string) {
  if (typeof window === "undefined") return;
  const history = getHistory().filter((h) => h !== query);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function RutasPage() {
  const [origen, setOrigen] = useState("Mi ubicación");
  const [destino, setDestino] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<"origen" | "destino" | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDestino, setSelectedDestino] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const searchNominatim = useCallback(async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=mx&accept-language=es`,
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (value: string, field: "origen" | "destino") => {
    if (field === "origen") setOrigen(value);
    else setDestino(value);

    setActiveField(field);
    setSelectedDestino("");

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchNominatim(value);
    }, 400);
  };

  const selectResult = (name: string) => {
    if (activeField === "origen") {
      setOrigen(name);
    } else {
      setDestino(name);
      setSelectedDestino(name);
    }
    saveToHistory(name);
    setHistory(getHistory());
    setResults([]);
    setActiveField(null);
  };

  const selectFromHistory = (name: string) => {
    if (activeField === "origen") {
      setOrigen(name);
    } else {
      setDestino(name);
      setSelectedDestino(name);
    }
    setResults([]);
    setActiveField(null);
  };

  const handleRemoveHistory = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    removeFromHistory(item);
    setHistory(getHistory());
  };

  const showDropdown = activeField !== null;
  const currentQuery = activeField === "origen" ? origen : destino;
  const filteredHistory =
    currentQuery.length > 0
      ? history.filter((h) => h.toLowerCase().includes(currentQuery.toLowerCase()))
      : history;

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24">
      <TopBar title="Buscar ruta" back />

      <div className="px-4 pt-4 space-y-3">
        <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
          <label className="flex items-center gap-3 px-4 h-14 border-b border-border">
            <Circle className="size-4 text-muted-foreground" aria-hidden />
            <input
              type="text"
              value={origen}
              onChange={(e) => handleInputChange(e.target.value, "origen")}
              onFocus={() => setActiveField("origen")}
              aria-label="Origen"
              className="flex-1 bg-transparent text-base outline-none"
            />
          </label>
          <label className="flex items-center gap-3 px-4 h-14">
            <Square className="size-4 text-brand fill-brand" aria-hidden />
            <input
              type="text"
              value={destino}
              onChange={(e) => handleInputChange(e.target.value, "destino")}
              onFocus={() => setActiveField("destino")}
              placeholder="¿A dónde vamos?"
              aria-label="Destino"
              autoFocus
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>

        {showDropdown && (
          <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden divide-y divide-border">
            {loading && <div className="px-4 py-3 text-sm text-muted-foreground">Buscando…</div>}

            {results.map((r) => (
              <button
                key={r.place_id}
                type="button"
                onClick={() => selectResult(r.display_name)}
                className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <MapPin className="size-4 text-brand shrink-0 mt-0.5" aria-hidden />
                <span className="text-sm leading-snug line-clamp-2">{r.display_name}</span>
              </button>
            ))}

            {!loading && results.length === 0 && filteredHistory.length > 0 && (
              <>
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Búsquedas recientes
                  </p>
                </div>
                {filteredHistory.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => selectFromHistory(h)}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <History className="size-4 text-muted-foreground shrink-0" aria-hidden />
                    <span className="flex-1 text-sm truncate">{h}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveHistory(e, h)}
                      aria-label="Eliminar del historial"
                      className="size-6 grid place-items-center rounded-full hover:bg-muted"
                    >
                      <X className="size-3.5 text-muted-foreground" aria-hidden />
                    </button>
                  </button>
                ))}
              </>
            )}

            {!loading &&
              results.length === 0 &&
              filteredHistory.length === 0 &&
              currentQuery.length >= 3 && (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No se encontraron resultados
                </div>
              )}
          </div>
        )}
      </div>

      {selectedDestino && (
        <div className="px-4 pt-6 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Rutas sugeridas
          </h2>
          {routes.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={[
                "w-full text-left bg-card rounded-3xl ring-1 p-5 transition-all hover:shadow-md",
                i === 0 ? "ring-brand ring-2" : "ring-border",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold truncate">{r.summary}</h3>
                    {i === 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-brand bg-brand-soft px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="size-3" aria-hidden /> Mejor
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{r.via}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={["text-2xl font-bold", scoreColor(r.score)].join(" ")}>{r.score}</p>
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                    Accesibilidad
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4 text-muted-foreground" aria-hidden />
                  <span className="font-semibold">{r.durationMin} min</span>
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="font-semibold">{r.rampas} rampas</span>
                <span className="text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Mountain className="size-4 text-muted-foreground" aria-hidden />
                  <span className="capitalize">{r.pendiente}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
