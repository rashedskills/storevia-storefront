import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WC_URL =
  process.env.WOOCOMMERCE_URL!;

export async function GET() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      "storevia_customer_token"
    )?.value;

  if (!token) {
    return NextResponse.json(
      {
        authenticated: false,
      },
      {
        status: 401,
      }
    );
  }

  const response =
    await fetch(
      `${WC_URL}/wp-json/storevia/v1/customer/account`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        cache: "no-store",
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        authenticated: false,
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json({
    authenticated: true,
    ...data,
  });
}