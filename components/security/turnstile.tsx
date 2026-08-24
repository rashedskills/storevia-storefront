"use client";

import Script from "next/script";

import {
  useEffect,
  useRef,
} from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (
            token: string
          ) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;

      reset?: (
        widgetId?: string
      ) => void;
    };
  }
}

type TurnstileProps = {
  onVerify: (
    token: string
  ) => void;

  onExpire?: () => void;
};

export function Turnstile({
  onVerify,
  onExpire,
}: TurnstileProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const rendered =
    useRef(false);

  const siteKey =
    process.env
      .NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  function renderWidget() {
    if (
      !siteKey ||
      !containerRef.current ||
      !window.turnstile ||
      rendered.current
    ) {
      return;
    }

    rendered.current =
      true;

    window.turnstile.render(
      containerRef.current,
      {
        sitekey:
          siteKey,

        theme:
          "auto",

        callback(
          token
        ) {
          onVerify(
            token
          );
        },

        "expired-callback"() {
          onVerify("");

          onExpire?.();
        },

        "error-callback"() {
          onVerify("");
        },
      }
    );
  }

  useEffect(() => {
    renderWidget();
  }, [siteKey]);

  if (!siteKey) {
    return null;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={
          renderWidget
        }
      />

      <div ref={containerRef} />
    </>
  );
}