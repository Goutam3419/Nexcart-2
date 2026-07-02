"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface PlaceSuggestion {
  description: string;
  placeId: string;
}

export interface PlaceDetails {
  formattedAddress: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

/**
 * Hook for Google Places Autocomplete.
 * Falls back gracefully (returns empty suggestions) when no API key is configured,
 * allowing manual address entry to work without errors.
 */
export function useGooglePlaces() {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAvailable] = useState(!!API_KEY);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (!API_KEY) {
      // Fallback mode — no API key configured yet
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            query
          )}&key=${API_KEY}`
        );
        const data = await res.json();
        if (data.predictions) {
          setSuggestions(
            data.predictions.map((p: { description: string; place_id: string }) => ({
              description: p.description,
              placeId: p.place_id,
            }))
          );
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  const getDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    if (!API_KEY) return null;
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`
      );
      const data = await res.json();
      const components = data.result?.address_components ?? [];

      const getComponent = (type: string) =>
        components.find((c: { types: string[] }) => c.types.includes(type))?.long_name ?? "";
      const getComponentShort = (type: string) =>
        components.find((c: { types: string[] }) => c.types.includes(type))?.short_name ?? "";

      return {
        formattedAddress: data.result?.formatted_address ?? "",
        city: getComponent("locality") || getComponent("administrative_area_level_2"),
        state: getComponent("administrative_area_level_1"),
        country: getComponent("country"),
        countryCode: getComponentShort("country"),
        pincode: getComponent("postal_code"),
        lat: data.result?.geometry?.location?.lat,
        lng: data.result?.geometry?.location?.lng,
      };
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { suggestions, loading, isAvailable, search, getDetails };
}
