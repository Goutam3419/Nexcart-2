"use client";

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: "TOGGLE"; product: Product }
  | { type: "CLEAR" };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.items.find((p) => p.id === action.product.id);
      return {
        items: exists
          ? state.items.filter((p) => p.id !== action.product.id)
          : [...state.items, action.product],
      };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface WishlistContextValue {
  items: Product[];
  count: number;
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue>({
  items: [],
  count: 0,
  toggle: () => {},
  isWishlisted: () => false,
  clear: () => {},
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  const toggle = useCallback((product: Product) => {
    dispatch({ type: "TOGGLE", product });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => state.items.some((p) => p.id === productId),
    [state.items]
  );

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  return (
    <WishlistContext.Provider value={{ items: state.items, count: state.items.length, toggle, isWishlisted, clear }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
