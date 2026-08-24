const WC_URL =
  process.env.WOOCOMMERCE_URL;

if (!WC_URL) {
  throw new Error(
    "WOOCOMMERCE_URL is missing"
  );
}


export type WooProductReview = {
  id: number;

  date_created: string;

  formatted_date_created?: string;

  reviewer: string;

  review: string;

  rating: number;

  verified: boolean;

  reviewer_avatar_urls?: {
    "24"?: string;
    "48"?: string;
    "96"?: string;
  };
};


export async function getProductReviews(
  productId: number,
  perPage = 20
): Promise<WooProductReview[]> {

  try {

    const response =
      await fetch(
        `${WC_URL}/wp-json/wc/store/v1/products/reviews?product_id=${productId}&per_page=${perPage}`,
        process.env.NODE_ENV ===
          "development"
          ? {
              cache:
                "no-store",
            }
          : {
              next: {
                revalidate:
                  120,
              },
            }
      );


    if (!response.ok) {

      console.error(
        "Product reviews request failed:",
        response.status
      );

      return [];
    }


    return await response.json();

  } catch (error) {

    console.error(
      "Product reviews error:",
      error
    );

    return [];
  }
}