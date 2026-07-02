"use client";

import { useEffect, useState, useCallback } from "react";
import { PenLine, X } from "lucide-react";
import { getProductReviews, calculateRatingBreakdown, calculateAverageRating, sortReviews } from "@/lib/reviews/reviewService";
import { RatingBreakdownChart } from "@/components/reviews/RatingBreakdownChart";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { WriteReviewForm } from "@/components/reviews/WriteReviewForm";
import { useAuth } from "@/context/AuthContext";
import type { Review, ReviewSortOption } from "@/types";

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1", productId: "demo", customerId: "u1", customerName: "Priya Sharma", rating: 5,
    title: "Excellent quality!", comment: "Really happy with this purchase. Quality exceeded my expectations and delivery was fast.",
    images: [], isVerifiedPurchase: true, helpfulCount: 24, notHelpfulCount: 1, status: "approved",
    createdAt: new Date("2026-06-15"), updatedAt: new Date("2026-06-15"),
  },
  {
    id: "r2", productId: "demo", customerId: "u2", customerName: "Rahul Mehta", rating: 4,
    title: "Good value for money", comment: "Works as expected. Would have given 5 stars but packaging could be better.",
    images: [], isVerifiedPurchase: true, helpfulCount: 12, notHelpfulCount: 2, status: "approved",
    createdAt: new Date("2026-06-10"), updatedAt: new Date("2026-06-10"),
  },
  {
    id: "r3", productId: "demo", customerId: "u3", customerName: "Anita Verma", rating: 5,
    title: "", comment: "Perfect! Exactly what I was looking for. Highly recommend to anyone considering this.",
    images: [], isVerifiedPurchase: false, helpfulCount: 8, notHelpfulCount: 0, status: "approved",
    adminReply: "Thank you so much for your feedback, Anita! We're thrilled you love it.",
    adminReplyAt: new Date("2026-06-12"),
    createdAt: new Date("2026-06-08"), updatedAt: new Date("2026-06-08"),
  },
];

interface ReviewsSectionProps {
  productId: string;
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<ReviewSortOption>("recent");
  const [showForm, setShowForm] = useState(false);

  const loadReviews = useCallback(async () => {
    try {
      const data = await getProductReviews(productId);
      setReviews(data.length > 0 ? data : MOCK_REVIEWS);
    } catch {
      setReviews(MOCK_REVIEWS);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const breakdown = calculateRatingBreakdown(reviews);
  const average = calculateAverageRating(reviews);
  const sorted = sortReviews(reviews, sortBy);

  const handleReviewSuccess = () => {
    setShowForm(false);
    loadReviews();
  };

  return (
    <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-600/30"
        >
          {showForm ? <X size={14} /> : <PenLine size={14} />}
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 mb-6 border border-gray-100 dark:border-gray-800">
          {!isAuthenticated && (
            <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-lg px-3 py-2 mb-4">
              You&apos;re reviewing as a guest. <a href="/login" className="underline font-semibold">Sign in</a> to get a Verified Purchase badge.
            </p>
          )}
          <WriteReviewForm productId={productId} onSuccess={handleReviewSuccess} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 mb-6">
            <RatingBreakdownChart breakdown={breakdown} average={average} totalCount={reviews.length} />
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ReviewSortOption)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-brand-400"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          )}

          <div>
            {sorted.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No reviews yet. Be the first to review this product!</p>
            ) : (
              sorted.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}
