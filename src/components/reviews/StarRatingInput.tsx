"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}

export function StarRatingInput({ value, onChange, size = 28 }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={cn(
              "transition-colors",
              (hovered || value) >= star ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 dark:fill-gray-800 text-gray-300 dark:text-gray-700"
            )}
          />
        </button>
      ))}
    </div>
  );
}
