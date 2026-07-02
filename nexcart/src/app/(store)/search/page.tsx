"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, Star, Heart, ShoppingCart, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { trendingProducts, flashDeals, bestSellers, newArrivals, categories } from "@/data";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const ALL_PRODUCTS: Product[] = [
  ...trendingProducts,
  ...flashDeals,
  ...bestSellers,
  ...newArrivals,
];

type SortOption = "relevance" | "price-low" | "price-high" | "rating";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const { format } = useCurrency();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let results = ALL_PRODUCTS.filter((p) => {
      const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
      const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating = p.rating >= minRating;
      return matchQuery && matchCategory && matchPrice && matchRating;
    });

    switch (sortBy) {
      case "price-low": results = [...results].sort((a, b) => a.price - b.price); break;
      case "price-high": results = [...results].sort((a, b) => b.price - a.price); break;
      case "rating": results = [...results].sort((a, b) => b.rating - a.rating); break;
    }

    return results;
  }, [query, selectedCategory, priceRange, minRating, sortBy]);

  const handleAdd = (product: Product) => {
    addItem(product);
    showToast(`${product.name} added to cart!`, "success");
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 500]);
    setMinRating(0);
    setSortBy("relevance");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Search bar */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm"
            />
          </div>

          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} results {query && <>for &ldquo;<span className="font-semibold text-gray-900 dark:text-white">{query}</span>&rdquo;</>}
            </p>
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl">
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters sidebar */}
            <aside className={cn("lg:col-span-1", showFilters ? "block" : "hidden lg:block")}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                  <button onClick={clearFilters} className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline">Clear all</button>
                </div>

                {/* Category */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Category</p>
                  <div className="space-y-1.5">
                    <button onClick={() => setSelectedCategory("all")} className={cn("block w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors", selectedCategory === "all" ? "bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 font-semibold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800")}>
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={cn("block w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors", selectedCategory === cat.name ? "bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 font-semibold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800")}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Price Range</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{format(priceRange[0])}</span> – <span>{format(priceRange[1])}</span>
                  </div>
                  <input
                    type="range" min={0} max={500} step={10}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-brand-600"
                  />
                </div>

                {/* Rating */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Minimum Rating</p>
                  <div className="flex gap-1.5">
                    {[0, 3, 3.5, 4, 4.5].map((r) => (
                      <button key={r} onClick={() => setMinRating(r)} className={cn("flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all", minRating === r ? "bg-brand-600 border-brand-600 text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400")}>
                        {r === 0 ? "Any" : <><Star size={10} className="fill-current" /> {r}+</>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Sort */}
              <div className="flex items-center justify-end gap-2 mb-4">
                <span className="text-xs text-gray-400">Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="text-sm px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-brand-400">
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-16 text-center">
                  <Search size={40} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                  <p className="font-semibold text-gray-500 dark:text-gray-400">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filtered.map((product) => (
                    <div key={product.id} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all overflow-hidden">
                      <div className="relative">
                        <Link href={`/product/${product.id}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                        </Link>
                        <button onClick={() => toggle(product)} className={cn("absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all", isWishlisted(product.id) ? "bg-rose-500 text-white" : "bg-white/90 text-gray-600 hover:bg-rose-500 hover:text-white")}>
                          <Heart size={13} className={isWishlisted(product.id) ? "fill-current" : ""} />
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] text-brand-500 font-bold uppercase mb-1">{product.category}</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2 mb-2 min-h-[32px]">{product.name}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star size={11} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{product.rating}</span>
                        </div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white mb-2">{format(product.price)}</p>
                        <button onClick={() => handleAdd(product)} className="w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold py-1.5 rounded-xl transition-all">
                          <ShoppingCart size={12} /> Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
