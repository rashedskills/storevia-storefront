"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Container,
} from "@/components/layout/container";

import { useCart } from "@/components/cart/cart-provider";
import { CartRecommendations } from "@/components/cart/cart-recommendations";

import {
  CartCoupon,
} from "@/components/cart/cart-coupon";

import type {
  StoreviaSettings,
} from "@/lib/storevia/settings";

import {
  CheckoutLink,
} from "@/components/tracking/checkout-link";

import type {
  WooCart,
} from "@/lib/woocommerce/cart-types";


function money(
  amount: string,
  minorUnit: number
) {
  return (
    Number(amount) /
    Math.pow(10, minorUnit)
  ).toLocaleString();
}

function getProductSlug(
  permalink: string
) {
  try {
    const url = new URL(permalink);

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    const productIndex =
      parts.indexOf("product");

    if (
      productIndex !== -1 &&
      parts[productIndex + 1]
    ) {
      return parts[productIndex + 1];
    }

    return parts.at(-1) || "";
  } catch {
    return "";
  }
}

export function CartPage({
  settings,
}: {
  settings: StoreviaSettings;
}) {
  const {
    cart,
    loading,
    actionLoading,
    updateItem,
    removeItem,
  } = useCart();

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-[var(--store-text)]">
        Loading cart...
      </div>
    );
  }

  if (!cart || !cart.items.length) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-3xl font-bold text-[var(--store-dark)]">
          Your cart is empty
        </h1>

        <Link
          href="/shop"
          className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-7 font-bold !text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const totals = cart.totals;

  return (
    <>
      {/* ==========================================================
          CART HEADING
      ========================================================== */}
<Container>
      <div className="mb-5 mt-5 flex items-center justify-between border-b border-[var(--store-border)] pb-4">
        <h1 className="text-[24px] font-bold text-[var(--store-dark)] sm:text-3xl">
          My Cart
        </h1>

        <span className="rounded-[var(--store-radius-sm)] bg-[var(--store-accent)] px-4 py-2 text-sm font-bold text-white">
          {cart.items_count} Items
        </span>
      </div>


      {/* ==========================================================
          DESKTOP
      ========================================================== */}

      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">

        {/* LEFT */}
        <div>

          {/* Labels */}
          <div className="grid grid-cols-[minmax(0,1fr)_160px_130px_130px_40px] border-b border-[var(--store-border)] py-4 text-sm font-semibold text-[var(--store-dark)]">
            <span>PRODUCT DETAILS</span>
            <span>QUANTITY</span>
            <span>PRICE</span>
            <span>TOTAL</span>
            <span />
          </div>

          {cart.items.map((item) => {
            const image = item.images?.[0];

            const slug =
              getProductSlug(item.permalink);

            const unitPrice = money(
              item.prices.price,
              item.prices.currency_minor_unit
            );

            const regularPrice = money(
              item.prices.regular_price,
              item.prices.currency_minor_unit
            );

            const lineTotal = money(
              item.totals.line_total,
              item.totals.currency_minor_unit
            );

            return (
              <article
                key={item.key}
                className="grid grid-cols-[minmax(0,1fr)_160px_130px_130px_40px] items-center border-b border-[var(--store-border)] py-6"
              >

                {/* Product */}
                <div className="flex min-w-0 items-center gap-4">

                  <Link
                    href={`/product/${slug}`}
                    className="relative h-[118px] w-[118px] shrink-0 overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-neutral-50"
                  >
                    {image && (
                      <Image
                        src={
                          image.thumbnail ||
                          image.src
                        }
                        alt={
                          image.alt ||
                          item.name
                        }
                        fill
                        sizes="118px"
                        loading="lazy"
                        className="object-cover"
                      />
                    )}
                  </Link>

                  <div className="min-w-0">

                    <Link
                      href={`/product/${slug}`}
                      className="text-[16px] font-bold leading-[1.4] text-[var(--store-dark)] transition hover:text-[var(--store-primary)]"
                    >
                      {item.name}
                    </Link>

                    {item.variation?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-neutral-500">

                        {item.variation.map(
                          (variation) => (
                            <span
                              key={
                                variation.attribute
                              }
                            >
                              {
                                variation.attribute
                              }
                              :{" "}
                              <strong className="font-medium">
                                {variation.value}
                              </strong>
                            </span>
                          )
                        )}

                      </div>
                    )}

                  </div>

                </div>


                {/* Quantity */}
                <QuantityControl
                  item={item}
                  actionLoading={
                    actionLoading
                  }
                  updateItem={updateItem}
                />


                {/* Price */}
                <div>
                  <div className="text-[16px] font-semibold text-[var(--store-dark)]">
                    {
                      item.prices
                        .currency_symbol
                    }
                    {unitPrice}
                  </div>

                  {regularPrice !==
                    unitPrice && (
                    <div className="mt-1 text-sm text-neutral-400 line-through">
                      {
                        item.prices
                          .currency_symbol
                      }
                      {regularPrice}
                    </div>
                  )}
                </div>


                {/* Total */}
                <div className="text-[16px] font-bold text-[var(--store-dark)]">
                  {
                    item.totals
                      .currency_symbol
                  }
                  {lineTotal}
                </div>


                {/* Remove */}
                <button
                  type="button"
                  aria-label="Remove product"
                  disabled={actionLoading}
                  onClick={() =>
                    removeItem(item.key)
                  }
                  className="flex h-9 w-9 items-center justify-center text-xl text-neutral-400 transition hover:text-red-500"
                >
                  ×
                </button>

              </article>
            );
          })}

        </div>


        {/* SUMMARY */}
        <aside>
          <OrderSummary
            cart={cart}
            settings={settings}
          />
        </aside>

      </div>


      {/* ==========================================================
          MOBILE / TABLET
      ========================================================== */}

      <div className="space-y-4 lg:hidden">

        {cart.items.map((item) => {
          const image = item.images?.[0];

          const slug =
            getProductSlug(item.permalink);

          const unitPrice = money(
            item.prices.price,
            item.prices.currency_minor_unit
          );

          const regularPrice = money(
            item.prices.regular_price,
            item.prices.currency_minor_unit
          );

          return (
            <article
              key={item.key}
              className="rounded-[var(--store-radius-md)] bg-[#f8f8fb] p-3.5"
            >

              {/* Product top */}
              <div className="flex gap-3">

                <Link
                  href={`/product/${slug}`}
                  className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white"
                >
                  {image && (
                    <Image
                      src={
                        image.thumbnail ||
                        image.src
                      }
                      alt={
                        image.alt ||
                        item.name
                      }
                      fill
                      sizes="92px"
                      className="object-cover"
                    />
                  )}
                </Link>


                <div className="min-w-0 flex-1">

                  <div className="flex items-start gap-2">

                    <Link
                      href={`/product/${slug}`}
                      className="flex-1 text-[14px] font-bold leading-[1.35] text-[var(--store-dark)] transition hover:text-[var(--store-primary)]"
                    >
                      {item.name}
                    </Link>

                    <button
                      type="button"
                      aria-label="Remove product"
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        removeItem(item.key)
                      }
                      className="shrink-0 text-xl leading-none text-neutral-400"
                    >
                      ×
                    </button>

                  </div>


                  {/* Variations */}
                  {item.variation?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-500">

                      {item.variation.map(
                        (variation) => (
                          <span
                            key={
                              variation.attribute
                            }
                          >
                            {
                              variation.attribute
                            }
                            :{" "}
                            <strong className="font-medium text-[var(--store-primary)]">
                              {variation.value}
                            </strong>
                          </span>
                        )
                      )}

                    </div>
                  )}

                </div>
              </div>


              {/* Bottom controls */}
              <div className="mt-4 flex items-end justify-between gap-3">

                <QuantityControl
                  item={item}
                  actionLoading={
                    actionLoading
                  }
                  updateItem={updateItem}
                  compact
                />


                {/* Price */}
                <div className="text-right">

                  <div className="text-[17px] font-bold text-[var(--store-dark)]">
                    {
                      item.prices
                        .currency_symbol
                    }
                    {unitPrice}
                  </div>

                  {regularPrice !==
                    unitPrice && (
                    <div className="text-xs text-neutral-400 line-through">
                      {
                        item.prices
                          .currency_symbol
                      }
                      {regularPrice}
                    </div>
                  )}

                </div>

              </div>

            </article>
          );
        })}


        {/* Mobile summary */}
        <div className="hidden sm:block">
          <OrderSummary
            cart={cart}
            settings={settings}
          />
        </div>

      </div>
      {/* =========================================================
    MOBILE COUPON
========================================================= */}

      {Boolean(
        settings?.cart_coupon_enabled
      ) && (
        <div className="mt-4 rounded-[var(--store-radius-md)] bg-white p-4 lg:hidden">

          <CartCoupon />

        </div>
      )}
      <div className="mb-5">
        <CartRecommendations />
      </div>
      
      </Container>

      {/* ==========================================================
          MOBILE FIXED CHECKOUT
      ========================================================== */}

      {/* MOBILE FIXED CHECKOUT BAR */}
{cart && cart.items_count > 0 && (
  <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.08)] lg:hidden">
    <div className="mx-auto flex max-w-[500px] items-center gap-3">

      {/* Total */}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-neutral-500">
          Grand Total
        </p>

        <p className="text-lg font-bold text-[var(--store-dark)]">
          {cart.totals.currency_symbol}
          {(
            Number(cart.totals.total_price) /
            Math.pow(10, cart.totals.currency_minor_unit)
          ).toLocaleString()}
        </p>
      </div>

      {/* Checkout */}
      <CheckoutLink
      value={
        Number(
          cart.totals.total_price
        ) /
        Math.pow(
          10,
          cart.totals.currency_minor_unit
        )
      }
      currency={
        cart.totals.currency_code
      }
      itemCount={
        cart.items_count
      }
      className="flex min-h-[48px] min-w-[155px] items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-6 text-sm font-bold !text-white transition hover:opacity-90"
    >
      Checkout
    </CheckoutLink>

    </div>
  </div>
)}

     
    </>
  );
}



/* ================================================================
   QUANTITY
================================================================ */

function QuantityControl({
  item,
  actionLoading,
  updateItem,
  compact = false,
}: {
  item: any;
  actionLoading: boolean;

  updateItem: (
    key: string,
    quantity: number
  ) => Promise<boolean>;

  compact?: boolean;
}) {
  return (
    <div
  className={`inline-flex w-fit shrink-0 overflow-hidden rounded-[var(--store-radius-sm)] border border-[var(--store-border)] bg-white ${
    compact
      ? "h-9"
      : "h-11"
  }`}
>
  <button
    type="button"
    disabled={
      actionLoading ||
      item.quantity <=
        item.quantity_limits.minimum
    }
    onClick={() =>
      updateItem(
        item.key,
        Math.max(
          item.quantity_limits.minimum,
          item.quantity - 1
        )
      )
    }
    className={`flex shrink-0 items-center justify-center hover:bg-[var(--store-soft)] ${
      compact
        ? "w-9"
        : "w-10"
    }`}
  >
    −
  </button>

  <span
    className={`flex shrink-0 items-center justify-center border-x border-[var(--store-border)] text-sm font-semibold ${
      compact
        ? "w-9"
        : "w-10"
    }`}
  >
    {item.quantity}
  </span>

  <button
    type="button"
    disabled={
      actionLoading ||
      item.quantity >=
        item.quantity_limits.maximum
    }
    onClick={() =>
      updateItem(
        item.key,
        item.quantity + 1
      )
    }
    className={`flex shrink-0 items-center justify-center hover:bg-[var(--store-soft)] ${
      compact
        ? "w-9"
        : "w-10"
    }`}
  >
    +
  </button>
</div>
  );
}



/* ================================================================
   ORDER SUMMARY
================================================================ */

function OrderSummary({
  cart,
  settings,
}: {
  cart: WooCart;
  settings: StoreviaSettings;
}) {
  const totals =
    cart.totals;

  return (
    <div className="w-full rounded-[var(--store-radius-md)] border border-[var(--store-primary)] bg-white p-5 lg:sticky lg:top-[145px]">

      <h2 className="text-xl font-bold text-[var(--store-dark)]">
        Order Summary
      </h2>


      <div className="mt-5 border-t border-[var(--store-border)] pt-4">

        {/* SUBTOTAL */}
        <div className="flex items-center justify-between py-3 text-sm">

          <span>
            Sub Total
          </span>

          <span>
            {totals.currency_symbol}

            {money(
              totals.total_items,
              totals.currency_minor_unit
            )}
          </span>

        </div>


        {/* DISCOUNT */}
        {Number(
          totals.total_discount
        ) > 0 && (
          <div className="flex items-center justify-between py-3 text-sm text-green-600">

            <span>
              Discount
            </span>

            <span className="font-semibold">
              -
              {totals.currency_symbol}

              {money(
                totals.total_discount,
                totals.currency_minor_unit
              )}
            </span>

          </div>
        )}


        {/* GRAND TOTAL */}
        <div className="flex items-center justify-between border-t border-[var(--store-border)] py-4 text-[16px] font-bold">

          <span>
            Grand Total
          </span>

          <span className="text-[var(--store-primary)]">
            {totals.currency_symbol}

            {money(
              totals.total_price,
              totals.currency_minor_unit
            )}
          </span>

        </div>


        {/* COUPON */}
        {Boolean(
          settings?.cart_coupon_enabled
        ) && (
          <div className="mt-3">
            <CartCoupon />
          </div>
        )}


        {/* CHECKOUT */}
        <CheckoutLink
          value={
            Number(
              totals.total_price
            ) /
            Math.pow(
              10,
              totals.currency_minor_unit
            )
          }
          currency={
            totals.currency_code
          }
          itemCount={
            cart.items_count
          }
          className="mt-4 flex min-h-[48px] items-center justify-center rounded-[var(--store-radius-sm)] bg-[var(--store-primary)] px-5 font-bold !text-white"
        >
          Checkout
        </CheckoutLink>

      </div>

    </div>
  );
}