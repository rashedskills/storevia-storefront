"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  trackPurchase,
} from "@/lib/tracking/facebook";


type PurchaseEventProps = {
  orderId: string | number;

  value: number;

  currency: string;

  itemCount?: number;
};


export function PurchaseEvent({
  orderId,
  value,
  currency,
  itemCount,
}: PurchaseEventProps) {
  const fired =
    useRef(false);


  useEffect(() => {
    if (fired.current) {
      return;
    }


    /*
     * Extra browser protection against
     * accidental duplicate Purchase event
     * during rerenders/navigation.
     */
    const storageKey =
      `storevia_purchase_${orderId}`;


    if (
      sessionStorage.getItem(
        storageKey
      )
    ) {
      return;
    }


    fired.current =
      true;


    trackPurchase({
      value,

      currency,

      ...(itemCount
        ? {
            num_items:
              itemCount,
          }
        : {}),
    });


    sessionStorage.setItem(
      storageKey,
      "1"
    );

  }, [
    orderId,
    value,
    currency,
    itemCount,
  ]);


  return null;
}