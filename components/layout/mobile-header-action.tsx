"use client";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useMobileCategoryMenu,
} from "@/components/layout/mobile-category-context";

export function MobileHeaderAction() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    openMenu,
  } =
    useMobileCategoryMenu();

  /*
   * HOME:
   * burger only
   */
  if (pathname === "/") {
    return (
      <button
        type="button"
        onClick={openMenu}
        aria-label="Open categories"
        className="flex h-[44px] w-[38px] shrink-0 items-center justify-center text-[var(--store-primary)]"
      >
        <MenuIcon />
      </button>
    );
  }

  /*
   * CHILD PAGE:
   * back arrow only
   */
  return (
    <button
      type="button"
      onClick={() =>
        router.back()
      }
      aria-label="Go back"
      className="flex h-[44px] w-[38px] shrink-0 items-center justify-center text-[var(--store-dark)]"
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  );
}

function MenuIcon() {
  return (
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
  );
}