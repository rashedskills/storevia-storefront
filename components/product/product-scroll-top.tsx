"use client";

import {
  useLayoutEffect,
} from "react";

export function ProductScrollTop({
  slug,
}: {
  slug: string;
}) {
  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [slug]);

  return null;
}