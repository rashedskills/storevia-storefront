"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";

export function HeaderCart({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  const { cart } = useCart();

  const count = cart?.items_count ?? 0;

  if (mobile) {
    return (
      <Link
        href="/cart"
        aria-label="Cart"
        className="relative flex h-[44px] w-[38px] items-center justify-center"
      >
        <svg
          viewBox="0 0 24 24"
          width="25"
          height="25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M3 4h2l2 11h10l2-8H6" />
          <circle cx="9" cy="20" r="1.2" />
          <circle cx="17" cy="20" r="1.2" />
        </svg>

        <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--store-accent)] px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/cart"
      className="flex items-center gap-2 text-sm font-semibold text-[var(--store-dark)]"
    >
      <span className="relative">
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M3 4h2l2 11h10l2-8H6" />
          <circle cx="9" cy="20" r="1.2" />
          <circle cx="17" cy="20" r="1.2" />
        </svg>

        <span className="absolute -right-2 -top-3 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--store-accent)] px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      </span>

      <span>Cart</span>
    </Link>
  );
}