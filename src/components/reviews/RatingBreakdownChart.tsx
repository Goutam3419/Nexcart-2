import { Star } from "lucide-react";
import type { RatingBreakdown } from "@/types";

interface RatingBreakdownChartProps {
  breakdown: RatingBreakdown;
  average: number;
  totalCount: number;
}

export function RatingBreakdownChart({ breakdown, average, totalCount }: RatingBreakdownChartProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6">
      {/* Average score */}
      <div className="flex flex-col items-center justify-center shrink-0 sm:w-40">
        <p className="text-4xl font-bold text-gray-900 dark:text-white">{average || "—"}</p>
        <div className="flex items-center gap-0.5 mt-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={14}
              className={s <= Math.round(average) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">{totalCount} review{totalCount !== 1 ? "s" : ""}</p>
      </div>

      {/* Breakdown bars */}
      <div className="flex-1 space-y-1.5">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = breakdown[star];
          const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-8 text-gray-500 dark:text-gray-400 shrink-0">{star} ★</span>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-8 text-right text-gray-400 shrink-0">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
