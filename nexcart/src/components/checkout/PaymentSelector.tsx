"use client";

import { Wallet, CreditCard, Smartphone, Building2, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

const OPTIONS: PaymentOption[] = [
  { id: "cod", label: "Cash on Delivery", description: "Pay when your order arrives", icon: Wallet },
  { id: "upi", label: "UPI", description: "Google Pay, PhonePe, Paytm", icon: Smartphone, badge: "Popular" },
  { id: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "razorpay", label: "Net Banking", description: "All major Indian banks", icon: Building2 },
];

interface PaymentSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentSelector({ selected, onSelect }: PaymentSelectorProps) {
  return (
    <div className="space-y-3">
      {OPTIONS.map((option) => {
        const isSelected = selected === option.id;
        const Icon = option.icon;
        const isReady = option.id === "cod"; // Only COD fully functional without gateway keys

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
              isSelected
                ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}
          >
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", isSelected ? "bg-brand-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500")}>
              <Icon size={19} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{option.label}</p>
                {option.badge && (
                  <span className="text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded">
                    {option.badge}
                  </span>
                )}
                {!isReady && (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                    <Zap size={9} /> Gateway ready
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
            </div>
            {isSelected && <Check size={18} className="text-brand-600 shrink-0" />}
          </button>
        );
      })}

      <p className="text-xs text-gray-400 pt-2 flex items-center gap-1.5">
        <Zap size={11} /> Card, UPI &amp; Net Banking activate automatically once payment gateway keys are added.
      </p>
    </div>
  );
}
