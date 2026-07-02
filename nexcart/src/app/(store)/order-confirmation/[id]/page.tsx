"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Package, MapPin, CreditCard, Download, ArrowRight, Copy, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getOrderById } from "@/lib/checkout/orderService";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/components/ui/Toast";
import type { Order } from "@/types";

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { format } = useCurrency();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getOrderById(id).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    showToast("Order ID copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">Loading your order...</p>
            </div>
          ) : (
            <>
              {/* Success header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5 animate-fade-in">
                  <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Order Placed Successfully!
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thank you for shopping with NexCart. Your order is confirmed.
                </p>
              </div>

              {/* Order ID card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                  <p className="font-mono font-bold text-gray-900 dark:text-white">{id}</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {order ? (
                <>
                  {/* Items */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Package size={16} className="text-brand-600" />
                      <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Order Items</h2>
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-50 dark:border-gray-800 last:border-0 last:pb-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{format(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Subtotal</span><span>{format(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Shipping</span><span>{order.shippingCost === 0 ? "FREE" : format(order.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-1.5">
                        <span>Total</span><span>{format(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping + Payment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={15} className="text-brand-600" />
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Shipping Address</h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {order.shippingAddress.name}<br />
                        {order.shippingAddress.line1}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard size={15} className="text-brand-600" />
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Payment</h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        Method: {(order as unknown as { paymentMethod?: string }).paymentMethod ?? "COD"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Status: <span className="font-semibold capitalize text-gray-700 dark:text-gray-300">{order.paymentStatus}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Estimated delivery: {estimatedDelivery.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Order details are being processed. You'll receive a confirmation email shortly.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/track-order/${id}`} className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-brand-600/30 text-sm">
                  Track Order <ArrowRight size={15} />
                </Link>
                <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm">
                  <Download size={15} /> Download Invoice
                </button>
              </div>
              <Link href="/" className="block text-center mt-4 text-sm text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                Continue Shopping
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
