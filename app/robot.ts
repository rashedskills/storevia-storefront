import type {
  MetadataRoute,
} from "next";

import {
  SITE_URL,
} from "@/lib/storevia/seo";

import {
  getStoreviaSettings,
} from "@/lib/storevia/settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings =
    await getStoreviaSettings();

  const indexing =
    Boolean(
      settings
        .seo_indexing_enabled
    );

  if (!indexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",

      allow: "/",

      disallow: [
        "/cart",
        "/checkout",
        "/my-account",
        "/order-success",
        "/api/",
        "/search",
      ],
    },

    sitemap:
      `${SITE_URL}/sitemap.xml`,
  };
}