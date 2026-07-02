"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Circle, Package, MapPin, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getOrderById, buildOrderTimeline } from "@/lib/checkout/orderService";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import type { Order, OrderTimelineEvent } from "@/types";

const MOCK_ORDER: Order = {
  id: "NC-DEMO-0001",
  customerId: "guest",
  customerName: "Guest Customer",
  customerEmail: "guest@nexcart.com",
  items: [
    { productId: "p1", productType: "my_product", name: "Sample Product", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200", price: 49.99, quantity: 1 },
  ],
  subtotal: 49.99,
  shippingCost: 0,
  total: 49.99,
  status: "processing",
  paymentStatus: "paid",
  shippingAddress: { name: "Guest Customer", phone: "9999999999", line1: "123 Main St", city: "Mumbai", state: "Maharashtra", pincode: "400001", country: "India" },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function TrackOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { format } = useCurrency();
  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<OrderTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then((data) => {
      const finalOrder = data ?? { ...MOCK_ORDER, id };
      setOrder(finalOrder);
      setTimeline(buildOrderTimeline(finalOrder.status, finalOrder.createdAt));
      setLoading(false);
    });
  }, [id]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 mb-4">
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">Track Your Order</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-mono">{id}</p>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : order ? (
            <>
              {/* Timeline */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-5">
                <div className="flex items-center gap-2 mb-6">
                  <Package size={16} className="text-brand-600" />
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Order Status</h2>
                </div>

                <div className="space-y-0">
                  {timeline.map((event, i) => (
                    <div key={event.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10",
                          event.completed ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        )}>
                          {event.completed ? <CheckCircle size={16} /> : <Circle size={14} />}
                        </div>
                        {i < timeline.length - 1 && (
                          <div className={cn("w-0.5 h-12 -mt-0.5", event.completed ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700")} />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className={cn("text-sm font-semibold", event.completed ? "text-gray-900 dark:text-white" : "text-gray-400")}>
                          {event.label}
                        </p>
                        {event.completed && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {event.timestamp.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {event.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={15} className="text-brand-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Delivering To</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.line1}, {order.shippingAddress.city}<br />
                  {order.shippingAddress.state} {order.shippingAddress.pincode}, {order.shippingAddress.country}
                </p>
              </div>

              {/* Items summary */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Items ({order.items.length})</h3>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 line-clamp-1">{item.name} × {item.quantity}</span>
                      <span className="font-semibold text-gray-900 dark:text-white shrink-0 ml-2">{format(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between font-bold text-gray-900 dark:text-white">
                  <span>Total</span><span>{format(order.total)}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
