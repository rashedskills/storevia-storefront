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


/* ================================================================
   APPLY COUPON
================================================================ */

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const code =
      String(
        body?.code ?? ""
      ).trim();


    if (!code) {
      return NextResponse.json(
        {
          message:
            "Please enter a coupon code.",
        },
        {
          status: 422,
        }
      );
    }


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
            "Your cart session has expired. Please refresh the page.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * WooCommerce supports applying
     * a coupon to the current cart.
     */
    const endpoint =
      `${WC_URL}/wp-json/wc/store/v1/cart/apply-coupon?code=${encodeURIComponent(
        code
      )}`;


    const wooResponse =
      await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            "Cart-Token":
              cartToken,
          },

          cache:
            "no-store",
        }
      );


    const text =
      await wooResponse.text();


    let data: unknown;


    try {
      data =
        text
          ? JSON.parse(text)
          : {};
    } catch {
      console.error(
        "WooCommerce returned non-JSON:",
        text
      );

      return NextResponse.json(
        {
          message:
            "WooCommerce returned an invalid response.",
        },
        {
          status: 502,
        }
      );
    }


    if (!wooResponse.ok) {
      console.error(
        "WooCommerce apply coupon error:",
        data
      );


      const error =
        data as {
          message?: string;
          code?: string;
        };


      return NextResponse.json(
        {
          message:
            error?.message ||
            "Unable to apply coupon.",

          code:
            error?.code,
        },
        {
          status:
            wooResponse.status,
        }
      );
    }


    return NextResponse.json(
      {
        success: true,
        cart: data,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error(
      "Storevia apply coupon error:",
      error
    );


    return NextResponse.json(
      {
        message:
          "Unable to apply coupon. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}


/* ================================================================
   REMOVE COUPON
================================================================ */

export async function DELETE(
  request: Request
) {
  try {
    const body =
      await request.json();

    const code =
      String(
        body?.code ?? ""
      ).trim();


    if (!code) {
      return NextResponse.json(
        {
          message:
            "Coupon code is required.",
        },
        {
          status: 422,
        }
      );
    }


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
            "Your cart session has expired.",
        },
        {
          status: 400,
        }
      );
    }


    const endpoint =
      `${WC_URL}/wp-json/wc/store/v1/cart/remove-coupon?code=${encodeURIComponent(
        code
      )}`;


    const wooResponse =
      await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            "Cart-Token":
              cartToken,
          },

          cache:
            "no-store",
        }
      );


    const text =
      await wooResponse.text();


    let data: unknown;


    try {
      data =
        text
          ? JSON.parse(text)
          : {};
    } catch {
      return NextResponse.json(
        {
          message:
            "WooCommerce returned an invalid response.",
        },
        {
          status: 502,
        }
      );
    }


    if (!wooResponse.ok) {
      const error =
        data as {
          message?: string;
        };


      return NextResponse.json(
        {
          message:
            error?.message ||
            "Unable to remove coupon.",
        },
        {
          status:
            wooResponse.status,
        }
      );
    }


    return NextResponse.json({
      success: true,
      cart: data,
    });

  } catch (error) {
    console.error(
      "Storevia remove coupon error:",
      error
    );


    return NextResponse.json(
      {
        message:
          "Unable to remove coupon. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}