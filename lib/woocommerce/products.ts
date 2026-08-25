import { wooFetch } from "./client";

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  type?: string;
  sku?: string;

  short_description?: string;
  description?: string;

  on_sale: boolean;

prices: {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
};

  images: Array<{
    id: number;
    src: string;
    thumbnail: string;
    alt: string;
  }>;

  average_rating: string;
  review_count: number;

  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;

  brands?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;

  attributes?: Array<{
    id: number;
    name: string;
    taxonomy?: string;
    has_variations?: boolean;
    terms?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  }>;

  variations?: Array<number>;

  has_options?: boolean;

  is_purchasable: boolean;
  is_in_stock: boolean;

  stock_availability?: {
    text: string;
    class: string;
  };

  add_to_cart?: {
    text: string;
    description: string;
    url?: string;
    single_text?: string;
    minimum?: number;
    maximum?: number;
    multiple_of?: number;
  };
};

export async function getProducts({
  perPage = 16,
  page = 1,
  sort = "default",
  onSale = false,
}: {
  perPage?: number;
  page?: number;
  sort?: ProductSort;
  onSale?: boolean;
} = {}): Promise<WooProduct[]> {

  const query =
    buildProductQuery({
      perPage,
      page,
      sort,
      onSale,
    });


  return wooFetch<WooProduct[]>(
    `/products?${query}`
  );
}

export async function getSaleProducts(
  perPage = 10
): Promise<WooProduct[]> {
  return wooFetch<WooProduct[]>(
    `/products?on_sale=true&per_page=${perPage}`
  );
}


export async function getBestSellingProducts(
  perPage = 5
): Promise<WooProduct[]> {
  return wooFetch<WooProduct[]>(
    `/products?orderby=popularity&order=desc&per_page=${perPage}`
  );
}

export type ProductSort =
  | "default"
  | "best-selling"
  | "popularity"
  | "rating"
  | "latest"
  | "price-asc"
  | "price-desc";

type ProductQueryOptions = {
  perPage?: number;
  page?: number;
  sort?: ProductSort;
  category?: string;
  brand?: string;
  onSale?: boolean;
};

function buildProductQuery({
  perPage = 16,
  page = 1,
  sort = "default",
  category,
  brand,
  onSale = false,
}: {
  perPage?: number;
  page?: number;
  sort?: ProductSort;
  category?: string;
  brand?: string;
  onSale?: boolean;
}) {
  const params =
    new URLSearchParams();

  params.set(
    "per_page",
    String(perPage)
  );

  params.set(
    "page",
    String(page ?? 1)
  );


  if (category) {
    params.set(
      "category",
      category
    );
  }


  if (brand) {
    params.set(
      "brand",
      brand
    );
  }


  if (onSale) {
    params.set(
      "on_sale",
      "true"
    );
  }


  switch (sort) {

    case "latest":

      params.set(
        "orderby",
        "date"
      );

      params.set(
        "order",
        "desc"
      );

      break;


    case "best-selling":

      params.set(
        "orderby",
        "popularity"
      );

      params.set(
        "order",
        "desc"
      );

      break;


    case "price-asc":

      params.set(
        "orderby",
        "price"
      );

      params.set(
        "order",
        "asc"
      );

      break;


    case "price-desc":

      params.set(
        "orderby",
        "price"
      );

      params.set(
        "order",
        "desc"
      );

      break;


    default:
      break;
  }


  return params.toString();
}


function getSortQuery(
  sort: ProductSort
) {
  switch (sort) {
    case "popularity":
      return "orderby=popularity&order=desc";

    case "rating":
      return "orderby=rating&order=desc";

    case "latest":
      return "orderby=date&order=desc";

    case "price-asc":
      return "orderby=price&order=asc";

    case "price-desc":
      return "orderby=price&order=desc";

    default:
      return "orderby=menu_order&order=asc";
  }
}

function buildSortQuery(sort: ProductSort) {
  switch (sort) {
    case "best-selling":
    case "latest":
      return "&orderby=date&order=desc";

    case "price-asc":
      return "&orderby=price&order=asc";

    case "price-desc":
      return "&orderby=price&order=desc";

    case "popularity":
      return "&orderby=popularity&order=desc";

    case "rating":
      return "&orderby=rating&order=desc";

    default:
      return "&orderby=menu_order&order=asc";
  }
}

/* ================================================================
   SHOP
================================================================ */

export async function getShopProducts(
  options: ProductQueryOptions = {}
): Promise<WooProduct[]> {
  const query =
    buildProductQuery(options);

  return wooFetch<WooProduct[]>(
    `/products?${query}`
  );
}

/* ================================================================
   CATEGORY
================================================================ */

export async function getCategoryProducts({
  slug,
  perPage = 16,
  page = 1,
  sort = "default",
}: {
  slug: string;
  perPage?: number;
  page?: number;
  sort?: ProductSort;
}): Promise<WooProduct[]> {

  const query =
    buildProductQuery({
      perPage,
      page,
      sort,
      category: slug,
    });


  return wooFetch<WooProduct[]>(
    `/products?${query}`
  );
}


/* ================================================================
   BRAND
================================================================ */

export async function getBrandProducts({
  slug,
  perPage = 16,
  page = 1,
  sort = "default",
}: {
  slug: string;
  perPage?: number;
  page?: number;
  sort?: ProductSort;
}): Promise<WooProduct[]> {

  const query =
    buildProductQuery({
      perPage,
      page,
      sort,
      brand: slug,
    });

  return wooFetch<WooProduct[]>(
    `/products?${query}`
  );
}

export async function getProductsByCategory({
  category,
  perPage = 16,
  page = 1,
  sort = "default",
}: {
  category: string;
  perPage?: number;
  page?: number;
  sort?: ProductSort;
}): Promise<WooProduct[]> {
  return wooFetch<WooProduct[]>(
    `/products?category=${encodeURIComponent(
      category
    )}&per_page=${perPage}&page=${page}${buildSortQuery(sort)}`
  );
}

export async function getProductsByBrand({
  brand,
  perPage = 20,
  page = 1,
  sort = "default",
}: {
  brand: string;
  perPage?: number;
  page?: number;
  sort?: ProductSort;
}): Promise<WooProduct[]> {
  return wooFetch<WooProduct[]>(
    `/products?brand=${encodeURIComponent(
      brand
    )}&per_page=${perPage}&page=${page}${buildSortQuery(sort)}`
  );
}

export async function getProductBySlug(
  slug: string
): Promise<WooProduct | null> {
  try {
    return await wooFetch<WooProduct>(
      `/products/${encodeURIComponent(slug)}`
    );
  } catch {
    return null;
  }
}

export async function getRelatedProducts(
  productId: number,
  perPage = 5
): Promise<WooProduct[]> {
  try {
    return await wooFetch<WooProduct[]>(
      `/products?related=${productId}&per_page=${perPage}`
    );
  } catch {
    return [];
  }
}

export type WooVariation = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  type: string;

  variation: string;

  sku?: string;

  prices: {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
};

  images: Array<{
    id: number;
    src: string;
    thumbnail: string;
    alt: string;
  }>;

  attributes: Array<{
    id: number;
    name: string;
    taxonomy?: string;
    has_variations?: boolean;

    terms?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  }>;

  is_purchasable: boolean;
  is_in_stock: boolean;

  stock_availability?: {
    text: string;
    class: string;
  };
};

export async function getProductVariations(
  productId: number
): Promise<WooVariation[]> {
  try {
    return await wooFetch<WooVariation[]>(
      `/products?type=variation&parent=${productId}&per_page=100`
    );
  } catch (error) {
    console.error("Unable to fetch variations:", error);
    return [];
  }
}

export async function searchProducts({
  query,
  perPage = 24,
  sort = "default",
}: {
  query: string;
  perPage?: number;
  sort?: ProductSort;
}): Promise<WooProduct[]> {
  const params = new URLSearchParams();

  params.set("search", query);
  params.set("per_page", String(perPage));

  switch (sort) {
    case "popularity":
      params.set("orderby", "popularity");
      params.set("order", "desc");
      break;

    case "rating":
      params.set("orderby", "rating");
      params.set("order", "desc");
      break;

    case "latest":
      params.set("orderby", "date");
      params.set("order", "desc");
      break;

    case "price-asc":
      params.set("orderby", "price");
      params.set("order", "asc");
      break;

    case "price-desc":
      params.set("orderby", "price");
      params.set("order", "desc");
      break;

    /*
     * IMPORTANT:
     * Do not send orderby for default search.
     * Let WooCommerce determine the normal
     * search ordering.
     */
    default:
      break;
  }

  return wooFetch<WooProduct[]>(
    `/products?${params.toString()}`
  );
}