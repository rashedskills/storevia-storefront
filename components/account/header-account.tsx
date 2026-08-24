"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

type Customer = {
  name: string;
  phone: string;
};

export function HeaderAccount() {
  const [
    customer,
    setCustomer,
  ] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    async function loadAccount() {
      try {
        const response =
          await fetch(
            "/api/account",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          setCustomer(null);
          return;
        }

        const data =
          await response.json();

        setCustomer(
          data.customer ?? null
        );
      } catch {
        setCustomer(null);
      }
    }

    loadAccount();

    function handleAuthChange() {
      loadAccount();
    }

    window.addEventListener(
      "storevia-auth-changed",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "storevia-auth-changed",
        handleAuthChange
      );
    };
  }, []);

  return (
    <Link
      href="/my-account"
      className="hidden items-center gap-2 text-sm font-semibold text-[var(--store-dark)] transition hover:text-[var(--store-primary)] lg:flex"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle
          cx="12"
          cy="7"
          r="4"
        />

        <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
      </svg>

      <span>
        {customer
          ? customer.name
          : "Login / Sign Up"}
      </span>
    </Link>
  );
}