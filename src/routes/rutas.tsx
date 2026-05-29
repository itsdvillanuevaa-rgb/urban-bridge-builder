import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TopBar } from "@/components/top-bar";
import { SearchBar } from "@/components/SearchBar";
import { SearchSuggestions } from "@/components/SearchSuggestions";
import { RouteOptionsPanel } from "@/components/RouteOptionsPanel";
import { MapCanvas } from "@/components/map-canvas";
import { RouteAlertBanner } from "@/components/route-alert-banner";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useUserLocation } from "@/hooks/useUserLocation";
import { LocationSuggestion } from "@/types/location";
import { SearchHistoryEntry } from "@/types/accessibility";
import { tijuanaRouteAlert, mainTijuanaRoute, alternativeTijuanaRoute } from "@/data/mock";

const TIJUANA_CENTER: [number, number] = [32.5145, -117.0395];

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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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

  const activateDemoMode = () => {
    setIsDemoMode(true);
    setShowAlert(true);
    setOrigen("Taxis adaptados - Av. Constitución");
    setDestino("Centro de Salud - Av. Constitución");
    setSelectedDestino("Centro de Salud - Av. Constitución");
    setOriginCoords([32.5145, -117.0395]);
    setDestinoCoords([32.5158, -117.0375]);
    setActiveGeometry(mainTijuanaRoute.geometry);
    setActiveField(null);
    clearSearch();
  };

  const deactivateDemoMode = () => {
    setIsDemoMode(false);
    setShowAlert(false);
    setDestino("");
    setSelectedDestino("");
    setDestinoCoords(null);
    setActiveGeometry(null);
  };

  const showDropdown = activeField !== null;

  // Use locked/resolved origin coordinates state, falling back to Tijuana
  const activeOriginCoords: [number, number] = originCoords || TIJUANA_CENTER;

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

        {!isDemoMode && (
          <button
            type="button"
            onClick={activateDemoMode}
            className="w-full bg-brand text-white font-semibold py-3 px-4 rounded-2xl hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="text-lg">🚗</span>
            <div className="text-left">
              <div className="text-sm font-semibold">Demo: Ruta accesible</div>
              <div className="text-xs opacity-90">Zona Centro, Tijuana</div>
            </div>
          </button>
        )}

        {isDemoMode && (
          <button
            type="button"
            onClick={deactivateDemoMode}
            className="w-full bg-muted text-muted-foreground font-semibold py-3 px-4 rounded-2xl hover:bg-muted/80 transition-colors"
          >
            ✕ Salir de demo
          </button>
        )}

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

      {/* Show location context when demo is active */}
      {isDemoMode && (
        <div className="mx-4 mt-4 bg-card rounded-2xl ring-1 ring-border p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">📍</span>
            <div className="flex-1">
              <div className="font-semibold text-foreground">Zona Centro, Tijuana</div>
              <div className="text-xs text-muted-foreground">Ruta: Taxis adaptados → Centro de Salud</div>
            </div>
          </div>
        </div>
      )}

      {/* Show alert banner when demo is active */}
      {isDemoMode && showAlert && (
        <RouteAlertBanner
          alert={tijuanaRouteAlert}
          onDismiss={() => setShowAlert(false)}
        />
      )}

      {/* Render map canvas with dynamic coordinates bounds fitting */}
      {selectedDestino && destinoCoords && (
        <div className="relative h-80 rounded-3xl overflow-hidden ring-1 ring-border mx-4 mt-4 shadow-sm z-0">
          <MapCanvas
            userLocation={activeOriginCoords}
            routeGeometry={activeGeometry}
            alertPosition={isDemoMode ? tijuanaRouteAlert.position : undefined}
            alternativeRouteGeometry={isDemoMode ? alternativeTijuanaRoute.geometry : undefined}
          />
        </div>
      )}

      {selectedDestino && destinoCoords && (
        <RouteOptionsPanel
          originCoords={activeOriginCoords}
          destinationCoords={destinoCoords}
          onRouteSelect={setActiveGeometry}
          isDemoMode={isDemoMode}
        />
      )}
    </div>
  );
}
