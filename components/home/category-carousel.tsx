"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import type { WooCategory } from "@/lib/woocommerce/categories";

type CategoryCarouselProps = {
  categories: WooCategory[];
};

export function CategoryCarousel({
  categories,
}: CategoryCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scroller.current) return;

    const amount = scroller.current.clientWidth * 0.75;

    scroller.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (!categories.length) return null;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous categories"
        onClick={() => scroll("left")}
        className="absolute left-0 top-[42%] z-20 hidden h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--store-border)] bg-white text-xl text-[var(--store-dark)] shadow-sm transition hover:text-[var(--store-primary)] md:flex"
      >
        ‹
      </button>

      <div
        ref={scroller}
        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 sm:gap-4"
      >
        {categories.map((category) => (
          <Link
            href={`/category/${category.slug}`}
            key={category.id}
            className="group w-[112px] shrink-0 snap-start sm:w-[145px] lg:w-[160px]"
          >
            <div className="overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white p-2 transition group-hover:-translate-y-0.5 group-hover:shadow-md">
              <div className="relative aspect-square overflow-hidden rounded-[var(--store-radius-md)] bg-[var(--store-soft)]">
                {category.image?.src ? (
                  <Image
                    src={category.image.src}
                    alt={category.image.alt || category.name}
                    fill
                    loading="lazy"
                    sizes="
                      (max-width: 640px) 30vw,
                      (max-width: 1024px) 20vw,
                      145px
                    "
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl text-[var(--store-primary)]">
                    ◇
                  </div>
                )}
              </div>
            </div>

            <div className="px-1 pt-2 text-center">
              <h3 className="text-[13px] font-semibold leading-[1.35] text-[var(--store-dark)] sm:text-sm">
                {category.name}
              </h3>

              <p className="mt-0.5 text-[10px] text-neutral-400 sm:text-[11px]">
                {category.count} products
              </p>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Next categories"
        onClick={() => scroll("right")}
        className="absolute right-0 top-[42%] z-20 hidden h-9 w-9 translate-x-1/2 items-center justify-center rounded-full border border-[var(--store-border)] bg-white text-xl text-[var(--store-dark)] shadow-sm transition hover:text-[var(--store-primary)] md:flex"
      >
        ›
      </button>
    </div>
  );
}