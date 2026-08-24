import Link from "next/link";

import type {
  StoreviaSettings,
} from "@/lib/storevia/settings";

export function PromoBanner({
  settings,
}: {
  settings: StoreviaSettings;
}) {
  if (
    !Boolean(
      settings.promo_banner_enabled
    )
  ) {
    return null;
  }

  return (
    <section className="py-8">

      <div className="mx-auto w-full max-w-[var(--store-max-width)] px-4 sm:px-5 lg:px-6">

        <div className="relative overflow-hidden rounded-[var(--store-radius-lg)] bg-[var(--store-primary)] px-6 py-8 text-white sm:px-9 sm:py-10">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-10 -top-20 h-[230px] w-[230px] rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="max-w-[680px]">

              {settings.promo_banner_eyebrow && (
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  {settings.promo_banner_eyebrow}
                </p>
              )}

              {settings.promo_banner_title && (
                <h2 className="mt-3 text-2xl font-bold leading-tight !text-white sm:text-3xl lg:text-4xl">
                  {settings.promo_banner_title}
                </h2>
              )}

              {settings.promo_banner_description && (
                <p className="mt-3 max-w-[620px] text-sm leading-6 text-white/90">
                  {settings.promo_banner_description}
                </p>
              )}

            </div>


            {settings.promo_banner_button_text && (
              <Link
                href={
                  settings.promo_banner_button_link ||
                  "/shop"
                }
                className="inline-flex min-h-[46px] shrink-0 items-center justify-center rounded-[var(--store-radius-md)] bg-white px-6 text-sm font-bold !text-[var(--store-dark)] transition hover:opacity-90"
              >
                {settings.promo_banner_button_text}
              </Link>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}