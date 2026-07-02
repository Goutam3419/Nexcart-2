import Link from "next/link";
import { topBrands } from "@/data";

export function TopBrands() {
  return (
    <section className="py-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-5">
          Top Brands
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {topBrands.map((brand) => (
            <Link
              key={brand.id}
              href={brand.href}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 flex items-center justify-center hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all group aspect-square"
            >
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-center leading-tight">
                {brand.name}
              </span>
            </Link>
          ))}
          <Link
            href="/brands"
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 flex flex-col items-center justify-center hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all group aspect-square"
          >
            <span className="text-2xl mb-1">···</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">More</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
