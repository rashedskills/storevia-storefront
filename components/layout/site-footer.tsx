import Image from "next/image";
import Link from "next/link";

import {
  Container,
} from "@/components/layout/container";

import {
  getStoreviaFooter,
} from "@/lib/storevia/footer";

import {
  storefrontUrl,
} from "@/lib/storevia/links";

export async function SiteFooter() {
  const footer =
    await getStoreviaFooter();

  return (
    <footer className="mt-auto border-t border-[var(--store-border)] bg-white">

      {/* MAIN FOOTER */}
      <Container>

        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">

          {/* STORE */}
          <div>

            <Link
              href="/"
              className="inline-flex"
            >
              <Image
                src={
                  footer.footer_logo ||
                  "/logo.png"
                }
                alt="Store logo"
                width={180}
                height={60}
                className="h-auto max-h-[48px] w-auto object-contain"
              />
            </Link>


            {footer.slogan && (
              <p className="mt-4 max-w-[280px] text-sm leading-6 text-neutral-500">
                {footer.slogan}
              </p>
            )}


            {/* SOCIAL */}
            <div className="mt-5 flex items-center gap-2">

              {footer.facebook && (
                <a
                  href={
                    footer.facebook
                  }
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--store-border)] transition hover:border-[var(--store-primary)] hover:bg-[var(--store-soft)] hover:text-[var(--store-primary)]"
                >
                  f
                </a>
              )}


              {footer.instagram && (
                <a
                  href={
                    footer.instagram
                  }
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--store-border)] transition hover:border-[var(--store-primary)] hover:bg-[var(--store-soft)] hover:text-[var(--store-primary)]"
                >
                  ◎
                </a>
              )}


              {footer.youtube && (
  <a
    href={footer.youtube}
    target="_blank"
    rel="noreferrer"
    aria-label="YouTube"
    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--store-border)] text-neutral-600 transition hover:border-[var(--store-primary)] hover:bg-[var(--store-soft)] hover:text-[var(--store-primary)]"
  >
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M21.5 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.5 7.5.5 7.5.5s5.8 0 7.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.5-4.8Z" />

      <path
        d="m10 9 5 3-5 3Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  </a>
)}

            </div>

          </div>


          {/* CONTACT */}
            <div>

            <h3 className="text-base font-bold text-[var(--store-dark)]">
                Contact
            </h3>

            <div className="mt-4 space-y-4 text-sm text-neutral-500">

                {/* PHONE */}
                {footer.phone && (
                <a
                    href={`tel:${footer.phone}`}
                    className="flex items-start gap-3 transition hover:text-[var(--store-primary)]"
                >
                    <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="mt-[2px] shrink-0 text-[var(--store-primary)]"
                    >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                    </svg>

                    <span>
                    {footer.phone}
                    </span>
                </a>
                )}


                {/* EMAIL */}
                {footer.email && (
                <a
                    href={`mailto:${footer.email}`}
                    className="flex items-start gap-3 transition hover:text-[var(--store-primary)]"
                >
                    <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="mt-[2px] shrink-0 text-[var(--store-primary)]"
                    >
                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                    />

                    <path d="m3 7 9 6 9-6" />
                    </svg>

                    <span className="break-all">
                    {footer.email}
                    </span>
                </a>
                )}


                {/* ADDRESS */}
                {footer.address && (
                <div className="flex items-start gap-3">

                    <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="mt-[2px] shrink-0 text-[var(--store-primary)]"
                    >
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />

                    <circle
                        cx="12"
                        cy="10"
                        r="2.5"
                    />
                    </svg>

                    <p className="leading-6">
                    {footer.address}
                    </p>

                </div>
                )}

            </div>

            </div>


          {/* QUICK LINKS */}
          <div>

            <h3 className="text-base font-bold text-[var(--store-dark)]">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-3">

              {footer.quick_links.map(
                (item) => {

                  const href =
                    storefrontUrl(
                      item.url
                    );

                  return (
                    <li
                      key={
                        item.id
                      }
                    >
                      <Link
                        href={href}
                        target={
                          item.target ||
                          undefined
                        }
                        className="text-sm text-neutral-500 transition hover:text-[var(--store-primary)]"
                      >
                        {
                          item.title
                        }
                      </Link>
                    </li>
                  );
                }
              )}

            </ul>

          </div>


          {/* USEFUL */}
          <div>

            <h3 className="text-base font-bold text-[var(--store-dark)]">
              Useful Links
            </h3>

            <ul className="mt-4 space-y-3">

              {footer.useful_links.map(
                (item) => {

                  const href =
                    storefrontUrl(
                      item.url
                    );

                  return (
                    <li
                      key={
                        item.id
                      }
                    >
                      <Link
                        href={href}
                        target={
                          item.target ||
                          undefined
                        }
                        className="text-sm text-neutral-500 transition hover:text-[var(--store-primary)]"
                      >
                        {
                          item.title
                        }
                      </Link>
                    </li>
                  );
                }
              )}

            </ul>

          </div>

        </div>

      </Container>


      {/* COPYRIGHT */}
      <div className="border-t border-[var(--store-border)]">

        <Container>

          <div className="flex flex-col gap-2 py-4 text-center text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">

            <p>
              {footer.copyright}
            </p>

            {footer.powered_by && (
              <p>
                {
                  footer.powered_by
                }
              </p>
            )}

          </div>

        </Container>

      </div>

    </footer>
  );
}