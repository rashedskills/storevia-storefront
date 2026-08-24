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


type ReviewProduct = {
  item_id: number;
  product_id: number;
  name: string;
  quantity: number;
  image?: string;
  reviewed: boolean;
};


type ReviewData = {
  order_id: number;
  order_number: string;
  products: ReviewProduct[];
};


export function ReviewOrderPage({
  orderId,
}: {
  orderId: string;
}) {
  const [
    data,
    setData,
  ] = useState<ReviewData | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  async function loadProducts() {
    try {
      const response =
  await fetch(
    `/api/account/orders/${orderId}/reviewable-products`,
    {
      cache: "no-store",
    }
  );


const rawText =
  await response.text();


let result: any = {};


if (rawText) {
  try {
    result =
      JSON.parse(
        rawText
      );
  } catch {
    console.error(
      "Review products invalid response:",
      rawText
    );

    throw new Error(
      "Server returned an invalid response."
    );
  }
}


if (!response.ok) {
  throw new Error(
    result?.message ||
    `Unable to load products (${response.status}).`
  );
}


setData(
  result
);

      if (!response.ok) {
        throw new Error(
          result?.message ||
          "Unable to load products."
        );
      }

      setData(
        result
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load products."
      );
    } finally {
      setLoading(
        false
      );
    }
  }


  useEffect(() => {
    loadProducts();
  }, [orderId]);


  if (loading) {
    return (
      <main className="py-10">
        <Container>
          <p className="text-center text-sm text-[var(--store-text)]">
            Loading products...
          </p>
        </Container>
      </main>
    );
  }


  if (
    error ||
    !data
  ) {
    return (
      <main className="py-10">
        <Container>

          <div className="mx-auto max-w-[650px] rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white p-6 text-center">

            <p className="text-sm text-red-500">
              {error ||
                "Unable to load order."}
            </p>

            <Link
              href="/my-account"
              className="mt-5 inline-flex rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-5 py-3 text-sm font-bold !text-white"
            >
              Back to My Account
            </Link>

          </div>

        </Container>
      </main>
    );
  }


  return (
    <main className="bg-[var(--store-soft)] py-7 sm:py-10">

      <Container>

        <div className="mx-auto max-w-[850px]">

          <div className="mb-6">

            <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--store-primary)]">
              Order #{data.order_number}
            </p>

            <h1 className="mt-2 text-2xl font-bold text-[var(--store-dark)] sm:text-3xl">
              Review Your Products
            </h1>

            <p className="mt-2 text-sm text-[var(--store-text)]">
              Share your experience with the products you purchased.
            </p>

          </div>


          <div className="space-y-4">

            {data.products.map(
              (
                product
              ) => (
                <ReviewProductCard
                  key={
                    product.item_id
                  }
                  orderId={
                    data.order_id
                  }
                  product={
                    product
                  }
                  onSuccess={
                    loadProducts
                  }
                />
              )
            )}

          </div>


          <Link
            href="/my-account"
            className="mt-6 inline-flex text-sm font-semibold text-[var(--store-primary)]"
          >
            ← Back to My Account
          </Link>

        </div>

      </Container>

    </main>
  );
}


function ReviewProductCard({
  orderId,
  product,
  onSuccess,
}: {
  orderId: number;
  product: ReviewProduct;
  onSuccess: () => Promise<void>;
}) {
  const [
    rating,
    setRating,
  ] = useState(0);

  const [
    review,
    setReview,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");


  async function submitReview() {
    setMessage("");
    setError("");

    if (
      rating < 1
    ) {
      setError(
        "Please select a star rating."
      );

      return;
    }

    if (
      review.trim().length <
      3
    ) {
      setError(
        "Please write a short review."
      );

      return;
    }


    setSubmitting(
      true
    );


    try {
      const response =
        await fetch(
          "/api/account/reviews",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                order_id:
                  orderId,

                product_id:
                  product.product_id,

                rating,

                review:
                  review.trim(),
              }),
          }
        );


      const result =
        await response.json();


      if (!response.ok) {
        throw new Error(
          result?.message ||
          "Unable to submit review."
        );
      }


      setMessage(
        result?.message ||
        "Thank you for your review."
      );


      await onSuccess();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit review."
      );

    } finally {

      setSubmitting(
        false
      );
    }
  }


  return (
    <article className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-4 sm:p-5">

      <div className="flex gap-4">

        <div className="relative h-[85px] w-[85px] shrink-0 overflow-hidden rounded-[var(--store-radius-md)] bg-[var(--store-soft)]">

          {product.image ? (
            <Image
              src={
                product.image
              }
              alt={
                product.name
              }
              fill
              sizes="85px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-neutral-400">
              No image
            </div>
          )}

        </div>


        <div className="min-w-0 flex-1">

          <h2 className="font-bold text-[var(--store-dark)]">
            {product.name}
          </h2>

          <p className="mt-1 text-xs text-[var(--store-text)]">
            Qty: {product.quantity}
          </p>


          {product.reviewed ? (
            <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
              ✓ Review Submitted
            </div>
          ) : (
            <>
              <div className="mt-4">

                <p className="mb-2 text-xs font-semibold text-[var(--store-dark)]">
                  Your Rating
                </p>

                <div className="flex gap-1">

                  {[
                    1,
                    2,
                    3,
                    4,
                    5,
                  ].map(
                    (
                      star
                    ) => (
                      <button
                        key={
                          star
                        }
                        type="button"
                        onClick={() =>
                          setRating(
                            star
                          )
                        }
                        aria-label={`${star} stars`}
                        className={`text-2xl transition ${
                          star <=
                          rating
                            ? "text-amber-400"
                            : "text-neutral-200 hover:text-amber-300"
                        }`}
                      >
                        ★
                      </button>
                    )
                  )}

                </div>

              </div>


              <textarea
                value={
                  review
                }
                onChange={(
                  event
                ) =>
                  setReview(
                    event.target.value
                  )
                }
                rows={4}
                maxLength={2000}
                placeholder="Write your review..."
                className="mt-4 w-full resize-none rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white p-3 text-sm outline-none transition focus:border-[var(--store-primary)]"
              />


              {error && (
                <p className="mt-2 text-xs text-red-500">
                  {error}
                </p>
              )}


              {message && (
                <p className="mt-2 text-xs text-emerald-600">
                  {message}
                </p>
              )}


              <button
                type="button"
                disabled={
                  submitting
                }
                onClick={
                  submitReview
                }
                className="mt-4 inline-flex min-h-[42px] items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </>
          )}

        </div>

      </div>

    </article>
  );
}