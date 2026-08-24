"use client";

import Link from "next/link";

import {
  trackInitiateCheckout,
} from "@/lib/tracking/facebook";

type CheckoutLinkProps = {
  value: number;
  currency: string;
  itemCount: number;
  className?: string;
  children: React.ReactNode;
};

export function CheckoutLink({
  value,
  currency,
  itemCount,
  className,
  children,
}: CheckoutLinkProps) {
  function handleCheckout() {
    trackInitiateCheckout({
      value,
      currency,
      num_items: itemCount,
      content_type: "product",
    });
  }

  return (
    <Link
      href="/checkout"
      onClick={handleCheckout}
      className={className}
    >
      {children}
    </Link>
  );
}