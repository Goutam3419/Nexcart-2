"use client";

import Link from "next/link";
import { ArrowRight, Heart, ShoppingCart, Star } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/components/ui/Toast";
import { cn, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductRowProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  accentColor?: string;
}

export function ProductRow({ title, subtitle, products, viewAllHref = "/", accentColor = "text-brand-600 dark:text-brand-400" }: ProductRowProps) {
  const { format } = useCurrency();
  const { addItem, isInCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const handleAdd = (product: Product) => {
    addItem(product);
    showToast(`${product.name} added to cart!`, "success");
  };

  return (
    <section className="py-6 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            {subtitle && <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${accentColor}`}>{subtitle}</p>}
            <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          </div>
          <Link href={viewAllHref} className={`flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all ${accentColor}`}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {products.map((product) => (
            <div key={product.id} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 transition-all overflow-hidden">
              <div className="relative">
                <Link href={`/product/${product.id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Badge */}
                {product.badge && (
                  <div className={cn(
                    "absolute top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                    product.badge === "new" ? "bg-emerald-500"
                    : product.badge === "sale" ? "bg-rose-500"
                    : product.badge === "hot" ? "bg-orange-500"
                    : "bg-brand-600"
                  )}>
                    {product.badge}
                  </div>
                )}

                {/* Discount */}
                {product.originalPrice && (
                  <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    -{calculateDiscount(product.originalPrice, product.price)}%
                  </div>
                )}

                {/* Wishlist */}
                <button
                  onClick={() => toggle(product)}
                  className={cn(
                    "absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md",
                    isWishlisted(product.id) ? "bg-rose-500 text-white" : "bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:bg-rose-500 hover:text-white"
                  )}
                >
                  <Heart size={13} className={isWishlisted(product.id) ? "fill-current" : ""} />
                </button>
              </div>

              <div className="p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-brand-500 mb-1">{product.category}</p>
                <Link href={`/product/${product.id}`}>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2 mb-2 min-h-[32px] hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {product.name}
                  </p>
                </Link>

                <div className="flex items-center gap-1 mb-2">
                  <Star size={11} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
                  <span className="text-[10px] text-gray-400">({product.reviewCount.toLocaleString()})</span>
                </div>

                <div className="mb-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{format(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-[11px] text-gray-400 line-through ml-1">{format(product.originalPrice)}</span>
                  )}
                </div>

                <button
                  onClick={() => handleAdd(product)}
                  className={cn(
                    "w-full flex items-center justify-center gap-1.5 text-white text-xs font-semibold py-1.5 rounded-xl transition-all active:scale-95",
                    isInCart(product.id)
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-brand-600 hover:bg-brand-700"
                  )}
                >
                  <ShoppingCart size={12} />
                  {isInCart(product.id) ? "Added ✓" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
