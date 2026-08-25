import { Container } from "@/components/layout/container";

import { HeroCategoryLayout } from "@/components/home/hero-category-layout";
import { CategoryCarousel } from "@/components/home/category-carousel";
import { BrandCarousel } from "@/components/home/brand-carousel";

import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";

import {
  getProducts,
  getSaleProducts,
  getBestSellingProducts,
} from "@/lib/woocommerce/products";

import { getCategories } from "@/lib/woocommerce/categories";
import { getBrands } from "@/lib/woocommerce/brands";

import { getStoreviaSettings } from "@/lib/storevia/settings";

import {
  PromoBanner,
} from "@/components/home/promo-banner";

import {
  TrustFeatures,
} from "@/components/home/trust-features";


export default async function HomePage() {
  /*
  |--------------------------------------------------------------------------
  | Storevia settings
  |--------------------------------------------------------------------------
  */

  const settings = await getStoreviaSettings();


  /*
  |--------------------------------------------------------------------------
  | Fetch storefront content concurrently
  |--------------------------------------------------------------------------
  */

  const [
    categories,
    brands,
    newArrivals,
    saleProducts,
    bestSellers,
  ] = await Promise.all([
    getCategories(settings.categories_limit),

    settings.brands_enabled
      ? getBrands(settings.brands_limit)
      : Promise.resolve([]),

    settings.new_arrivals_enabled
    ? getProducts({
        perPage:
          settings.new_arrivals_limit,
        page: 1,
        sort: "latest",
      })
    : Promise.resolve([]),

    settings.flash_sale_enabled
      ? getSaleProducts(settings.flash_sale_limit)
      : Promise.resolve([]),

    settings.best_sellers_enabled
      ? getBestSellingProducts(
          settings.best_sellers_limit
        )
      : Promise.resolve([]),
  ]);


  /*
  |--------------------------------------------------------------------------
  | Hero slides from WordPress
  |--------------------------------------------------------------------------
  */

  const heroSlides = [
    {
      id: 1,
      image: settings.hero_slide_1,
      href: settings.hero_slide_1_link || "/shop",
      alt: "Store promotion 1",
    },

    {
      id: 2,
      image: settings.hero_slide_2,
      href: settings.hero_slide_2_link || "/shop",
      alt: "Store promotion 2",
    },

    {
      id: 3,
      image: settings.hero_slide_3,
      href: settings.hero_slide_3_link || "/shop",
      alt: "Store promotion 3",
    },
  ].filter((slide) => Boolean(slide.image));


  return (
    <main>

      {/* ================================================================
          HERO
      ================================================================= */}

      {Boolean(settings.hero_enabled) &&
        heroSlides.length > 0 && (
          <Container className="pt-4 sm:pt-6">
            <HeroCategoryLayout
              categories={categories}
              slides={heroSlides}
              showSidebar={Boolean(
                settings.hero_category_sidebar_enabled
              )}
            />
          </Container>
        )}


      {/* ================================================================
          SHOP BY CATEGORY
      ================================================================= */}

      {Boolean(settings.categories_enabled) &&
        categories.length > 0 && (
          <section className="py-8 sm:py-10">
            <Container>

              <SectionHeading
                eyebrow={
                  settings.categories_eyebrow
                }
                title={
                  settings.categories_title
                }
                description={
                  settings.categories_description
                }
                viewAllHref="/categories"
                viewAllText="All Categories"
              />

              <CategoryCarousel
                categories={categories}
              />

            </Container>
          </section>
        )}


      {/* ================================================================
          TOP BRANDS
      ================================================================= */}

      {Boolean(settings.brands_enabled) &&
        brands.length > 0 && (
          <section className="bg-[var(--store-soft)] py-8 sm:py-10">
            <Container>

              <SectionHeading
                eyebrow={
                  settings.brands_eyebrow
                }
                title={
                  settings.brands_title
                }
                description={
                  settings.brands_description
                }
                viewAllHref="/brands"
              />

              <BrandCarousel brands={brands} />

            </Container>
          </section>
        )}


      {/* ================================================================
          FLASH SALE
      ================================================================= */}

      {Boolean(settings.flash_sale_enabled) &&
        saleProducts.length > 0 && (
          <section className="py-8 sm:py-12">
            <Container>

              <SectionHeading
                eyebrow={
                  settings.flash_sale_eyebrow
                }
                title={
                  settings.flash_sale_title
                }
                description={
                  settings.flash_sale_description
                }
                viewAllHref="/shop?on_sale=true"
              />

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                {saleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}

              </div>

            </Container>
            <div className="mt-3">
                  <PromoBanner
                settings={settings}
              />
            </div>
          </section>
        )}
        
        
                

      {/* ================================================================
          BEST SELLERS
      ================================================================= */}

      {Boolean(settings.best_sellers_enabled) &&
        bestSellers.length > 0 && (
          <section className="bg-[var(--store-soft)] py-8 sm:py-12">
            <Container>

              <SectionHeading
                eyebrow={
                  settings.best_sellers_eyebrow
                }
                title={
                  settings.best_sellers_title
                }
                description={
                  settings.best_sellers_description
                }
                viewAllHref="/shop?sort=best-selling"
              />

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                {bestSellers.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}

              </div>

            </Container>
          </section>
        )}


      {/* ================================================================
          NEW ARRIVALS
      ================================================================= */}

      {Boolean(settings.new_arrivals_enabled) &&
        newArrivals.length > 0 && (
          <section className="py-8 sm:py-12">
            <Container>

              <SectionHeading
                eyebrow={
                  settings.new_arrivals_eyebrow
                }
                title={
                  settings.new_arrivals_title
                }
                description={
                  settings.new_arrivals_description
                }
                viewAllHref="/shop?sort=latest"
              />

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}

              </div>
              
            </Container>    
                  
              <div className="mt-5">
                <TrustFeatures
                  settings={settings}
                /> 
              </div>
                         
          </section>
          
        )}

    </main>
  );
}