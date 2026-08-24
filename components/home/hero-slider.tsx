"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type HeroSlide = {
  id: number;
  image: string;
  href?: string;
  alt: string;
};

type HeroSliderProps = {
  slides: HeroSlide[];
};

export function HeroSlider({
  slides,
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    if (slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [slides.length]);

  if (!slides.length) return null;

  const goPrevious = () => {
    setCurrent(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative overflow-hidden rounded-[var(--store-radius-md)] bg-[var(--store-soft)]">
      <div className="relative aspect-[1086/452] w-full">
        {slides.map((slide, index) => {
          const image = (
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              loading={
                index === 0
                  ? "eager"
                  : "lazy"
              }
              sizes="(max-width: 768px) 100vw, 1340px"
              className={`object-cover transition-opacity duration-700 ${
                index === current
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            />
          );

          return slide.href ? (
            <Link
              key={slide.id}
              href={slide.href}
              className={
                index === current
                  ? "block"
                  : "pointer-events-none"
              }
            >
              {image}
            </Link>
          ) : (
            <div key={slide.id}>{image}</div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous banner"
            onClick={goPrevious}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/90 text-2xl leading-none text-[var(--store-primary)] shadow-sm backdrop-blur transition hover:bg-[var(--store-primary)] hover:text-white sm:left-4 sm:h-11 sm:w-11"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Next banner"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/90 text-2xl leading-none text-[var(--store-primary)] shadow-sm backdrop-blur transition hover:bg-[var(--store-primary)] hover:text-white sm:right-4 sm:h-11 sm:w-11"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.id}
                onClick={() => setCurrent(index)}
                aria-label={`Banner ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === current
                    ? "w-6 bg-[var(--store-primary)]"
                    : "w-2 bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}