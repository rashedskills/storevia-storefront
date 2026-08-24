"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  count?: number;
};

type CategoryContextType = {
  open: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  categories: Category[];
};

const CategoryContext =
  createContext<CategoryContextType | null>(
    null
  );

export function MobileCategoryProvider({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: Category[];
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <CategoryContext.Provider
      value={{
        open,
        openMenu: () =>
          setOpen(true),

        closeMenu: () =>
          setOpen(false),

        categories,
      }}
    >
      {children}

      <MobileCategoryDrawer />
    </CategoryContext.Provider>
  );
}

export function useMobileCategoryMenu() {
  const context =
    useContext(CategoryContext);

  if (!context) {
    throw new Error(
      "useMobileCategoryMenu must be used inside MobileCategoryProvider"
    );
  }

  return context;
}

function MobileCategoryDrawer() {
  const {
    open,
    closeMenu,
    categories,
  } = useMobileCategoryMenu();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] lg:hidden">

      {/* OVERLAY */}
      <button
        type="button"
        aria-label="Close categories"
        onClick={closeMenu}
        className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
      />


      {/* PANEL */}
      <div className="absolute left-1/2 top-[102px] w-[calc(100%-24px)] max-w-[420px] -translate-x-1/2 overflow-hidden rounded-[var(--store-radius-md)] border border-neutral-300 bg-white shadow-2xl">

        {/* TITLE */}
        <div className="flex h-[48px] items-center justify-between bg-[var(--store-primary)] px-4">
          <div className="text-sm font-bold text-white">
            Categories
          </div>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center text-xl font-bold text-white"
          >
            ×
          </button>
        </div>


        {/* CATEGORY LIST */}
        <div className="max-h-[420px] overflow-y-auto">

          <a
            href="/shop"
            onClick={closeMenu}
            className="flex min-h-[48px] items-center justify-between border-b border-neutral-100 px-4 text-[13px] font-medium text-neutral-800"
          >
            <span>
              All Products
            </span>
          </a>


          {categories.map(
            (category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={closeMenu}
                className="flex min-h-[48px] items-center justify-between border-b border-neutral-100 px-4 text-[13px] font-medium text-neutral-800 transition hover:bg-neutral-50"
              >
                <span>
                  {category.name}
                </span>

                <span className="text-neutral-400">
                  ›
                </span>
              </a>
            )
          )}


          {/* LOGIN */}
          <a
            href="/my-account"
            onClick={closeMenu}
            className="flex min-h-[48px] items-center border-b border-neutral-100 px-4 text-[13px] font-semibold text-neutral-800"
          >
            Login / Sign Up
          </a>

        </div>

      </div>

    </div>
  );
}