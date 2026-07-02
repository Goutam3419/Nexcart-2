"use client";

import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { trendingSearches, getRecentSearches, addRecentSearch, clearRecentSearches, getLiveSuggestions } from "@/lib/search/searchEngine";
import { trendingProducts, bestSellers, newArrivals, flashDeals } from "@/data";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SEARCH_CORPUS = [
  ...trendingProducts.map((p) => p.name),
  ...bestSellers.map((p) => p.name),
  ...newArrivals.map((p) => p.name),
  ...flashDeals.map((p) => p.name),
];

export function SearchBar({
  className,
  placeholder = "Search products, brands and categories…",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const runSearch = (term: string) => {
    if (!term.trim()) return;
    addRecentSearch(term.trim());
    setRecentSearches(getRecentSearches());
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") { handleClear(); setShowDropdown(false); }
    if (e.key === "Enter" && query.trim()) runSearch(query);
  };

  const liveSuggestions = query.trim() ? getLiveSuggestions(query, SEARCH_CORPUS, 5) : [];

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="relative flex items-center group">
        <Search
          size={16}
          className="absolute left-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors pointer-events-none"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-9 py-2.5 rounded-xl text-sm",
            "bg-gray-100 dark:bg-gray-800",
            "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
            "border border-transparent focus:border-brand-400 dark:focus:border-brand-500",
            "focus:bg-white dark:focus:bg-gray-900",
            "outline-none transition-all duration-200",
            "focus:ring-2 focus:ring-brand-500/20"
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showDropdown && (
        <div className="absolute z-30 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
          {/* Live suggestions while typing */}
          {liveSuggestions.length > 0 && (
            <div className="py-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-1">Suggestions</p>
              {liveSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => runSearch(s)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Search size={13} className="text-gray-400" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Recent searches when no query typed */}
          {!query && recentSearches.length > 0 && (
            <div className="py-2 border-t border-gray-50 dark:border-gray-800 first:border-0">
              <div className="flex items-center justify-between px-4 py-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recent Searches</p>
                <button onClick={() => { clearRecentSearches(); setRecentSearches([]); }} className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Clear
                </button>
              </div>
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => runSearch(s)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Clock size={13} className="text-gray-400" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Trending searches always shown */}
          {!query && (
            <div className="py-2 border-t border-gray-50 dark:border-gray-800">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-1">Trending</p>
              <div className="flex flex-wrap gap-2 px-4 py-2">
                {trendingSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => runSearch(s)}
                    className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950/30 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <TrendingUp size={11} /> {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
