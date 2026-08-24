"use client";

import Image from "next/image";
import { useState } from "react";

type TrackItem = {
  name: string;
  quantity: number;
  total: number;
  image: string;

  variation: Array<{
    name: string;
    value: string;
  }>;
};

type TrackOrder = {
  order_number: string;

  status: string;

  status_label: string;

  date_created: string;

  customer_name: string;

  phone: string;

  address: string;

  payment_method: string;

  delivery_area: string;

  delivery_charge: number;

  subtotal: number;

  total: number;

  currency: string;

  items: TrackItem[];
};

export function TrackOrderForm() {
  const [
    orderNumber,
    setOrderNumber,
  ] = useState("");

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [order, setOrder] =
    useState<TrackOrder | null>(
      null
    );

  async function trackOrder() {
    setError("");
    setOrder(null);

    if (!orderNumber.trim()) {
      setError(
        "Order number is required."
      );

      return;
    }

    if (!/^01\d{9}$/.test(phone)) {
      setError(
        "Enter a valid 11-digit mobile number."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/track-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              orderNumber,
              phone,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data?.message ||
          "Order not found."
        );

        return;
      }

      setOrder(data);

    } catch {
      setError(
        "Unable to track your order."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>

      <div className="mt-6 rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-4 sm:p-6">

        <div className="grid gap-3 sm:grid-cols-2">

          <input
            value={orderNumber}
            onChange={(event) =>
              setOrderNumber(
                event.target.value
              )
            }
            placeholder="Order Number *"
            className="h-12 rounded-[var(--store-radius-md)] border border-[var(--store-border)] px-4 text-sm outline-none focus:border-[var(--store-primary)]"
          />

          <input
            value={phone}
            onChange={(event) =>
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
            className="h-12 rounded-[var(--store-radius-md)] border border-[var(--store-border)] px-4 text-sm outline-none focus:border-[var(--store-primary)]"
          />

        </div>

        <button
          type="button"
          onClick={trackOrder}
          disabled={loading}
          className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-primary)] px-5 font-bold text-white disabled:opacity-50"
        >
          {loading
            ? "Checking..."
            : "Track Order"}
        </button>

        {error && (
          <p className="mt-3 rounded-[var(--store-radius-md)] bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

      </div>


      {order && (
        <div className="mt-5 rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-4 sm:p-6">

          <div className="flex flex-wrap items-start justify-between gap-3">

            <div>
              <p className="text-xs text-neutral-500">
                Order
              </p>

              <h2 className="text-2xl font-bold">
                #
                {
                  order.order_number
                }
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                {
                  order.date_created
                }
              </p>
            </div>

            <span className="rounded-full bg-[var(--store-soft)] px-4 py-2 text-sm font-bold text-[var(--store-primary)]">
              {
                order.status_label
              }
            </span>

          </div>


          <div className="mt-6 space-y-4">

            {order.items.map(
              (item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex gap-3 border-b border-[var(--store-border)] pb-4"
                >

                  <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[var(--store-radius-md)] bg-neutral-50">

                    {item.image && (
                      <Image
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        fill
                        sizes="70px"
                        className="object-cover"
                      />
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-bold">
                      {
                        item.name
                      }
                    </p>

                    {item.variation
                      ?.length >
                      0 && (
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-neutral-500">

                        {item.variation.map(
                          (
                            value,
                            variationIndex
                          ) => (
                            <span
                              key={
                                variationIndex
                              }
                            >
                              {
                                value.name
                              }
                              :{" "}
                              {
                                value.value
                              }
                            </span>
                          )
                        )}

                      </div>
                    )}

                    <p className="mt-2 text-xs text-neutral-500">
                      Qty:{" "}
                      {
                        item.quantity
                      }
                    </p>

                  </div>

                </div>
              )
            )}

          </div>


          <div className="mt-5 space-y-2 text-sm">

            <div className="flex justify-between">
              <span>
                Payment
              </span>

              <strong>
                {
                  order.payment_method
                }
              </strong>
            </div>

            <div className="flex justify-between">
              <span>
                Delivery Charge
              </span>

              <strong>
                ৳
                {
                  order.delivery_charge
                }
              </strong>
            </div>

            <div className="flex justify-between border-t border-[var(--store-border)] pt-3 text-base">
              <span>
                Grand Total
              </span>

              <strong>
                ৳
                {
                  order.total
                }
              </strong>
            </div>

          </div>


          <div className="mt-5 rounded-[var(--store-radius-md)] bg-neutral-50 p-4">

            <p className="text-xs text-neutral-500">
              Delivery Address
            </p>

            <p className="mt-1 text-sm font-medium">
              {
                order.address
              }
            </p>

          </div>

        </div>
      )}

    </>
  );
}