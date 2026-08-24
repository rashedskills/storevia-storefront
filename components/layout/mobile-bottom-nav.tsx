"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  useMobileCategoryMenu,
} from "@/components/layout/mobile-category-context";

import type {
  StoreviaSettings,
} from "@/lib/storevia/settings";

export function MobileBottomNav({
  settings,
}: {
  settings: StoreviaSettings;
}) {
  const whatsappNumber =
  String(
    settings.whatsapp_number || ""
  ).replace(/\D/g, "");
  
  const pathname =
    usePathname();

  const {
    openMenu,
  } =
    useMobileCategoryMenu();

  /*
   * Special pages already have
   * their own bottom action bar.
   */
  const hideBottomNav =
    pathname.startsWith(
      "/product/"
    ) ||
    pathname.startsWith(
      "/cart"
    ) ||
    pathname.startsWith(
      "/checkout"
    );

  if (hideBottomNav) {
    return null;
  }

  const base =
    "flex flex-col items-center justify-center gap-[3px] text-[10px] font-medium transition";

  const active =
    "text-[var(--store-primary)]";

  const normal =
    "text-neutral-700";

  const shopActive =
    pathname === "/" ||
    pathname.startsWith(
      "/shop"
    ) ||
    pathname.startsWith(
      "/product/"
    );

  const categoryActive =
    pathname.startsWith(
      "/category/"
    );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--store-border)] bg-white shadow-[0_-5px_20px_rgba(0,0,0,.06)] lg:hidden">

      <div className="mx-auto grid h-[64px] max-w-[500px] grid-cols-4">

        {/* SHOP */}
        <Link
          href="/shop"
          className={`${base} ${
            shopActive
              ? active
              : normal
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path d="M4 10V20H20V10" />
            <path d="M3 10L5 4H19L21 10" />
            <path d="M9 20V14H15V20" />
          </svg>

          <span>
            Shop
          </span>
        </Link>


        {/* CATEGORIES */}
        <button
          type="button"
          onClick={openMenu}
          className={`${base} ${
            categoryActive
              ? active
              : normal
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path d="M8 6H20" />
            <path d="M8 12H20" />
            <path d="M8 18H20" />

            <circle
              cx="4"
              cy="6"
              r="1"
            />

            <circle
              cx="4"
              cy="12"
              r="1"
            />

            <circle
              cx="4"
              cy="18"
              r="1"
            />
          </svg>

          <span>
            Categories
          </span>
        </button>


        {/* CHAT */}
        {whatsappNumber && (
  <a
    href={`https://wa.me/${whatsappNumber}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] text-[var(--store-dark)]"
  >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path d="M4 5H20V16H8L4 20Z" />
          </svg>

         <span>
      Chat
    </span>
  </a>
        )}


        {/* ACCOUNT */}
        <Link
          href="/my-account"
          className={`${base} ${
            pathname.startsWith(
              "/my-account"
            )
              ? active
              : normal
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <circle
              cx="12"
              cy="7"
              r="4"
            />

            <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
          </svg>

          <span>
            Account
          </span>
        </Link>

      </div>

    </nav>
  );
}