"use client";

const RECENT_SEARCHES_KEY = "nexcart_recent_searches";
const MAX_RECENT = 6;

export const trendingSearches = [
  "Wireless earbuds",
  "Smart watch",
  "Running shoes",
  "Bluetooth speaker",
  "Backpack",
  "Perfume",
];

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === "undefined" || !query.trim()) return;
  try {
    const existing = getRecentSearches().filter((q) => q.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // ignore
  }
}

/**
 * Simple typo-tolerant "did you mean" matcher using Levenshtein distance.
 */
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

export function findDidYouMean(query: string, corpus: string[]): string | null {
  if (!query || query.length < 3) return null;
  let bestMatch: string | null = null;
  let bestDistance = Infinity;

  for (const term of corpus) {
    const distance = levenshtein(query.toLowerCase(), term.toLowerCase());
    if (distance < bestDistance && distance > 0 && distance <= 2) {
      bestDistance = distance;
      bestMatch = term;
    }
  }
  return bestMatch;
}

export function getLiveSuggestions(query: string, corpus: string[], limit = 6): string[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return corpus
    .filter((term) => term.toLowerCase().includes(lower))
    .slice(0, limit);
}
