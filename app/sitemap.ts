import type {
  MetadataRoute,
} from "next";

import {
  SITE_URL,
} from "@/lib/storevia/seo";

import {
  getShopProducts,
} from "@/lib/woocommerce/products";

import {
  getCategories,
} from "@/lib/woocommerce/categories";

import {
  getBrands,
} from "@/lib/woocommerce/brands";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    products,
    categories,
    brands,
  ] = await Promise.all([
    getShopProducts({
      perPage: 100,
    }),

    getCategories(100),

    getBrands(100),
  ]);

  const staticPages: MetadataRoute.Sitemap =
    [
      {
        url:
          SITE_URL,

        changeFrequency:
          "daily",

        priority:
          1,
      },

      {
        url:
          `${SITE_URL}/shop`,

        changeFrequency:
          "daily",

        priority:
          0.9,
      },

      {
        url:
          `${SITE_URL}/brands`,

        changeFrequency:
          "weekly",

        priority:
          0.7,
      },
    ];

  const productPages =
    products.map(
      (product) => ({
        url:
          `${SITE_URL}/product/${product.slug}`,

        changeFrequency:
          "daily" as const,

        priority:
          0.8,
      })
    );

  const categoryPages =
    categories.map(
      (category) => ({
        url:
          `${SITE_URL}/category/${category.slug}`,

        changeFrequency:
          "weekly" as const,

        priority:
          0.7,
      })
    );

  const brandPages =
    brands.map(
      (brand) => ({
        url:
          `${SITE_URL}/brand/${brand.slug}`,

        changeFrequency:
          "weekly" as const,

        priority:
          0.6,
      })
    );

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...brandPages,
  ];
}