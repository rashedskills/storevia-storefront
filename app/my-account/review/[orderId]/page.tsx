import type {
  Metadata,
} from "next";

import {
  ReviewOrderPage,
} from "@/components/account/review-order-page";


export const metadata: Metadata = {
  title:
    "Review Products",

  robots: {
    index: false,
    follow: false,
  },
};


type PageProps = {
  params: Promise<{
    orderId: string;
  }>;
};


export default async function Page({
  params,
}: PageProps) {

  const {
    orderId,
  } =
    await params;


  return (
    <ReviewOrderPage
      orderId={
        orderId
      }
    />
  );
}