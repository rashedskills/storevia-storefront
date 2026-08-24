"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Turnstile,
} from "@/components/security/turnstile";

type Customer = {
  id: number;
  name: string;
  phone: string;
};

type Order = {
  id: number;
  number: string;
  date: string;
  status: string;
  status_label: string;
  total: number;
  payment: string;
  items_count: number;
};

export function AccountPage() {

  const [
  turnstileToken,
  setTurnstileToken,
] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    authenticated,
    setAuthenticated,
  ] = useState(false);

  const [
    customer,
    setCustomer,
  ] = useState<Customer | null>(
    null
  );

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [
    mode,
    setMode,
  ] = useState<
    "login" | "register"
  >("login");

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [error, setError] =
    useState("");

  async function loadAccount() {
    try {
      const response =
        await fetch(
          "/api/account",
          {
            cache:
              "no-store",
          }
        );

      if (!response.ok) {
        setAuthenticated(
          false
        );

        return;
      }

      const data =
        await response.json();

      setAuthenticated(true);
      setCustomer(
        data.customer
      );
      setOrders(
        data.orders || []
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccount();
  }, []);

 async function submit() {
  setError("");

  if (
    mode === "register" &&
    !turnstileToken
  ) {
    setError(
      "Please complete the security verification."
    );

    return;
  }

  const endpoint =
    mode === "login"
      ? "/api/auth/login"
      : "/api/auth/register";


  const payload =
    mode === "login"
      ? {
          phone,
          password,
        }
      : {
          name,
          phone,
          password,

          turnstile_token:
            turnstileToken,
        };

  const response =
    await fetch(
      endpoint,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
      }
    );


  const data =
    await response.json();


  if (!response.ok) {
    setError(
      data?.message ||
      "Unable to continue."
    );

    return;
  }


  setPassword("");

  /*
   * Clear Turnstile token after
   * successful registration.
   */
  if (
    mode === "register"
  ) {
    setTurnstileToken("");
  }


  await loadAccount();
}

  window.dispatchEvent(
  new Event(
    "storevia-auth-changed"
  )
);

window.dispatchEvent(
  new Event(
    "storevia-auth-changed"
  )
);

  async function logout() {
    await fetch(
      "/api/auth/logout",
      {
        method: "POST",
      }
    );

    setAuthenticated(false);
    setCustomer(null);
    setOrders([]);
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading account...
      </div>
    );
  }

  /*
   * LOGIN / REGISTER
   */
  if (!authenticated) {
    const registerFormValid =
  name.trim().length >= 2 &&
  phone.trim().length >= 11 &&
  password.length >= 6 &&
  Boolean(turnstileToken);

const loginFormValid =
  phone.trim().length >= 11 &&
  password.length >= 6;

const canSubmit =
  mode === "login"
    ? loginFormValid
    : registerFormValid;
    return (
      <div className="mx-auto max-w-[480px]">

        <div className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-5 sm:p-7">

          <h1 className="text-2xl font-bold">
            {mode === "login"
              ? "Login"
              : "Create Account"}
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Use your mobile number to access your account.
          </p>


          <div className="mt-5 flex rounded-[var(--store-radius-md)] bg-neutral-100 p-1">

            <button
              type="button"
              onClick={() =>
                setMode(
                  "login"
                )
              }
              className={`flex-1 rounded-[var(--store-radius-sm)] px-4 py-2 text-sm font-bold ${
                mode ===
                "login"
                  ? "bg-white text-[var(--store-primary)] shadow-sm"
                  : "text-neutral-500"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() =>
                setMode(
                  "register"
                )
              }
              className={`flex-1 rounded-[var(--store-radius-sm)] px-4 py-2 text-sm font-bold ${
                mode ===
                "register"
                  ? "bg-white text-[var(--store-primary)] shadow-sm"
                  : "text-neutral-500"
              }`}
            >
              Sign Up
            </button>

          </div>


          <div className="mt-5 space-y-3">

            {mode ===
              "register" && (
              <input
                value={name}
                onChange={(
                  event
                ) =>
                  setName(
                    event.target
                      .value
                  )
                }
                placeholder="Full Name *"
                className="h-12 w-full rounded-[var(--store-radius-md)] border border-[var(--store-border)] px-4 text-sm outline-none focus:border-[var(--store-primary)]"
              />
            )}


            <input
              value={phone}
              onChange={(
                event
              ) =>
                setPhone(
                  event.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(
                      0,
                      11
                    )
                )
              }
              placeholder="Mobile Number *"
              inputMode="numeric"
              maxLength={11}
              className="h-12 w-full rounded-[var(--store-radius-md)] border border-[var(--store-border)] px-4 text-sm outline-none focus:border-[var(--store-primary)]"
            />


            <input
              type="password"
              value={password}
              onChange={(
                event
              ) =>
                setPassword(
                  event.target
                    .value
                )
              }
              placeholder="Password *"
              className="h-12 w-full rounded-[var(--store-radius-md)] border border-[var(--store-border)] px-4 text-sm outline-none focus:border-[var(--store-primary)]"
            />

          </div>


          {error && (
            <div className="mt-3 rounded-[var(--store-radius-md)] bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="mt-4">
            <Turnstile
              onVerify={
                setTurnstileToken
              }
            />
          </div>
          <button
  type="button"
  onClick={submit}
  disabled={
    loading ||
    !canSubmit
  }
  className="
    mt-5
    flex
    min-h-[48px]
    w-full
    items-center
    justify-center
    rounded-[var(--store-radius-md)]
    bg-[var(--store-primary)]
    px-5
    font-bold
    text-white
    transition
    disabled:cursor-not-allowed
    disabled:opacity-40
  "
>
  {loading
    ? "Please wait..."
    : mode === "login"
      ? "Login"
      : "Create Account"}
</button>

        </div>

      </div>
    );
  }


  /*
   * PROFILE
   */
  return (
    <div className="mx-auto max-w-[900px]">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <p className="text-sm text-neutral-500">
            Welcome back
          </p>

          <h1 className="text-3xl font-bold">
            {customer?.name}
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            {customer?.phone}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white px-4 py-2 text-sm font-semibold"
        >
          Logout
        </button>

      </div>


      <section className="mt-7 rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-4 sm:p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-bold">
            My Orders
          </h2>
          <Link
            href="/my-account/wishlist"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--store-primary)]"
          >
            <span>♡</span>
            Wishlist
          </Link>
          <Link
            href="/track-order"
            className="text-sm font-semibold text-[var(--store-primary)]"
          >
            Track Order →
          </Link>

        </div>


        {!orders.length ? (
          <div className="py-12 text-center">

            <p className="text-neutral-500">
              You have no orders yet.
            </p>

            <Link
              href="/shop"
              className="mt-4 inline-flex rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-5 py-2.5 text-sm font-bold !text-white"
            >
              Start Shopping
            </Link>

          </div>
        ) : (
          <div className="mt-5 space-y-3">

            {orders.map(
              (order) => (
                <div
                  key={
                    order.id
                  }
                  className="rounded-[var(--store-radius-md)] border border-[var(--store-border)] p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="font-bold">
                        Order #
                        {
                          order.number
                        }
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {
                          order.date
                        }
                        {" • "}
                        {
                          order.items_count
                        }{" "}
                        items
                      </p>
                    </div>

                    <span className="rounded-full bg-[var(--store-soft)] px-3 py-1 text-xs font-bold text-[var(--store-primary)]">
                      {
                        order.status_label
                      }
                    </span>

                  </div>


                  <div className="mt-4 flex items-end justify-between border-t border-[var(--store-border)] pt-3">

                    <div>
                      <p className="text-xs text-neutral-500">
                        Payment
                      </p>

                      <p className="text-sm font-medium">
                        {
                          order.payment
                        }
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-neutral-500">
                        Total
                      </p>

                      <p className="font-bold">
                        ৳
                        {
                          order.total
                        }
                      </p>
                    </div>                   

                  </div>
                  <div className="mt-5">
                        {order.status === "completed" && (
                      <Link
                        href={`/my-account/review/${order.id}`}
                        className="inline-flex min-h-[38px] items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-4 text-xs font-bold !text-white transition hover:opacity-90"
                      >
                        Review Products
                      </Link>
                    )}
                  </div>
                    
                </div>
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}