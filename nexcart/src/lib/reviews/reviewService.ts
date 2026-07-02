import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Review, RatingBreakdown, ReviewSortOption } from "@/types";

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", productId),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        adminReplyAt: data.adminReplyAt ? toDate(data.adminReplyAt) : undefined,
      } as Review;
    });
  } catch {
    return [];
  }
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        adminReplyAt: data.adminReplyAt ? toDate(data.adminReplyAt) : undefined,
      } as Review;
    });
  } catch {
    return [];
  }
}

export async function addReview(
  data: Omit<Review, "id" | "createdAt" | "updatedAt" | "helpfulCount" | "notHelpfulCount" | "status">
): Promise<string> {
  const ref = await addDoc(collection(db, "reviews"), {
    ...data,
    helpfulCount: 0,
    notHelpfulCount: 0,
    status: "approved", // auto-approve; admin can moderate afterwards
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateReviewStatus(id: string, status: Review["status"]): Promise<void> {
  await updateDoc(doc(db, "reviews", id), { status, updatedAt: serverTimestamp() });
}

export async function replyToReview(id: string, reply: string): Promise<void> {
  await updateDoc(doc(db, "reviews", id), {
    adminReply: reply,
    adminReplyAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function voteReviewHelpful(id: string, helpful: boolean): Promise<void> {
  await updateDoc(doc(db, "reviews", id), {
    [helpful ? "helpfulCount" : "notHelpfulCount"]: increment(1),
  });
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, "reviews", id));
}

// ─── Rating Breakdown ─────────────────────────────────────────────────────────

export function calculateRatingBreakdown(reviews: Review[]): RatingBreakdown {
  const breakdown: RatingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const rounded = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
    if (rounded >= 1 && rounded <= 5) breakdown[rounded]++;
  });
  return breakdown;
}

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
}

export function sortReviews(reviews: Review[], sortBy: ReviewSortOption): Review[] {
  const sorted = [...reviews];
  switch (sortBy) {
    case "recent":
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    case "highest":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "lowest":
      return sorted.sort((a, b) => a.rating - b.rating);
    case "helpful":
      return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
    default:
      return sorted;
  }
}
