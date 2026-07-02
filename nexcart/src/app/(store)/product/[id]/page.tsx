"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Truck, RotateCcw, ShieldCheck, ChevronRight, Minus, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { trendingProducts, flashDeals, bestSellers, newArrivals } from "@/data";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useToast } from "@/components/ui/Toast";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { ProductQA } from "@/components/store/ProductQA";
import { Recommendations } from "@/components/store/Recommendations";
import { cn, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

const ALL_PRODUCTS: Product[] = [
  ...trendingProducts,
  ...flashDeals,
  ...bestSellers,
  ...newArrivals,
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = ALL_PRODUCTS.find((p) => p.id === id) ?? trendingProducts[0];

  const { format } = useCurrency();
  const { addItem, isInCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { addToRecent } = useRecentlyViewed();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    addToRecent(product.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const images = [product.image, product.image, product.image];

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast(`${quantity} × ${product.name} added to cart!`, "success");
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    showToast("Redirecting to checkout...", "info");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight size={12} />
            <Link href={`/category/${product.category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-brand-600">{product.category}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 dark:text-white line-clamp-1">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn("w-16 h-16 rounded-xl overflow-hidden border-2 transition-all", selectedImage === i ? "border-brand-500" : "border-gray-200 dark:border-gray-700")}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="text-xs text-brand-500 font-bold uppercase tracking-wide mb-2">{product.category}</p>
                <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h1>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg">
                    <Star size={13} className="fill-emerald-600 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-400">{product.reviewCount.toLocaleString()} ratings</span>
                  {product.badge && (
                    <span className={cn("text-[10px] font-bold uppercase px-2 py-1 rounded",
                      product.badge === "new" ? "bg-emerald-100 text-emerald-700" :
                      product.badge === "sale" ? "bg-rose-100 text-rose-700" :
                      product.badge === "hot" ? "bg-orange-100 text-orange-700" : "bg-brand-100 text-brand-700")}>
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{format(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">{format(product.originalPrice)}</span>
                      <span className="text-base font-bold text-emerald-600">{calculateDiscount(product.originalPrice, product.price)}% off</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-6">Inclusive of all taxes</p>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity:</span>
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-1.5">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Minus size={13} />
                    </button>
                    <span className="font-bold w-6 text-center">{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className={cn("flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] text-white shadow-lg",
                      isInCart(product.id) ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30" : "bg-brand-600 hover:bg-brand-700 shadow-brand-600/30")}
                  >
                    <ShoppingCart size={17} /> {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
                  </button>
                  <button onClick={handleBuyNow} className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-accent/30">
                    Buy Now
                  </button>
                  <button
                    onClick={() => toggle(product)}
                    className={cn("w-14 flex items-center justify-center rounded-xl border-2 transition-all",
                      isWishlisted(product.id) ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-500" : "border-gray-200 dark:border-gray-700 text-gray-400 hover:border-rose-300")}
                  >
                    <Heart size={20} className={isWishlisted(product.id) ? "fill-current" : ""} />
                  </button>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <Truck size={20} className="text-brand-600" />
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Free Delivery</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <RotateCcw size={20} className="text-brand-600" />
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">10 Day Returns</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <ShieldCheck size={20} className="text-brand-600" />
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
              <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-3">Product Description</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Experience premium quality with the {product.name}. Designed for everyday use with a focus on durability,
                comfort, and style. This {product.category.toLowerCase()} item has earned a {product.rating} star rating from over{" "}
                {product.reviewCount.toLocaleString()} satisfied customers. Backed by NexCart&apos;s quality guarantee and easy
                return policy.
              </p>
            </div>

            {/* Q&A */}
            <ProductQA productId={product.id} />

            {/* Reviews */}
            <ReviewsSection productId={product.id} />
          </div>

          {/* Recommendations */}
          <Recommendations currentProduct={product} allProducts={ALL_PRODUCTS} format={format} />
        </div>
      </main>
      <Footer />
    </>
  );
}
