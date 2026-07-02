"use client";

import { use } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { trendingProducts, flashDeals, bestSellers, newArrivals } from "@/data";
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

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace("And", "&");
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const categoryName = slugToName(slug);

  const { format } = useCurrency();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const products = ALL_PRODUCTS.filter(
    (p) => p.category.toLowerCase().replace(/\s+/g, "-").replace("&", "and") === slug
      || p.category.toLowerCase() === categoryName.toLowerCase()
  );

  const handleAdd = (product: Product) => {
    addItem(product);
    showToast(`${product.name} added to cart!`, "success");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 dark:text-white">{categoryName}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{categoryName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{products.length} products found</p>

          {products.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-16 text-center">
              <p className="font-semibold text-gray-500 dark:text-gray-400">No products in this category yet</p>
              <Link href="/" className="inline-block mt-4 text-brand-600 dark:text-brand-400 font-semibold text-sm hover:underline">
                ← Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all overflow-hidden">
                  <div className="relative">
                    <Link href={`/product/${product.id}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    {product.badge && (
                      <span className={cn("absolute top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                        product.badge === "new" ? "bg-emerald-500" : product.badge === "sale" ? "bg-rose-500" : product.badge === "hot" ? "bg-orange-500" : "bg-brand-600")}>
                        {product.badge}
                      </span>
                    )}
                    <button onClick={() => toggle(product)} className={cn("absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all", isWishlisted(product.id) ? "bg-rose-500 text-white" : "bg-white/90 text-gray-600 hover:bg-rose-500 hover:text-white")}>
                      <Heart size={13} className={isWishlisted(product.id) ? "fill-current" : ""} />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2 mb-2 min-h-[32px]">{product.name}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-[10px] text-gray-400">({product.reviewCount.toLocaleString()})</span>
                    </div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white mb-2">{format(product.price)}</p>
                    <button onClick={() => handleAdd(product)} className="w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold py-1.5 rounded-xl transition-all">
                      <ShoppingCart size={12} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
