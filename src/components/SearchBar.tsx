import React from "react";
import { Circle, Square } from "lucide-react";

interface SearchBarProps {
  origen: string;
  destino: string;
  onInputChange: (value: string, field: "origen" | "destino") => void;
  onInputFocus: (field: "origen" | "destino") => void;
}

export function SearchBar({
  origen,
  destino,
  onInputChange,
  onInputFocus,
}: SearchBarProps) {
  return (
    <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
      <label className="flex items-center gap-3 px-4 h-14">
        <Circle className="size-4 text-muted-foreground" aria-hidden />
        <input
          type="text"
          value={origen}
          onChange={(e) => onInputChange(e.target.value, "origen")}
          onFocus={() => onInputFocus("origen")}
          aria-label="Origen"
          className="flex-1 bg-transparent text-base outline-none text-foreground"
        />
      </label>
      <label className="flex items-center gap-3 px-4 h-14">
        <Square className="size-4 text-brand fill-brand" aria-hidden />
        <input
          type="text"
          value={destino}
          onChange={(e) => onInputChange(e.target.value, "destino")}
          onFocus={() => onInputFocus("destino")}
          placeholder="¿A dónde vamos?"
          aria-label="Destino"
          autoFocus
          className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground text-foreground"
        />
      </label>
    </div>
  );
}
