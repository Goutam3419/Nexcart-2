import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Product } from "@/types";

interface RecommendationsProps {
  currentProduct: Product;
  allProducts: Product[];
  format: (n: number) => string;
}

export function Recommendations({ currentProduct, allProducts, format }: RecommendationsProps) {
  // "Customers also bought" — same category, different product, sorted by rating
  const recommendations = allProducts
    .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-brand-600" />
        <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Customers Also Bought</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {recommendations.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="p-3">
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2 mb-1 min-h-[32px]">{p.name}</p>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{format(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
