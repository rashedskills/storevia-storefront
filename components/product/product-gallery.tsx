"use client";

import Image from "next/image";
import { useState } from "react";

import {
  WishlistButton,
} from "@/components/wishlist/wishlist-button";

type ProductImage = {
  id: number;
  src: string;
  thumbnail: string;
  alt: string;
};

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
  onSale?: boolean;
  productId: number;
};

export function ProductGallery({
  images,
  productName,
  productId,
  onSale = false,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex];

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[var(--store-radius-lg)] bg-neutral-100 text-sm text-neutral-400">
        No product image
      </div>
    );
  }

  return (
    <div className="grid min-w-0 items-start gap-3 md:grid-cols-[82px_minmax(0,1fr)]">

      {/* Desktop thumbnails */}
      {images.length > 1 && (
        <div className="hidden flex-col gap-3 md:flex">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-[var(--store-radius-md)] border bg-white transition ${
                activeIndex === index
                  ? "border-[var(--store-primary)] ring-1 ring-[var(--store-primary)]"
                  : "border-[var(--store-border)] hover:border-[var(--store-primary)]"
              }`}
            >
              <Image
                src={image.thumbnail || image.src}
                alt={image.alt || productName}
                fill
                loading="lazy"
                sizes="90px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative self-start overflow-hidden rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-[#fafafa]">

        {onSale && (
          <span className="absolute left-4 top-4 z-10 rounded-[var(--store-radius-sm)] bg-[var(--store-accent)] px-3 py-1.5 text-xs font-bold uppercase text-white">
            Sale
          </span>
        )}

        {/* WISHLIST */}
        <WishlistButton
          productId={productId}
          iconOnly
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md transition hover:scale-105"
        />

        <div className="relative aspect-square">
          <Image
            src={activeImage.src}
            alt={activeImage.alt || productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-contain"
          />
        </div>

        {/* Mobile image count */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white md:hidden">
            {activeIndex + 1}/{images.length}
          </div>
        )}

        {/* Mobile previous */}
        {images.length > 1 && activeIndex > 0 && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={() =>
              setActiveIndex((current) =>
                Math.max(0, current - 1)
              )
            }
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl shadow md:hidden"
          >
            ‹
          </button>
        )}

        {/* Mobile next */}
        {images.length > 1 &&
          activeIndex < images.length - 1 && (
            <button
              type="button"
              aria-label="Next image"
              onClick={() =>
                setActiveIndex((current) =>
                  Math.min(
                    images.length - 1,
                    current + 1
                  )
                )
              }
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl shadow md:hidden"
            >
              ›
            </button>
          )}
      </div>
    </div>
  );
}