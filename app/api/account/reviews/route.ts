import {
  cookies,
} from "next/headers";

import {
  NextResponse,
} from "next/server";


const WP_URL =
  process.env.WOOCOMMERCE_URL;


export async function POST(
  request: Request
) {

  if (!WP_URL) {

    return NextResponse.json(
      {
        message:
          "WordPress URL is not configured.",
      },
      {
        status: 500,
      }
    );
  }


  const cookieStore =
    await cookies();


  const token =
    cookieStore.get(
      "storevia_customer_token"
    )?.value;


  if (!token) {

    return NextResponse.json(
      {
        message:
          "Please login first.",
      },
      {
        status: 401,
      }
    );
  }


  const body =
    await request.json();


  const response =
    await fetch(
      `${WP_URL}/wp-json/storevia/v1/customer/reviews`,
      {
        method:
          "POST",

        headers: {
          Accept:
            "application/json",

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body:
          JSON.stringify(
            body
          ),

        cache:
          "no-store",
      }
    );


  const text =
    await response.text();


  let data;


  try {

    data =
      text
        ? JSON.parse(text)
        : {};

  } catch {

    data = {
      message:
        "Invalid response from WordPress.",
    };
  }


  return NextResponse.json(
    data,
    {
      status:
        response.status,
    }
  );
}