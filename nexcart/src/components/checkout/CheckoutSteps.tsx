import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutStep } from "@/types";

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: "address", label: "Address" },
  { key: "delivery", label: "Delivery" },
  { key: "payment", label: "Payment" },
  { key: "review", label: "Review" },
];

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                i < currentIndex
                  ? "bg-emerald-500 text-white"
                  : i === currentIndex
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400"
              )}
            >
              {i < currentIndex ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={cn(
                "text-[11px] font-semibold hidden sm:block",
                i <= currentIndex ? "text-gray-900 dark:text-white" : "text-gray-400"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn("w-8 sm:w-16 h-0.5 transition-colors", i < currentIndex ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700")} />
          )}
        </div>
      ))}
    </div>
  );
}
