import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Order, PlaceOrderPayload, OrderStatus, OrderTimelineEvent } from "@/types";

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NC-${timestamp}-${random}`;
}

/**
 * Places an order: creates the Firestore order document.
 * Falls back to a locally-generated order (for demo/offline mode) if Firestore is unavailable.
 */
export async function placeOrder(payload: PlaceOrderPayload): Promise<Order> {
  const orderId = generateOrderId();
  const paymentStatus = payload.paymentMethod === "cod" ? "pending" : "paid";

  const orderData = {
    customerId: payload.customerId,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    items: payload.items,
    subtotal: payload.subtotal,
    shippingCost: payload.shippingCost,
    discount: payload.discount,
    couponCode: payload.couponCode ?? null,
    total: payload.total,
    status: "confirmed" as OrderStatus,
    paymentStatus,
    paymentMethod: payload.paymentMethod,
    shippingAddress: payload.shippingAddress,
    deliveryMethod: payload.deliveryMethod,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    const ref = await addDoc(collection(db, "orders"), orderData);
    return {
      id: ref.id,
      ...orderData,
      couponCode: payload.couponCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Order;
  } catch {
    // Fallback — Firestore not configured, return a local order object
    return {
      id: orderId,
      ...orderData,
      couponCode: payload.couponCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Order;
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const snap = await getDoc(doc(db, "orders", orderId));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    } as Order;
  } catch {
    return null;
  }
}

export function buildOrderTimeline(status: OrderStatus, createdAt: Date): OrderTimelineEvent[] {
  const stages: { status: OrderStatus; label: string; offsetHours: number }[] = [
    { status: "confirmed", label: "Order Confirmed", offsetHours: 0 },
    { status: "processing", label: "Processing", offsetHours: 2 },
    { status: "shipped", label: "Shipped", offsetHours: 24 },
    { status: "delivered", label: "Delivered", offsetHours: 96 },
  ];

  const statusOrder: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const currentIndex = statusOrder.indexOf(status);

  return stages.map((stage, i) => ({
    status: stage.status,
    label: stage.label,
    timestamp: new Date(createdAt.getTime() + stage.offsetHours * 60 * 60 * 1000),
    completed: statusOrder.indexOf(stage.status) <= currentIndex,
  }));
}

export async function updateOrderPaymentStatus(orderId: string, status: "paid" | "failed"): Promise<void> {
  try {
    await updateDoc(doc(db, "orders", orderId), { paymentStatus: status, updatedAt: serverTimestamp() });
  } catch {
    // Firestore may not be configured — no-op in demo mode
  }
}
