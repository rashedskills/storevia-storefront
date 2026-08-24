import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { HeaderCart } from "@/components/cart/header-cart";
import { HeaderAccount } from "@/components/account/header-account";
import { MobileHeaderAction } from "@/components/layout/mobile-header-action";
import { DesktopCategoryMenu } from "@/components/layout/desktop-category-menu";

import type { StoreviaSettings } from "@/lib/storevia/settings";
import type { WooCategory } from "@/lib/woocommerce/categories";

import {
  WishlistHeaderLink,
} from "@/components/wishlist/wishlist-header-link";

type SiteHeaderProps = {
  settings: StoreviaSettings;
  categories: WooCategory[];
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4.2 3.3-6.5 7.5-6.5s6.7 2.3 7.5 6.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 4h2l2 11h10l2-8H6" />
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function SiteHeader({
  settings,
  categories,
}: SiteHeaderProps) {
  {Boolean(settings.top_header_enabled) && (
  <div className="hidden border-b border-[var(--store-border)] bg-white lg:block">
    <Container>
      <div className="flex h-9 items-center justify-between text-xs text-neutral-500">

        <div className="flex items-center gap-5">

          {settings.top_header_email && (
            <a
              href={`mailto:${settings.top_header_email}`}
              className="flex items-center gap-1.5 transition hover:text-[var(--store-primary)]"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>

              {settings.top_header_email}
            </a>
          )}

          {settings.top_header_phone && (
            <a
              href={`tel:${settings.top_header_phone}`}
              className="flex items-center gap-1.5 transition hover:text-[var(--store-primary)]"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5.2 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L9 10.7a16 16 0 0 0 4.3 4.3l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z" />
              </svg>

              {settings.top_header_phone}
            </a>
          )}

        </div>

        <div className="flex items-center gap-5">          

          <Link
            href="/my-account"
            className="transition hover:text-[var(--store-primary)]"
          >
            {settings.top_header_account_label || "My Account"}
          </Link>

          <WishlistHeaderLink />

          <Link
            href="/track-order"
            className="transition hover:text-[var(--store-primary)]"
          >
            {settings.top_header_track_label || "Track Order"}
          </Link>

        </div>

      </div>
    </Container>
  </div>
)}
  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,0,0,.06)]">
      {/* Desktop top bar */}
      <div className="hidden border-b border-neutral-100 md:block">
        <Container className="flex h-9 items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center gap-6">
            {settings.top_header_phone && (
              <a
                href={`tel:${settings.top_header_phone}`}
                className="flex items-center gap-1.5 transition hover:text-[var(--store-primary)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5.2 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L9 10.7a16 16 0 0 0 4.3 4.3l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z" />
                </svg>

                {settings.top_header_phone}
              </a>
            )}
          </div>

          <div className="flex gap-5">
            <WishlistHeaderLink />
            <Link href="/my-account">My Account</Link>
            <Link href="/track-order">Track Order</Link>
          </div>
        </Container>
      </div>

      {/* Main header */}
      <div className="bg-white">
        <Container>
          {/* Desktop */}
          
          {/* =========================================================
    DESKTOP MAIN HEADER
========================================================= */}

<div className="hidden border-b border-[var(--store-border)] bg-white lg:block">
  <Container>

    <div className="flex min-h-[92px] items-center gap-5">

      {/* LOGO */}
      <Link
        href="/"
        className="flex w-[230px] shrink-0 items-center"
      >
        <Image
          src={
            settings.header_logo ||
            "/logo.png"
          }
          alt="Store logo"
          width={220}
          height={70}
          priority
          className="h-auto max-h-[54px] w-auto max-w-[210px] object-contain"
        />
      </Link>


      {/* CATEGORIES */}
      <DesktopCategoryMenu
        categories={categories}
      />


      {/* SEARCH */}
      <form
        action="/search"
        method="GET"
        className="flex h-[48px] min-w-[260px] flex-1 overflow-hidden rounded-[var(--store-radius-md)] border-2 border-[var(--store-primary)] bg-white"
      >
        <input
          type="search"
          name="q"
          placeholder="Search products..."
          className="min-w-0 flex-1 px-4 text-sm outline-none"
        />

        <button
          type="submit"
          aria-label="Search"
          className="flex w-[58px] shrink-0 items-center justify-center bg-[var(--store-primary)] text-white"
        >
          <SearchIcon />
        </button>
      </form>


      {/* ACCOUNT */}
      <div className="shrink-0">
        <HeaderAccount />
      </div>


      {/* CART */}
      <div className="shrink-0">
        <HeaderCart />
      </div>

    </div>

  </Container>
</div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="flex h-[64px] items-center justify-center">
              <Link href="/">
                <Image
                  src={
                    settings.header_logo ||
                    "/logo.png"
                  }
                  alt="Store logo"
                  width={160}
                  height={50}
                  priority
                  className="h-auto max-h-[42px] w-auto object-contain"
                />
              </Link>
            </div>
            
            <div className="flex items-center gap-2 pb-3">

            {/* BACK OR BURGER */}
            <MobileHeaderAction />


            {/* SEARCH */}
            <form
              action="/search"
              method="GET"
              className="flex h-[44px] min-w-0 flex-1 overflow-hidden rounded-[var(--store-radius-md)] border-2 border-[var(--store-primary)]"
            >

              <input
                type="search"
                name="q"
                placeholder="Search products..."
                className="min-w-0 flex-1 bg-white px-3 text-[13px] outline-none"
              />

              <button
                type="submit"
                aria-label="Search"
                className="flex w-[48px] shrink-0 items-center justify-center bg-[var(--store-primary)] text-white"
              >
                <SearchIcon />
              </button>

            </form>


            {/* CART ONLY */}
            <HeaderCart mobile />

          </div>
          </div>
        </Container>
      </div>
    </header>
  );
}