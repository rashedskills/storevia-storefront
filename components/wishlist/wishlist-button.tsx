"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";


type WishlistButtonProps = {
  productId: number;

  initialActive?: boolean;

  iconOnly?: boolean;

  className?: string;
};


export function WishlistButton({
  productId,
  initialActive = false,
  iconOnly = false,
  className = "",
}: WishlistButtonProps) {

  const router =
    useRouter();


  const [
    active,
    setActive,
  ] =
    useState(
      initialActive
    );


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  async function toggleWishlist() {

    if (loading) {
      return;
    }


    setLoading(
      true
    );


    try {

      const response =
        await fetch(
          active
            ? `/api/account/wishlist/${productId}`
            : "/api/account/wishlist",
          {
            method:
              active
                ? "DELETE"
                : "POST",

            headers:
              active
                ? undefined
                : {
                    "Content-Type":
                      "application/json",
                  },

            body:
              active
                ? undefined
                : JSON.stringify({
                    product_id:
                      productId,
                  }),
          }
        );


      /*
       * Guest customer.
       */
      if (
        response.status ===
        401
      ) {

        router.push(
          `/my-account?redirect=${encodeURIComponent(
            window.location.pathname
          )}`
        );

        return;
      }


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          "Wishlist error:",
          data
        );

        return;
      }


      setActive(
        !active
      );

      window.dispatchEvent(
        new Event(
          "storevia:wishlist-changed"
        )
      );

    } finally {

      setLoading(
        false
      );
    }
  }


  return (
    <button
      type="button"
      onClick={
        toggleWishlist
      }
      disabled={
        loading
      }
      aria-label={
        active
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className={
        className
      }
    >

      <span
        className={`text-xl ${
          active
            ? "text-[var(--store-primary)]"
            : "text-neutral-500"
        }`}
      >
        {active
          ? "♥"
          : "♡"}
      </span>


      {!iconOnly && (
        <span className="ml-2">
          {active
            ? "Saved"
            : "Add to Wishlist"}
        </span>
      )}

    </button>
  );
}