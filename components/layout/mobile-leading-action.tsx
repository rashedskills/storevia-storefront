"use client";

import {
  usePathname,
} from "next/navigation";

import {
  MobileBackButton,
} from "./mobile-back-button";

import {
  MobileCategoryMenu,
} from "./mobile-category-menu";

type Category = {
  id: number;
  name: string;
  slug: string;
  count?: number;
};

export function MobileLeadingAction({
  categories,
}: {
  categories: Category[];
}) {
  const pathname =
    usePathname();

  if (pathname === "/") {
    return (
      <MobileCategoryMenu
        categories={
          categories
        }
      />
    );
  }

  return (
    <MobileBackButton />
  );
}