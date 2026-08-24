type FacebookEventData =
  Record<
    string,
    unknown
  >;


function canTrack() {
  return (
    typeof window !==
      "undefined" &&
    typeof window.fbq ===
      "function"
  );
}


/* ================================================================
   VIEW CONTENT
================================================================ */

export function trackViewContent(
  data: FacebookEventData
) {
  if (!canTrack()) {
    return;
  }

  window.fbq?.(
    "track",
    "ViewContent",
    data
  );
}


/* ================================================================
   ADD TO CART
================================================================ */

export function trackAddToCart(
  data: FacebookEventData
) {
  if (!canTrack()) {
    return;
  }

  window.fbq?.(
    "track",
    "AddToCart",
    data
  );
}


/* ================================================================
   INITIATE CHECKOUT
================================================================ */

export function trackInitiateCheckout(
  data: FacebookEventData
) {
  if (!canTrack()) {
    return;
  }

  window.fbq?.(
    "track",
    "InitiateCheckout",
    data
  );
}


/* ================================================================
   PURCHASE
================================================================ */

export function trackPurchase(
  data: FacebookEventData
) {
  if (!canTrack()) {
    return;
  }

  window.fbq?.(
    "track",
    "Purchase",
    data
  );
}


/* ================================================================
   SEARCH
================================================================ */

export function trackSearch(
  data: FacebookEventData
) {
  if (!canTrack()) {
    return;
  }

  window.fbq?.(
    "track",
    "Search",
    data
  );
}