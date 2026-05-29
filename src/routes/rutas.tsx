import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TopBar } from "@/components/top-bar";
import { SearchBar } from "@/components/SearchBar";
import { SearchSuggestions } from "@/components/SearchSuggestions";
import { RouteOptionsPanel } from "@/components/RouteOptionsPanel";
import { MapCanvas } from "@/components/map-canvas";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useUserLocation } from "@/hooks/useUserLocation";
import { LocationSuggestion } from "@/types/location";
import { SearchHistoryEntry } from "@/types/accessibility";

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

export const Route = createFileRoute("/rutas")({
  head: () => ({ meta: [{ title: "Buscar ruta accesible" }] }),
  component: RutasPage,
});

function RutasPage() {
  const [origen, setOrigen] = useState("Mi ubicación");
  const [destino, setDestino] = useState("");
  const [activeField, setActiveField] = useState<"origen" | "destino" | null>(null);
  const [selectedDestino, setSelectedDestino] = useState("");
  const [activeGeometry, setActiveGeometry] = useState<[number, number][] | null>(null);

  // States to store real lat/lon coordinate numbers
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destinoCoords, setDestinoCoords] = useState<[number, number] | null>(null);

  // Hook for tracking continuous real-time user location
  const { location: userCoords, error: gpsError } = useUserLocation();

  // Lock user coordinates to state once when resolved, avoiding continuous updates and loops
  useEffect(() => {
    if (userCoords && origen === "Mi ubicación" && !originCoords) {
      setOriginCoords([userCoords.latitude, userCoords.longitude]);
    }
  }, [userCoords, origen, originCoords]);

  const {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    clearSearch,
  } = useLocationSearch();

  const {
    history,
    saveQuery,
    removeQuery,
  } = useSearchHistory();

  const handleInputChange = (value: string, field: "origen" | "destino") => {
    if (field === "origen") {
      setOrigen(value);
      setOriginCoords(null); // Reset originCoords to allow fetching new coordinates
    } else {
      setDestino(value);
      setDestinoCoords(null);
    }

    setSelectedDestino("");
    setActiveField(field);
    setQuery(value);
  };

  const handleInputFocus = (field: "origen" | "destino") => {
    setActiveField(field);
    const value = field === "origen" ? origen : destino;
    if (value === "Mi ubicación") {
      setOriginCoords(null); // Force recapture of GPS coordinates on focus
      clearSearch();
    } else {
      setQuery(value);
    }
  };

  const selectResult = (suggestion: LocationSuggestion) => {
    const name = suggestion.display_name;
    const coords: [number, number] = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];

    if (activeField === "origen") {
      setOrigen(name);
      setOriginCoords(coords);
    } else {
      setDestino(name);
      setSelectedDestino(name);
      setDestinoCoords(coords);
    }
    saveQuery(name, coords[0], coords[1]);
    setActiveField(null);
    clearSearch();
  };

  const selectFromHistory = (entry: SearchHistoryEntry) => {
    const name = entry.query;
    const coords: [number, number] = [entry.lat, entry.lon];

    if (activeField === "origen") {
      setOrigen(name);
      setOriginCoords(coords);
    } else {
      setDestino(name);
      setSelectedDestino(name);
      setDestinoCoords(coords);
    }
    setActiveField(null);
    clearSearch();
  };

  const handleRemoveHistory = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    removeQuery(item);
  };

  const showDropdown = activeField !== null;

  // Use locked/resolved origin coordinates state, falling back to CDMX
  const activeOriginCoords: [number, number] = originCoords || CDMX_CENTER;

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24">
      <TopBar title="Buscar ruta" back />

      {gpsError && (
        <div className="mx-4 mt-3 text-xs text-warning-foreground bg-warning/10 p-3 rounded-2xl border border-warning/20">
          Aviso GPS: {gpsError}. La navegación se basará en posiciones de simulación.
        </div>
      )}

      <div className="px-4 pt-4 space-y-3">
        <SearchBar
          origen={origen}
          destino={destino}
          onInputChange={handleInputChange}
          onInputFocus={handleInputFocus}
        />

        {showDropdown && (
          <SearchSuggestions
            loading={loading}
            error={error}
            suggestions={suggestions}
            history={history}
            currentQuery={query}
            onSelectSuggestion={selectResult}
            onSelectHistory={selectFromHistory}
            onRemoveHistory={handleRemoveHistory}
          />
        )}
      </div>

      {/* Render map canvas with dynamic coordinates bounds fitting */}
      {selectedDestino && destinoCoords && (
        <div className="relative h-64 rounded-3xl overflow-hidden ring-1 ring-border mx-4 mt-4 shadow-sm z-0">
          <MapCanvas
            userLocation={activeOriginCoords}
            routeGeometry={activeGeometry}
          />
        </div>
      )}

      {selectedDestino && destinoCoords && (
        <RouteOptionsPanel
          originCoords={activeOriginCoords}
          destinationCoords={destinoCoords}
          onRouteSelect={setActiveGeometry}
        />
      )}
    </div>
  );
}
