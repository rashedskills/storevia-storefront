"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

type WishlistResponse = {
  count?: number;
};

export function WishlistHeaderLink() {
  const [
    count,
    setCount,
  ] = useState(0);

  const [
    loggedIn,
    setLoggedIn,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadWishlist() {
      try {
        const response =
          await fetch(
            "/api/account/wishlist",
            {
              cache: "no-store",
            }
          );

        if (!mounted) {
          return;
        }

        if (
          response.status === 401
        ) {
          setLoggedIn(false);
          setCount(0);
          return;
        }

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as WishlistResponse;

        setLoggedIn(true);

        setCount(
          Number(
            data.count ?? 0
          )
        );
      } catch {
        // Keep header usable even
        // if wishlist request fails.
      }
    }

    loadWishlist();

    /*
     * WishlistButton will dispatch
     * this event after add/remove.
     */
    function handleWishlistChanged() {
      loadWishlist();
    }

    window.addEventListener(
      "storevia:wishlist-changed",
      handleWishlistChanged
    );

    return () => {
      mounted = false;

      window.removeEventListener(
        "storevia:wishlist-changed",
        handleWishlistChanged
      );
    };
  }, []);

  if (!loggedIn) {
    return null;
  }

  return (
    <Link
      href="/my-account/wishlist"
      className="transition hover:text-[var(--store-primary)]"
    >
      Wishlist ({count})
    </Link>
  );
}