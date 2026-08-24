import { Container } from "@/components/layout/container";
import { TrackOrderForm } from "@/components/order/track-order-form";

import type {
  Metadata,
} from "next";

export const metadata: Metadata = {
  title:
    "Track Order",

  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <main className="bg-[#f8f8fb] py-6 sm:py-10">
      <Container>
        <div className="mx-auto max-w-[760px]">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--store-primary)]">
            Order Status
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[var(--store-dark)]">
            Track Your Order
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Enter your order number and the mobile number used during checkout.
          </p>

          <TrackOrderForm />
        </div>
      </Container>
    </main>
  );
}