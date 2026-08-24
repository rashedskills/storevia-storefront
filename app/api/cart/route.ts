import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WC_URL = process.env.WOOCOMMERCE_URL;

if (!WC_URL) {
  throw new Error("WOOCOMMERCE_URL is missing");
}

export async function GET() {
  const cookieStore = await cookies();

  const existingToken =
    cookieStore.get("storevia_cart_token")?.value;

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (existingToken) {
    headers["Cart-Token"] = existingToken;
  }

  const wooResponse = await fetch(
    `${WC_URL}/wp-json/wc/store/v1/cart`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  const data = await wooResponse.json();

  const cartToken =
    wooResponse.headers.get("Cart-Token");

  const response = NextResponse.json(data, {
    status: wooResponse.status,
  });

  if (cartToken) {
    response.cookies.set(
      "storevia_cart_token",
      cartToken,
      {
        httpOnly: true,
        sameSite: "lax",
        secure:
          process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      }
    );
  }

  return response;
}