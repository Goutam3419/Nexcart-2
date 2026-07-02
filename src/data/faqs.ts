import type { Faq } from "@/types";

export const faqs: Faq[] = [
  {
    id: "f1",
    question: "How do I track my order?",
    answer: "Go to 'My Orders' in your account, select the order, and click 'Track Order'. You'll see a live status timeline showing Confirmed, Processing, Shipped, and Delivered stages.",
    category: "Orders",
    order: 1,
  },
  {
    id: "f2",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy on most items. Products must be unused and in original packaging. Go to 'My Orders' and select 'Request Return' on the eligible order.",
    category: "Returns",
    order: 2,
  },
  {
    id: "f3",
    question: "How long does delivery take?",
    answer: "Standard delivery takes 5-7 business days. Express delivery (available at checkout) takes 1-2 business days depending on your location.",
    category: "Orders",
    order: 3,
  },
  {
    id: "f4",
    question: "What payment methods do you accept?",
    answer: "We accept Cash on Delivery (COD), UPI, Credit/Debit Cards, and Net Banking. All online payments are processed securely.",
    category: "Payments",
    order: 4,
  },
  {
    id: "f5",
    question: "How do I apply a coupon code?",
    answer: "At checkout, during the 'Review' step, you'll find a coupon input field. Enter your code and click 'Apply' to see the discount reflected in your order total.",
    category: "Payments",
    order: 5,
  },
  {
    id: "f6",
    question: "Can I change my delivery address after placing an order?",
    answer: "Address changes are possible only before the order is shipped. Please contact support immediately with your order ID if you need to update the address.",
    category: "Orders",
    order: 6,
  },
  {
    id: "f7",
    question: "How do I create a supplier/seller account?",
    answer: "Currently, seller onboarding is managed by our admin team. Please reach out via the Contact Us page and our team will guide you through the process.",
    category: "Account",
    order: 7,
  },
  {
    id: "f8",
    question: "Is my payment information secure?",
    answer: "Yes. All transactions are processed through secure, PCI-DSS compliant payment gateways. We never store your card details on our servers.",
    category: "Payments",
    order: 8,
  },
  {
    id: "f9",
    question: "How do I write a product review?",
    answer: "Once your order is delivered, go to 'My Orders', find the product, and click 'Write a Review'. You can rate the product and optionally add photos.",
    category: "Products",
    order: 9,
  },
  {
    id: "f10",
    question: "What if I receive a damaged product?",
    answer: "We're sorry for the inconvenience! Please raise a support ticket with photos of the damaged item within 48 hours of delivery, and we'll arrange a replacement or refund.",
    category: "Returns",
    order: 10,
  },
];

export const faqCategories = Array.from(new Set(faqs.map((f) => f.category)));
