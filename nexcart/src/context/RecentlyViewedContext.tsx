"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "nexcart_recently_viewed";
const MAX_ITEMS = 10;

interface RecentlyViewedContextValue {
  recentIds: string[];
  addToRecent: (productId: string) => void;
  clearRecent: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue>({
  recentIds: [],
  addToRecent: () => {},
  clearRecent: () => {},
});

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentIds(JSON.parse(stored));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  const addToRecent = useCallback((productId: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const updated = [productId, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage may be unavailable — fail silently
      }
      return updated;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  if (!hydrated) {
    return <>{children}</>;
  }

  return (
    <RecentlyViewedContext.Provider value={{ recentIds, addToRecent, clearRecent }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext);
}
