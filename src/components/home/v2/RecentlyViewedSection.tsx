"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useCurrency } from "@/context/CurrencyContext";
import { trendingProducts, bestSellers, newArrivals, flashDeals } from "@/data";
import type { Product } from "@/types";

const ALL_PRODUCTS: Product[] = [
  ...trendingProducts,
  ...flashDeals,
  ...bestSellers,
  ...newArrivals,
];

export function RecentlyViewedSection() {
  const { recentIds } = useRecentlyViewed();
  const { format } = useCurrency();

  const recentProducts = recentIds
    .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-6 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-5">
          <History size={16} className="text-gray-400" />
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Continue Browsing</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {recentProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="shrink-0 w-36 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-2.5">
                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2 mb-1 min-h-[32px]">{product.name}</p>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{format(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
