import React from "react";
import { MapPin, History, X } from "lucide-react";
import { LocationSuggestion } from "@/types/location";
import { SearchHistoryEntry } from "@/types/accessibility";

interface SearchSuggestionsProps {
  loading: boolean;
  error: string | null;
  suggestions: LocationSuggestion[];
  history: SearchHistoryEntry[];
  currentQuery: string;
  onSelectSuggestion: (suggestion: LocationSuggestion) => void;
  onSelectHistory: (entry: SearchHistoryEntry) => void;
  onRemoveHistory: (e: React.MouseEvent, item: string) => void;
}

export function SearchSuggestions({
  loading,
  error,
  suggestions,
  history,
  currentQuery,
  onSelectSuggestion,
  onSelectHistory,
  onRemoveHistory,
}: SearchSuggestionsProps) {
  const isQueryShort = currentQuery.trim().length < 3;
  const filteredHistory =
    currentQuery.length > 0
      ? history.filter((h) => h.query.toLowerCase().includes(currentQuery.toLowerCase()))
      : history;

  return (
    <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden divide-y divide-border shadow-md">
      {loading && <div className="px-4 py-3 text-sm text-muted-foreground animate-pulse">Buscando…</div>}

      {error && <div className="px-4 py-3 text-sm text-destructive">{error}</div>}

      {!loading && !error && !isQueryShort && suggestions.length > 0 && (
        suggestions.map((r) => {
          const parsedName = r.name || r.display_name.split(",")[0];
          const hasCityAndState = r.city && r.state;
          const secondaryText = hasCityAndState
            ? `${r.city}, ${r.state}`
            : r.display_name;

          return (
            <button
              key={r.place_id}
              type="button"
              onClick={() => onSelectSuggestion(r)}
              className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors focus:outline-none focus:bg-muted/50"
            >
              <MapPin className="size-4 text-brand shrink-0 mt-1" aria-hidden />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-foreground truncate">
                    {parsedName}
                  </span>
                  {r.distance !== undefined && (
                    <span className="text-xs font-semibold text-muted-foreground shrink-0 bg-muted px-2 py-0.5 rounded-md">
                      {r.distance < 1 ? `${Math.round(r.distance * 1000)} m` : `${r.distance.toFixed(1)} km`}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground block truncate mt-0.5">
                  {secondaryText}
                </span>
              </div>
            </button>
          );
        })
      )}

      {/* Empty State */}
      {!loading && !error && !isQueryShort && suggestions.length === 0 && (
        <div className="px-4 py-3 text-sm text-muted-foreground">
          No se encontraron resultados
        </div>
      )}

      {/* Search History */}
      {!loading && !error && isQueryShort && filteredHistory.length > 0 && (
        <>
          <div className="px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Búsquedas recientes
            </p>
          </div>
          {filteredHistory.map((h) => (
            <div
              key={h.query}
              onClick={() => onSelectHistory(h)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectHistory(h);
                }
              }}
              role="button"
              tabIndex={0}
              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:bg-muted/50"
            >
              <History className="size-4 text-muted-foreground shrink-0" aria-hidden />
              <span className="flex-1 text-sm truncate text-foreground">{h.query}</span>
              <button
                type="button"
                onClick={(e) => onRemoveHistory(e, h.query)}
                aria-label="Eliminar del historial"
                className="size-6 grid place-items-center rounded-full hover:bg-muted"
              >
                <X className="size-3.5 text-muted-foreground" aria-hidden />
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
