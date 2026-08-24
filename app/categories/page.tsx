import Link from "next/link";
import Image from "next/image";

import {
  Container,
} from "@/components/layout/container";

import {
  getCategories,
} from "@/lib/woocommerce/categories";

import type {
  Metadata,
} from "next";


export const metadata: Metadata = {
  title: "All Categories",
  description:
    "Browse all product categories.",
};


export default async function CategoriesPage() {

  /*
   * Fetch enough categories for the full archive.
   * Increase this later if needed.
   */
  const categories =
    await getCategories(100);


  return (
    <main className="py-8 sm:py-12">

      <Container>

        {/* HEADER */}

        <div className="mb-7">

          <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--store-primary)]">
            Browse
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-[-.03em] text-[var(--store-dark)] sm:text-4xl">
            All Categories
          </h1>

          <p className="mt-2 text-sm text-[var(--store-text)]">
            Explore products by category.
          </p>

        </div>


        {/* CATEGORY GRID */}

        {categories.length > 0 ? (

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">

            {categories.map(
              (category) => (

                <Link
                  key={
                    category.id
                  }
                  href={`/category/${category.slug}`}
                  className="group"
                >

                  <div className="overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white transition group-hover:-translate-y-0.5 group-hover:shadow-md">

                    {/* IMAGE */}

                    <div className="relative aspect-square bg-[var(--store-soft)]">

                      {category.image?.src ? (

                        <Image
                          src={
                            category.image.src
                          }
                          alt={
                            category.image.alt ||
                            category.name
                          }
                          fill
                          sizes="
                            (max-width: 640px) 50vw,
                            (max-width: 1024px) 25vw,
                            220px
                          "
                          className="object-cover"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-3xl font-bold text-[var(--store-primary)]">
                          {category.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="p-3 text-center">

                      <h2 className="text-sm font-bold text-[var(--store-dark)]">
                        {category.name}
                      </h2>

                      <p className="mt-1 text-xs text-[var(--store-text)]">
                        {category.count}{" "}
                        {category.count === 1
                          ? "product"
                          : "products"}
                      </p>

                    </div>

                  </div>

                </Link>

              )
            )}

          </div>

        ) : (

          <div className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-8 text-center text-sm text-[var(--store-text)]">
            No categories found.
          </div>

        )}

      </Container>

    </main>
  );
}