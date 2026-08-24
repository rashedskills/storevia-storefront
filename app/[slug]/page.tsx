import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import {
  Container,
} from "@/components/layout/container";

import {
  getPageBySlug,
} from "@/lib/wordpress/pages";

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
};


/* ================================================================
   WORDPRESS PAGE SEO
================================================================ */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const [
    page,
    settings,
  ] = await Promise.all([
    getPageBySlug(slug),
    getStoreviaSettings(),
  ]);

  if (!page) {
    return {
      title:
        "Page Not Found",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const plainTitle =
    page.title.rendered
      .replace(
        /<[^>]*>/g,
        ""
      )
      .trim();

  const title =
    buildTitle(
      plainTitle,
      settings
    );

  const description =
    seoDescription(
      page.excerpt?.rendered ||
        page.content?.rendered,

      settings
        .seo_default_description
    );

  const url =
    canonicalUrl(
      `/${page.slug}`
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
        "article",

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
                  plainTitle,
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


/* ================================================================
   WORDPRESS PAGE
================================================================ */

export default async function WordPressPage({
  params,
}: PageProps) {
  const {
    slug,
  } = await params;

  const page =
    await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="bg-[var(--store-bg)] py-6 sm:py-10">

      <Container>

        <article className="mx-auto max-w-[900px] rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-5 sm:p-8 lg:p-10">

          <h1
            className="text-3xl font-bold tracking-[-0.03em] text-[var(--store-dark)] sm:text-4xl"
            dangerouslySetInnerHTML={{
              __html:
                page.title.rendered,
            }}
          />


          <div
            className="storevia-page-content mt-7"
            dangerouslySetInnerHTML={{
              __html:
                page.content.rendered,
            }}
          />

        </article>

      </Container>

    </main>
  );
}