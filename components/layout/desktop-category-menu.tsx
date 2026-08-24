"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export function DesktopCategoryMenu({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOutside(
      event: MouseEvent
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      closeOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeOutside
      );
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative hidden shrink-0 lg:block"
    >

      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) =>
              !current
          )
        }
        className="flex h-[46px] items-center gap-2 rounded-[var(--store-radius-md)] px-3 text-sm font-semibold text-[var(--store-dark)] transition hover:bg-[var(--store-soft)]"
      >
        <svg
          viewBox="0 0 24 24"
          width="21"
          height="21"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>

        <span>Categories</span>

        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition ${
            open
              ? "rotate-180"
              : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>


      {open && (
        <div className="absolute left-0 top-[52px] z-[120] w-[280px] overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white shadow-xl">

          <div className="bg-[var(--store-primary)] px-4 py-3 text-sm font-bold text-white">
            Categories
          </div>

          <div className="max-h-[420px]
    overflow-y-auto

    [scrollbar-width:thin]
    [scrollbar-color:#e7e1e5_transparent]

    [&::-webkit-scrollbar]:w-[4px]
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-[#e7e1e5]
    hover:[&::-webkit-scrollbar-thumb]:bg-[#d8d0d5]">

            <Link
              href="/shop"
              onClick={() =>
                setOpen(false)
              }
              className="flex min-h-[45px] items-center justify-between border-b border-neutral-100 px-4 text-sm font-semibold transition hover:bg-[var(--store-soft)] hover:text-[var(--store-primary)]"
            >
              All Products
            </Link>

            {categories.map(
              (category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex min-h-[45px] items-center justify-between border-b border-neutral-100 px-4 text-sm transition hover:bg-[var(--store-soft)] hover:text-[var(--store-primary)]"
                >
                  <span>
                    {category.name}
                  </span>

                  <span className="text-neutral-400">
                    ›
                  </span>
                </Link>
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}