import type {
  Metadata,
} from "next";

import Image from "next/image";
import Link from "next/link";

import {
  Container,
} from "@/components/layout/container";

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


/* ================================================================
   BRANDS INDEX SEO
================================================================ */

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await getStoreviaSettings();

  const title =
    buildTitle(
      "All Brands",
      settings
    );

  const description =
    seoDescription(
      "Browse all available brands and discover products from your favorite brands.",
      settings.seo_default_description
    );

  const url =
    canonicalUrl(
      "/brands"
    );

  const indexingEnabled =
    Boolean(
      settings.seo_indexing_enabled
    );

  const image =
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
                url: image,
                alt:
                  "All Brands",
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


/* ================================================================
   BRANDS INDEX PAGE
================================================================ */

export default async function BrandsPage() {
  const brands =
    await getBrands(100);

  const brandsUrl =
    canonicalUrl(
      "/brands"
    );


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
          brandsUrl,
      },
    ],
  };


  return (
    <main className="bg-[var(--store-bg)] py-6 sm:py-10">

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


      <Container>

        {/* =======================================================
            PAGE HEADER
        ======================================================= */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold tracking-[-0.03em] text-[var(--store-dark)]">
            All Brands
          </h1>

          <p className="mt-1 text-sm text-[var(--store-text)]">
            Browse products by brand.
          </p>

        </div>


        {/* =======================================================
            EMPTY STATE
        ======================================================= */}

        {brands.length === 0 ? (
          <div className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-10 text-center">

            <p className="text-[var(--store-text)]">
              No brands found.
            </p>

          </div>
        ) : (

          /* =====================================================
             BRAND GRID
          ===================================================== */

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">

            {brands.map(
              (brand) => (
                <Link
                  key={
                    brand.id
                  }
                  href={`/brand/${brand.slug}`}
                  className="group overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white p-2 transition hover:-translate-y-0.5 hover:border-[var(--store-primary)] hover:shadow-sm sm:p-3"
                >

                  {/* BRAND IMAGE */}
                  <div className="relative aspect-square overflow-hidden rounded-[var(--store-radius-md)] bg-[var(--store-soft)]">

                    {brand.image?.src ? (
                      <Image
                        src={
                          brand.image.src
                        }
                        alt={
                          brand.image.alt ||
                          brand.name
                        }
                        fill
                        sizes="(max-width: 640px) 33vw, 180px"
                        className="object-contain p-2 transition duration-300 group-hover:scale-105 sm:p-3"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-xs font-bold text-[var(--store-text)] sm:px-3 sm:text-sm">
                        {brand.name}
                      </div>
                    )}

                  </div>


                  {/* BRAND INFO */}
                  <div className="pt-2 text-center sm:pt-3">

                    <h2 className="line-clamp-2 text-xs font-bold leading-4 text-[var(--store-dark)] transition group-hover:text-[var(--store-primary)] sm:text-sm">
                      {brand.name}
                    </h2>


                    {typeof brand.count ===
                      "number" && (
                      <p className="mt-1 text-[10px] text-neutral-400 sm:text-xs">

                        {brand.count}{" "}

                        {brand.count === 1
                          ? "product"
                          : "products"}

                      </p>
                    )}

                  </div>

                </Link>
              )
            )}

          </div>
        )}

      </Container>

    </main>
  );
}