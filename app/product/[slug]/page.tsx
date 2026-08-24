import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  Container,
} from "@/components/layout/container";

import {
  ProductGallery,
} from "@/components/product/product-gallery";

import {
  ProductInfo,
} from "@/components/product/product-info";

import {
  ProductDescription,
} from "@/components/product/product-description";

import {
  RelatedProducts,
} from "@/components/product/related-products";

import {
  getProductBySlug,
  getRelatedProducts,
  getProductVariations,
} from "@/lib/woocommerce/products";

import {
  getStoreviaSettings,
} from "@/lib/storevia/settings";

import {
  canonicalUrl,
  buildTitle,
  seoDescription,
} from "@/lib/storevia/seo";

import {
  ProductViewEvent,
} from "@/components/tracking/product-view-event";

import {
  ProductReviews,
} from "@/components/product/product-reviews";

import {
  getProductReviews,
} from "@/lib/woocommerce/reviews";

import {
  ProductScrollTop,
} from "@/components/product/product-scroll-top";


/* ================================================================
   TYPES
================================================================ */

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


/* ================================================================
   PRODUCT METADATA / SEO
================================================================ */

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const [
    product,
    settings,
  ] = await Promise.all([
    getProductBySlug(slug),
    getStoreviaSettings(),
  ]);


  /* Product does not exist */
  if (!product) {
    return {
      title:
        "Product Not Found",

      robots: {
        index: false,
        follow: false,
      },
    };
  }


  const title =
    buildTitle(
      product.name,
      settings
    );


  const description =
    seoDescription(
      product.short_description ||
        product.description,

      settings
        .seo_default_description
    );


  const canonical =
    canonicalUrl(
      `/product/${product.slug}`
    );


  const primaryImage =
    product.images?.[0]?.src ||
    settings.seo_default_image ||
    undefined;


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
      canonical,
    },

    openGraph: {
      type:
        "website",

      title,

      description,

      url:
        canonical,

      siteName:
        settings.seo_site_name ||
        undefined,

      images:
        primaryImage
          ? [
              {
                url:
                  primaryImage,

                alt:
                  product.name,
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
        primaryImage
          ? [
              primaryImage,
            ]
          : undefined,
    },
  };
}


/* ================================================================
   PRODUCT PAGE
================================================================ */

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const {
    slug,
  } = await params;


  /* ==============================================================
     PRODUCT + STOREVIA SETTINGS
  ============================================================== */

  const [
    product,
    settings,
  ] = await Promise.all([
    getProductBySlug(slug),
    getStoreviaSettings(),
  ]);


  /*
   * IMPORTANT:
   * Never access product fields
   * before this check.
   */
  if (!product) {
    notFound();
  }


  /* ==============================================================
     PRODUCT EXTRA DATA
  ============================================================== */

  const [
  variations,
  relatedProducts,
  reviews,
] = await Promise.all([

  product.type ===
    "variable"
    ? getProductVariations(
        product.id
      )
    : Promise.resolve([]),

  getRelatedProducts(
    product.id,
    5
  ),

  getProductReviews(
    product.id,
    20
  ),
]);


  const firstCategory =
    product.categories?.[0];


  const firstBrand =
    product.brands?.[0];


  /* ==============================================================
     SEO VALUES
  ============================================================== */

  const productUrl =
    canonicalUrl(
      `/product/${product.slug}`
    );


  const productDescription =
    seoDescription(
      product.short_description ||
        product.description,

      settings
        .seo_default_description
    );


  const minorUnit =
    Number(
      product.prices
        ?.currency_minor_unit ??
        2
    );


  const storedPrice =
    Number(
      product.prices?.price ??
      0
    );


  const actualPrice =
    storedPrice /
    Math.pow(
      10,
      minorUnit
    );


  const currency =
    product.prices
      ?.currency_code ||
    "BDT";


  const productImages =
    (
      product.images ?? []
    )
      .map(
        (image) =>
          image.src
      )
      .filter(
        (
          src
        ): src is string =>
          Boolean(src)
      );


  /* ==============================================================
     PRODUCT JSON-LD
  ============================================================== */

  const productJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "Product",

    name:
      product.name,

    url:
      productUrl,


    ...(productDescription
      ? {
          description:
            productDescription,
        }
      : {}),


    ...(product.sku
      ? {
          sku:
            product.sku,
        }
      : {}),


    ...(productImages.length
      ? {
          image:
            productImages,
        }
      : {}),


    ...(firstBrand
      ? {
          brand: {
            "@type":
              "Brand",

            name:
              firstBrand.name,
          },
        }
      : {}),


    /*
     * Only output Offer if
     * WooCommerce returned a valid price.
     */
    ...(Number.isFinite(
      actualPrice
    ) &&
    actualPrice >= 0
      ? {
          offers: {
            "@type":
              "Offer",

            url:
              productUrl,

            priceCurrency:
              currency,

            price:
              actualPrice.toFixed(
                minorUnit
              ),

            availability:
              product.is_in_stock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",

            itemCondition:
              "https://schema.org/NewCondition",
          },
        }
      : {}),
  };


  /* ==============================================================
     BREADCRUMB JSON-LD
  ============================================================== */

  const breadcrumbItems: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
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
  ];


  if (firstCategory) {
    breadcrumbItems.push({
      "@type":
        "ListItem",

      position:
        2,

      name:
        firstCategory.name,

      item:
        canonicalUrl(
          `/category/${firstCategory.slug}`
        ),
    });
  }


  breadcrumbItems.push({
    "@type":
      "ListItem",

    position:
      breadcrumbItems.length +
      1,

    name:
      product.name,

    item:
      productUrl,
  });


  const breadcrumbJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement:
      breadcrumbItems,
  };


  /* ==============================================================
     PAGE
  ============================================================== */

  return (
    <main className="bg-[var(--store-bg)]">

      <ProductScrollTop
        slug={product.slug}
      />


      {/* =========================================================
          PRODUCT STRUCTURED DATA
      ========================================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              productJsonLd
            ).replace(
              /</g,
              "\\u003c"
            ),
        }}
      />


      {/* =========================================================
          BREADCRUMB STRUCTURED DATA
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

      <ProductViewEvent
      id={product.id}
      name={product.name}
      price={actualPrice}
      currency={currency}
    />  
    
      <Container>

        {/* =======================================================
            VISIBLE BREADCRUMB
        ======================================================= */}

        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 py-4 text-xs text-[var(--store-text)] sm:text-sm"
        >

          <Link
            href="/"
            className="transition hover:text-[var(--store-primary)]"
          >
            Home
          </Link>


          <span
            aria-hidden="true"
            className="text-neutral-400"
          >
            ›
          </span>


          {firstCategory && (
            <>
              <Link
                href={`/category/${firstCategory.slug}`}
                className="transition hover:text-[var(--store-primary)]"
              >
                {firstCategory.name}
              </Link>


              <span
                aria-hidden="true"
                className="text-neutral-400"
              >
                ›
              </span>
            </>
          )}


          <span
            aria-current="page"
            className="text-neutral-400"
          >
            {product.name}
          </span>

        </nav>


        {/* =======================================================
            PRODUCT
        ======================================================= */}

        <section className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-4 sm:p-6 lg:p-8">

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)] lg:gap-10">

            {/* PRODUCT GALLERY */}
            <ProductGallery
              images={
                product.images
              }
              productName={
                product.name
              }
              productId={product.id}
              onSale={
                product.on_sale
              }
            />


            {/* PRODUCT INFO */}
            <ProductInfo
              product={
                product
              }
              variations={
                variations
              }
              settings={
                settings
              }
            />

          </div>

        </section>


        {/* =======================================================
            PRODUCT DESCRIPTION
        ======================================================= */}

        {product.description && (
          <div className="mt-7">

            <ProductDescription
              description={
                product.description
              }
            />

          </div>
        )}

        {/* =======================================================
        CUSTOMER REVIEWS
        ======================================================= */}

        <div className="mt-7">

          <ProductReviews
            reviews={
              reviews
            }
            averageRating={
              product.average_rating
            }
            reviewCount={
              product.review_count
            }
          />

        </div>


        {/* =======================================================
            RELATED PRODUCTS
        ======================================================= */}

        {relatedProducts.length >
          0 && (
          <RelatedProducts
            products={
              relatedProducts
            }
          />
        )}

      </Container>

    </main>
  );
}