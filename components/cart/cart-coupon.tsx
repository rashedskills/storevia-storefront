"use client";

import {
  useState,
} from "react";

import {
  useCart,
} from "@/components/cart/cart-provider";


function money(
  value: string,
  minorUnit: number
) {
  return (
    Number(value) /
    Math.pow(
      10,
      minorUnit
    )
  ).toLocaleString();
}


export function CartCoupon() {
  const {
    cart,
    actionLoading,
    applyCoupon,
    removeCoupon,
  } = useCart();


  const [
    code,
    setCode,
  ] = useState("");


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  if (!cart) {
    return null;
  }


  async function submitCoupon() {

    setMessage("");
    setError("");


    const couponCode =
      code
        .trim();


    if (!couponCode) {

      setError(
        "Please enter a coupon code."
      );

      return;
    }


    const result =
      await applyCoupon(
        couponCode
      );


    if (!result.success) {

      setError(
        result.message
      );

      return;
    }


    setMessage(
      result.message
    );

    setCode("");
  }


  async function handleRemove(
    couponCode: string
  ) {

    setMessage("");
    setError("");


    try {

      await removeCoupon(
        couponCode
      );


      setMessage(
        "Coupon removed."
      );

    } catch {

      setError(
        "Unable to remove coupon."
      );
    }
  }


  return (
    <div className="border-t border-[var(--store-border)] pt-4">

      <p className="text-sm font-bold text-[var(--store-dark)]">
        Coupon
      </p>


      {/* =========================================================
          COUPON INPUT
      ========================================================= */}

      <div className="mt-3 flex gap-2">

        <input
          value={
            code
          }
          onChange={(
            event
          ) => {

            setCode(
              event.target.value
                .toUpperCase()
            );

            setError("");
            setMessage("");
          }}
          onKeyDown={(
            event
          ) => {

            if (
              event.key ===
              "Enter"
            ) {
              event.preventDefault();

              submitCoupon();
            }
          }}
          placeholder="Coupon code"
          maxLength={50}
          className="h-11 min-w-0 flex-1 rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white px-3 text-sm uppercase outline-none transition focus:border-[var(--store-primary)]"
        />


        <button
          type="button"
          disabled={
            actionLoading
          }
          onClick={
            submitCoupon
          }
          className="h-11 shrink-0 rounded-[var(--store-radius-md)] bg-[var(--store-dark)] px-5 text-sm font-bold text-white transition hover:bg-[var(--store-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLoading
            ? "..."
            : "Apply"}
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <p className="mt-2 text-xs font-medium text-red-500">
          {error}
        </p>
      )}


      {/* SUCCESS */}

      {message && (
        <p className="mt-2 text-xs font-medium text-green-600">
          {message}
        </p>
      )}


      {/* =========================================================
          APPLIED COUPONS
      ========================================================= */}

      {cart.coupons?.length >
        0 && (

        <div className="mt-4 space-y-2">

          {cart.coupons.map(
            (coupon) => (

              <div
                key={
                  coupon.code
                }
                className="flex items-center justify-between gap-3 rounded-[var(--store-radius-md)] bg-[var(--store-soft)] px-3 py-2.5"
              >

                <div className="min-w-0">

                  <p className="text-xs text-[var(--store-text)]">
                    Applied Coupon
                  </p>

                  <p className="truncate text-sm font-bold uppercase text-[var(--store-primary)]">
                    {
                      coupon.code
                    }
                  </p>

                </div>


                <div className="flex shrink-0 items-center gap-3">

                  {coupon.totals
                    ?.total_discount && (

                    <span className="text-sm font-bold text-green-600">

                      -
                      {
                        coupon.totals
                          .currency_symbol
                      }

                      {money(
                        coupon.totals
                          .total_discount,

                        coupon.totals
                          .currency_minor_unit
                      )}

                    </span>
                  )}


                  <button
                    type="button"
                    disabled={
                      actionLoading
                    }
                    onClick={() =>
                      handleRemove(
                        coupon.code
                      )
                    }
                    aria-label={`Remove coupon ${coupon.code}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-neutral-400 transition hover:bg-white hover:text-red-500 disabled:opacity-50"
                  >
                    ×
                  </button>

                </div>

              </div>

            )
          )}

        </div>
      )}

    </div>
  );
}