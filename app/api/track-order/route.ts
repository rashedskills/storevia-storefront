import { NextResponse } from "next/server";

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
  try {
    const body =
      await request.json();

    const orderNumber =
      String(
        body.orderNumber ?? ""
      ).trim();

    const phone =
      String(
        body.phone ?? ""
      )
        .replace(/\D/g, "")
        .slice(0, 11);

    if (
      !orderNumber ||
      !/^01\d{9}$/.test(phone)
    ) {
      return NextResponse.json(
        {
          message:
            "Enter a valid order number and mobile number.",
        },
        {
          status: 422,
        }
      );
    }

    const response =
      await fetch(
        `${WC_URL}/wp-json/storevia/v1/track-order`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            order_number:
              orderNumber,

            phone,
          }),

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
            "Order not found.",
        },
        {
          status:
            response.status,
        }
      );
    }

    return NextResponse.json(
      data
    );

  } catch {
    return NextResponse.json(
      {
        message:
          "Unable to track the order. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}