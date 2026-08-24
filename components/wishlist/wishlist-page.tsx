"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  Container,
} from "@/components/layout/container";


type WishlistProduct = {
  id: number;
  name: string;
  slug: string;
  type: string;
  price: string;
  regular_price: string;
  sale_price: string;
  currency: string;
  in_stock: boolean;
  purchasable: boolean;
  image?: string;
};


type WishlistData = {
  ids: number[];

  products:
    WishlistProduct[];

  count: number;
};


export function WishlistPage() {

  const [
    data,
    setData,
  ] =
    useState<WishlistData | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  async function loadWishlist() {

    try {

      const response =
        await fetch(
          "/api/account/wishlist",
          {
            cache:
              "no-store",
          }
        );


      if (
        response.status ===
        401
      ) {

        window.location.href =
          "/my-account";

        return;
      }


      const result =
        await response.json();


      if (!response.ok) {
        return;
      }


      setData(
        result
      );

    } finally {

      setLoading(
        false
      );
    }
  }


  async function remove(
    productId: number
  ) {

    const response =
      await fetch(
        `/api/account/wishlist/${productId}`,
        {
          method:
            "DELETE",
        }
      );


    if (response.ok) {

      await loadWishlist();

      window.dispatchEvent(
        new Event(
          "storevia:wishlist-changed"
        )
      );
    }
  }


  useEffect(() => {

    loadWishlist();

  }, []);


  return (
    <main className="bg-[var(--store-soft)] py-7 sm:py-10">

      <Container>

        <div className="mx-auto max-w-[1000px]">

          <h1 className="text-2xl font-bold text-[var(--store-dark)] sm:text-3xl">
            My Wishlist
          </h1>


          {loading ? (

            <p className="mt-6 text-sm text-[var(--store-text)]">
              Loading wishlist...
            </p>

          ) : !data ||
            data.products.length ===
              0 ? (

            <div className="mt-6 rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-8 text-center">

              <p className="font-bold text-[var(--store-dark)]">
                Your wishlist is empty.
              </p>

              <Link
                href="/shop"
                className="mt-4 inline-flex rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-5 py-3 text-sm font-bold !text-white"
              >
                Start Shopping
              </Link>

            </div>

          ) : (

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

              {data.products.map(
                (
                  product
                ) => (

                  <article
                    key={
                      product.id
                    }
                    className="overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white"
                  >

                    <Link
                      href={`/product/${product.slug}`}
                      className="relative block aspect-square bg-[var(--store-soft)]"
                    >

                      {product.image && (
                        <Image
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          fill
                          sizes="(max-width: 640px) 50vw, 250px"
                          className="object-cover"
                        />
                      )}

                    </Link>


                    <div className="p-3">

                      <Link
                        href={`/product/${product.slug}`}
                        className="line-clamp-2 text-sm font-bold text-[var(--store-dark)]"
                      >
                        {product.name}
                      </Link>


                      <p className="mt-2 font-bold text-[var(--store-primary)]">
                        {product.currency}
                        {" "}
                        {product.price}
                      </p>


                      <Link
                        href={`/product/${product.slug}`}
                        className="mt-3 flex min-h-[40px] items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-3 text-xs font-bold !text-white"
                      >
                        {product.type ===
                        "variable"
                          ? "Select Options"
                          : "View Product"}
                      </Link>


                      <button
                        type="button"
                        onClick={() =>
                          remove(
                            product.id
                          )
                        }
                        className="mt-2 w-full text-center text-xs font-semibold text-red-500"
                      >
                        Remove
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </div>

      </Container>

    </main>
  );
}