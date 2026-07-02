"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, ShieldCheck, MessageCircle } from "lucide-react";
import { voteReviewHelpful } from "@/lib/reviews/reviewService";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [helpful, setHelpful] = useState(review.helpfulCount);
  const [notHelpful, setNotHelpful] = useState(review.notHelpfulCount);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const handleVote = async (isHelpful: boolean) => {
    if (voted) return;
    setVoted(isHelpful ? "up" : "down");
    if (isHelpful) setHelpful((h) => h + 1);
    else setNotHelpful((n) => n + 1);
    try {
      await voteReviewHelpful(review.id, isHelpful);
    } catch {
      // Firestore may not be configured — local vote still reflected
    }
  };

  const initials = review.customerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 py-5 last:border-0">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm text-gray-900 dark:text-white">{review.customerName}</p>
            {review.isVerifiedPurchase && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                <ShieldCheck size={10} /> Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"} />
              ))}
            </div>
            <span className="text-xs text-gray-400">{review.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {review.title && <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{review.title}</p>}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{review.comment}</p>

      {review.images.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-100 dark:border-gray-800" />
          ))}
        </div>
      )}

      {/* Admin reply */}
      {review.adminReply && (
        <div className="flex items-start gap-2 bg-brand-50 dark:bg-brand-950/20 rounded-xl p-3 mb-3 ml-4">
          <MessageCircle size={14} className="text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-brand-700 dark:text-brand-400 mb-0.5">NexCart Team Response</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{review.adminReply}</p>
          </div>
        </div>
      )}

      {/* Helpful votes */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">Was this helpful?</span>
        <button
          onClick={() => handleVote(true)}
          disabled={!!voted}
          className={cn("flex items-center gap-1 text-xs font-medium transition-colors", voted === "up" ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600")}
        >
          <ThumbsUp size={12} /> {helpful}
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={!!voted}
          className={cn("flex items-center gap-1 text-xs font-medium transition-colors", voted === "down" ? "text-rose-600" : "text-gray-500 hover:text-rose-600")}
        >
          <ThumbsDown size={12} /> {notHelpful}
        </button>
      </div>
    </div>
  );
}
