import Image from "next/image";

import type {
  WooProductReview,
} from "@/lib/woocommerce/reviews";


type ProductReviewsProps = {
  reviews:
    WooProductReview[];

  averageRating:
    string | number;

  reviewCount:
    number;
};


export function ProductReviews({
  reviews,
  averageRating,
  reviewCount,
}: ProductReviewsProps) {

  const average =
    Number(
      averageRating || 0
    );


  return (
    <section className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-5 sm:p-6">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 border-b border-[var(--store-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--store-primary)]">
            Customer Feedback
          </p>

          <h2 className="mt-1 text-xl font-bold text-[var(--store-dark)] sm:text-2xl">
            Product Reviews
          </h2>

        </div>


        <div className="flex items-center gap-3">

          <div>

            <p className="text-3xl font-bold text-[var(--store-dark)]">
              {average.toFixed(1)}
            </p>

            <p className="text-xs text-[var(--store-text)]">
              out of 5
            </p>

          </div>


          <div>

            <RatingStars
              rating={
                average
              }
            />

            <p className="mt-1 text-xs text-[var(--store-text)]">
              {reviewCount}
              {" "}
              {reviewCount === 1
                ? "review"
                : "reviews"}
            </p>

          </div>

        </div>

      </div>


      {/* =========================================================
          EMPTY
      ========================================================= */}

      {reviews.length === 0 ? (

        <div className="py-10 text-center">

          <p className="font-semibold text-[var(--store-dark)]">
            No reviews yet.
          </p>

          <p className="mt-1 text-sm text-[var(--store-text)]">
            Customers who complete an order can leave a review from their account.
          </p>

        </div>

      ) : (

        /* =======================================================
           REVIEW LIST
        ======================================================= */

        <div className="divide-y divide-[var(--store-border)]">

          {reviews.map(
            (
              review
            ) => (

              <article
                key={
                  review.id
                }
                className="py-5"
              >

                <div className="flex gap-3">

                  {/* AVATAR */}

                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--store-soft)]">

                    {review
                      .reviewer_avatar_urls
                      ?.[
                        "48"
                      ] ? (

                      <Image
                        src={
                          review
                            .reviewer_avatar_urls[
                              "48"
                            ]!
                        }
                        alt={
                          review.reviewer
                        }
                        fill
                        sizes="40px"
                        className="object-cover"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-sm font-bold text-[var(--store-primary)]">
                        {review.reviewer
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "C"}
                      </div>

                    )}

                  </div>


                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <p className="font-bold text-[var(--store-dark)]">
                        {review.reviewer}
                      </p>


                      {review.verified && (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                          Verified Buyer
                        </span>
                      )}

                    </div>


                    <div className="mt-1 flex flex-wrap items-center gap-2">

                      <RatingStars
                        rating={
                          review.rating
                        }
                      />


                      {review.formatted_date_created && (
                        <span className="text-xs text-[var(--store-text)]">
                          {review.formatted_date_created}
                        </span>
                      )}

                    </div>


                    <div
                      className="mt-3 text-sm leading-6 text-[var(--store-text)]"
                      dangerouslySetInnerHTML={{
                        __html:
                          review.review,
                      }}
                    />

                  </div>

                </div>

              </article>

            )
          )}

        </div>

      )}

    </section>
  );
}


/* ================================================================
   STAR COMPONENT
================================================================ */

function RatingStars({
  rating,
}: {
  rating: number;
}) {

  const percentage =
    Math.min(
      100,
      Math.max(
        0,
        (rating / 5) *
          100
      )
    );


  return (
    <div
      className="relative inline-block text-sm leading-none"
      aria-label={`${rating} out of 5 stars`}
    >

      <span className="tracking-[1px] text-neutral-200">
        ★★★★★
      </span>

      <span
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap tracking-[1px] text-amber-400"
        style={{
          width:
            `${percentage}%`,
        }}
      >
        ★★★★★
      </span>

    </div>
  );
}