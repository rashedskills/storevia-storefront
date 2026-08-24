import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WC_URL = process.env.WOOCOMMERCE_URL!;

export async function POST(request: Request) {
  const {
    key,
  }: {
    key: string;
  } = await request.json();

  const cookieStore = await cookies();

  const cartToken =
    cookieStore.get("storevia_cart_token")
      ?.value;

  if (!cartToken) {
    return NextResponse.json(
      {
        message: "Cart session not found.",
      },
      {
        status: 400,
      }
    );
  }

  const wooResponse = await fetch(
    `${WC_URL}/wp-json/wc/store/v1/cart/remove-item`,
    {
      method: "POST",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
      },

      body: JSON.stringify({
        key,
      }),

      cache: "no-store",
    }
  );

  const data = await wooResponse.json();

  return NextResponse.json(data, {
    status: wooResponse.status,
  });
}