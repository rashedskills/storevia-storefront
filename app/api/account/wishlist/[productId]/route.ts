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
    productId: string;
  }>;
};


export async function DELETE(
  _request: Request,
  {
    params,
  }: RouteContext
) {

  const {
    productId,
  } =
    await params;


  if (
    !WP_URL ||
    !/^\d+$/.test(
      productId
    )
  ) {

    return NextResponse.json(
      {
        message:
          "Invalid request.",
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
          "Please login to continue.",
      },
      {
        status: 401,
      }
    );
  }


  const response =
    await fetch(
      `${WP_URL}/wp-json/storevia/v1/customer/wishlist/${productId}`,
      {
        method:
          "DELETE",

        headers: {
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