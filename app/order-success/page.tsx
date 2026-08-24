import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  Container,
} from "@/components/layout/container";

import {
  OrderSuccessPurchaseEvent,
} from "@/components/tracking/order-success-purchase-event";


export const metadata: Metadata = {
  title:
    "Order Successful",

  robots: {
    index: false,
    follow: false,
  },
};


type PageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};


export default async function OrderSuccessPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;


  /*
   * Keep only safe characters in
   * the displayed order number.
   */
  const orderNumber =
    String(
      params.order ?? ""
    )
      .replace(
        /[^a-zA-Z0-9_-]/g,
        ""
      )
      .slice(
        0,
        50
      );


  return (
    <main className="bg-[var(--store-soft)] py-10 sm:py-16">

      {/* =========================================================
          META PURCHASE EVENT
          
          The component reads the verified purchase payload that
          Checkout stored in sessionStorage after WooCommerce
          successfully created the order.
      ========================================================= */}

      {orderNumber && (
        <OrderSuccessPurchaseEvent
          orderNumber={
            orderNumber
          }
        />
      )}


      <Container>

        <div className="mx-auto max-w-[650px] rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-6 text-center shadow-sm sm:p-10">

          {/* =====================================================
              SUCCESS ICON
          ===================================================== */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">

            <svg
              viewBox="0 0 24 24"
              width="40"
              height="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-600"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />

              <path d="m8 12 2.5 2.5L16.5 9" />
            </svg>

          </div>


          {/* =====================================================
              TITLE
          ===================================================== */}

          <p className="mt-6 text-xs font-bold uppercase tracking-[.18em] text-[var(--store-primary)]">
            Order Confirmed
          </p>


          <h1 className="mt-2 text-3xl font-bold tracking-[-.03em] text-[var(--store-dark)] sm:text-4xl">
            Thank you for your order!
          </h1>


          <p className="mx-auto mt-3 max-w-[480px] text-sm leading-6 text-[var(--store-text)]">
            Your order has been received successfully.
            Our team will process it shortly.
          </p>


          {/* =====================================================
              ORDER NUMBER
          ===================================================== */}

          {orderNumber && (
            <div className="mx-auto mt-6 max-w-[360px] rounded-[var(--store-radius-md)] bg-[var(--store-soft)] px-5 py-4">

              <p className="text-xs text-[var(--store-text)]">
                Order Number
              </p>

              <p className="mt-1 text-xl font-bold text-[var(--store-primary)]">
                #{orderNumber}
              </p>

            </div>
          )}


          {/* =====================================================
              ACTIONS
          ===================================================== */}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">

            <Link
              href="/shop"
              className="flex min-h-[48px] items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-5 text-sm font-bold !text-white transition hover:opacity-90"
            >
              Continue Shopping
            </Link>


            {orderNumber ? (
              <Link
                href="/track-order"
                className="flex min-h-[48px] items-center justify-center rounded-[var(--store-radius-md)] border border-[var(--store-primary)] bg-white px-5 text-sm font-bold !text-[var(--store-primary)] transition hover:bg-[var(--store-soft)]"
              >
                Track Order
              </Link>
            ) : (
              <Link
                href="/"
                className="flex min-h-[48px] items-center justify-center rounded-[var(--store-radius-md)] border border-[var(--store-primary)] bg-white px-5 text-sm font-bold !text-[var(--store-primary)] transition hover:bg-[var(--store-soft)]"
              >
                Back to Home
              </Link>
            )}

          </div>

        </div>

      </Container>

    </main>
  );
}