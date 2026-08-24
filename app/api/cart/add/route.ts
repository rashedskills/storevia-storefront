import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { AddCartItemPayload } from "@/lib/woocommerce/cart-types";

const WC_URL = process.env.WOOCOMMERCE_URL;

if (!WC_URL) {
  throw new Error("WOOCOMMERCE_URL is not configured");
}

async function obtainCartToken(): Promise<string | null> {
  const response = await fetch(
    `${WC_URL}/wp-json/wc/store/v1/cart`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.headers.get("Cart-Token");
}

export async function POST(request: Request) {
  const payload =
    (await request.json()) as AddCartItemPayload;

  const cookieStore = await cookies();

  let cartToken: string | null =
    cookieStore.get("storevia_cart_token")?.value ??
    null;

  if (!cartToken) {
    cartToken = await obtainCartToken();
  }

  if (!cartToken) {
    return NextResponse.json(
      {
        message: "Unable to initialise cart session.",
      },
      {
        status: 500,
      }
    );
  }

  const wooResponse = await fetch(
    `${WC_URL}/wp-json/wc/store/v1/cart/add-item`,
    {
      method: "POST",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
      },

      body: JSON.stringify({
        id: payload.id,
        quantity: payload.quantity,
        variation: payload.variation ?? [],
      }),

      cache: "no-store",
    }
  );

  const data = await wooResponse.json();

  if (!wooResponse.ok) {
    return NextResponse.json(data, {
      status: wooResponse.status,
    });
  }

  const returnedToken =
    wooResponse.headers.get("Cart-Token");

  const response = NextResponse.json(data);

  response.cookies.set(
    "storevia_cart_token",
    returnedToken ?? cartToken,
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  return response;
}