import {
  ProductArchive,
} from "@/components/shop/product-archive";

import {
  getShopProducts,
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

import {
  getStoreviaSettings,
} from "@/lib/storevia/settings";

import {
  buildTitle,
  canonicalUrl,
  seoDescription,
} from "@/lib/storevia/seo";


type PageProps = {
  searchParams: Promise<{
    sort?: ProductSort;
    on_sale?: string;
  }>;
};


export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await getStoreviaSettings();

  const title =
    buildTitle(
      "Shop",
      settings
    );

  const description =
    seoDescription(
      "Browse all products available in our online store.",
      settings
        .seo_default_description
    );

  const url =
    canonicalUrl(
      "/shop"
    );

  const indexingEnabled =
    Boolean(
      settings
        .seo_indexing_enabled
    );

  return {
    title,

    description,

    robots: {
      index:
        indexingEnabled,

      follow:
        indexingEnabled,
    },

    alternates: {
      canonical:
        url,
    },

    openGraph: {
      type:
        "website",

      title,

      description,

      url,

      siteName:
        settings.seo_site_name ||
        undefined,

      images:
        settings.seo_default_image
          ? [
              {
                url:
                  settings
                    .seo_default_image,

                alt:
                  "Shop",
              },
            ]
          : undefined,
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,

      images:
        settings.seo_default_image
          ? [
              settings
                .seo_default_image,
            ]
          : undefined,
    },
  };
}


export default async function ShopPage({
  searchParams,
}: PageProps) {

  const params =
    await searchParams;


  const sort: ProductSort =
    params.sort ??
    "default";


  const onSale =
    params.on_sale ===
    "true";


  const [
    products,
    categories,
    brands,
  ] = await Promise.all([

    getShopProducts({
      perPage: 16,
      page: 1,
      sort,
      onSale,
    }),

    getCategories(100),

    getBrands(100),

  ]);


  /* ================================================================
     ARCHIVE TITLE
  ================================================================ */

  let title =
    "Shop";


  if (onSale) {
    title =
      "Flash Sale";
  } else if (
    sort ===
    "best-selling"
  ) {
    title =
      "Best Sellers";
  } else if (
    sort ===
    "latest"
  ) {
    title =
      "New Arrivals";
  }


  return (
    <ProductArchive
      title={
        title
      }
      products={
        products
      }
      categories={
        categories
      }
      brands={
        brands
      }
      sort={
        sort
      }

      loadMore={{
        enabled: true,
        perPage: 16,
        type: "shop",
        onSale,
      }}
    />
  );
}