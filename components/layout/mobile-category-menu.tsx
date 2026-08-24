"use client";

import Link from "next/link";
import { useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  count?: number;
};

export function MobileCategoryMenu({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        aria-label="Browse categories"
        className="flex h-10 w-8 shrink-0 items-center justify-center text-[var(--store-primary)] lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
        >
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      </button>


      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          <button
            type="button"
            aria-label="Close categories"
            onClick={() =>
              setOpen(false)
            }
            className="absolute inset-0 bg-black/35"
          />

          <div className="absolute inset-y-0 left-0 w-[85%] max-w-[340px] overflow-y-auto bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-[var(--store-border)] p-4">

              <h2 className="text-lg font-bold">
                Categories
              </h2>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-xl"
              >
                ×
              </button>

            </div>


            <div className="p-3">

              <Link
                href="/shop"
                onClick={() =>
                  setOpen(false)
                }
                className="flex items-center justify-between rounded-[var(--store-radius-md)] px-3 py-3 font-semibold hover:bg-[var(--store-soft)]"
              >
                <span>
                  All Products
                </span>

                <span>›</span>
              </Link>


              {categories.map(
                (category) => (
                  <Link
                    key={
                      category.id
                    }
                    href={`/category/${category.slug}`}
                    onClick={() =>
                      setOpen(
                        false
                      )
                    }
                    className="flex items-center justify-between rounded-[var(--store-radius-md)] px-3 py-3 hover:bg-[var(--store-soft)]"
                  >
                    <div>

                      <p className="text-sm font-semibold">
                        {
                          category.name
                        }
                      </p>

                      {typeof category.count ===
                        "number" && (
                        <p className="mt-0.5 text-[11px] text-neutral-400">
                          {
                            category.count
                          }{" "}
                          items
                        </p>
                      )}

                    </div>

                    <span>›</span>

                  </Link>
                )
              )}

            </div>

          </div>

        </div>
      )}
    </>
  );
}