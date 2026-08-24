import {
  NextResponse,
} from "next/server";

import {
  getProducts,
  getCategoryProducts,
  type ProductSort,
} from "@/lib/woocommerce/products";

import {
   getBrandProducts,
  type ProductSort,
} from "@/lib/woocommerce/products";


export async function GET(
  request: Request
) {
  const {
    searchParams,
  } =
    new URL(
      request.url
    );


  /* ================================================================
     QUERY PARAMS
  ================================================================ */

  const page =
    Math.max(
      1,
      Number(
        searchParams.get(
          "page"
        ) || 1
      )
    );

  const onSale =
  searchParams.get(
    "on_sale"
  ) === "true";

  const perPage =
    Math.min(
      20,
      Math.max(
        1,
        Number(
          searchParams.get(
            "per_page"
          ) || 16
        )
      )
    );


  const sort =
    (
      searchParams.get(
        "sort"
      ) ||
      "default"
    ) as ProductSort;


  const type =
    searchParams.get(
      "type"
    ) || "shop";


  const slug =
    searchParams.get(
      "slug"
    ) || "";


  /* ================================================================
     LOAD PRODUCTS
  ================================================================ */

  try {

    let products;


if (
  type === "category" &&
  slug
) {

  products =
    await getCategoryProducts({
      slug,
      page,
      perPage,
      sort,
    });

} else if (
  type === "brand" &&
  slug
) {

  products =
    await getBrandProducts({
      slug,
      page,
      perPage,
      sort,
    });

} else {

  products =
    await getProducts({
      page,
      perPage,
      sort,
      onSale,
    });
}


    /* ================================================================
       RESPONSE
    ================================================================ */

    return NextResponse.json({
      products,

      page,

      hasMore:
        products.length ===
        perPage,
    });

  } catch (
    error
  ) {

    console.error(
      "Load more products error:",
      error
    );


    return NextResponse.json(
      {
        message:
          "Unable to load products.",
      },
      {
        status: 500,
      }
    );
  }
}