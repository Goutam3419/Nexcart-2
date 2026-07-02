"use client";

import { useState } from "react";
import { Tag, X, Check, Loader2 } from "lucide-react";
import { validateCoupon } from "@/lib/checkout/couponEngine";
import { cn } from "@/lib/utils";
import type { AppliedCoupon } from "@/types";

interface CouponInputProps {
  orderTotal: number;
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon | null) => void;
}

export function CouponInput({ orderTotal, appliedCoupon, onApply }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 500)); // simulate check

    const result = validateCoupon(code, orderTotal);
    if (result.valid && result.coupon) {
      onApply({ code: result.coupon.code, discount: result.discount, type: result.coupon.type });
      setCode("");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleRemove = () => {
    onApply(null);
    setError("");
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{appliedCoupon.code} applied</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">You saved {appliedCoupon.discount.toFixed(2)}</p>
          </div>
        </div>
        <button onClick={handleRemove} className="text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApply())}
            placeholder="Enter coupon code"
            className={cn(
              "w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all",
              error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/20" : "border-gray-200 dark:border-gray-700 focus:border-brand-400 focus:ring-brand-500/20"
            )}
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
        </button>
      </div>
      {error && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5">{error}</p>}
      <p className="text-xs text-gray-400 mt-1.5">Try: WELCOME15, FLAT200, or NEXCART50</p>
    </div>
  );
}
