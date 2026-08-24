import type {
  StoreviaSettings,
} from "@/lib/storevia/settings";

type TrustIcon =
  | "check"
  | "support"
  | "delivery"
  | "secure";

function FeatureIcon({
  icon,
}: {
  icon: TrustIcon;
}) {
  if (icon === "support") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 13a8 8 0 0 1 16 0" />
        <path d="M4 13v4a2 2 0 0 0 2 2h2v-6H4Z" />
        <path d="M20 13v4a2 2 0 0 1-2 2h-2v-6h4Z" />
      </svg>
    );
  }

  if (icon === "delivery") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="m13 2-7 11h6l-1 9 7-12h-6Z" />
      </svg>
    );
  }

  if (icon === "secure") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 12 4 4 8-9" />
    </svg>
  );
}

export function TrustFeatures({
  settings,
}: {
  settings: StoreviaSettings;
}) {
  if (
    !Boolean(
      settings.trust_features_enabled
    )
  ) {
    return null;
  }

  const items = [
    {
      icon:
        settings.trust_1_icon as TrustIcon,

      title:
        settings.trust_1_title,

      description:
        settings.trust_1_description,
    },
    {
      icon:
        settings.trust_2_icon as TrustIcon,

      title:
        settings.trust_2_title,

      description:
        settings.trust_2_description,
    },
    {
      icon:
        settings.trust_3_icon as TrustIcon,

      title:
        settings.trust_3_title,

      description:
        settings.trust_3_description,
    },
    {
      icon:
        settings.trust_4_icon as TrustIcon,

      title:
        settings.trust_4_title,

      description:
        settings.trust_4_description,
    },
  ];

  return (
    <section className="mt-10 mb-8 sm:mt-5 sm:mb-0">

      <div className="mx-auto w-full max-w-[var(--store-max-width)] px-4 sm:px-5 lg:px-6">

        <div className="grid overflow-hidden rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white sm:grid-cols-2 lg:grid-cols-4">

          {items.map(
            (item, index) => (
              <div
                key={index}
                className="flex min-h-[78px] items-center gap-3 border-b border-[var(--store-border)] px-4 py-3.5 sm:min-h-[88px] sm:px-5 sm:py-4 sm:border-r lg:border-b-0 last:border-b-0 lg:last:border-r-0"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--store-radius-md)] bg-[var(--store-soft)] text-[var(--store-primary)]">
                  <FeatureIcon
                    icon={
                      item.icon
                    }
                  />
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-bold text-[var(--store-dark)]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--store-text)]">
                    {item.description}
                  </p>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </section>
  );
}