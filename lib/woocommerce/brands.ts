import {
  wooFetch,
} from "./client";

export type WooBrand = {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;

  image?: {
    id: number;
    src: string;
    thumbnail?: string;
    alt?: string;
  } | null;

  review_count?: number;
  permalink?: string;
};

export async function getBrands(
  perPage = 100
): Promise<WooBrand[]> {
  return wooFetch<WooBrand[]>(
    `/products/brands?per_page=${perPage}`,
    {
      next: {
        revalidate: 600,
      },
    }
  );
}

export async function getBrandBySlug(
  slug: string
): Promise<WooBrand | null> {
  try {
    return await wooFetch<WooBrand>(
      `/products/brands/${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: 600,
        },
      }
    );
  } catch {
    return null;
  }
}