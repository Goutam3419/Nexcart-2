import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryIconsRow } from "@/components/home/v2/CategoryIconsRow";
import { FlashDeals } from "@/components/home/v2/FlashDeals";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { ProductRow } from "@/components/home/v2/ProductRow";
import { TopBrands } from "@/components/home/v2/TopBrands";
import { RecentlyViewedSection } from "@/components/home/v2/RecentlyViewedSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { bestSellers, newArrivals } from "@/data";
import type { Product } from "@/types";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <CategoryIconsRow />
        <HeroBanner />
        <FlashDeals />
        <RecentlyViewedSection />
        <FeaturedCategories />
        <ProductRow
          title="Best Sellers"
          subtitle="Top rated"
          products={bestSellers as Product[]}
          viewAllHref="/search?q=bestseller"
          accentColor="text-orange-600 dark:text-orange-400"
        />
        <ProductRow
          title="New Arrivals"
          subtitle="Just landed"
          products={newArrivals as Product[]}
          viewAllHref="/search?q=new"
          accentColor="text-emerald-600 dark:text-emerald-400"
        />
        <TopBrands />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
