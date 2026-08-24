import { NextResponse } from "next/server";

const WC_URL =
  process.env.WOOCOMMERCE_URL!;

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const response =
    await fetch(
      `${WC_URL}/wp-json/storevia/v1/customer/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(body),

        cache: "no-store",
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        message:
          data?.message ||
          "Unable to login.",
      },
      {
        status:
          response.status,
      }
    );
  }

  const result =
    NextResponse.json({
      success: true,
      customer:
        data.customer,
    });

  result.cookies.set(
    "storevia_customer_token",
    data.token,
    {
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV ===
        "production",

      path: "/",

      maxAge:
        60 *
        60 *
        24 *
        30,
    }
  );

  return result;
}