const WP_URL =
  process.env.WOOCOMMERCE_URL;

if (!WP_URL) {
  throw new Error(
    "WOOCOMMERCE_URL is missing"
  );
}

export type WordPressPage = {
  id: number;
  slug: string;

  title: {
    rendered: string;
  };

  content: {
    rendered: string;
  };

  excerpt: {
    rendered: string;
  };

  date: string;
  modified: string;
};

export async function getPageBySlug(
  slug: string
): Promise<WordPressPage | null> {
  const response =
    await fetch(
      `${WP_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(
        slug
      )}&status=publish`,
      {
        cache:
          process.env.NODE_ENV ===
          "development"
            ? "no-store"
            : "force-cache",

        next: {
          revalidate: 60,
        },
      }
    );

  if (!response.ok) {
    return null;
  }

  const pages =
    (await response.json()) as WordPressPage[];

  return pages[0] ?? null;
}