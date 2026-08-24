"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import type {
  ProductSort,
} from "@/lib/woocommerce/products";

const options: Array<{
  value: ProductSort;
  label: string;
}> = [
  {
    value: "default",
    label: "Default sorting",
  },
  {
    value: "best-selling",
    label: "Best Selling",
  },
  {
    value: "popularity",
    label: "Sort by popularity",
  },
  {
    value: "rating",
    label: "Sort by average rating",
  },
  {
    value: "latest",
    label: "Sort by latest",
  },
  {
    value: "price-asc",
    label: "Price: low to high",
  },
  {
    value: "price-desc",
    label: "Price: high to low",
  },
];

export function ArchiveSort({
  currentSort = "default",
}: {
  currentSort?: ProductSort;
}) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const [
    open,
    setOpen,
  ] = useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(
      null
    );

  function changeSort(
    value: ProductSort
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (value === "default") {
      params.delete("sort");
    } else {
      params.set(
        "sort",
        value
      );
    }

    const query =
      params.toString();

    router.push(
      query
        ? `${pathname}?${query}`
        : pathname
    );

    setOpen(false);
  }

  useEffect(() => {
    function handleOutside(
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
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >

      <button
        type="button"
        aria-label="Sort products"
        onClick={() =>
          setOpen(
            (value) =>
              !value
          )
        }
        className="flex h-10 w-10 items-center justify-center rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white text-[var(--store-dark)] transition hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </svg>
      </button>


      {open && (
        <div className="absolute right-0 top-[46px] z-50 w-[220px] overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white shadow-xl">

          {options.map(
            (option) => {
              const selected =
                currentSort ===
                option.value;

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    changeSort(
                      option.value
                    )
                  }
                  className={`flex w-full items-center justify-between border-b border-neutral-100 px-4 py-3 text-left text-sm transition last:border-0 ${
                    selected
                      ? "bg-[var(--store-soft)] font-semibold text-[var(--store-primary)]"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span>
                    {
                      option.label
                    }
                  </span>

                  {selected && (
                    <span>
                      ✓
                    </span>
                  )}

                </button>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}