"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, totalCount, clearCart } = useCart();
  const { format } = useCurrency();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center py-16 px-4">
            <ShoppingBag size={64} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add some products to get started!</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-brand-600/30">
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const shipping = totalPrice > 75 ? 0 : 9.99;
  const total = totalPrice + shipping;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              My Cart ({totalCount} items)
            </h1>
            <button onClick={clearCart} className="text-sm text-rose-600 dark:text-rose-400 hover:underline font-medium">
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0" />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-brand-500 font-semibold uppercase tracking-wide mb-0.5">{product.category}</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">{product.name}</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{format(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">{format(product.originalPrice)}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <button onClick={() => removeItem(product.id)} className="text-gray-400 hover:text-rose-600 transition-colors">
                      <Trash2 size={15} />
                    </button>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-2 py-1">
                      <button onClick={() => updateQty(product.id, quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold text-gray-900 dark:text-white w-6 text-center">{quantity}</span>
                      <button onClick={() => updateQty(product.id, quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400">
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
                      {format(product.price * quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-20">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Order Summary</h2>
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({totalCount} items)</span>
                    <span>{format(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-emerald-600 font-semibold" : ""}>
                      {shipping === 0 ? "FREE" : format(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400">Add {format(75 - totalPrice)} more for free shipping</p>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                    <span>Total</span>
                    <span>{format(total)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-brand-600/30 text-sm"
                >
                  Proceed to Checkout <ArrowRight size={15} />
                </Link>
                <Link href="/" className="w-full flex items-center justify-center gap-2 mt-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm">
                  Continue Shopping
                </Link>

                {/* Trust badges */}
                <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5"><span>🔒</span> Secure Checkout</div>
                  <div className="flex items-center gap-1.5"><span>🔄</span> Easy Returns</div>
                  <div className="flex items-center gap-1.5"><span>🚚</span> Fast Delivery</div>
                  <div className="flex items-center gap-1.5"><span>💬</span> 24/7 Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
