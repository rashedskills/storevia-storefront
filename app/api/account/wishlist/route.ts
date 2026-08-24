import {
  cookies,
} from "next/headers";

import {
  NextResponse,
} from "next/server";


const WP_URL =
  process.env.WOOCOMMERCE_URL;


async function getToken() {

  const cookieStore =
    await cookies();


  return cookieStore.get(
    "storevia_customer_token"
  )?.value;
}


/* ================================================================
   GET
================================================================ */

export async function GET() {

  if (!WP_URL) {
    return NextResponse.json(
      {
        message:
          "WordPress URL is missing.",
      },
      {
        status: 500,
      }
    );
  }


  const token =
    await getToken();


  if (!token) {

    return NextResponse.json(
      {
        message:
          "Please login to continue.",
      },
      {
        status: 401,
      }
    );
  }


  const response =
    await fetch(
      `${WP_URL}/wp-json/storevia/v1/customer/wishlist`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        cache:
          "no-store",
      }
    );


  const text =
    await response.text();


  let data = {};


  try {
    data =
      text
        ? JSON.parse(text)
        : {};
  } catch {
    return NextResponse.json(
      {
        message:
          "Invalid WordPress response.",
      },
      {
        status: 502,
      }
    );
  }


  return NextResponse.json(
    data,
    {
      status:
        response.status,
    }
  );
}


/* ================================================================
   ADD
================================================================ */

export async function POST(
  request: Request
) {

  if (!WP_URL) {
    return NextResponse.json(
      {
        message:
          "WordPress URL is missing.",
      },
      {
        status: 500,
      }
    );
  }


  const token =
    await getToken();


  if (!token) {

    return NextResponse.json(
      {
        message:
          "Please login to continue.",
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
      `${WP_URL}/wp-json/storevia/v1/customer/wishlist`,
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
          JSON.stringify({
            product_id:
              body.product_id,
          }),

        cache:
          "no-store",
      }
    );


  const data =
    await response.json();


  return NextResponse.json(
    data,
    {
      status:
        response.status,
    }
  );
}