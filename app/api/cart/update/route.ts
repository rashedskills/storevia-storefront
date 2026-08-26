import {
  cookies,
} from "next/headers";

import {
  NextResponse,
} from "next/server";


const WC_URL =
  process.env.WOOCOMMERCE_URL;


if (!WC_URL) {
  throw new Error(
    "WOOCOMMERCE_URL is missing"
  );
}


export async function POST(
  request: Request
) {

  const {
    key,
    quantity,
  }: {
    key: string;
    quantity: number;
  } =
    await request.json();


  const cookieStore =
    await cookies();


  const cartToken =
    cookieStore.get(
      "storevia_cart_token"
    )?.value;


  if (!cartToken) {
    return NextResponse.json(
      {
        message:
          "Cart session not found.",
      },
      {
        status: 400,
      }
    );
  }


  const wooResponse =
    await fetch(
      `${WC_URL}/wp-json/wc/store/v1/cart/update-item`,
      {
        method: "POST",

        headers: {
          Accept:
            "application/json",

          "Content-Type":
            "application/json",

          "Cart-Token":
            cartToken,
        },

        body:
          JSON.stringify({
            key,
            quantity,
          }),

        cache:
          "no-store",
      }
    );


  const data =
    await wooResponse.json();


  const returnedToken =
    wooResponse.headers.get(
      "Cart-Token"
    );


  const response =
    NextResponse.json(
      data,
      {
        status:
          wooResponse.status,
      }
    );


  response.cookies.set(
    "storevia_cart_token",
    returnedToken ??
      cartToken,
    {
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV ===
        "production",
      path: "/",
      maxAge:
        60 * 60 * 24 * 30,
    }
  );


  return response;
}