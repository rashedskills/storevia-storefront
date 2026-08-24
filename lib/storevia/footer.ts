const WC_URL =
  process.env.WOOCOMMERCE_URL;

if (!WC_URL) {
  throw new Error(
    "WOOCOMMERCE_URL is missing"
  );
}

export type FooterMenuItem = {
  id: number;
  title: string;
  url: string;
  target: string;
  parent: number;
  order: number;
};

export type StoreviaFooter = {
  footer_logo: string;

  slogan: string;

  phone: string;
  email: string;
  address: string;

  facebook: string;
  instagram: string;
  youtube: string;

  copyright: string;
  powered_by: string;

  quick_links: FooterMenuItem[];
  useful_links: FooterMenuItem[];
};

export async function getStoreviaFooter(): Promise<StoreviaFooter> {
  const response =
    await fetch(
      `${WC_URL}/wp-json/storevia/v1/footer`,
      {
        cache:
          process.env.NODE_ENV ===
          "development"
            ? "no-store"
            : "force-cache",

        next: {
          revalidate: 300,
        },
      }
    );

  if (!response.ok) {
    throw new Error(
      `Unable to load footer: ${response.status}`
    );
  }

  return response.json();
}

