import { Container } from "@/components/layout/container";
import { CheckoutPage } from "@/components/checkout/checkout-page";

import { getStoreviaSettings } from "@/lib/storevia/settings";

import type {
  Metadata,
} from "next";

export const metadata: Metadata = {
  title: "Checkout",

  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const settings =
    await getStoreviaSettings();

  return (
    <main className="bg-[#f8f8fb] py-5 sm:py-8">
      <Container>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--store-primary)]">
            Secure Checkout
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-[-.03em]">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Enter your delivery details and confirm your order.
          </p>
        </div>

        <CheckoutPage
          settings={settings}
        />

      </Container>
    </main>
  );
}