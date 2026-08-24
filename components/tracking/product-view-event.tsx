"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  trackViewContent,
} from "@/lib/tracking/facebook";


type ProductViewEventProps = {
  id: number;
  name: string;
  price: number;
  currency: string;
};


export function ProductViewEvent({
  id,
  name,
  price,
  currency,
}: ProductViewEventProps) {
  const fired =
    useRef(false);


  useEffect(() => {
    if (fired.current) {
      return;
    }

    fired.current =
      true;


    trackViewContent({
      content_ids: [
        String(id),
      ],

      content_name:
        name,

      content_type:
        "product",

      value:
        price,

      currency,
    });

  }, [
    id,
    name,
    price,
    currency,
  ]);


  return null;
}