"use client";

import { useEffect, useState } from "react";
import { Star, Check, X, MessageCircle, Trash2, Search } from "lucide-react";
import { getAllReviews, updateReviewStatus, replyToReview, deleteReview } from "@/lib/reviews/reviewService";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

const MOCK_REVIEWS: Review[] = [
  { id: "r1", productId: "p1", customerId: "u1", customerName: "Priya Sharma", rating: 5, title: "Excellent quality!", comment: "Really happy with this purchase.", images: [], isVerifiedPurchase: true, helpfulCount: 24, notHelpfulCount: 1, status: "approved", createdAt: new Date("2026-06-15"), updatedAt: new Date("2026-06-15") },
  { id: "r2", productId: "p2", customerId: "u2", customerName: "Rahul Mehta", rating: 2, title: "Not as expected", comment: "The product quality did not match the description.", images: [], isVerifiedPurchase: true, helpfulCount: 3, notHelpfulCount: 8, status: "pending", createdAt: new Date("2026-06-20"), updatedAt: new Date("2026-06-20") },
  { id: "r3", productId: "p1", customerId: "u3", customerName: "Anita Verma", rating: 5, title: "", comment: "Perfect! Exactly what I was looking for.", images: [], isVerifiedPurchase: false, helpfulCount: 8, notHelpfulCount: 0, status: "approved", createdAt: new Date("2026-06-08"), updatedAt: new Date("2026-06-08") },
];

const STATUS_STYLE: Record<Review["status"], string> = {
  approved: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  rejected: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
};

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Review["status"] | "all">("all");
  const [replyTarget, setReplyTarget] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  useEffect(() => {
    getAllReviews()
      .then((data) => setReviews(data.length > 0 ? data : MOCK_REVIEWS))
      .catch(() => setReviews(MOCK_REVIEWS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reviews.filter((r) => {
    const matchSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (review: Review, status: Review["status"]) => {
    try { await updateReviewStatus(review.id, status); } catch { /* demo mode */ }
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, status } : r));
    showToast(`Review ${status}`, status === "approved" ? "success" : "info");
  };

  const handleReply = async () => {
    if (!replyTarget || !replyText.trim()) return;
    try { await replyToReview(replyTarget.id, replyText); } catch { /* demo mode */ }
    setReviews((prev) => prev.map((r) => r.id === replyTarget.id ? { ...r, adminReply: replyText, adminReplyAt: new Date() } : r));
    showToast("Reply posted", "success");
    setReplyTarget(null);
    setReplyText("");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await deleteReview(deleteTarget.id); } catch { /* demo mode */ }
    setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    showToast("Review deleted", "success");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Reviews Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{reviews.length} total reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: reviews.length, color: "text-gray-900 dark:text-white" },
          { label: "Approved", value: reviews.filter((r) => r.status === "approved").length, color: "text-emerald-600" },
          { label: "Pending", value: reviews.filter((r) => r.status === "pending").length, color: "text-yellow-600" },
          { label: "Avg Rating", value: reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—", color: "text-brand-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" placeholder="Search reviews..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 transition-all w-56" />
        </div>
        {(["all", "approved", "pending", "rejected"] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={cn("text-xs font-semibold px-3 py-2 rounded-lg capitalize transition-all", statusFilter === s ? "bg-brand-600 text-white" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400")}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"><TableSkeleton rows={4} cols={6} /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"><EmptyState icon={Star} title="No reviews found" description="Reviews will appear here once customers start reviewing products" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.customerName}</p>
                    <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-semibold capitalize", STATUS_STYLE[review.status])}>{review.status}</span>
                    {review.isVerifiedPurchase && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">✓ Verified</span>}
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">{review.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {review.status !== "approved" && (
                    <button onClick={() => handleStatusChange(review, "approved")} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors" title="Approve"><Check size={15} /></button>
                  )}
                  {review.status !== "rejected" && (
                    <button onClick={() => handleStatusChange(review, "rejected")} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors" title="Reject"><X size={15} /></button>
                  )}
                  <button onClick={() => { setReplyTarget(review); setReplyText(review.adminReply ?? ""); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors" title="Reply"><MessageCircle size={15} /></button>
                  <button onClick={() => setDeleteTarget(review)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors" title="Delete"><Trash2 size={15} /></button>
                </div>
              </div>
              {review.title && <p className="font-medium text-sm text-gray-900 dark:text-white mb-1">{review.title}</p>}
              <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
              {review.adminReply && (
                <div className="mt-3 ml-4 bg-brand-50 dark:bg-brand-950/20 rounded-xl p-3">
                  <p className="text-xs font-semibold text-brand-700 dark:text-brand-400 mb-0.5">Your Reply</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{review.adminReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply modal */}
      {replyTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md p-6 animate-fade-in">
            <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-4">Reply to Review</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 italic">&ldquo;{replyTarget.comment}&rdquo;</p>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              placeholder="Write your response..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={handleReply} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-brand-600/30">Post Reply</button>
              <button onClick={() => { setReplyTarget(null); setReplyText(""); }} className="px-5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete Review" message="Delete this review permanently? This cannot be undone." confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
