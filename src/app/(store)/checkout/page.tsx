"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Edit2, ArrowLeft, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { AddressForm } from "@/components/checkout/AddressForm";
import { DeliverySelector, deliveryOptions } from "@/components/checkout/DeliverySelector";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { CouponInput } from "@/components/checkout/CouponInput";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { placeOrder } from "@/lib/checkout/orderService";
import { calculateOrderTotal } from "@/lib/checkout/couponEngine";
import type { Address, CheckoutStep, DeliveryMethod, PaymentMethod, AppliedCoupon, OrderItem } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { format } = useCurrency();
  const { appUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<Address | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [placing, setPlacing] = useState(false);

  const shippingCost = deliveryOptions.find((d) => d.id === deliveryMethod)?.price ?? 0;
  const { discount, total } = calculateOrderTotal(totalPrice, shippingCost, appliedCoupon);

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center py-16 px-4">
            <ShoppingBag size={64} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add products before checking out.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-brand-600/30">
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleAddressSubmit = (addr: Address) => {
    setAddress(addr);
    setStep("delivery");
  };

  const handlePlaceOrder = async () => {
    if (!address) return;
    setPlacing(true);

    const orderItems: OrderItem[] = items.map(({ product, quantity }) => ({
      productId: product.id,
      productType: "my_product",
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
    }));

    try {
      const order = await placeOrder({
        customerId: appUser?.uid ?? "guest",
        customerName: address.name,
        customerEmail: appUser?.email ?? "guest@nexcart.com",
        items: orderItems,
        shippingAddress: address,
        deliveryMethod,
        paymentMethod,
        subtotal: totalPrice,
        shippingCost,
        discount,
        couponCode: appliedCoupon?.code,
        total,
      });

      clearCart();
      showToast("Order placed successfully! 🎉", "success");
      router.push(`/order-confirmation/${order.id}`);
    } catch {
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Checkout</h1>
          <CheckoutSteps currentStep={step} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                {/* Step: Address */}
                {step === "address" && (
                  <>
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
                    <AddressForm onSubmit={handleAddressSubmit} submitLabel="Continue to Delivery" />
                  </>
                )}

                {/* Step: Delivery */}
                {step === "delivery" && address && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-gray-900 dark:text-white">Delivery Address</h2>
                      <button onClick={() => setStep("address")} className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                        <Edit2 size={12} /> Edit
                      </button>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                      <MapPin size={16} className="text-brand-600 mt-0.5 shrink-0" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-semibold text-gray-900 dark:text-white">{address.name} · {address.phone}</p>
                        <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                        <p>{address.city}, {address.state} {address.pincode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>

                    <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Select Delivery Method</h2>
                    <DeliverySelector selected={deliveryMethod} onSelect={setDeliveryMethod} />

                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setStep("address")} className="flex items-center gap-2 px-5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm">
                        <ArrowLeft size={15} /> Back
                      </button>
                      <button onClick={() => setStep("payment")} className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-brand-600/30">
                        Continue to Payment <ArrowRight size={15} />
                      </button>
                    </div>
                  </>
                )}

                {/* Step: Payment */}
                {step === "payment" && (
                  <>
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Select Payment Method</h2>
                    <PaymentSelector selected={paymentMethod} onSelect={setPaymentMethod} />

                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setStep("delivery")} className="flex items-center gap-2 px-5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm">
                        <ArrowLeft size={15} /> Back
                      </button>
                      <button onClick={() => setStep("review")} className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-brand-600/30">
                        Review Order <ArrowRight size={15} />
                      </button>
                    </div>
                  </>
                )}

                {/* Step: Review */}
                {step === "review" && address && (
                  <>
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Review Your Order</h2>

                    {/* Items */}
                    <div className="space-y-3 mb-6">
                      {items.map(({ product, quantity }) => (
                        <div key={product.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400">Qty: {quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{format(product.price * quantity)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Address summary */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">Shipping to:</p>
                      <p className="text-gray-600 dark:text-gray-400">{address.name}, {address.line1}, {address.city}, {address.state} {address.pincode}, {address.country}</p>
                    </div>

                    {/* Coupon */}
                    <div className="mb-6">
                      <CouponInput orderTotal={totalPrice} appliedCoupon={appliedCoupon} onApply={setAppliedCoupon} />
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setStep("payment")} className="flex items-center gap-2 px-5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm">
                        <ArrowLeft size={15} /> Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-accent/30"
                      >
                        {placing ? <Loader2 size={16} className="animate-spin" /> : null}
                        {placing ? "Placing Order..." : `Place Order — ${format(total)}`}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-20">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                <div className="space-y-2.5 text-sm mb-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{format(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-emerald-600 font-semibold" : ""}>
                      {shippingCost === 0 ? "FREE" : format(shippingCost)}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Coupon ({appliedCoupon.code})</span>
                      <span>-{format(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-2.5 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                    <span>Total</span>
                    <span>{format(total)}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2.5 text-[11px] text-gray-400">
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
