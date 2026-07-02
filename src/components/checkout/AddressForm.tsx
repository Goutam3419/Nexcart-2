"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Check } from "lucide-react";
import { countries, indianStates } from "@/data/countries";
import { useGooglePlaces } from "@/lib/checkout/useGooglePlaces";
import { cn } from "@/lib/utils";
import type { Address } from "@/types";

interface AddressFormProps {
  initialAddress?: Partial<Address>;
  onSubmit: (address: Address) => void;
  submitLabel?: string;
}

export function AddressForm({ initialAddress, onSubmit, submitLabel = "Save Address" }: AddressFormProps) {
  const { suggestions, isAvailable, search, getDetails } = useGooglePlaces();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Address>({
    name: initialAddress?.name ?? "",
    phone: initialAddress?.phone ?? "",
    line1: initialAddress?.line1 ?? "",
    line2: initialAddress?.line2 ?? "",
    city: initialAddress?.city ?? "",
    state: initialAddress?.state ?? "",
    pincode: initialAddress?.pincode ?? "",
    country: initialAddress?.country ?? "India",
    isDefault: initialAddress?.isDefault ?? false,
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(true);
    search(value);
  };

  const handleSelectSuggestion = async (placeId: string, description: string) => {
    setSearchQuery(description);
    setShowSuggestions(false);
    const details = await getDetails(placeId);
    if (details) {
      setForm((prev) => ({
        ...prev,
        line1: details.formattedAddress,
        city: details.city,
        state: details.state,
        pincode: details.pincode,
        country: details.country,
      }));
    }
  };

  const f = (key: keyof Address, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isIndia = form.country === "India";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Google Places search — shown when API available */}
      {isAvailable && (
        <div className="relative" ref={wrapperRef}>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Search Address
          </label>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Start typing your address..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s.placeId}
                  type="button"
                  onClick={() => handleSelectSuggestion(s.placeId, s.description)}
                  className="w-full flex items-start gap-2 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                >
                  <MapPin size={14} className="mt-0.5 text-gray-400 shrink-0" />
                  {s.description}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!isAvailable && (
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-2.5 text-xs text-blue-700 dark:text-blue-400">
          <MapPin size={14} className="shrink-0" />
          Enter your address manually below. Smart address search will activate once configured.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
          <input value={form.name} onChange={(e) => f("name", e.target.value)} required className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone *</label>
          <input value={form.phone} onChange={(e) => f("phone", e.target.value)} required className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all" />
        </div>
      </div>

      {/* Country FIRST */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Country *</label>
        <select
          value={form.country}
          onChange={(e) => f("country", e.target.value)}
          required
          className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Address Line 1 *</label>
        <input value={form.line1} onChange={(e) => f("line1", e.target.value)} required placeholder="House/Flat no, Street name" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Address Line 2</label>
        <input value={form.line2} onChange={(e) => f("line2", e.target.value)} placeholder="Landmark, Area (optional)" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all" />
      </div>

      {/* City / State (after country, per requested flow) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City *</label>
          <input value={form.city} onChange={(e) => f("city", e.target.value)} required className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">State *</label>
          {isIndia ? (
            <select value={form.state} onChange={(e) => f("state", e.target.value)} required className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all">
              <option value="">Select state</option>
              {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <input value={form.state} onChange={(e) => f("state", e.target.value)} required className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all" />
          )}
        </div>
      </div>

      {/* Pincode LAST, per requested flow */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          {isIndia ? "Pincode" : "ZIP / Postal Code"} *
        </label>
        <input value={form.pincode} onChange={(e) => f("pincode", e.target.value)} required maxLength={10} className="w-full sm:w-40 px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all" />
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" checked={form.isDefault} onChange={(e) => f("isDefault", e.target.checked)} className="w-4 h-4 rounded accent-brand-600" />
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Set as default address</span>
      </label>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-brand-600/30 text-sm active:scale-[0.98]"
      >
        <Check size={16} /> {submitLabel}
      </button>
    </form>
  );
}
