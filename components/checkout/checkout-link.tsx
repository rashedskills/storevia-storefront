"use client";

import Link from "next/link";

import {
  trackInitiateCheckout,
} from "@/lib/tracking/facebook";


type CheckoutLinkProps = {
  href?: string;

  value: number;

  currency: string;

  itemCount: number;

  className?: string;

  children:
    React.ReactNode;
};


export function CheckoutLink({
  href = "/checkout",
  value,
  currency,
  itemCount,
  className,
  children,
}: CheckoutLinkProps) {

  return (
    <Link
      href={href}
      onClick={() => {

        trackInitiateCheckout({
          value,

          currency,

          num_items:
            itemCount,

          content_type:
            "product",
        });

      }}
      className={
        className
      }
    >
      {children}
    </Link>
  );
}