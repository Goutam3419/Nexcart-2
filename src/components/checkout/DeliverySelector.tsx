"use client";

import { Truck, Zap, Check } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import type { DeliveryMethod, DeliveryOption } from "@/types";

const OPTIONS: DeliveryOption[] = [
  { id: "standard", label: "Standard Delivery", description: "Reliable and economical", price: 0, estimatedDays: "5-7 business days" },
  { id: "express", label: "Express Delivery", description: "Get it faster", price: 9.99, estimatedDays: "1-2 business days" },
];

interface DeliverySelectorProps {
  selected: DeliveryMethod;
  onSelect: (method: DeliveryMethod) => void;
}

export function DeliverySelector({ selected, onSelect }: DeliverySelectorProps) {
  const { format } = useCurrency();

  return (
    <div className="space-y-3">
      {OPTIONS.map((option) => {
        const Icon = option.id === "express" ? Zap : Truck;
        const isSelected = selected === option.id;
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
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{option.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{option.description} · {option.estimatedDays}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-sm text-gray-900 dark:text-white">
                {option.price === 0 ? "FREE" : format(option.price)}
              </p>
              {isSelected && <Check size={16} className="text-brand-600 ml-auto mt-1" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export { OPTIONS as deliveryOptions };
