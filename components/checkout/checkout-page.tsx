"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";

import type { StoreviaSettings } from "@/lib/storevia/settings";

type Props = {
  settings: StoreviaSettings;
};

type FieldErrors = {
  name?: string;
  phone?: string;
  address?: string;
  bkashSender?: string;
  transactionId?: string;
};

function money(
  value: string,
  minorUnit: number
) {
  return (
    Number(value) /
    Math.pow(10, minorUnit)
  ).toLocaleString();
}

function normalizePhone(value: string) {
  return value
    .replace(/\s+/g, "")
    .replace(/-/g, "");
}

export function CheckoutPage({
  settings,
}: Props) {
  const router = useRouter();

  const {
  cart,
  loading,
  actionLoading,
  removeItem,
  refreshCart,
} = useCart();

  /* ================================================================
     CUSTOMER
  ================================================================ */

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  /* ================================================================
     DELIVERY
  ================================================================ */

  const [
    deliveryArea,
    setDeliveryArea,
  ] = useState<
    "inside" | "outside"
  >("inside");

  /* ================================================================
     PAYMENT
  ================================================================ */

  const defaultPayment:
    | "cod"
    | "bkash" =
    Boolean(settings.cod_enabled)
      ? "cod"
      : "bkash";

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<
    "cod" | "bkash"
  >(defaultPayment);

  const [
    bkashSender,
    setBkashSender,
  ] = useState("");

  const [
    transactionId,
    setTransactionId,
  ] = useState("");

  const [
    copiedBkash,
    setCopiedBkash,
  ] = useState(false);

  /* ================================================================
     UI STATE
  ================================================================ */

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState<FieldErrors>({});

  /* ================================================================
     TOTALS
  ================================================================ */

  const deliveryCharge =
    deliveryArea === "inside"
      ? Number(
          settings.inside_city_charge
        )
      : Number(
          settings.outside_city_charge
        );

  /*
   * This currently represents the
   * WooCommerce cart total before our
   * Storevia delivery preview.
   */
const minorUnit =
  cart
    ? cart.totals
        .currency_minor_unit
    : 2;


const itemsSubtotal =
  cart
    ? Number(
        cart.totals
          .total_items
      ) /
      Math.pow(
        10,
        minorUnit
      )
    : 0;


const discount =
  cart
    ? Number(
        cart.totals
          .total_discount
      ) /
      Math.pow(
        10,
        minorUnit
      )
    : 0;


/*
 * WooCommerce authoritative
 * cart total after discounts.
 */
const cartTotal =
  cart
    ? Number(
        cart.totals
          .total_price
      ) /
      Math.pow(
        10,
        minorUnit
      )
    : 0;


/*
 * Preview:
 * Woo total + Storevia delivery fee.
 */
const previewTotal =
  cartTotal +
  deliveryCharge;



  /* ================================================================
     FIELD HELPERS
  ================================================================ */

  function clearFieldError(
    field: keyof FieldErrors
  ) {
    setFieldErrors(
      (current) => {
        if (!current[field]) {
          return current;
        }

        return {
          ...current,
          [field]: undefined,
        };
      }
    );
  }

  /* ================================================================
     COPY BKASH
  ================================================================ */

  async function copyBkashNumber() {
    if (!settings.bkash_number) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        settings.bkash_number
      );

      setCopiedBkash(true);

      window.setTimeout(() => {
        setCopiedBkash(false);
      }, 1500);
    } catch {
      setError(
        "Unable to copy the bKash number. Please copy it manually."
      );
    }
  }

  /* ================================================================
     VALIDATION
  ================================================================ */

  function validateCheckout() {
    const errors: FieldErrors = {};

    const cleanPhone =
      normalizePhone(phone);

    const cleanBkashSender =
      normalizePhone(
        bkashSender
      );

    if (!name.trim()) {
      errors.name =
        "Full name is required.";
    } else if (
      name.trim().length < 2
    ) {
      errors.name =
        "Please enter a valid name.";
    }

    if (!cleanPhone) {
      errors.phone =
        "Mobile number is required.";
    } else if (
      !/^01\d{9}$/.test(
        cleanPhone
      )
    ) {
      errors.phone =
        "Enter a valid 11-digit mobile number.";
    }

    if (!address.trim()) {
      errors.address =
        "Delivery address is required.";
    } else if (
      address.trim().length < 5
    ) {
      errors.address =
        "Please enter your complete delivery address.";
    }

    if (
      paymentMethod === "bkash"
    ) {
      if (!cleanBkashSender) {
        errors.bkashSender =
          "bKash sender number is required.";
      } else if (
        !/^01\d{9}$/.test(
          cleanBkashSender
        )
      ) {
        errors.bkashSender =
          "Enter a valid 11-digit bKash number.";
      }

      if (
        !transactionId.trim()
      ) {
        errors.transactionId =
          "Transaction ID is required.";
      } else if (
        transactionId.trim()
          .length < 5
      ) {
        errors.transactionId =
          "Enter a valid Transaction ID.";
      }
    }

    setFieldErrors(errors);

    return (
      Object.keys(errors)
        .length === 0
    );
  }

  /* ================================================================
     SUBMIT
  ================================================================ */
  
  async function submitOrder() {
    if (
      submitting ||
      actionLoading
    ) {
      return;
    }

    setError("");

    if (!validateCheckout()) {
      return;
    }

    setSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/checkout",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: name.trim(),

              phone:
                normalizePhone(
                  phone
                ),

              address:
                address.trim(),

              deliveryArea,

              paymentMethod,

              bkashSender:
                paymentMethod ===
                "bkash"
                  ? normalizePhone(
                      bkashSender
                    )
                  : undefined,

              bkashTransactionId:
                paymentMethod ===
                "bkash"
                  ? transactionId
                      .trim()
                      .toUpperCase()
                  : undefined,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data?.message ||
            data?.data?.message ||
            "Unable to place your order."
        );

        return;
      }

      await fetch("/api/cart/reset", {
        method: "POST",
      });

      await refreshCart();

      const orderNumber =
        String(
          data.order_number ??
          data.order_id
        );


      sessionStorage.setItem(
        `storevia_purchase_payload_${orderNumber}`,

        JSON.stringify({
          orderId:
            data.order_id,

          value:
            previewTotal,

          currency:
            cart.totals
              .currency_code,

          itemCount:
            cart.items_count,
        })
      );


      router.push(
        `/order-success?order=${encodeURIComponent(
          orderNumber
        )}`
      );

      router.push(
        `/order-success?order=${
          data.order_number ??
          data.order_id ??
          ""
        }`
      );
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* ================================================================
     LOADING
  ================================================================ */

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading checkout...
      </div>
    );
  }

  /* ================================================================
     EMPTY CART
  ================================================================ */

  if (
    !cart ||
    !cart.items.length
  ) {
    return (
      <div className="py-20 text-center">

        <h1 className="text-2xl font-bold">
          Your cart is empty
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Add some products before proceeding to checkout.
        </p>

        <Link
          href="/shop"
          className="mt-5 inline-flex rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-6 py-3 font-bold !text-white"
        >
          Go to Shop
        </Link>

      </div>
    );
  }

  return (
    <div className="grid gap-7 pb-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:pb-0">

      {/* ============================================================
          LEFT
      ============================================================ */}

      <div className="space-y-6">

        {/* ==========================================================
            DELIVERY ADDRESS
        ========================================================== */}

        <section className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-4 sm:p-6">

          <h2 className="text-xl font-bold text-[var(--store-dark)]">
            Delivery Address
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Only the essential information is required.
          </p>


          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            {/* NAME */}

            <div>

              <input
                value={name}
                onChange={(
                  event
                ) => {
                  setName(
                    event.target.value
                  );

                  clearFieldError(
                    "name"
                  );
                }}
                placeholder="Full Name *"
                autoComplete="name"
                aria-invalid={
                  Boolean(
                    fieldErrors.name
                  )
                }
                className={`h-12 w-full rounded-[var(--store-radius-md)] border px-4 text-sm outline-none transition ${
                  fieldErrors.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-[var(--store-border)] focus:border-[var(--store-primary)]"
                }`}
              />

              {fieldErrors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {
                    fieldErrors.name
                  }
                </p>
              )}

            </div>


            {/* PHONE */}

            <div>

              <input
                value={phone}
                onChange={(
                  event
                ) => {
                  /*
                   * Keep only numbers.
                   */
                  const value =
                    event.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        11
                      );

                  setPhone(value);

                  clearFieldError(
                    "phone"
                  );
                }}
                placeholder="Mobile Number *"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={11}
                aria-invalid={
                  Boolean(
                    fieldErrors.phone
                  )
                }
                className={`h-12 w-full rounded-[var(--store-radius-md)] border px-4 text-sm outline-none transition ${
                  fieldErrors.phone
                    ? "border-red-400 focus:border-red-500"
                    : "border-[var(--store-border)] focus:border-[var(--store-primary)]"
                }`}
              />

              {fieldErrors.phone && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {
                    fieldErrors.phone
                  }
                </p>
              )}

            </div>

          </div>


          {/* ADDRESS */}

          <div className="mt-3">

            <textarea
              value={address}
              onChange={(
                event
              ) => {
                setAddress(
                  event.target.value
                );

                clearFieldError(
                  "address"
                );
              }}
              placeholder="Full Address — Area, Thana, District *"
              rows={3}
              autoComplete="street-address"
              aria-invalid={
                Boolean(
                  fieldErrors.address
                )
              }
              className={`w-full resize-none rounded-[var(--store-radius-md)] border p-4 text-sm outline-none transition ${
                fieldErrors.address
                  ? "border-red-400 focus:border-red-500"
                  : "border-[var(--store-border)] focus:border-[var(--store-primary)]"
              }`}
            />

            {fieldErrors.address && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {
                  fieldErrors.address
                }
              </p>
            )}

          </div>

        </section>


        {/* ==========================================================
            DELIVERY AREA
        ========================================================== */}

        <section className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-4 sm:p-6">

          <h2 className="text-xl font-bold">
            Delivery Area
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Select where you want the order delivered.
          </p>


          <div className="mt-4 grid gap-3 sm:grid-cols-2">

            {/* INSIDE */}

            <button
              type="button"
              onClick={() =>
                setDeliveryArea(
                  "inside"
                )
              }
              className={`relative rounded-[var(--store-radius-md)] border-2 p-4 text-left transition ${
                deliveryArea ===
                "inside"
                  ? "border-[var(--store-primary)] bg-[var(--store-soft)]"
                  : "border-[var(--store-border)] hover:border-neutral-300"
              }`}
            >

              {deliveryArea ===
                "inside" && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--store-primary)] text-[11px] font-bold text-white">
                  ✓
                </span>
              )}

              <div className="pr-7 font-bold">
                {
                  settings.inside_city_label
                }{" "}
                {
                  settings.checkout_city_name
                }
              </div>

              <div className="mt-1 text-sm text-neutral-500">
                Delivery Charge: ৳
                {Number(
                  settings.inside_city_charge
                ).toLocaleString()}
              </div>

            </button>


            {/* OUTSIDE */}

            <button
              type="button"
              onClick={() =>
                setDeliveryArea(
                  "outside"
                )
              }
              className={`relative rounded-[var(--store-radius-md)] border-2 p-4 text-left transition ${
                deliveryArea ===
                "outside"
                  ? "border-[var(--store-primary)] bg-[var(--store-soft)]"
                  : "border-[var(--store-border)] hover:border-neutral-300"
              }`}
            >

              {deliveryArea ===
                "outside" && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--store-primary)] text-[11px] font-bold text-white">
                  ✓
                </span>
              )}

              <div className="pr-7 font-bold">
                {
                  settings.outside_city_label
                }{" "}
                {
                  settings.checkout_city_name
                }
              </div>

              <div className="mt-1 text-sm text-neutral-500">
                Delivery Charge: ৳
                {Number(
                  settings.outside_city_charge
                ).toLocaleString()}
              </div>

            </button>

          </div>

        </section>


        {/* ==========================================================
            PAYMENT
        ========================================================== */}

        <section className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-4 sm:p-6">

          <h2 className="text-xl font-bold">
            Select a Payment Option
          </h2>


          <div className="mt-4 grid grid-cols-2 gap-3">

            {/* COD */}

            {Boolean(
              settings.cod_enabled
            ) && (
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod(
                    "cod"
                  );

                  setFieldErrors(
                    (current) => ({
                      ...current,
                      bkashSender:
                        undefined,
                      transactionId:
                        undefined,
                    })
                  );
                }}
                className={`relative min-h-[90px] rounded-[var(--store-radius-md)] border-2 p-3 font-bold transition ${
                  paymentMethod ===
                  "cod"
                    ? "border-[var(--store-primary)] bg-[var(--store-soft)]"
                    : "border-[var(--store-border)]"
                }`}
              >

                {paymentMethod ===
                  "cod" && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--store-primary)] text-[10px] text-white">
                    ✓
                  </span>
                )}

                <span className="text-2xl">
                  💵
                </span>

                <div className="mt-1">
                  {
                    settings.cod_title
                  }
                </div>

              </button>
            )}


            {/* BKASH */}

            {Boolean(
              settings.bkash_enabled
            ) && (
              <button
                type="button"
                onClick={() =>
                  setPaymentMethod(
                    "bkash"
                  )
                }
                className={`relative min-h-[90px] rounded-[var(--store-radius-md)] border-2 p-3 font-bold transition ${
                  paymentMethod ===
                  "bkash"
                    ? "border-[var(--store-primary)] bg-[var(--store-soft)]"
                    : "border-[var(--store-border)]"
                }`}
              >

                {paymentMethod ===
                  "bkash" && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--store-primary)] text-[10px] text-white">
                    ✓
                  </span>
                )}

                <span className="text-xl">
                  বিকাশ
                </span>

                <div className="mt-1">
                  {
                    settings.bkash_title
                  }
                </div>

              </button>
            )}

          </div>


          {/* ========================================================
              BKASH DETAILS
          ======================================================== */}

          {paymentMethod ===
            "bkash" && (
            <div className="mt-5 rounded-[var(--store-radius-md)] bg-neutral-100 p-4 sm:p-5">

              {/* BKASH NUMBER */}

              <div className="flex items-center justify-between gap-3 rounded-[var(--store-radius-md)] bg-white px-4 py-3">

                <div className="min-w-0">

                  <p className="text-xs text-neutral-500">
                    bKash Number
                  </p>

                  <p className="mt-0.5 break-all text-base font-bold text-[var(--store-dark)]">
                    {
                      settings.bkash_number
                    }
                  </p>

                </div>


                <button
                  type="button"
                  onClick={
                    copyBkashNumber
                  }
                  className="flex h-10 shrink-0 items-center gap-2 rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white px-3 text-xs font-semibold transition hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
                >

                  {/* Copy Icon */}

                  <svg
                    viewBox="0 0 24 24"
                    width="17"
                    height="17"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="8"
                      y="8"
                      width="11"
                      height="11"
                      rx="2"
                    />

                    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                  </svg>

                  {copiedBkash
                    ? "Copied!"
                    : "Copy"}

                </button>

              </div>


              <h3 className="mt-5 font-bold">
                bKash Payment Instructions
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-600">
                {
                  settings.bkash_instructions
                }
              </p>


              <div className="mt-5 space-y-3">

                {/* BKASH SENDER */}

                <div>

                  <input
                    value={
                      bkashSender
                    }
                    onChange={(
                      event
                    ) => {
                      const value =
                        event.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            11
                          );

                      setBkashSender(
                        value
                      );

                      clearFieldError(
                        "bkashSender"
                      );
                    }}
                    placeholder="Your bKash Number *"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={11}
                    aria-invalid={
                      Boolean(
                        fieldErrors.bkashSender
                      )
                    }
                    className={`h-12 w-full rounded-[var(--store-radius-md)] border bg-white px-4 text-sm outline-none transition ${
                      fieldErrors.bkashSender
                        ? "border-red-400 focus:border-red-500"
                        : "border-[var(--store-border)] focus:border-[var(--store-primary)]"
                    }`}
                  />

                  {fieldErrors.bkashSender && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {
                        fieldErrors.bkashSender
                      }
                    </p>
                  )}

                </div>


                {/* TRANSACTION ID */}

                <div>

                  <input
                    value={
                      transactionId
                    }
                    onChange={(
                      event
                    ) => {
                      setTransactionId(
                        event.target.value
                          .replace(
                            /\s/g,
                            ""
                          )
                          .toUpperCase()
                      );

                      clearFieldError(
                        "transactionId"
                      );
                    }}
                    placeholder="Transaction ID *"
                    autoComplete="off"
                    maxLength={30}
                    aria-invalid={
                      Boolean(
                        fieldErrors.transactionId
                      )
                    }
                    className={`h-12 w-full rounded-[var(--store-radius-md)] border bg-white px-4 text-sm uppercase outline-none transition ${
                      fieldErrors.transactionId
                        ? "border-red-400 focus:border-red-500"
                        : "border-[var(--store-border)] focus:border-[var(--store-primary)]"
                    }`}
                  />

                  {fieldErrors.transactionId && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {
                        fieldErrors.transactionId
                      }
                    </p>
                  )}

                </div>

              </div>

            </div>
          )}

        </section>


        {/* GENERAL ERROR */}

        {error && (
          <div
            role="alert"
            className="rounded-[var(--store-radius-md)] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

      </div>


      {/* ============================================================
          ORDER SIDE
      ============================================================ */}

      <aside>

        <div className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-4 sm:p-5 lg:sticky lg:top-[145px]">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold">
              Order Items
            </h2>

            <span className="rounded-full bg-[var(--store-soft)] px-3 py-1 text-xs font-bold text-[var(--store-primary)]">
              {cart.items_count}{" "}
              {cart.items_count === 1
                ? "Item"
                : "Items"}
            </span>

          </div>


          {/* ITEMS */}

          <div className="mt-4 divide-y divide-[var(--store-border)]">

            {cart.items.map(
              (item) => {
                const image =
                  item.images?.[0];

                return (
                  <div
                    key={item.key}
                    className="relative flex gap-3 py-4 pr-7"
                  >

                    {/* REMOVE */}

                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      title="Remove item"
                      disabled={
                        actionLoading ||
                        submitting
                      }
                      onClick={() =>
                        removeItem(
                          item.key
                        )
                      }
                      className="absolute right-0 top-4 flex h-7 w-7 items-center justify-center rounded-full text-xl leading-none text-neutral-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ×
                    </button>


                    {/* IMAGE */}

                    <div className="relative h-[65px] w-[65px] shrink-0 overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-neutral-50">

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
                          sizes="65px"
                          className="object-cover"
                        />
                      )}

                    </div>


                    {/* PRODUCT INFO */}

                    <div className="min-w-0 flex-1">

                      <div className="pr-2 text-sm font-bold leading-snug text-[var(--store-dark)]">
                        {item.name}
                      </div>


                      {/* VARIATION */}

                      {item.variation
                        ?.length >
                        0 && (
                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-neutral-500">

                          {item.variation.map(
                            (
                              variation
                            ) => (
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
                                  {
                                    variation.value
                                  }
                                </strong>
                              </span>
                            )
                          )}

                        </div>
                      )}


                      <div className="mt-2 text-xs text-neutral-500">
                        Qty:{" "}
                        {
                          item.quantity
                        }
                      </div>

                    </div>


                    {/* PRICE */}

                    <div className="shrink-0 pr-1 text-sm font-bold text-[var(--store-dark)]">

                      {
                        item.totals
                          .currency_symbol
                      }

                      {money(
                        item.totals
                          .line_total,
                        item.totals
                          .currency_minor_unit
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>


          {/* ========================================================
              TOTALS
          ======================================================== */}

          <div className="border-t border-[var(--store-border)] pt-4">

          {/* =========================================================
              SUBTOTAL
          ========================================================= */}

          <div className="flex items-center justify-between py-2 text-sm">

            <span className="text-[var(--store-text)]">
              Subtotal
            </span>

            <span className="font-medium text-[var(--store-dark)]">
              {cart.totals.currency_symbol}
              {itemsSubtotal.toLocaleString()}
            </span>

          </div>


          {/* =========================================================
              COUPON DISCOUNT
          ========================================================= */}

          {discount > 0 && (
            <div className="flex items-center justify-between py-2 text-sm">

              <span className="text-green-600">
                Coupon Discount
              </span>

              <span className="font-semibold text-green-600">
                -
                {cart.totals.currency_symbol}
                {discount.toLocaleString()}
              </span>

            </div>
          )}


          {/* =========================================================
              APPLIED COUPONS
          ========================================================= */}

          {cart.coupons?.length > 0 && (
            <div className="pb-2">

              {cart.coupons.map(
                (coupon) => (
                  <div
                    key={coupon.code}
                    className="flex items-center justify-between py-1 text-xs"
                  >

                    <span className="text-[var(--store-text)]">
                      Coupon
                    </span>

                    <span className="font-semibold uppercase text-[var(--store-primary)]">
                      {coupon.code}
                    </span>

                  </div>
                )
              )}

            </div>
          )}


          {/* =========================================================
              DELIVERY CHARGE
          ========================================================= */}

          <div className="flex items-center justify-between py-2 text-sm">

            <span className="text-[var(--store-text)]">
              Delivery Charge
            </span>

            <span className="font-medium text-[var(--store-dark)]">
              {cart.totals.currency_symbol}
              {deliveryCharge.toLocaleString()}
            </span>

          </div>


          {/* =========================================================
              GRAND TOTAL
          ========================================================= */}

          <div className="mt-2 flex items-center justify-between border-t border-[var(--store-border)] pt-4">

            <span className="text-base font-bold text-[var(--store-dark)] sm:text-lg">
              Grand Total
            </span>

            <span className="text-lg font-bold text-[var(--store-primary)] sm:text-xl">
              {cart.totals.currency_symbol}
              {previewTotal.toLocaleString()}
            </span>

          </div>

        </div>


          {/* DESKTOP CONFIRM */}

          <button
            type="button"
            disabled={
              submitting ||
              actionLoading
            }
            onClick={
              submitOrder
            }
            className="mt-5 hidden min-h-[50px] w-full items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-5 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex"
          >
            {submitting
              ? "Placing Order..."
              : "Confirm Order"}
          </button>


          <Link
            href="/cart"
            className="mt-3 hidden text-center text-sm font-medium text-neutral-500 transition hover:text-[var(--store-primary)] sm:block"
          >
            ← Back to Cart
          </Link>

        </div>

      </aside>


      {/* ============================================================
          MOBILE FIXED CONFIRM
      ============================================================ */}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--store-border)] bg-white px-4 py-3 shadow-[0_-7px_25px_rgba(0,0,0,.08)] sm:hidden">

        <div className="mx-auto flex max-w-[500px] items-center gap-3">

          <div className="min-w-0 flex-1">

            <p className="text-[10px] text-neutral-500">
              Grand Total
            </p>

            <p className="text-lg font-bold text-[var(--store-primary)]">
              ৳
              {previewTotal.toLocaleString()}
            </p>

          </div>


          <button
            type="button"
            disabled={
              submitting ||
              actionLoading
            }
            onClick={
              submitOrder
            }
            className="flex min-h-[48px] min-w-[160px] items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Processing..."
              : "Confirm Order"}
          </button>

        </div>

      </div>

    </div>
  );
}

