const WP_URL = process.env.WORDPRESS_URL;

if (!WP_URL) {
  throw new Error("WORDPRESS_URL is not configured");
}

export type StoreviaSettings = {
  hero_enabled: number;

  hero_slide_1: string;
  hero_slide_1_link: string;

  hero_slide_2: string;
  hero_slide_2_link: string;

  hero_slide_3: string;
  hero_slide_3_link: string;

  hero_category_sidebar_enabled: number;

  categories_enabled: number;
  categories_eyebrow: string;
  categories_title: string;
  categories_description: string;
  categories_limit: number;

  brands_enabled: number;
  brands_eyebrow: string;
  brands_title: string;
  brands_description: string;
  brands_limit: number;

  flash_sale_enabled: number;
  flash_sale_eyebrow: string;
  flash_sale_title: string;
  flash_sale_description: string;
  flash_sale_limit: number;

  new_arrivals_enabled: number;
  new_arrivals_eyebrow: string;
  new_arrivals_title: string;
  new_arrivals_description: string;
  new_arrivals_limit: number;

  best_sellers_enabled: number;
  best_sellers_eyebrow: string;
  best_sellers_title: string;
  best_sellers_description: string;
  best_sellers_limit: number;

  checkout_city_name: string;

  inside_city_label: string;
  inside_city_charge: number;

  outside_city_label: string;
  outside_city_charge: number;

  cod_enabled: number;
  cod_title: string;

  bkash_enabled: number;
  bkash_title: string;
  bkash_number: string;
  bkash_instructions: string;

  /* Branding */

  header_logo: string;
  footer_logo: string;
  favicon: string;


/* Top Header */

  top_header_enabled: number;

  top_header_email: string;
  top_header_phone: string;

  top_header_account_label: string;
  top_header_track_label: string;


  /* Theme */

  theme_primary_color: string;
  theme_accent_color: string;

  theme_dark_color: string;
  theme_text_color: string;

  theme_bg_color: string;
  theme_soft_color: string;
  theme_border_color: string;

  theme_heading_font: string;
  theme_body_font: string;


  /* Ordering */

  whatsapp_number: string;
  order_phone_number: string;

  promo_banner_enabled: number;
  promo_banner_eyebrow: string;
  promo_banner_title: string;
  promo_banner_description: string;
  promo_banner_button_text: string;
  promo_banner_button_link: string;

  trust_features_enabled: number;

  trust_1_icon: string;
  trust_1_title: string;
  trust_1_description: string;

  trust_2_icon: string;
  trust_2_title: string;
  trust_2_description: string;

  trust_3_icon: string;
  trust_3_title: string;
  trust_3_description: string;

  trust_4_icon: string;
  trust_4_title: string;
  trust_4_description: string;

  seo_site_name: string;
  seo_default_title: string;
  seo_default_description: string;
  seo_default_image: string;
  seo_indexing_enabled: number;
  seo_title_separator: string;

  cart_coupon_enabled: number;

  /*Facebook Pixel*/
  facebook_pixel_enabled: number;
  facebook_pixel_id: string;

  /*Border corder style*/
  theme_corner_style?:
  | "square"
  | "subtle"
  | "rounded"
  | "soft";
};

export async function getStoreviaSettings(): Promise<StoreviaSettings> {
  const response = await fetch(
    `${WP_URL}/wp-json/storevia/v1/settings`,
    process.env.NODE_ENV === "development"
      ? {
          cache: "no-store",
        }
      : {
          next: {
            revalidate: 300,
          },
        }
  );

  if (!response.ok) {
    throw new Error(
      `Storevia settings request failed: ${response.status}`
    );
  }

  return response.json();
}