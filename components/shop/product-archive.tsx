import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { ArchiveSort } from "@/components/shop/archive-sort";
import { ArchiveSidebar } from "@/components/shop/archive-sidebar";

import type { WooCategory } from "@/lib/woocommerce/categories";
import type { WooBrand } from "@/lib/woocommerce/brands";
import type {
  ProductSort,
  WooProduct,
} from "@/lib/woocommerce/products";

import {
  LoadMoreProducts,
} from "@/components/shop/load-more-products";

type Props = {
  title: string;
  description?: string;

  products: WooProduct[];
  categories: WooCategory[];
  brands: WooBrand[];

  activeCategory?: string;
  activeBrand?: string;

  breadcrumb?: string;
};

type ProductArchiveProps = {
  title: string;
  products: WooProduct[];

  categories?: any[];
  brands?: any[];

  sort?: ProductSort;

  description?: string;

  activeCategory?: string;
  activeBrand?: string;
  loadMore?: {
    enabled: boolean;
    perPage: number;

    type?:
    | "shop"
    | "category"
    | "brand";

    slug?: string;
    onSale?: boolean;
  };
};

export function ProductArchive({
  title,
  breadcrumb,
  products,
  categories = [],
  brands = [],
  sort = "default",
  description,
  activeCategory,
  activeBrand,
  loadMore,
}: ProductArchiveProps) {
  return (
    <main className="bg-[#fcfcfc] py-7 sm:py-10">
      <Container>

        <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">

          <ArchiveSidebar
            categories={categories}
            brands={brands}
            activeCategory={activeCategory}
            activeBrand={activeBrand}
          />

          <div className="min-w-0">

            <div className="mb-5 flex items-start justify-between gap-4">

              <div>
                <div className="mb-2 text-xs text-[var(--store-text)]">
                  <Link href="/">Home</Link>
                  <span className="mx-2">›</span>

                  <span>
                    {breadcrumb || title}
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-[-0.03em] text-[var(--store-dark)] sm:text-4xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1 text-sm text-neutral-500">
                    {description}
                  </p>
                )}

                <p className="mt-2 text-sm text-neutral-500">
                  Showing {products.length} products
                </p>
              </div>

              <ArchiveSort currentSort={sort} />
                
            </div>

            {products.length > 0 ? (
              loadMore?.enabled ? (

                <LoadMoreProducts
                  initialProducts={
                    products
                  }
                  perPage={
                    loadMore.perPage
                  }
                  sort={
                    sort
                  }
                  type={
                    loadMore.type ||
                    "shop"
                  }
                  slug={
                    loadMore.slug
                  }
                  onSale={loadMore.onSale}
                />

              ) : (

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

                  {products.map(
                    (
                      product
                    ) => (
                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                      />
                    )
                  )}

                </div>

              )

            ) : (

              <div className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-8 text-center">

                <p className="text-sm text-[var(--store-text)]">
                  No products found.
                </p>

              </div>

            )}
          </div>
        </div>

      </Container>
    </main>
  );
}