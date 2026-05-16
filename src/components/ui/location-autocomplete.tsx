"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Loader2, X } from "lucide-react";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, coords?: [number, number]) => void;
  placeholder?: string;
  label?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
}

export function LocationAutocomplete({ value, onChange, placeholder = "Search location...", label }: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
        {
          headers: {
            "User-Agent": "BITAExpress/1.0",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Location search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onChange(val);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (val.length >= 2) {
      setIsOpen(true);
      debounceRef.current = setTimeout(() => {
        searchLocations(val);
      }, 300);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (place: NominatimResult) => {
    const displayName = place.name || place.display_name.split(",")[0];
    setInputValue(displayName);
    onChange(displayName, [parseFloat(place.lat), parseFloat(place.lon)]);
    setIsOpen(false);
    setResults([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="text-[11px] text-black/30 dark:text-white/30 uppercase tracking-wider font-medium mb-1.5 block">
          {label}
        </label>
      )}
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25 dark:text-white/25 pointer-events-none" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => inputValue.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 text-sm focus:outline-none focus:border-brand-red/50 transition-all"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25 dark:text-white/25 animate-spin" />
        )}
        {!loading && inputValue && (
          <button
            type="button"
            onClick={() => { setInputValue(""); onChange(""); setIsOpen(false); setResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/20 hover:text-black/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-lg overflow-hidden">
          {results.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto py-1">
              {results.map((place) => {
                const mainName = place.name || place.display_name.split(",")[0];
                const shortAddress = place.display_name.split(",").slice(1, 3).join(",");
                return (
                  <li key={place.place_id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(place)}
                      className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-sm text-black dark:text-white block truncate">{mainName}</span>
                        <span className="text-xs text-black/40 dark:text-white/40 block truncate">{shortAddress}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : inputValue.length >= 2 && !loading ? (
            <div className="px-4 py-3 text-xs text-black/30 dark:text-white/30">
              No locations found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}