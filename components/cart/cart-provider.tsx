"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  AddCartItemPayload,
  WooCart,
} from "@/lib/woocommerce/cart-types";


type CouponActionResult = {
  success: boolean;
  message: string;
};


type CartContextType = {
  cart: WooCart | null;

  loading: boolean;

  actionLoading: boolean;


  refreshCart: () => Promise<void>;


  addItem: (
    item: AddCartItemPayload
  ) => Promise<boolean>;


  updateItem: (
    key: string,
    quantity: number
  ) => Promise<boolean>;


  removeItem: (
    key: string
  ) => Promise<boolean>;


  applyCoupon: (
    code: string
  ) => Promise<CouponActionResult>;


  removeCoupon: (
    code: string
  ) => Promise<CouponActionResult>;
};


const CartContext =
  createContext<CartContextType | null>(
    null
  );


export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    cart,
    setCart,
  ] =
    useState<WooCart | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    actionLoading,
    setActionLoading,
  ] =
    useState(false);


  /* ================================================================
     REFRESH CART
  ================================================================ */

  const refreshCart =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/cart",
            {
              cache:
                "no-store",
              credentials: 
                "include",
            }
          );


        if (!response.ok) {
          throw new Error(
            "Unable to fetch cart."
          );
        }


        const data =
          (await response.json()) as WooCart;


        setCart(
          data
        );

      } catch (error) {

        console.error(
          "Refresh cart error:",
          error
        );

      } finally {

        setLoading(
          false
        );
      }
    }, []);


  /* ================================================================
     INITIAL CART LOAD
  ================================================================ */

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);


  /* ================================================================
     ADD ITEM
  ================================================================ */

  async function addItem(
    item: AddCartItemPayload
  ) {
    if (actionLoading) {
      return false;
    }


    setActionLoading(
      true
    );


    try {

      const response =
        await fetch(
          "/api/cart/add",
          {
            method:
              "POST",

             credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                item
              ),

            cache:
              "no-store",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          "Add to cart failed:",
          data
        );

        return false;
      }


      /*
       * WooCommerce returns
       * the complete updated cart.
       */
      setCart(
        data as WooCart
      );


      return true;

    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );


      return false;

    } finally {

      setActionLoading(
        false
      );
    }
  }


  /* ================================================================
     UPDATE ITEM
  ================================================================ */

  async function updateItem(
    key: string,
    quantity: number
  ) {
    if (actionLoading) {
      return false;
    }


    setActionLoading(
      true
    );


    try {

      const response =
        await fetch(
          "/api/cart/update",
          {
            method:
              "POST",
            
            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                key,
                quantity,
              }),

            cache:
              "no-store",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          "Update cart failed:",
          data
        );

        return false;
      }


      setCart(
        data as WooCart
      );


      return true;

    } catch (error) {

      console.error(
        "Update cart error:",
        error
      );


      return false;

    } finally {

      setActionLoading(
        false
      );
    }
  }


  /* ================================================================
     REMOVE ITEM
  ================================================================ */

  async function removeItem(
    key: string
  ) {
    if (actionLoading) {
      return false;
    }


    setActionLoading(
      true
    );


    try {

      const response =
        await fetch(
          "/api/cart/remove",
          {
            method:
              "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                key,
              }),

            cache:
              "no-store",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          "Remove cart item failed:",
          data
        );

        return false;
      }


      setCart(
        data as WooCart
      );


      return true;

    } catch (error) {

      console.error(
        "Remove cart item error:",
        error
      );


      return false;

    } finally {

      setActionLoading(
        false
      );
    }
  }


  /* ================================================================
     APPLY COUPON
  ================================================================ */

  async function applyCoupon(
    code: string
  ): Promise<CouponActionResult> {

    if (actionLoading) {
      return {
        success:
          false,

        message:
          "Please wait...",
      };
    }


    const couponCode =
      code
        .trim()
        .toUpperCase();


    if (!couponCode) {
      return {
        success:
          false,

        message:
          "Please enter a coupon code.",
      };
    }


    setActionLoading(
      true
    );


    try {

      const response =
        await fetch(
          "/api/cart/coupon",
          {
            method:
              "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                code:
                  couponCode,
              }),

            cache:
              "no-store",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          "Apply coupon failed:",
          data
        );


        return {
          success:
            false,

          message:
            data?.message ||
            "Unable to apply coupon.",
        };
      }


      /*
       * WooCommerce should return
       * the updated cart.
       */
      if (data.cart) {

        setCart(
          data.cart as WooCart
        );

      } else {

        /*
         * Fallback in case the API
         * response structure changes.
         */
        await refreshCart();
      }


      return {
        success:
          true,

        message:
          "Coupon applied successfully.",
      };

    } catch (error) {

      console.error(
        "Apply coupon error:",
        error
      );


      return {
        success:
          false,

        message:
          "Unable to apply coupon. Please try again.",
      };

    } finally {

      setActionLoading(
        false
      );
    }
  }


  /* ================================================================
     REMOVE COUPON
  ================================================================ */

  async function removeCoupon(
    code: string
  ): Promise<CouponActionResult> {

    if (actionLoading) {
      return {
        success:
          false,

        message:
          "Please wait...",
      };
    }


    const couponCode =
      code
        .trim()
        .toUpperCase();


    if (!couponCode) {
      return {
        success:
          false,

        message:
          "Coupon code is required.",
      };
    }


    setActionLoading(
      true
    );


    try {

      const response =
        await fetch(
          "/api/cart/coupon",
          {
            method:
              "DELETE",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                code:
                  couponCode,
              }),

            cache:
              "no-store",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          "Remove coupon failed:",
          data
        );


        return {
          success:
            false,

          message:
            data?.message ||
            "Unable to remove coupon.",
        };
      }


      if (data.cart) {

        setCart(
          data.cart as WooCart
        );

      } else {

        await refreshCart();
      }


      return {
        success:
          true,

        message:
          "Coupon removed successfully.",
      };

    } catch (error) {

      console.error(
        "Remove coupon error:",
        error
      );


      return {
        success:
          false,

        message:
          "Unable to remove coupon. Please try again.",
      };

    } finally {

      setActionLoading(
        false
      );
    }
  }


  /* ================================================================
     PROVIDER
  ================================================================ */

  return (
    <CartContext.Provider
      value={{
        cart,

        loading,

        actionLoading,

        refreshCart,

        addItem,

        updateItem,

        removeItem,

        applyCoupon,

        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


/* ================================================================
   CART HOOK
================================================================ */

export function useCart() {
  const context =
    useContext(
      CartContext
    );


  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider."
    );
  }


  return context;
}