"use client";

import Script from "next/script";

import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import {
  useEffect,
} from "react";


declare global {
  interface Window {
    fbq?: (
      command: string,
      event: string,
      params?: Record<
        string,
        unknown
      >
    ) => void;

    _fbq?: unknown;
  }
}


type FacebookPixelProps = {
  pixelId: string;
};


export function FacebookPixel({
  pixelId,
}: FacebookPixelProps) {
  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();


  /*
   * Next.js client-side route changes
   * do not reload the full document,
   * so send PageView manually.
   */
  useEffect(() => {
    if (!window.fbq) {
      return;
    }

    window.fbq(
      "track",
      "PageView"
    );

  }, [
    pathname,
    searchParams,
  ]);


  if (!pixelId) {
    return null;
  }


  return (
    <>
      <Script
        id="storevia-facebook-pixel"
        strategy="afterInteractive"
      >
        {`
          !function(f,b,e,v,n,t,s)
          {
            if(f.fbq)return;
            n=f.fbq=function(){
              n.callMethod
                ? n.callMethod.apply(n,arguments)
                : n.queue.push(arguments)
            };

            if(!f._fbq)f._fbq=n;

            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];

            t=b.createElement(e);
            t.async=!0;
            t.src=v;

            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
          }(
            window,
            document,
            'script',
            'https://connect.facebook.net/en_US/fbevents.js'
          );

          fbq(
            'init',
            '${pixelId}'
          );
        `}
      </Script>
    </>
  );
}