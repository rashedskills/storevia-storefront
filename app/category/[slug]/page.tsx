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
  getCategoryProducts,
  type ProductSort,
} from "@/lib/woocommerce/products";

import {
  getCategories,
} from "@/lib/woocommerce/categories";

import {
  getBrands,
} from "@/lib/woocommerce/brands";

import {
  getStoreviaSettings,
} from "@/lib/storevia/settings";

import {
  buildTitle,
  canonicalUrl,
  seoDescription,
} from "@/lib/storevia/seo";


type PageProps = {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    sort?: ProductSort;
  }>;
};


/* ================================================================
   CATEGORY SEO
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
    categories,
    settings,
  ] = await Promise.all([
    getCategories(100),
    getStoreviaSettings(),
  ]);

  const category =
    categories.find(
      (item) =>
        item.slug === slug
    );

  if (!category) {
    return {
      title:
        "Category Not Found",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    buildTitle(
      category.name,
      settings
    );

  const description =
    seoDescription(
      category.description,
      `Shop ${category.name} products online.`
    );

  const url =
    canonicalUrl(
      `/category/${category.slug}`
    );

  const indexingEnabled =
    Boolean(
      settings.seo_indexing_enabled
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
        category.image?.src
          ? [
              {
                url:
                  category.image.src,

                alt:
                  category.name,
              },
            ]
          : settings.seo_default_image
            ? [
                {
                  url:
                    settings.seo_default_image,

                  alt:
                    category.name,
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
        category.image?.src
          ? [
              category.image.src,
            ]
          : settings.seo_default_image
            ? [
                settings.seo_default_image,
              ]
            : undefined,
    },
  };
}


/* ================================================================
   CATEGORY PAGE
================================================================ */

export default async function CategoryPage({
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
    categories,
    brands,
    products,
  ] = await Promise.all([
    getCategories(100),

    getBrands(100),

    getCategoryProducts({
      slug,
      perPage: 16,
      page: 1,
      sort,
    }),
  ]);

  const category =
    categories.find(
      (item) =>
        item.slug === slug
    );

  if (!category) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify({
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
                    category.name,

                  item:
                    canonicalUrl(
                      `/category/${category.slug}`
                    ),
                },
              ],
            }).replace(
              /</g,
              "\\u003c"
            ),
        }}
      />

      <ProductArchive
        title={category.name}
        description={
          category.description ||
          undefined
        }
        products={products}
        categories={categories}
        brands={brands}
        sort={sort}
        activeCategory={slug}

        loadMore={{
          enabled: true,
          perPage: 16,
          type: "category",
          slug,
        }}
      />
    </>
  );
}