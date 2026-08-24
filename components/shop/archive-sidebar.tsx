import Link from "next/link";

import type { WooCategory } from "@/lib/woocommerce/categories";
import type { WooBrand } from "@/lib/woocommerce/brands";

type Props = {
  categories: WooCategory[];
  brands: WooBrand[];
  activeCategory?: string;
  activeBrand?: string;
};

export function ArchiveSidebar({
  categories,
  brands,
  activeCategory,
  activeBrand,
}: Props) {
  return (
    <aside className="hidden lg:block">

      <div className="overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white">
        <div className="bg-[var(--store-primary)] px-5 py-4 text-[15px] font-bold text-white">
          Categories
        </div>

        <Link
          href="/shop"
          className={`flex items-center justify-between border-b border-[var(--store-border)] px-5 py-3.5 text-sm font-semibold ${
            !activeCategory
              ? "bg-[var(--store-soft)] text-[var(--store-primary)]"
              : ""
          }`}
        >
          All Products
          <span>›</span>
        </Link>

        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className={`flex items-center justify-between border-b border-[var(--store-border)] px-5 py-3.5 text-sm transition last:border-b-0 hover:bg-[var(--store-soft)] ${
              activeCategory === category.slug
                ? "bg-[var(--store-soft)] font-semibold text-[var(--store-primary)]"
                : "text-[var(--store-dark)]"
            }`}
          >
            <span>{category.name}</span>
            <span>›</span>
          </Link>
        ))}
      </div>

      {brands.length > 0 && (
        <div className="mt-6 rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white p-4">
          <h2 className="mb-4 text-lg font-bold text-[var(--store-dark)]">
            Brands
          </h2>

          <div className="space-y-2">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className={`block rounded-[var(--store-radius-md)] border border-[var(--store-border)] px-3 py-2.5 text-sm transition hover:border-[var(--store-primary)] ${
                  activeBrand === brand.slug
                    ? "border-[var(--store-primary)] bg-[var(--store-soft)] font-semibold text-[var(--store-primary)]"
                    : ""
                }`}
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
}