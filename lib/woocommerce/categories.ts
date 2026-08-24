import {
  wooFetch,
} from "./client";

export type WooCategory = {
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
};

export async function getCategories(
  perPage = 100
): Promise<WooCategory[]> {
  return wooFetch<
    WooCategory[]
  >(
    `/products/categories?per_page=${perPage}&hide_empty=true`
  );
}

export async function getCategoryBySlug(
  slug: string
): Promise<WooCategory | null> {
  try {
    return await wooFetch<
      WooCategory
    >(
      `/products/categories/${encodeURIComponent(
        slug
      )}`
    );
  } catch {
    return null;
  }
}