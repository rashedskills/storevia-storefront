"use client";

import {
  usePathname,
  useRouter,
} from "next/navigation";

export function MobileBackButton() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  /*
   * Home page has no back arrow.
   */
  if (pathname === "/") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() =>
        router.back()
      }
      aria-label="Go back"
      className="flex h-10 w-8 shrink-0 items-center justify-center text-[var(--store-dark)] lg:hidden"
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