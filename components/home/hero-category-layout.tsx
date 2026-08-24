import Link from "next/link";

import { HeroSlider } from "@/components/home/hero-slider";
import type { WooCategory } from "@/lib/woocommerce/categories";

type HeroSlide = {
  id: number;
  image: string;
  href?: string;
  alt: string;
};

type HeroCategoryLayoutProps = {
  categories: WooCategory[];
  slides: HeroSlide[];

  /*
   * Seller can enable / disable
   * the desktop category sidebar.
   */
  showSidebar?: boolean;
};

export function HeroCategoryLayout({
  categories,
  slides,
  showSidebar = true,
}: HeroCategoryLayoutProps) {
  return (
    <div
      className={
        showSidebar
          ? "relative lg:pl-[276px]"
          : "relative"
      }
    >

      {/* =========================================================
          DESKTOP CATEGORY SIDEBAR
      ========================================================= */}

      {showSidebar && (

        <aside
          className="
            absolute
            bottom-0
            left-0
            top-0
            hidden
            w-[260px]
            min-h-0
            overflow-hidden
            rounded-[var(--store-radius-md)]
            border
            border-[var(--store-border)]
            bg-white
            lg:flex
            lg:flex-col
          "
        >

          {/* HEADING */}

          <div className="shrink-0 bg-[var(--store-primary)] px-5 py-4 text-[15px] font-bold text-white">
            Shop Categories
          </div>


          {/* CATEGORY LIST */}

          <nav
  className="
    min-h-0
    flex-1
    overflow-y-auto
    overscroll-contain
    pb-2

    [scrollbar-width:thin]
    [scrollbar-color:var(--store-border)_transparent]

    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-[var(--store-border)]
    hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300
  "
>

            {categories.map(
              (category) => (

                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="
                    group
                    flex
                    min-h-[52px]
                    items-center
                    justify-between
                    border-b
                    border-[var(--store-border)]
                    px-5
                    py-3
                    text-[14px]
                    font-medium
                    text-[var(--store-dark)]
                    transition
                    last:border-b-0
                    hover:bg-[var(--store-soft)]
                    hover:text-[var(--store-primary)]
                  "
                >

                  <span>
                    {category.name}
                  </span>

                  <span className="text-lg text-[var(--store-text)] transition-all group-hover:translate-x-1 group-hover:text-[var(--store-primary)]">
                    ›
                  </span>

                </Link>

              )
            )}

          </nav>


          {/* VIEW ALL */}

          <Link
            href="/categories"
            className="
              relative
              z-10
              flex
              min-h-[48px]
              shrink-0
              items-center
              justify-center
              border-t
              border-[var(--store-border)]
              bg-white
              text-[13px]
              font-bold
              text-[var(--store-primary)]
              transition
              hover:bg-[var(--store-soft)]
            "
          >
            View All Categories
          </Link>

        </aside>

      )}


      {/* =========================================================
          HERO
      ========================================================= */}

      <div className="min-w-0">

        <HeroSlider
          slides={slides}
        />

      </div>

    </div>
  );
}