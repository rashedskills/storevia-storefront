const WORDPRESS_URL =
  process.env.WOOCOMMERCE_URL ?? "";

export function storefrontUrl(
  value: string
) {
  if (!value) {
    return "#";
  }

  /*
   * External URL:
   * leave untouched.
   */
  if (
    WORDPRESS_URL &&
    !value.startsWith(
      WORDPRESS_URL
    )
  ) {
    return value;
  }

  let path = value;

  if (WORDPRESS_URL) {
    path =
      value.replace(
        WORDPRESS_URL,
        ""
      );
  }

  /*
   * Normalize trailing slash.
   */
  path =
    path.replace(
      /\/+$/,
      ""
    ) || "/";

  /*
   * Woo category URL:
   *
   * /product-category/makeup
   * →
   * /category/makeup
   */
  path =
    path.replace(
      /^\/product-category\//,
      "/category/"
    );

  /*
   * Brand routes already match:
   * /brand/sunsilk
   */

  /*
   * Product routes already match:
   * /product/example
   */

  /*
   * Woo shop:
   */
  if (
    path === "/shop"
  ) {
    return "/shop";
  }

  return path;
}