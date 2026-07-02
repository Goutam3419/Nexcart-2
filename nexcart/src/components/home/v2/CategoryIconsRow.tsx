import Link from "next/link";
import { categoryIcons } from "@/data";

export function CategoryIconsRow() {
  return (
    <section className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categoryIcons.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center gap-1.5 shrink-0 group min-w-[60px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-2xl group-hover:bg-brand-50 dark:group-hover:bg-brand-950/30 transition-colors border border-gray-100 dark:border-gray-700">
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
