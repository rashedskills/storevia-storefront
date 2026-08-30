const WC_URL = process.env.WOOCOMMERCE_URL;

if (!WC_URL) {
  throw new Error(
    "WOOCOMMERCE_URL is not configured"
  );
}

export async function wooFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const isDevelopment =
    process.env.NODE_ENV === "development";

  const response = await fetch(
    `${WC_URL}/wp-json/wc/store/v1${endpoint}`,
    {
      ...options,

      headers: {
        Accept: "application/json",
        ...options.headers,
      },

      cache: isDevelopment
        ? "no-store"
        : "force-cache",

      next: isDevelopment
        ? undefined
        : {
            revalidate: 30,
          },
    }
  );

  if (!response.ok) {
    throw new Error(
      `WooCommerce request failed: ${response.status}`
    );
  }

  return response.json();
}