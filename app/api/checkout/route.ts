import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WC_URL =
  process.env.WOOCOMMERCE_URL;

if (!WC_URL) {
  throw new Error(
    "WOOCOMMERCE_URL is missing"
  );
}

type CheckoutPayload = {
  name: string;
  phone: string;
  address: string;

  deliveryArea:
    | "inside"
    | "outside";

  paymentMethod:
    | "cod"
    | "bkash";

  bkashSender?: string;
  bkashTransactionId?: string;
};

type StoreviaSettings = {
  checkout_city_name?: string;
};

function cleanText(
  value: unknown
) {
  return String(value ?? "")
    .trim()
    .replace(/[<>]/g, "");
}

function normalizePhone(
  value: string
) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11);
}

/* ================================================================
   STORE SETTINGS
================================================================ */

async function getStoreviaSettings(): Promise<StoreviaSettings> {
  const response = await fetch(
    `${WC_URL}/wp-json/storevia/v1/settings`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load Storevia settings."
    );
  }

  return response.json();
}

/* ================================================================
   CHECKOUT
================================================================ */

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as CheckoutPayload;

    /* ============================================================
       SANITIZE
    ============================================================ */

    const name =
      cleanText(body.name);

    const phone =
      normalizePhone(
        cleanText(body.phone)
      );

    const address =
      cleanText(body.address);

    const deliveryArea =
      body.deliveryArea;

    const paymentMethod =
      body.paymentMethod;

    /* ============================================================
       VALIDATION
    ============================================================ */

    if (
      name.length < 2 ||
      name.length > 100
    ) {
      return NextResponse.json(
        {
          message:
            "Please enter a valid full name.",
        },
        {
          status: 422,
        }
      );
    }

    if (!/^01\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          message:
            "Please enter a valid 11-digit mobile number.",
        },
        {
          status: 422,
        }
      );
    }

    if (
      address.length < 5 ||
      address.length > 500
    ) {
      return NextResponse.json(
        {
          message:
            "Please enter your complete delivery address.",
        },
        {
          status: 422,
        }
      );
    }

    if (
      deliveryArea !== "inside" &&
      deliveryArea !== "outside"
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid delivery area.",
        },
        {
          status: 422,
        }
      );
    }

    if (
      paymentMethod !== "cod" &&
      paymentMethod !== "bkash"
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid payment method.",
        },
        {
          status: 422,
        }
      );
    }

    /* ============================================================
       BKASH VALIDATION
    ============================================================ */

    let bkashSender = "";
    let bkashTransactionId = "";

    if (
      paymentMethod === "bkash"
    ) {
      bkashSender =
        normalizePhone(
          cleanText(
            body.bkashSender
          )
        );

      bkashTransactionId =
        cleanText(
          body.bkashTransactionId
        )
          .replace(/\s/g, "")
          .toUpperCase();

      if (
        !/^01\d{9}$/.test(
          bkashSender
        )
      ) {
        return NextResponse.json(
          {
            message:
              "Please enter a valid bKash sender number.",
          },
          {
            status: 422,
          }
        );
      }

      if (
        bkashTransactionId.length < 5 ||
        bkashTransactionId.length > 30
      ) {
        return NextResponse.json(
          {
            message:
              "Please enter a valid bKash Transaction ID.",
          },
          {
            status: 422,
          }
        );
      }
    }

    /* ============================================================
       CART TOKEN
    ============================================================ */

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

    /* ============================================================
       STORE SETTINGS
    ============================================================ */

    const storeSettings =
      await getStoreviaSettings();

    const configuredCity =
      cleanText(
        storeSettings.checkout_city_name
      ) || "Dhaka";

    /* ============================================================
       NAME MAPPING
    ============================================================ */

    const nameParts =
      name
        .split(/\s+/)
        .filter(Boolean);

    const firstName =
      nameParts[0] || name;

    /*
     * WooCommerce currently requires last_name.
     *
     * If customer entered only one name,
     * reuse it internally.
     */
    const lastName =
      nameParts.length > 1
        ? nameParts
            .slice(1)
            .join(" ")
        : "-";

    /* ============================================================
       INTERNAL ADDRESS MAPPING

       Customer only enters one full address.
       WooCommerce still needs city/state for BD.

       We map these internally so the storefront stays minimal.
    ============================================================ */

    const internalCity =
      deliveryArea === "inside"
        ? configuredCity
        : `Outside ${configuredCity}`;

    /*
     * WooCommerce accepts state/district
     * name or code through the Store API.
     *
     * For our minimal checkout, use the
     * configured city/district internally.
     */
    const internalState =
      configuredCity;

    /* ============================================================
       INTERNAL GUEST EMAIL
    ============================================================ */

    const guestEmail =
      `${phone}@guest.storevia.local`;

    /* ============================================================
       PAYMENT DATA
    ============================================================ */

    const paymentData: Array<{
      key: string;
      value: string;
    }> = [
      {
        key:
          "storevia_delivery_area",

        value:
          deliveryArea,
      },
    ];

    if (
      paymentMethod === "bkash"
    ) {
      paymentData.push(
        {
          key:
            "storevia_bkash_sender",

          value:
            bkashSender,
        },
        {
          key:
            "storevia_bkash_trxid",

          value:
            bkashTransactionId,
        }
      );
    }

    /* ============================================================
       PAYMENT METHOD
    ============================================================ */

    const wooPaymentMethod =
      paymentMethod === "bkash"
        ? "storevia_bkash"
        : "storevia_cod";

    /* ============================================================
       PLACE ORDER
    ============================================================ */

    const wooResponse =
      await fetch(
        `${WC_URL}/wp-json/wc/store/v1/checkout`,
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

          body: JSON.stringify({
            billing_address: {
              first_name:
                firstName,

              last_name:
                lastName,

              company: "",

              address_1:
                address,

              address_2: "",

              city:
                internalCity,

              state:
                internalState,

              postcode: "",

              country: "BD",

              email:
                guestEmail,

              phone,
            },

            shipping_address: {
              first_name:
                firstName,

              last_name:
                lastName,

              company: "",

              address_1:
                address,

              address_2: "",

              city:
                internalCity,

              state:
                internalState,

              postcode: "",

              country: "BD",
            },

            create_account:
              false,

            payment_method:
              wooPaymentMethod,

            payment_data:
              paymentData,

            customer_note: "",
          }),

          cache: "no-store",
        }
      );

    const result =
      await wooResponse.json();

    /* ============================================================
       ERROR
    ============================================================ */

    if (!wooResponse.ok) {
      console.error(
        "WooCommerce checkout error:",
        result
      );

      return NextResponse.json(
        {
          message:
            result?.message ||
            result?.data?.message ||
            "Unable to place your order.",

          code:
            result?.code,

          error:
            result,
        },
        {
          status:
            wooResponse.status,
        }
      );
    }

    /* ============================================================
       SUCCESS
    ============================================================ */

    return NextResponse.json({
      success: true,

      order_id:
        result.order_id,

      order_number:
        result.order_number ??
        result.order_id,

      order_key:
        result.order_key,

      status:
        result.status,

      payment_method:
        result.payment_method,

      payment_status:
        result
          ?.payment_result
          ?.payment_status ?? "",

      redirect_url:
        result
          ?.payment_result
          ?.redirect_url ?? "",
    });

  } catch (error) {
    console.error(
      "Storevia checkout error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unexpected checkout error. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}