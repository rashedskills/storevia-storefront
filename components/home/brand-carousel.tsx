"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useRef,
} from "react";

import type {
  WooBrand,
} from "@/lib/woocommerce/brands";


type BrandCarouselProps = {
  brands: WooBrand[];
};


export function BrandCarousel({
  brands,
}: BrandCarouselProps) {

  const scrollRef =
    useRef<HTMLDivElement | null>(
      null
    );


  if (!brands.length) {
    return null;
  }


  function scroll(
    direction:
      | "left"
      | "right"
  ) {

    const container =
      scrollRef.current;


    if (!container) {
      return;
    }


    const amount =
      container.clientWidth *
      0.75;


    container.scrollBy({
      left:
        direction === "left"
          ? -amount
          : amount,

      behavior:
        "smooth",
    });
  }


  return (
    <div className="relative">


      {/* =========================================================
          DESKTOP PREVIOUS
      ========================================================= */}

      <button
        type="button"
        aria-label="Previous brands"
        onClick={() =>
          scroll(
            "left"
          )
        }
        className="
          absolute
          -left-4
          top-[42%]
          z-20
          hidden
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-[var(--store-border)]
          bg-white
          text-xl
          text-[var(--store-dark)]
          shadow-sm
          transition
          hover:border-[var(--store-primary)]
          hover:text-[var(--store-primary)]
          lg:flex
        "
      >
        ‹
      </button>


      {/* =========================================================
          BRANDS
      ========================================================= */}

      <div
        ref={
          scrollRef
        }
        className="
          scrollbar-hide
          flex
          snap-x
          snap-mandatory
          gap-3
          overflow-x-auto
          scroll-smooth
          pb-2
          sm:gap-4
        "
      >

        {brands.map(
          (
            brand
          ) => (

            <Link
              href={`/brand/${brand.slug}`}
              key={
                brand.id
              }
              className="
                group
                w-[125px]
                shrink-0
                snap-start
                sm:w-[160px]
                lg:w-[175px]
              "
            >

              {/* LOGO */}

              <div
                className="
                  flex
                  aspect-[1.35/1]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[var(--store-radius-md)]
                  border
                  border-[var(--store-border)]
                  bg-white
                  p-4
                  transition
                  group-hover:-translate-y-0.5
                  group-hover:shadow-md
                "
              >

                {brand.image?.src ? (

                  <div className="relative h-full w-full">

                    <Image
                      src={
                        brand.image.src
                      }
                      alt={
                        brand.image.alt ||
                        brand.name
                      }
                      fill
                      loading="lazy"
                      sizes="
                        (max-width: 640px) 30vw,
                        (max-width: 1024px) 20vw,
                        160px
                      "
                      className="object-contain"
                    />

                  </div>

                ) : (

                  <span className="text-center text-lg font-bold text-[var(--store-primary)]">
                    {brand.name
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                )}

              </div>


              {/* NAME */}

              <h3 className="mt-2 text-center text-[13px] font-semibold leading-[1.35] text-[var(--store-dark)] sm:text-sm">
                {brand.name}
              </h3>

            </Link>

          )
        )}

      </div>


      {/* =========================================================
          DESKTOP NEXT
      ========================================================= */}

      <button
        type="button"
        aria-label="Next brands"
        onClick={() =>
          scroll(
            "right"
          )
        }
        className="
          absolute
          -right-4
          top-[42%]
          z-20
          hidden
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-[var(--store-border)]
          bg-white
          text-xl
          text-[var(--store-dark)]
          shadow-sm
          transition
          hover:border-[var(--store-primary)]
          hover:text-[var(--store-primary)]
          lg:flex
        "
      >
        ›
      </button>

    </div>
  );
}