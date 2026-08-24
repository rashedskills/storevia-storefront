import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import {
  ProductArchive,
} from "@/components/shop/product-archive";

import {
  getBrandProducts,
  type ProductSort,
} from "@/lib/woocommerce/products";

import {
  getCategories,
} from "@/lib/woocommerce/categories";

import {
  getBrands,
  getBrandBySlug,
} from "@/lib/woocommerce/brands";

import {
  getStoreviaSettings,
} from "@/lib/storevia/settings";

import {
  buildTitle,
  canonicalUrl,
  seoDescription,
} from "@/lib/storevia/seo";


/* ================================================================
   TYPES
================================================================ */

type PageProps = {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    sort?: ProductSort;
  }>;
};


/* ================================================================
   BRAND SEO
================================================================ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const [
    brand,
    settings,
  ] = await Promise.all([
    getBrandBySlug(
      slug
    ),

    getStoreviaSettings(),
  ]);

  if (!brand) {
    return {
      title:
        "Brand Not Found",

      robots: {
        index: false,
        follow: false,
      },
    };
  }


  const title =
    buildTitle(
      brand.name,
      settings
    );


  const description =
    seoDescription(
      brand.description,
      `Shop ${brand.name} products online.`
    );


  const url =
    canonicalUrl(
      `/brand/${brand.slug}`
    );


  const indexingEnabled =
    Boolean(
      settings.seo_indexing_enabled
    );


  const image =
    brand.image?.src ||
    settings.seo_default_image ||
    undefined;


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
        image
          ? [
              {
                url:
                  image,

                alt:
                  brand.name,
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
          ? [
              image,
            ]
          : undefined,
    },
  };
}


/* ================================================================
   BRAND PAGE
================================================================ */

export default async function BrandPage({
  params,
  searchParams,
}: PageProps) {
  const {
    slug,
  } = await params;

  const query =
    await searchParams;

  const sort: ProductSort =
    query.sort ??
    "default";


  const [
    brand,
    products,
    categories,
    brands,
  ] = await Promise.all([
    getBrandBySlug(
      slug
    ),

    getBrandProducts({
      slug,
      perPage: 16,
      page: 1,
      sort,
    }),

    getCategories(100),

    getBrands(100),
  ]);


  if (!brand) {
    notFound();
  }


  /* ==============================================================
     BREADCRUMB JSON-LD
  ============================================================== */

  const breadcrumbJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [
      {
        "@type":
          "ListItem",

        position:
          1,

        name:
          "Home",

        item:
          canonicalUrl("/"),
      },

      {
        "@type":
          "ListItem",

        position:
          2,

        name:
          "Brands",

        item:
          canonicalUrl(
            "/brands"
          ),
      },

      {
        "@type":
          "ListItem",

        position:
          3,

        name:
          brand.name,

        item:
          canonicalUrl(
            `/brand/${brand.slug}`
          ),
      },
    ],
  };


  return (
    <>
      {/* =========================================================
          BRAND BREADCRUMB STRUCTURED DATA
      ========================================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbJsonLd
            ).replace(
              /</g,
              "\\u003c"
            ),
        }}
      />


      {/* =========================================================
          BRAND PRODUCTS
      ========================================================= */}

      <ProductArchive
        title={brand.name}
        description={
          brand.description ||
          undefined
        }
        products={products}
        categories={categories}
        brands={brands}
        sort={sort}
        activeBrand={slug}
        loadMore={{
          enabled: true,
          perPage: 16,
          type: "brand",
          slug,
        }}
      />
    </>
  );
}