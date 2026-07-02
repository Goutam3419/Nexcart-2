import type { Coupon, AppliedCoupon } from "@/types";

export const DEMO_COUPONS: Coupon[] = [
  {
    id: "c1",
    code: "WELCOME15",
    type: "percentage",
    value: 15,
    minOrderValue: 30,
    maxDiscount: 50,
    expiryDate: new Date("2026-12-31"),
    usageLimit: 1000,
    usedCount: 342,
    isActive: true,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "c2",
    code: "FLAT200",
    type: "fixed",
    value: 2.4,
    minOrderValue: 50,
    expiryDate: new Date("2026-12-31"),
    usageLimit: 500,
    usedCount: 120,
    isActive: true,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "c3",
    code: "NEXCART50",
    type: "percentage",
    value: 50,
    minOrderValue: 100,
    maxDiscount: 30,
    expiryDate: new Date("2026-08-01"),
    usageLimit: 200,
    usedCount: 198,
    isActive: true,
    createdAt: new Date("2026-01-01"),
  },
];

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  discount: number;
  coupon?: Coupon;
}

export function validateCoupon(code: string, orderTotal: number, coupons: Coupon[] = DEMO_COUPONS): CouponValidationResult {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code", discount: 0 };
  }
  if (!coupon.isActive) {
    return { valid: false, message: "This coupon is no longer active", discount: 0 };
  }
  if (new Date() > coupon.expiryDate) {
    return { valid: false, message: "This coupon has expired", discount: 0 };
  }
  if (coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has reached its usage limit", discount: 0 };
  }
  if (orderTotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `Minimum order value of ${coupon.minOrderValue} required`,
      discount: 0,
    };
  }

  let discount = coupon.type === "percentage" ? (orderTotal * coupon.value) / 100 : coupon.value;

  if (coupon.type === "percentage" && coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  return {
    valid: true,
    message: `Coupon applied! You saved ${discount.toFixed(2)}`,
    discount: parseFloat(discount.toFixed(2)),
    coupon,
  };
}

export function calculateOrderTotal(
  subtotal: number,
  shippingCost: number,
  appliedCoupon: AppliedCoupon | null
): { discount: number; total: number } {
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal + shippingCost - discount);
  return { discount, total };
}
