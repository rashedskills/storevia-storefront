import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WC_URL = process.env.WOOCOMMERCE_URL;

if (!WC_URL) {
  throw new Error("WOOCOMMERCE_URL is missing");
}

export async function GET() {
  const cookieStore = await cookies();

  const cartToken =
    cookieStore.get("storevia_cart_token")?.value;

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }

  /*
   * Get current cart first.
   */
  const cartResponse = await fetch(
    `${WC_URL}/wp-json/wc/store/v1/cart`,
    {
      headers,
      cache: "no-store",
    }
  );

  if (!cartResponse.ok) {
    return NextResponse.json([]);
  }

  const cart = await cartResponse.json();

  if (!cart.items?.length) {
    return NextResponse.json([]);
  }

  /*
   * Cross-sells returned directly by cart.
   */
  if (
    Array.isArray(cart.cross_sells) &&
    cart.cross_sells.length > 0
  ) {
    return NextResponse.json(
      cart.cross_sells.slice(0, 8)
    );
  }

  /*
   * Fallback:
   * related products from first cart item.
   */
  const firstItem = cart.items[0];

  const productId = firstItem.id;

  const relatedResponse = await fetch(
    `${WC_URL}/wp-json/wc/store/v1/products?related=${productId}&per_page=8`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!relatedResponse.ok) {
    return NextResponse.json([]);
  }

  const products =
    await relatedResponse.json();

  /*
   * Avoid showing products already in cart.
   */
  const cartProductIds = new Set(
    cart.items.map(
      (item: { id: number }) => item.id
    )
  );

  const filtered = products.filter(
    (product: { id: number }) =>
      !cartProductIds.has(product.id)
  );

  return NextResponse.json(
    filtered.slice(0, 8)
  );
}