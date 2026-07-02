"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight, Heart, ShoppingCart } from "lucide-react";
import { flashDeals } from "@/data";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

function useCountdown(targetHours = 2) {
  const [timeLeft, setTimeLeft] = useState({ h: targetHours, m: 15, s: 36 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: targetHours, m: 15, s: 36 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetHours]);

  return timeLeft;
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 text-white font-bold text-sm w-8 h-8 rounded flex items-center justify-center">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[9px] text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}

export function FlashDeals() {
  const time = useCountdown(2);
  const { format } = useCurrency();
  const { addItem } = useCart();
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
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-lg">
              <Zap size={15} className="fill-gray-900" />
              <span className="font-bold text-sm">Flash Deals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TimeBox value={time.h} label="HRS" />
              <span className="text-gray-400 font-bold text-sm mb-3">:</span>
              <TimeBox value={time.m} label="MIN" />
              <span className="text-gray-400 font-bold text-sm mb-3">:</span>
              <TimeBox value={time.s} label="SEC" />
            </div>
          </div>
          <Link href="/flash-deals" className="flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:gap-2 transition-all">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {flashDeals.map((product) => (
            <div key={product.id} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 transition-all overflow-hidden">
              {/* Discount badge */}
              <div className="relative">
                <Link href={`/product/${product.id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {product.discount}% OFF
                </div>
                <button
                  onClick={() => toggle(product as Product)}
                  className={cn("absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100",
                    isWishlisted(product.id) ? "bg-rose-500 text-white" : "bg-white/90 text-gray-600 hover:bg-rose-500 hover:text-white")}
                >
                  <Heart size={13} className={isWishlisted(product.id) ? "fill-current" : ""} />
                </button>
              </div>

              <div className="p-3">
                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2 mb-2 min-h-[32px]">{product.name}</p>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400 text-xs">{"★".repeat(Math.floor(product.rating))}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()})</span>
                </div>
                <div className="mb-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{format(product.price)}</span>
                  <span className="text-xs text-gray-400 line-through ml-1">{format(product.originalPrice)}</span>
                </div>
                <button
                  onClick={() => handleAdd(product as Product)}
                  className="w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold py-1.5 rounded-xl transition-all active:scale-95"
                >
                  <ShoppingCart size={12} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
