"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  trackPurchase,
} from "@/lib/tracking/facebook";


type PurchasePayload = {
  orderId:
    | string
    | number;

  value: number;

  currency: string;

  itemCount?: number;
};


type OrderSuccessPurchaseEventProps = {
  orderNumber: string;
};


export function OrderSuccessPurchaseEvent({
  orderNumber,
}: OrderSuccessPurchaseEventProps) {
  const firedRef =
    useRef(false);


  useEffect(() => {

    if (
      firedRef.current ||
      !orderNumber
    ) {
      return;
    }


    const purchaseKey =
      `storevia_purchase_${orderNumber}`;


    /*
     * Already fired during this
     * browser session.
     */
    if (
      sessionStorage.getItem(
        purchaseKey
      ) === "1"
    ) {
      return;
    }


    const payloadKey =
      `storevia_purchase_payload_${orderNumber}`;


    const rawPayload =
      sessionStorage.getItem(
        payloadKey
      );


    if (!rawPayload) {
      return;
    }


    try {
      const payload =
        JSON.parse(
          rawPayload
        ) as PurchasePayload;


      if (
        !payload.orderId ||
        !Number.isFinite(
          payload.value
        ) ||
        payload.value < 0 ||
        !payload.currency
      ) {
        return;
      }


      firedRef.current =
        true;


      trackPurchase({
        value:
          payload.value,

        currency:
          payload.currency,

        ...(payload.itemCount
          ? {
              num_items:
                payload.itemCount,
            }
          : {}),
      });


      /*
       * Prevent duplicate Purchase when
       * refreshing the success page.
       */
      sessionStorage.setItem(
        purchaseKey,
        "1"
      );


      /*
       * Purchase was sent successfully.
       * We don't need to retain payload.
       */
      sessionStorage.removeItem(
        payloadKey
      );

    } catch (error) {

      console.error(
        "Meta Purchase tracking error:",
        error
      );
    }

  }, [
    orderNumber,
  ]);


  return null;
}