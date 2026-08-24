import {
  cookies,
} from "next/headers";

import {
  NextResponse,
} from "next/server";


const WP_URL =
  process.env.WOOCOMMERCE_URL;


type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};


export async function GET(
  _request: Request,
  {
    params,
  }: RouteContext
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


  const {
    orderId,
  } =
    await params;


  if (
    !/^\d+$/.test(
      orderId
    )
  ) {

    return NextResponse.json(
      {
        message:
          "Invalid order.",
      },
      {
        status: 400,
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


  const response =
    await fetch(
      `${WP_URL}/wp-json/storevia/v1/customer/orders/${orderId}/reviewable-products`,
      {
        headers: {

          /*
           * IMPORTANT:
           * Change this header if your
           * existing Storevia Core customer
           * authentication uses another
           * token header.
           */
          Authorization:
            `Bearer ${token}`,
        },

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