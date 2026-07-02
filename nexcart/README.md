# NexCart — Module 02

A production-ready ecommerce platform built with Next.js 15, TypeScript, Tailwind CSS, and Firebase.

## ✨ What's included

### Module 01 (Storefront)
- Responsive homepage with Hero, Featured Categories, Trending Products, Newsletter
- Professional Header with search, cart, wishlist, dark/light mode
- Professional Footer with trust bar, social links, sitemap

### Module 02 (Auth + Admin + Customer)
- **Authentication** — Login, Register, Forgot Password, Email Verification, Persistent Login
- **User Roles** — Admin & Customer stored in Firestore
- **Admin Panel** — Full sidebar dashboard with:
  - Dashboard with KPI stats and recent orders
  - My Products (CRUD)
  - Dropshipping Products (read-only, supplier-imported)
  - Add Product with image upload to Firebase Storage
  - Categories management
  - Orders management with status updates
  - Customers management with role control
  - Suppliers page (Baap Store, Meesho, Udaan, IndiaMART, TradeIndia, CJ Dropshipping, AliExpress)
  - Reports with revenue chart
  - Settings
- **Customer Panel** — Profile, Wishlist, Orders, Addresses

## 🚀 Getting Started

### 1. Clone
```bash
git clone https://github.com/yourusername/nexcart.git
cd nexcart
```

### 2. Install
```bash
npm install
```

### 3. Environment variables
```bash
cp .env.example .env.local
# Fill in your Firebase values
```

### 4. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔥 Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a project
3. Enable **Authentication** (Email/Password provider)
4. Enable **Firestore Database**
5. Enable **Storage**
6. Go to **Project Settings → General → Your apps** → Add Web App
7. Copy config values into `.env.local`

### Firestore Collections (auto-created on first write)
| Collection | Description |
|---|---|
| `users` | uid, name, email, role, emailVerified, createdAt |
| `my_products` | Admin-owned products |
| `dropshipping_products` | Supplier-imported products |
| `suppliers` | Supplier status and metadata |
| `orders` | Customer orders |
| `categories` | Product categories |
| `settings` | Store configuration |

### First Admin User
After registering, manually set `role: "admin"` in Firestore for your user document to access the admin panel at `/dashboard`.

## 📁 Project Structure

```
nexcart/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, Register, Forgot Password, Verify Email
│   │   ├── (admin)/             # Admin panel (dashboard, products, orders, etc.)
│   │   ├── (customer)/          # Customer panel (profile, wishlist, orders, addresses)
│   │   ├── layout.tsx           # Root layout — ThemeProvider + AuthProvider
│   │   └── page.tsx             # Storefront homepage
│   ├── components/
│   │   ├── admin/layout/        # AdminSidebar, AdminTopbar
│   │   ├── admin/dashboard/     # StatCard, RecentOrdersTable
│   │   ├── auth/                # AuthGuard
│   │   ├── customer/            # CustomerSidebar
│   │   ├── home/                # HeroBanner, FeaturedCategories, TrendingProducts, etc.
│   │   ├── layout/              # Header, Footer
│   │   ├── shared/              # ThemeToggle, SearchBar
│   │   └── ui/                  # Button, Badge, StarRating
│   ├── context/
│   │   └── AuthContext.tsx      # Global auth state (firebaseUser + appUser)
│   ├── data/                    # Dummy data for storefront
│   ├── hooks/                   # useCart, useWishlist
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts        # Firebase init
│   │   │   ├── auth.ts          # Auth service (register, login, logout, etc.)
│   │   │   ├── firestore.ts     # Firestore service layer
│   │   │   └── storage.ts       # Firebase Storage helpers
│   │   └── utils/               # cn(), formatCurrency(), calculateDiscount()
│   ├── middleware.ts             # Route protection
│   └── types/                   # All TypeScript interfaces
├── .env.example
├── .gitignore
├── README.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## 🛠 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check |

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add all `NEXT_PUBLIC_FIREBASE_*` env vars in Vercel dashboard
4. Deploy

## 🗺 Roadmap

| Module | Status |
|---|---|
| Module 01 — Storefront | ✅ Done |
| Module 02 — Auth + Admin + Products | ✅ Done |
| Module 03 — Baap Store API + CSV Import | 🔜 Next |
| Module 04 — Cart + Checkout + Payments | 🔜 Planned |
| Module 05 — SEO + Performance + PWA | 🔜 Planned |

## 📄 License

MIT © NexCart

## Module 03 — Universal Supplier Engine

### New Pages Added
| Page | Route |
|---|---|
| Supplier Connections | `/supplier-connections` |
| Supplier Products | `/supplier-products` |
| CSV Imports | `/csv-imports` |
| API Connections | `/api-connections` |
| Profit Rules | `/profit-rules` |
| Import History | `/import-history` |
| Sync History | `/sync-history` |

### New Collections (Firestore)
`suppliers` · `supplier_products` · `csv_imports` · `api_connections` · `profit_rules` · `supplier_logs` · `sync_history` · `scheduler_jobs`

### New Features
- Universal CSV Import Wizard (drag & drop, column mapping, preview, bulk import)
- REST API Connector (GET/POST/PUT/PATCH/DELETE, bearer/API key auth, pagination, retry)
- Profit Rules Engine (global/supplier/category, fixed/percentage, live preview)
- Supplier Products table (bulk publish/unpublish/delete, export CSV, pagination)
- Import History with error report download
- Sync History with duration tracking
- Toast notification system
- Skeleton loaders, Empty states, Pagination, ConfirmDialog reusable components

### Architecture Ready For
Baap Store · Meesho · Udaan · IndiaMART · TradeIndia · CJ Dropshipping · AliExpress · Spocket · Zendrop · HyperSKU · Printful · Printify

## Module 04 — Flipkart-Style Storefront + Cart + Dual Currency

### New Pages
| Page | Route |
|---|---|
| Product Detail | `/product/[id]` |
| Cart | `/cart` |
| Search & Filters | `/search?q=...` |
| Category Listing | `/category/[slug]` |

### New Features
- **Dual Currency** — Switch between ₹ INR and $ USD anywhere (Header toggle)
- **Flash Deals** — Countdown timer section with live discount badges
- **Category Icons Row** — Horizontal scrollable quick-nav (Flipkart style)
- **Best Sellers / New Arrivals** — Dedicated product rows
- **Top Brands** — Brand grid section
- **Global Cart Context** — Persistent across all pages, synced badge count in Header
- **Global Wishlist Context** — Synced across storefront + customer panel
- **Product Detail Page** — Image gallery, quantity selector, related products, Buy Now
- **Search Page** — Live filters (category, price range, rating), sort options
- **Category Page** — Dynamic category-based product listing

### Architecture Notes
- `CartContext` and `WishlistContext` replace the old per-component `@/hooks` state — now global and shared between Header, Homepage, Product Detail, Cart, Search, and Customer Wishlist pages
- `CurrencyContext` provides `format()` for consistent price display (USD base price × live INR rate)
- All new components are additive — Module 01/02/03 routes and features remain fully intact

## Module 05 — Checkout + Payments + Order Management

### New Pages
| Page | Route |
|---|---|
| Checkout (multi-step) | `/checkout` |
| Order Confirmation | `/order-confirmation/[id]` |
| Track Order | `/track-order/[id]` |

### New Features
- **Smart Address Form** — Country → City/State → Pincode flow, Google Places autocomplete-ready (falls back to manual entry until API key is configured)
- **Multi-step Checkout** — Address → Delivery → Payment → Review, with progress indicator
- **Delivery Options** — Standard (free) / Express (paid), live pricing in cart currency
- **Payment Methods** — COD (fully functional), UPI/Card/Net Banking (gateway-ready, activates once Razorpay keys are added)
- **Coupon Engine** — Percentage/fixed discounts, min order value, expiry, usage limits (try `WELCOME15`, `FLAT200`, `NEXCART50`)
- **Order Placement** — Saves to Firestore `orders` collection, generates unique Order ID, graceful offline fallback
- **Order Confirmation Page** — Full order summary, shipping/payment details, invoice print
- **Order Tracking** — Visual timeline (Confirmed → Processing → Shipped → Delivered)
- **Real Order Data Flow** — Customer "My Orders" and Admin "Orders"/"Dashboard" (built in Module 02) now display real orders placed through checkout — no changes needed there, architecture was already forward-compatible

### New Environment Variable
```
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=   # optional — leave blank for manual address entry
```

### Architecture Notes
- `lib/checkout/orderService.ts` — order creation, retrieval, timeline generation
- `lib/checkout/couponEngine.ts` — coupon validation logic, demo coupons included
- `lib/checkout/useGooglePlaces.ts` — autocomplete hook with automatic fallback when no API key is set
- `data/countries.ts` — 50 countries + all Indian states for address forms

## Module 06 — Reviews + Support + Personalization

### New Pages
| Page | Route |
|---|---|
| Help Center (FAQ + Ticket Form) | `/help-center` |
| Admin Reviews Management | `/reviews` (admin) |
| Admin Support Tickets | `/support-tickets` (admin) |

### New Features
- **Product Reviews & Ratings** — Star rating input, photo upload, verified purchase badge, helpful/not-helpful voting
- **Rating Breakdown Chart** — Visual 5-star distribution bar chart on every product page
- **Admin Review Moderation** — Approve/Reject/Reply to customer reviews
- **Live Search Suggestions** — Autocomplete as you type, recent searches, trending searches, all stored locally
- **Recently Viewed** — Tracks last 10 viewed products (localStorage), shown on homepage as "Continue Browsing"
- **Product Recommendations** — "Customers Also Bought" section based on category + rating
- **Product Q&A** — Ask questions about a product, admin/verified answers displayed inline
- **Live Chat Widget** — Floating chat bubble with FAQ auto-responses and quick-reply buttons
- **Help Center** — Searchable FAQ with category filters + support ticket submission form
- **Support Ticket System** — Customer tickets flow into Admin "Support Tickets" page for response

### New Firestore Collections
`reviews` · `support_tickets`

### Architecture Notes
- `lib/reviews/reviewService.ts` — review CRUD, rating breakdown/average calculation, sorting
- `lib/support/ticketService.ts` — support ticket CRUD
- `lib/search/searchEngine.ts` — live suggestions, recent/trending searches, typo-tolerant "did you mean" (Levenshtein distance)
- `context/RecentlyViewedContext.tsx` — localStorage-backed, works without Firebase
- All Module 06 features gracefully fall back to demo/mock data when Firestore is not yet configured, matching the pattern established in Modules 02-05
