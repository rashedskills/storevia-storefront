import type {
  Metadata,
} from "next";

import type {
  StoreviaSettings,
} from "@/lib/storevia/settings";

export const SITE_URL =
  (
    process.env
      .NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

export function cleanHtml(
  value?: string
) {
  if (!value) {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}


export function seoDescription(
  value: string,
  fallback = ""
) {
  const text =
    cleanHtml(value) ||
    cleanHtml(fallback);

  if (text.length <= 160) {
    return text;
  }

  return (
    text.slice(0, 157).trim() +
    "..."
  );
}


export function buildTitle(
  pageTitle: string,
  settings: StoreviaSettings
) {
  const siteName =
    settings.seo_site_name ||
    settings.seo_default_title ||
    "Store";

  const separator =
    settings.seo_title_separator ||
    "|";

  if (
    !pageTitle ||
    pageTitle === siteName
  ) {
    return (
      settings.seo_default_title ||
      siteName
    );
  }

  return `${pageTitle} ${separator} ${siteName}`;
}


export function canonicalUrl(
  path = "/"
) {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (path === "/") {
    return SITE_URL;
  }

  return `${SITE_URL}${path}`;
}


export function baseMetadata(
  settings: StoreviaSettings
): Metadata {
  const title =
    settings.seo_default_title ||
    settings.seo_site_name ||
    "Store";

  const description =
    seoDescription(
      settings.seo_default_description
    );

  const image =
    settings.seo_default_image ||
    undefined;

  return {
    metadataBase:
      new URL(SITE_URL),

    title,

    description,

    robots: {
      index: Boolean(
        settings.seo_indexing_enabled
      ),

      follow: Boolean(
        settings.seo_indexing_enabled
      ),
    },

    alternates: {
      canonical:
        canonicalUrl("/"),
    },

    openGraph: {
      type: "website",

      siteName:
        settings.seo_site_name ||
        title,

      title,

      description,

      url:
        canonicalUrl("/"),

      images:
        image
          ? [
              {
                url: image,
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
        image
          ? [image]
          : undefined,
    },
  };
}