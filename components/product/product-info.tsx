"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  WooProduct,
  WooVariation,
} from "@/lib/woocommerce/products";

import { useCart } from "@/components/cart/cart-provider";

import type {
  StoreviaSettings,
} from "@/lib/storevia/settings";

import {
  trackAddToCart,
} from "@/lib/tracking/facebook";

type ProductInfoProps = {
  product: WooProduct;
  variations?: WooVariation[];
  settings: StoreviaSettings;
};

/* ================================================================
   HELPERS
================================================================ */

function formatPrice(
  amount: string,
  minorUnit: number
) {
  return (
    Number(amount) /
    Math.pow(10, minorUnit)
  ).toLocaleString();
}

function normalizeAttributeName(value: string) {
  return value
    .toLowerCase()
    .replace(/^pa_/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

function normalizeAttributeValue(value: string) {
  return value
    .toLowerCase()
    .trim();
}

/*
 * Your WooCommerce Store API currently returns:
 *
 * "variation": "Color: Green, Size: M"
 * "variation": "Color: Red"
 *
 * Missing Size means WooCommerce "Any Size".
 */
function getVariationAttributeMap(
  variation: WooVariation
): Record<string, string> {
  const map: Record<string, string> = {};

  if (!variation.variation) {
    return map;
  }

  variation.variation
    .split(",")
    .map((part) => part.trim())
    .forEach((part) => {
      const separatorIndex =
        part.indexOf(":");

      if (separatorIndex === -1) {
        return;
      }

      const name = part
        .slice(0, separatorIndex)
        .trim();

      const value = part
        .slice(separatorIndex + 1)
        .trim();

      if (!name || !value) {
        return;
      }

      map[
        normalizeAttributeName(name)
      ] = normalizeAttributeValue(value);
    });

  return map;
}

/*
 * A missing attribute in a variation means
 * WooCommerce "Any ..." and therefore acts
 * as a wildcard.
 */
function variationMatchesSelection(
  variation: WooVariation,
  selected: Record<string, string>
) {
  const variationMap =
    getVariationAttributeMap(variation);

  return Object.entries(selected).every(
    ([attributeName, selectedValue]) => {
      const variationValue =
        variationMap[attributeName];

      if (!variationValue) {
        return true;
      }

      return (
        variationValue ===
        normalizeAttributeValue(selectedValue)
      );
    }
  );
}

/* ================================================================
   COMPONENT
================================================================ */

export function ProductInfo({
  product,
  variations = [],
  settings,
}: ProductInfoProps) {
  const router = useRouter();

  const {
    cart,
    addItem,
    actionLoading,
  } = useCart();

  const [quantity, setQuantity] =
    useState(1);

  const [
    selectedAttributes,
    setSelectedAttributes,
  ] = useState<Record<string, string>>(
    {}
  );

  const [added, setAdded] =
    useState(false);

  const isVariable =
    product.type === "variable" &&
    variations.length > 0;

    const whatsappNumber =
    String(
      settings.whatsapp_number ||
      ""
    ).replace(/\D/g, "");

  const orderPhone =
    String(
      settings.order_phone_number ||
      ""
    );

  /* ================================================================
     SELECTED VARIATION
  ================================================================ */

  const selectedVariation =
    useMemo(() => {
      if (!isVariable) {
        return null;
      }

      const requiredAttributes =
        product.attributes?.filter(
          (attribute) =>
            attribute.has_variations
        ) ?? [];

      /*
       * Customer must select every
       * variation attribute first.
       */
      if (
        Object.keys(selectedAttributes)
          .length <
        requiredAttributes.length
      ) {
        return null;
      }

      return (
        variations.find((variation) => {
          if (!variation.is_in_stock) {
            return false;
          }

          return variationMatchesSelection(
            variation,
            selectedAttributes
          );
        }) ?? null
      );
    }, [
      isVariable,
      variations,
      selectedAttributes,
      product.attributes,
    ]);

  /* ================================================================
     ACTIVE PRODUCT DATA
  ================================================================ */

  const activePrices =
    selectedVariation?.prices ??
    product.prices;

  const activeStock =
    selectedVariation
      ? selectedVariation.is_in_stock
      : product.is_in_stock;

  const price = formatPrice(
    activePrices.price,
    activePrices.currency_minor_unit
  );

  const regularPrice =
    activePrices.regular_price
      ? formatPrice(
          activePrices.regular_price,
          activePrices.currency_minor_unit
        )
      : null;

  const categoryNames =
    product.categories
      ?.map((item) => item.name)
      .join(", ");

  const brandNames =
    product.brands
      ?.map((item) => item.name)
      .join(", ");

  /* ================================================================
     ATTRIBUTE SELECTION
  ================================================================ */

  function selectAttribute(
    attributeName: string,
    termValue: string
  ) {
    const attributeKey =
      normalizeAttributeName(
        attributeName
      );

    setSelectedAttributes(
      (current) => ({
        ...current,

        [attributeKey]:
          normalizeAttributeValue(
            termValue
          ),
      })
    );
  }

  function clearAttribute(
    attributeName: string
  ) {
    const attributeKey =
      normalizeAttributeName(
        attributeName
      );

    setSelectedAttributes(
      (current) => {
        const copy = {
          ...current,
        };

        delete copy[attributeKey];

        return copy;
      }
    );
  }

  function isCombinationAvailable(
    attributeName: string,
    termValue: string
  ) {
    const attributeKey =
      normalizeAttributeName(
        attributeName
      );

    const testSelection = {
      ...selectedAttributes,

      [attributeKey]:
        normalizeAttributeValue(
          termValue
        ),
    };

    return variations.some(
      (variation) => {
        if (!variation.is_in_stock) {
          return false;
        }

        return variationMatchesSelection(
          variation,
          testSelection
        );
      }
    );
  }

  /* ================================================================
     CART PAYLOAD
  ================================================================ */

  function buildCartPayload() {
    if (
      isVariable &&
      !selectedVariation
    ) {
      return null;
    }

    const variationPayload =
      isVariable
        ? product.attributes
            ?.filter(
              (attribute) =>
                attribute.has_variations
            )
            .map((attribute) => {
              const attributeKey =
                normalizeAttributeName(
                  attribute.taxonomy ||
                    attribute.name
                );

              const selectedValue =
                selectedAttributes[
                  attributeKey
                ];

              if (!selectedValue) {
                return null;
              }

              const selectedTerm =
                attribute.terms?.find(
                  (term) =>
                    normalizeAttributeValue(
                      term.slug ||
                        term.name
                    ) ===
                    selectedValue
                );

              return {
                attribute:
                  attribute.taxonomy ||
                  attribute.name,

                value:
                  attribute.taxonomy
                    ? selectedValue
                    : selectedTerm?.name ||
                      selectedValue,
              };
            })
            .filter(
              (
                item
              ): item is {
                attribute: string;
                value: string;
              } => item !== null
            ) ?? []
        : [];

    return {
      id:
        selectedVariation?.id ??
        product.id,

      quantity,

      variation: variationPayload,
    };
  }

  /* ================================================================
     ADD TO CART
  ================================================================ */

  async function handleAddToCart() {
    if (
      actionLoading ||
      !activeStock
    ) {
      return;
    }

    const payload =
      buildCartPayload();

    if (!payload) {
      return;
    }

    const success =
      await addItem(payload);

    if (!success) {
      const selectedProduct =
  selectedVariation ||
  product;


const minorUnit =
  selectedProduct
    .prices
    .currency_minor_unit;


const value =
  Number(
    selectedProduct
      .prices
      .price
  ) /
  Math.pow(
    10,
    minorUnit
  );


trackAddToCart({
  content_ids: [
    String(
      selectedVariation
        ? selectedVariation.id
        : product.id
    ),
  ],

  content_name:
    product.name,

  content_type:
    "product",

  value,

  currency:
    selectedProduct
      .prices
      .currency_code,
});
      return;
    }

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  /* ================================================================
     BUY NOW
  ================================================================ */

  async function handleBuyNow() {
    if (
      actionLoading ||
      !activeStock
    ) {
      return;
    }

    const payload =
      buildCartPayload();

    if (!payload) {
      return;
    }

    const success =
      await addItem(payload);

    if (!success) {
      return;
    }

    router.push("/checkout");
  }

  /* ================================================================
     UI
  ================================================================ */

  return (
    <div className="min-w-0">

      {/* PRODUCT TITLE */}

      <h1 className="text-[28px] font-bold leading-[1.2] tracking-[-0.03em] text-[var(--store-dark)] sm:text-3xl lg:text-[34px]">
        {product.name}
      </h1>


      {/* RATING */}

      <div className="mt-3 flex items-center gap-2">

        <div className="text-sm tracking-[2px] text-amber-400">
          ★★★★★
        </div>

        <span className="text-sm text-neutral-400">
          ({product.review_count || 0} reviews)
        </span>

      </div>


      {/* PRICE */}

      <div className="mt-5 flex flex-wrap items-center gap-3">

        <span className="text-3xl font-extrabold text-[var(--store-primary)] sm:text-[36px]">
          {activePrices.currency_symbol}
          {price}
        </span>

        {regularPrice &&
          regularPrice !== price && (
            <span className="text-lg text-neutral-400 line-through">

              {
                activePrices
                  .currency_symbol
              }

              {regularPrice}

            </span>
          )}

      </div>


      {/* STOCK */}

      <div className="mt-4">

        {activeStock ? (
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            In Stock
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
            Out of Stock
          </span>
        )}

      </div>
      {/* SHORT DESCRIPTION */}

      {product.short_description && (
        <div
          className="mt-5 text-sm leading-7 text-[var(--store-text)]"
          dangerouslySetInnerHTML={{
            __html:
              product.short_description,
          }}
        />
      )}


      {/* ============================================================
          VARIATIONS
      ============================================================ */}

      {isVariable &&
        product.attributes?.map(
          (attribute) => {
            if (
              !attribute.has_variations
            ) {
              return null;
            }

            const attributeName =
              attribute.taxonomy ||
              attribute.name;

            const attributeKey =
              normalizeAttributeName(
                attributeName
              );

            const currentlySelected =
              selectedAttributes[
                attributeKey
              ];

            return (
              <div
                key={
                  attribute.id ||
                  attribute.name
                }
                className="mt-6"
              >

                {/* Attribute header */}

                <div className="mb-2 flex items-center justify-between">

                  <p className="text-sm font-bold text-[var(--store-dark)]">
                    {attribute.name}
                  </p>

                  {currentlySelected && (
                    <button
                      type="button"
                      onClick={() =>
                        clearAttribute(
                          attributeName
                        )
                      }
                      className="text-xs font-semibold text-[var(--store-primary)]"
                    >
                      Clear
                    </button>
                  )}

                </div>


                {/* Values */}

                <div className="flex flex-wrap gap-2">

                  {attribute.terms?.map(
                    (term) => {
                      const termValue =
                        term.slug ||
                        term.name;

                      const normalizedTerm =
                        normalizeAttributeValue(
                          termValue
                        );

                      const selected =
                        currentlySelected ===
                        normalizedTerm;

                      const available =
                        isCombinationAvailable(
                          attributeName,
                          termValue
                        );

                      const isColor =
                        attribute.name
                          .toLowerCase()
                          .includes(
                            "color"
                          ) ||
                        attribute.name
                          .toLowerCase()
                          .includes(
                            "colour"
                          );

                      return (
                        <button
                          key={
                            term.id ||
                            term.slug
                          }
                          type="button"
                          disabled={
                            !available
                          }
                          onClick={() =>
                            selectAttribute(
                              attributeName,
                              termValue
                            )
                          }
                          title={
                            term.name
                          }
                          className={`
                            flex min-h-[42px]
                            items-center justify-center
                            rounded-[var(--store-radius-md)] border px-3
                            text-sm font-semibold
                            transition

                            ${
                              selected
                                ? "border-[var(--store-primary)] bg-[var(--store-primary)] text-white"
                                : "border-[var(--store-border)] bg-white text-[var(--store-dark)]"
                            }

                            ${
                              !available
                                ? "cursor-not-allowed opacity-35"
                                : "hover:border-[var(--store-primary)]"
                            }
                          `}
                        >

                          {isColor ? (
                            <span className="flex items-center gap-2">

                              <span className="h-4 w-4 rounded-full border border-black/10 bg-neutral-200" />

                              {term.name}

                            </span>
                          ) : (
                            term.name
                          )}

                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            );
          }
        )}


      {/* Invalid / incomplete combination */}

      {isVariable &&
        Object.keys(
          selectedAttributes
        ).length > 0 &&
        !selectedVariation && (
          <p className="mt-4 text-sm font-semibold text-amber-600">
            Please select a complete available combination.
          </p>
        )}


      {/* ============================================================
          QUANTITY
      ============================================================ */}

      <div className="mt-7 flex items-center gap-3">

        <div className="flex h-12 items-center overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)]">

          <button
            type="button"
            onClick={() =>
              setQuantity(
                (current) =>
                  Math.max(
                    1,
                    current - 1
                  )
              )
            }
            className="h-full w-11 text-lg hover:bg-[var(--store-soft)]"
          >
            −
          </button>

          <span className="flex h-full min-w-[46px] items-center justify-center border-x border-[var(--store-border)] text-sm font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              setQuantity(
                (current) =>
                  current + 1
              )
            }
            className="h-full w-11 text-lg hover:bg-[var(--store-soft)]"
          >
            +
          </button>

        </div>

      </div>


      {/* ============================================================
          PRIMARY ACTIONS
      ============================================================ */}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">

        <button
          type="button"
          onClick={
            handleAddToCart
          }
          disabled={
            actionLoading ||
            !activeStock ||
            (isVariable &&
              !selectedVariation)
          }
          className="min-h-[50px] rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {actionLoading
            ? "Adding..."
            : added
              ? "Added ✓"
              : "Add to Cart"}
        </button>


        <button
          type="button"
          onClick={handleBuyNow}
          disabled={
            actionLoading ||
            !activeStock ||
            (isVariable &&
              !selectedVariation)
          }
          className="min-h-[50px] rounded-[var(--store-radius-md)] border-2 border-[var(--store-primary)] bg-white px-5 text-sm font-bold text-[var(--store-primary)] transition hover:bg-[var(--store-soft)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {actionLoading
            ? "Please wait..."
            : "Buy Now"}
        </button>

      </div>


      {/* ============================================================
          CONTACT ORDER
      ============================================================ */}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">

        <a
          href={
            whatsappNumber
              ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello, I want to order ${product.name}`
                )}`
              : "#"
          }
          target="_blank"
          rel="noreferrer"
          className="flex min-h-[54px] items-center justify-center rounded-[var(--store-radius-md)] bg-[#16a34a] px-4 font-bold !text-white"
        >
          WhatsApp Order
        </a>

        <a
        href={
          orderPhone
            ? `tel:${orderPhone}`
            : "#"
        }
        className="flex min-h-[54px] items-center justify-center rounded-[var(--store-radius-md)] bg-[#24459a] px-4 font-bold !text-white"
      >
        Call For Order
      </a>

      </div>


      {/* ============================================================
          PRODUCT META
      ============================================================ */}

      <div className="mt-7 space-y-2 border-t border-[var(--store-border)] pt-5 text-sm">

        {categoryNames && (
          <div>

            <span className="text-neutral-400">
              Category:
            </span>{" "}

            <span className="font-medium text-[var(--store-primary)]">
              {categoryNames}
            </span>

          </div>
        )}

        {brandNames && (
          <div>

            <span className="text-neutral-400">
              Brand:
            </span>{" "}

            <span className="font-medium text-[var(--store-primary)]">
              {brandNames}
            </span>

          </div>
        )}

        {product.sku && (
          <div>

            <span className="text-neutral-400">
              SKU:
            </span>{" "}

            {product.sku}

          </div>
        )}

      </div>

      {/* MOBILE PRODUCT FIXED BAR */}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--store-border)] bg-white px-3 py-2 shadow-[0_-7px_25px_rgba(0,0,0,.08)] lg:hidden">

        <div className="mx-auto grid max-w-[500px] grid-cols-[58px_minmax(0,1fr)_58px] items-center gap-2">

          {/* Store */}
          <a
            href="/"
            className="flex flex-col items-center justify-center text-[10px] font-medium !text-[var(--store-dark)]"
          >
            <svg
              viewBox="0 0 24 24"
              width="21"
              height="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M3 10l1.5-6h15L21 10" />
              <path d="M5 10v10h14V10" />
            </svg>

            <span>Store</span>
          </a>


          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              actionLoading ||
              !activeStock ||
              (isVariable &&
                !selectedVariation)
            }
            className="flex min-h-[48px] items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {actionLoading
              ? "Adding..."
              : added
                ? "Added ✓"
                : "+ Add to Cart"}
          </button>


          {/* Cart */}
          <a
            href="/cart"
            className="relative flex flex-col items-center justify-center text-[10px] font-medium !text-[var(--store-dark)]"
          >
            <span className="relative">

              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M3 4h2l2 11h10l2-8H6" />
                <circle cx="9" cy="20" r="1.2" />
                <circle cx="17" cy="20" r="1.2" />
              </svg>

              {cart?.items_count ? (
                <span className="absolute -right-3 -top-3 flex min-h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[var(--store-accent)] px-1 text-[9px] font-bold text-white">
                  {cart.items_count}
                </span>
              ) : null}

            </span>

            <span>Cart</span>
          </a>

        </div>

      </div>

    </div>
    
  );
}