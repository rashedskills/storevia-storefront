import type {
  Metadata,
} from "next";

import {
  WishlistPage,
} from "@/components/wishlist/wishlist-page";


export const metadata: Metadata = {
  title:
    "My Wishlist",

  robots: {
    index: false,
    follow: false,
  },
};


export default function Page() {

  return (
    <WishlistPage />
  );
}