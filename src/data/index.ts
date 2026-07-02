import type { Product, Category } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
    productCount: 1240,
    href: "/category/electronics",
  },
  {
    id: "2",
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
    productCount: 3820,
    href: "/category/fashion",
  },
  {
    id: "3",
    name: "Home & Living",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    productCount: 980,
    href: "/category/home-living",
  },
  {
    id: "4",
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    productCount: 650,
    href: "/category/beauty",
  },
  {
    id: "5",
    name: "Sports",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80",
    productCount: 420,
    href: "/category/sports",
  },
  {
    id: "6",
    name: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
    productCount: 2100,
    href: "/category/books",
  },
];

export const trendingProducts: Product[] = [
  {
    id: "p1",
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 279.99,
    originalPrice: 349.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    category: "Electronics",
    rating: 4.8,
    reviewCount: 2341,
    badge: "sale",
  },
  {
    id: "p2",
    name: "Premium Leather Crossbody Bag",
    price: 149.00,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    category: "Fashion",
    rating: 4.6,
    reviewCount: 882,
    badge: "new",
  },
  {
    id: "p3",
    name: "Minimalist Ceramic Table Lamp",
    price: 89.99,
    originalPrice: 120.00,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    category: "Home & Living",
    rating: 4.7,
    reviewCount: 413,
    badge: "hot",
  },
  {
    id: "p4",
    name: "Apple Watch Ultra 2",
    price: 799.00,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80",
    category: "Electronics",
    rating: 4.9,
    reviewCount: 5621,
    badge: "limited",
  },
  {
    id: "p5",
    name: "Organic Face Serum Set",
    price: 64.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&q=80",
    category: "Beauty",
    rating: 4.5,
    reviewCount: 1100,
    badge: "sale",
  },
  {
    id: "p6",
    name: "Ultra-Light Running Shoes",
    price: 129.95,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    category: "Sports",
    rating: 4.7,
    reviewCount: 3209,
    badge: "new",
  },
  {
    id: "p7",
    name: "Linen Oversized Blazer",
    price: 199.00,
    originalPrice: 280.00,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    category: "Fashion",
    rating: 4.4,
    reviewCount: 567,
    badge: "sale",
  },
  {
    id: "p8",
    name: "Portable Espresso Maker",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1570087535440-f96a76261eca?w=600&q=80",
    category: "Home & Living",
    rating: 4.6,
    reviewCount: 789,
    badge: "hot",
  },
];

// ─── Module 04 Extended Data ──────────────────────────────────────────────────

export const flashDeals = [
  { id: "fd1", name: "boAt Airdopes 141 Bluetooth Earbuds", price: 10.77, originalPrice: 29.94, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80", category: "Electronics", rating: 4.3, reviewCount: 9245, badge: "sale" as const, discount: 64 },
  { id: "fd2", name: "Fire-Boltt Ninja Calling Smart Watch", price: 20.35, originalPrice: 32.34, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", category: "Electronics", rating: 4.1, reviewCount: 7126, badge: "sale" as const, discount: 36 },
  { id: "fd3", name: "Campus OXYFIT Men Running Shoes", price: 14.37, originalPrice: 21.56, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", category: "Sports", rating: 4.2, reviewCount: 5643, badge: "sale" as const, discount: 33 },
  { id: "fd4", name: "Safari Pentagon 45L Laptop Backpack", price: 11.97, originalPrice: 29.94, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", category: "Fashion", rating: 4.4, reviewCount: 4321, badge: "sale" as const, discount: 60 },
  { id: "fd5", name: "Philips HL7756/00 Mixer Grinder 750W", price: 51.50, originalPrice: 71.86, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", category: "Home & Living", rating: 4.5, reviewCount: 3210, badge: "sale" as const, discount: 28 },
  { id: "fd6", name: "realme Narzo 70 Pro 5G Smartphone", price: 167.07, originalPrice: 215.57, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", category: "Electronics", rating: 4.3, reviewCount: 12850, badge: "sale" as const, discount: 19 },
];

export const bestSellers = [
  { id: "bs1", name: "POCO X6 Pro 5G (8GB RAM, 256GB)", price: 227.54, originalPrice: 299.40, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80", category: "Electronics", rating: 4.5, reviewCount: 8765, badge: "hot" as const },
  { id: "bs2", name: "OnePlus Nord Buds 2 TWS Earbuds", price: 26.35, originalPrice: 35.93, image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&q=80", category: "Electronics", rating: 4.2, reviewCount: 6432, badge: "hot" as const },
  { id: "bs3", name: "Noise ColorFit Pulse Grand Smart Watch", price: 16.77, originalPrice: 29.94, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80", category: "Electronics", rating: 4.1, reviewCount: 5678, badge: "hot" as const },
  { id: "bs4", name: "Bata Men Sports Sneakers", price: 15.57, originalPrice: 23.95, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", category: "Sports", rating: 4.3, reviewCount: 4987, badge: "hot" as const },
  { id: "bs5", name: "Skybags Trooper 55 Travel Duffle Bag", price: 19.16, originalPrice: 35.93, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", category: "Fashion", rating: 4.4, reviewCount: 3876, badge: "hot" as const },
  { id: "bs6", name: "Sony WH-CH520 Wireless Headphones", price: 41.92, originalPrice: 59.88, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", category: "Electronics", rating: 4.5, reviewCount: 3210, badge: "hot" as const },
];

export const newArrivals = [
  { id: "na1", name: "Samsung Galaxy M55 5G (8GB RAM, 128GB)", price: 263.47, originalPrice: 323.35, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80", category: "Electronics", rating: 4.3, reviewCount: 699, badge: "new" as const },
  { id: "na2", name: "realme Buds T300 TWS Earbuds", price: 21.55, originalPrice: 29.94, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80", category: "Electronics", rating: 4.1, reviewCount: 521, badge: "new" as const },
  { id: "na3", name: "Fire-Boltt Invincible Plus Smart Watch", price: 26.35, originalPrice: 41.92, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", category: "Electronics", rating: 4.2, reviewCount: 421, badge: "new" as const },
  { id: "na4", name: "Puma Men Running Shoes", price: 27.54, originalPrice: 47.91, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", category: "Sports", rating: 4.0, reviewCount: 369, badge: "new" as const },
  { id: "na5", name: "American Tourister Backpack 32L", price: 14.37, originalPrice: 27.54, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", category: "Fashion", rating: 4.3, reviewCount: 287, badge: "new" as const },
  { id: "na6", name: "Wild Stone Code Perfume 100ml", price: 2.99, originalPrice: 4.79, image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80", category: "Beauty", rating: 4.4, reviewCount: 621, badge: "new" as const },
];

export const topBrands = [
  { id: "tb1", name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", href: "/brand/samsung" },
  { id: "tb2", name: "boAt", logo: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&q=80", href: "/brand/boat" },
  { id: "tb3", name: "realme", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&q=80", href: "/brand/realme" },
  { id: "tb4", name: "OnePlus", logo: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&q=80", href: "/brand/oneplus" },
  { id: "tb5", name: "Puma", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80", href: "/brand/puma" },
  { id: "tb6", name: "Sony", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80", href: "/brand/sony" },
];

export const categoryIcons = [
  { id: "ci1", name: "Mobiles", icon: "📱", href: "/category/mobiles" },
  { id: "ci2", name: "Electronics", icon: "💻", href: "/category/electronics" },
  { id: "ci3", name: "Fashion", icon: "👗", href: "/category/fashion" },
  { id: "ci4", name: "Home", icon: "🏠", href: "/category/home-living" },
  { id: "ci5", name: "Beauty", icon: "💄", href: "/category/beauty" },
  { id: "ci6", name: "Appliances", icon: "🍳", href: "/category/appliances" },
  { id: "ci7", name: "Sports", icon: "⚽", href: "/category/sports" },
  { id: "ci8", name: "Toys", icon: "🧸", href: "/category/toys" },
  { id: "ci9", name: "Automotive", icon: "🚗", href: "/category/automotive" },
  { id: "ci10", name: "Grocery", icon: "🛒", href: "/category/grocery" },
];
