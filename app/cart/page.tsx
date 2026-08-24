import { Container } from "@/components/layout/container";
import { CartPage } from "@/components/cart/cart-page";

import {
  getStoreviaSettings,
} from "@/lib/storevia/settings";

import type {
  Metadata,
} from "next";

export const metadata: Metadata = {
  title: "Cart",

  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const settings =
    await getStoreviaSettings();

  return (
    <CartPage
      settings={settings}
    />
  );
}