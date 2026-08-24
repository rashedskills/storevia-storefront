import {
  ProductArchive,
} from "@/components/shop/product-archive";

import {
  searchProducts,
  type ProductSort,
} from "@/lib/woocommerce/products";

import {
  getCategories,
} from "@/lib/woocommerce/categories";

import {
  getBrands,
} from "@/lib/woocommerce/brands";

import type {
  Metadata,
} from "next";

export const metadata: Metadata = {
  title: "Search",

  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    sort?: ProductSort;
  }>;
};

export default async function SearchPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const query =
    String(
      params.q ?? ""
    ).trim();

  const sort: ProductSort =
    params.sort ?? "default";

  const [
    categories,
    brands,
  ] = await Promise.all([
    getCategories(100),
    getBrands(100),
  ]);

  if (!query) {
    return (
      <ProductArchive
        title="Search Products"
        description="Enter a product name to search."
        products={[]}
        categories={categories}
        brands={brands}
        sort={sort}
      />
    );
  }

  const products =
    await searchProducts({
      query,
      perPage: 24,
      sort,
    });

  return (
    <ProductArchive
      title={`Search: "${query}"`}
      description={
        products.length === 1
          ? "1 product found"
          : `${products.length} products found`
      }
      products={products}
      categories={categories}
      brands={brands}
      sort={sort}
    />
  );
}