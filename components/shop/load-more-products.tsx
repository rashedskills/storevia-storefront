"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ProductCard,
} from "@/components/product/product-card";

import type {
  WooProduct,
} from "@/lib/woocommerce/products";


type LoadMoreProductsProps = {
  initialProducts: WooProduct[];

  perPage?: number;

  sort?: string;

  type?:
    | "shop"
    | "category"
    | "brand";

  slug?: string;
};


export function LoadMoreProducts({
  initialProducts,
  perPage = 16,
  sort = "default",
  type = "shop",
  slug,
  onSale = false,
}: LoadMoreProductsProps) {

  const [
    products,
    setProducts,
  ] = useState<WooProduct[]>(
    initialProducts
  );


  const [
    page,
    setPage,
  ] = useState(1);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    hasMore,
    setHasMore,
  ] = useState(
    initialProducts.length ===
      perPage
  );


  /* ================================================================
     RESET WHEN ARCHIVE / SORT CHANGES
  ================================================================ */

  useEffect(() => {

    setProducts(
      initialProducts
    );

    setPage(1);

    setHasMore(
      initialProducts.length ===
        perPage
    );

  }, [
    initialProducts,
    perPage,
    sort,
    type,
    slug,
    onSale,
  ]);


  /* ================================================================
     LOAD MORE
  ================================================================ */

  async function loadMore() {

    if (
      loading ||
      !hasMore
    ) {
      return;
    }


    setLoading(
      true
    );


    try {

      const nextPage =
        page + 1;


      const params =
        new URLSearchParams({
          page:
            String(
              nextPage
            ),

          per_page:
            String(
              perPage
            ),

          sort,

          type,
        });


      if (slug) {

        params.set(
          "slug",
          slug
        );

      }

      if (onSale) {
        params.set(
          "on_sale",
          "true"
        );
      }


      const response =
        await fetch(
          `/api/products?${params.toString()}`,
          {
            cache:
              "no-store",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.message ||
          "Unable to load products."
        );

      }


      const newProducts:
        WooProduct[] =
          data.products || [];


      /*
       * Prevent duplicate product IDs.
       */
      setProducts(
        (
          current
        ) => {

          const existingIds =
            new Set(
              current.map(
                (
                  product
                ) =>
                  product.id
              )
            );


          const uniqueProducts =
            newProducts.filter(
              (
                product
              ) =>
                !existingIds.has(
                  product.id
                )
            );


          return [
            ...current,
            ...uniqueProducts,
          ];
        }
      );


      setPage(
        nextPage
      );


      setHasMore(
        Boolean(
          data.hasMore
        )
      );

    } catch (
      error
    ) {

      console.error(
        "Load more error:",
        error
      );

    } finally {

      setLoading(
        false
      );

    }
  }


  /* ================================================================
     UI
  ================================================================ */

  return (
    <>

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


      {hasMore && (

        <div className="mt-8 flex justify-center">

          <button
            type="button"
            onClick={
              loadMore
            }
            disabled={
              loading
            }
            className="
            min-h-[46px]
            rounded-[var(--store-radius-md)]
            border
            border-[var(--store-primary)]
            bg-transparent
            px-8
            text-sm
            font-bold
            text-[var(--store-primary)]
            transition
            duration-200
            hover:bg-[var(--store-soft)]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          >
            {loading
              ? "Loading..."
              : "Load More Products"}
          </button>

        </div>

      )}

    </>
  );
}