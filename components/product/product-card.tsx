"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useState,
} from "react";

import {
  useCart,
} from "@/components/cart/cart-provider";

import type {
  WooProduct,
} from "@/lib/woocommerce/products";

import {
  trackAddToCart,
} from "@/lib/tracking/facebook";

import {
  WishlistButton,
} from "@/components/wishlist/wishlist-button";


type ProductCardProps = {
  product: WooProduct;

  imagePriority?: boolean;
};


/* ================================================================
   MONEY
================================================================ */

function formatMoney(
  value: string,
  minorUnit: number
) {
  const amount =
    Number(value) /
    Math.pow(
      10,
      minorUnit
    );

  return amount.toLocaleString(
    "en-BD",
    {
      maximumFractionDigits:
        minorUnit,
    }
  );
}


/* ================================================================
   PRODUCT CARD
================================================================ */

export function ProductCard({
  product,
  imagePriority = false,
}: ProductCardProps) {
  const {
    addItem,
    actionLoading,
  } = useCart();


  const [
    added,
    setAdded,
  ] = useState(false);


  const [
    localLoading,
    setLocalLoading,
  ] = useState(false);


  /* ==============================================================
     PRODUCT DATA
  ============================================================== */

  const image =
    product.images?.[0];


  const minorUnit =
    product.prices
      .currency_minor_unit ??
    2;


  const currency =
    product.prices
      .currency_symbol ||
    "৳";


  const currentPrice =
    formatMoney(
      product.prices.price,
      minorUnit
    );


  const regularPrice =
    formatMoney(
      product.prices.regular_price,
      minorUnit
    );


  const isVariable =
    product.type ===
    "variable";


  /*
   * Keep non-simple product types
   * on the product page.
   *
   * Later we can add grouped/external
   * behavior separately if needed.
   */
  const canDirectAdd =
    product.type ===
      "simple" &&
    product.is_purchasable &&
    product.is_in_stock;


  /* ==============================================================
     ADD TO CART
  ============================================================== */

  async function handleAddToCart() {
    if (
      !canDirectAdd ||
      localLoading ||
      actionLoading
    ) {
      return;
    }


    setLocalLoading(
      true
    );


    try {
      const success =
        await addItem({
          id:
            product.id,

          quantity:
            1,
        });


      if (success) {
        setAdded(
          true
        );


        trackAddToCart({
          content_ids: [
            String(
              product.id
            ),
          ],

          content_name:
            product.name,

          content_type:
            "product",

          value:
            Number(
              product.prices.price
            ) /
            Math.pow(
              10,
              product.prices
                .currency_minor_unit
            ),

          currency:
            product.prices
              .currency_code,
        });
      }

    } catch (error) {
      console.error(
        "Product card add to cart error:",
        error
      );

    } finally {
      setLocalLoading(
        false
      );
    }
  }


  /* ==============================================================
     BUTTON TEXT
  ============================================================== */

  let buttonText =
    "Add to Cart";


  if (isVariable) {
    buttonText =
      "Select Options";
  }

  else if (
    !product.is_in_stock
  ) {
    buttonText =
      "Out of Stock";
  }

  else if (
    !product.is_purchasable
  ) {
    buttonText =
      "View Product";
  }


  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white transition hover:-translate-y-0.5 hover:shadow-sm">

      {/* =========================================================
          PRODUCT IMAGE
      ========================================================= */}
<div className="relative">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-[var(--store-soft)]"
      >      
        {image?.src ? (
          <Image
            src={
              image.src
            }
            alt={
              image.alt ||
              product.name
            }
            fill
            loading={
              imagePriority
                ? "eager"
                : "lazy"
            }
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[var(--store-text)]">
            No image
          </div>
        )}


        {/* SALE BADGE */}

        {product.on_sale && (
          <span className="absolute left-3 top-3 rounded-[var(--store-radius-sm)] bg-[var(--store-accent)] px-2.5 py-1 text-[11px] font-bold uppercase text-white">
            Sale
          </span>
        )}

      </Link>

        <WishlistButton
          productId={
            product.id
          }
          iconOnly
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
        />
        </div>
      {/* =========================================================
          PRODUCT CONTENT
      ========================================================= */}

      <div className="flex flex-1 flex-col p-4">

        {/* RATING */}

<div className="mb-2 flex items-center gap-1.5 text-xs">

  <div
    className="relative inline-block leading-none"
    aria-label={`${product.average_rating || 0} out of 5 stars`}
  >

    {/* EMPTY STARS */}
    <span className="tracking-[1px] text-neutral-200">
      ★★★★★
    </span>

    {/* FILLED STARS */}
    <span
      className="absolute left-0 top-0 overflow-hidden whitespace-nowrap tracking-[1px] text-amber-400"
      style={{
        width: `${Math.min(
          100,
          Math.max(
            0,
            (Number(product.average_rating || 0) / 5) * 100
          )
        )}%`,
      }}
    >
      ★★★★★
    </span>

  </div>


  {Number(product.review_count) > 0 && (
    <span className="text-[var(--store-text)]">
      ({product.review_count})
    </span>
  )}

</div>


        {/* TITLE */}

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 min-h-[44px] text-sm font-semibold leading-[22px] text-[var(--store-dark)] transition hover:text-[var(--store-primary)]"
        >
          {product.name}
        </Link>


        {/* =======================================================
            PRICE
        ======================================================= */}

        <div className="mt-3 flex min-h-[28px] flex-wrap items-center gap-2">

          <span className="text-lg font-bold text-[var(--store-primary)]">
            {currency}
            {currentPrice}
          </span>


          {product.on_sale &&
            product.prices
              .regular_price !==
              product.prices.price && (
            <del className="text-xs text-neutral-400">
              {currency}
              {regularPrice}
            </del>
          )}

        </div>


        {/* =======================================================
            ACTIONS
        ======================================================= */}

        <div className="mt-auto pt-4">

          {/* VARIABLE PRODUCT */}

          {isVariable ? (
            <Link
              href={`/product/${product.slug}`}
              className="flex min-h-[44px] w-full items-center justify-center rounded-[var(--store-radius-sm)] bg-[var(--store-primary)] px-4 text-sm font-semibold !text-white transition hover:opacity-90"
            >
              Select Options
            </Link>
          ) : canDirectAdd ? (

            /* SIMPLE PRODUCT */

            <>
              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  localLoading ||
                  actionLoading
                }
                className={`flex min-h-[44px] w-full items-center justify-center rounded-[var(--store-radius-sm)] px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${
                  added
                    ? "bg-[var(--store-dark)]"
                    : "bg-[var(--store-primary)] hover:opacity-90"
                }`}
              >

                {localLoading
                  ? "Adding..."
                  : added
                    ? "Added ✓"
                    : "Add to Cart"}

              </button>


              {/* VIEW CART */}

              {added && (
                <Link
                  href="/cart"
                  className="mt-2 flex min-h-[30px] items-center text-sm font-medium text-[var(--store-primary)] transition hover:underline"
                >
                  View cart
                </Link>
              )}
            </>

          ) : (

            /* OUT OF STOCK / OTHER TYPES */

            <Link
              href={`/product/${product.slug}`}
              className={`flex min-h-[44px] w-full items-center justify-center rounded-[var(--store-radius-sm)] px-4 text-sm font-semibold ${
                product.is_in_stock
                  ? "bg-[var(--store-primary)] !text-white"
                  : "cursor-not-allowed bg-neutral-100 !text-neutral-400"
              }`}
            >
              {buttonText}
            </Link>

          )}

        </div>

      </div>

    </article>
  );
}