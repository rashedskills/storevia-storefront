"use client";

import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product/product-card";
import type { WooProduct } from "@/lib/woocommerce/products";

export function CartRecommendations() {
  const [products, setProducts] =
    useState<WooProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "/api/cart/recommendations",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as WooProduct[];

        setProducts(data);
      } catch (error) {
        console.error(
          "Unable to load cart recommendations:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return null;
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="mt-8 rounded-[var(--store-radius-md)] bg-[#f8f8fb] p-4 sm:p-5">

      <div className="mb-4 border-b border-[var(--store-border)] pb-3">
        <h2 className="text-xl font-bold text-[var(--store-dark)]">
          You May Like
        </h2>
      </div>

      {/* Mobile horizontal carousel */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:hidden">

        {products.map((product) => (
          <div
            key={product.id}
            className="w-[165px] shrink-0 snap-start sm:w-[190px]"
          >
            <ProductCard
              product={product}
            />
          </div>
        ))}

      </div>

      {/* Desktop grid */}
      <div className="hidden grid-cols-4 gap-4 lg:grid xl:grid-cols-5">

        {products.slice(0, 5).map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          )
        )}

      </div>

    </section>
  );
}