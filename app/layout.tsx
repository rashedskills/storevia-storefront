import type {
  Metadata,
} from "next";

import {
  Suspense,
} from "react";

import type {
  CSSProperties,
  ReactNode,
} from "react";


import "./globals.css";

import {
  CartProvider,
} from "@/components/cart/cart-provider";

import {
  SiteHeader,
} from "@/components/layout/site-header";

import {
  MobileBottomNav,
} from "@/components/layout/mobile-bottom-nav";

import {
  MobileCategoryProvider,
} from "@/components/layout/mobile-category-context";

import {
  SiteFooter,
} from "@/components/layout/site-footer";

import {
  getCategories,
} from "@/lib/woocommerce/categories";

import {
  getStoreviaSettings,
} from "@/lib/storevia/settings";

import {
  baseMetadata,
} from "@/lib/storevia/seo";

import {
  FacebookPixel,
} from "@/components/tracking/facebook-pixel";

import {
  ScrollToTop,
} from "@/components/layout/scroll-to-top";

/* ================================================================
   GLOBAL SEO
================================================================ */

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await getStoreviaSettings();

  const metadata =
    baseMetadata(settings);

  /*
   * Dynamic Storevia favicon.
   */
  return {
    ...metadata,

    icons: {
      icon:
        settings.favicon ||
        "/favicon.ico",

      shortcut:
        settings.favicon ||
        "/favicon.ico",
    },
  };
}


/* ================================================================
   ROOT LAYOUT
================================================================ */

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [
    settings,
    categories,
  ] = await Promise.all([
    getStoreviaSettings(),
    getCategories(100),
  ]);


  /* ==============================================================
     DYNAMIC STOREVIA THEME
  ============================================================== */

  const cornerStyle =
  settings.theme_corner_style ||
  "rounded";


  const radiusMap = {
    square: {
      sm: "0px",
      md: "0px",
      lg: "0px",
    },

    subtle: {
      sm: "2px",
      md: "4px",
      lg: "6px",
    },

    rounded: {
      sm: "5px",
      md: "8px",
      lg: "12px",
    },

    soft: {
      sm: "8px",
      md: "14px",
      lg: "20px",
    },
  } as const;


  const radius =
    radiusMap[
      cornerStyle
    ];

  const themeStyle = {
    "--store-primary":
      settings.theme_primary_color ||
      "#7c2d62",

    "--store-accent":
      settings.theme_accent_color ||
      "#f472b6",

    "--store-dark":
      settings.theme_dark_color ||
      "#171221",

    "--store-text":
      settings.theme_text_color ||
      "#554d5d",

    "--store-bg":
      settings.theme_bg_color ||
      "#ffffff",

    "--store-soft":
      settings.theme_soft_color ||
      "#fff6fa",

    "--store-border":
      settings.theme_border_color ||
      "#ede7eb",

    /*
     * Keep typography settings ready,
     * but we can optimize font loading later.
     */
    "--store-heading-font":
      settings.theme_heading_font ||
      "Arial",

    "--store-body-font":
      settings.theme_body_font ||
      "Arial",

    "--store-radius-sm":
      radius.sm,

    "--store-radius-md":
      radius.md,

    "--store-radius-lg":
      radius.lg,

    "--store-max-width":
      "1340px",    
    
  } as CSSProperties;


  return (
    <html lang="en">

      <body
        style={themeStyle}
        className="min-h-screen bg-[var(--store-bg)] text-[var(--store-text)]"
      >

        <CartProvider>

          <MobileCategoryProvider
            categories={categories}
          >

            <Suspense fallback={null}>
              <ScrollToTop />
            </Suspense>

            <SiteHeader
              settings={settings}
              categories={categories}
            />
          
              {children}           


            <SiteFooter />


            <Suspense fallback={null}>
              <MobileBottomNav 
                settings={settings} 
              />
            </Suspense>
            

          </MobileCategoryProvider>

        </CartProvider>
        <Suspense fallback={null}>
          {Boolean(
          settings.facebook_pixel_enabled
        ) &&
        settings.facebook_pixel_id && (
          <FacebookPixel
            pixelId={
              settings.facebook_pixel_id
            }
          />
        )}
        </Suspense>
        

      </body>

    </html>
  );
}