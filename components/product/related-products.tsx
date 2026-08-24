import Image from "next/image";
import Link from "next/link";

import type {
  WooProduct,
} from "@/lib/woocommerce/products";

type RelatedProductsProps = {
  products: WooProduct[];
};

function money(
  amount: string,
  minorUnit: number
) {
  return (
    Number(amount) /
    Math.pow(10, minorUnit)
  ).toLocaleString("en-BD");
}

export function RelatedProducts({
  products,
}: RelatedProductsProps) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="mt-7 rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-4 sm:p-5 mb-5">

      <div className="mb-4">

        <h2 className="text-lg font-bold text-[var(--store-dark)]">
          Related Products
        </h2>

        <div className="mt-2 h-[3px] w-20 rounded-full bg-[var(--store-primary)]" />

      </div>


      {/* MOBILE LIST */}
      <div className="divide-y divide-dotted divide-[var(--store-border)] md:hidden">

        {products.map(
          (product) => {

            const image =
              product.images?.[0];

            const minorUnit =
              product.prices.currency_minor_unit ??
              2;

            return (
              <article
                key={product.id}
                className="flex gap-3 py-3 first:pt-0"
              >

                <Link
                  href={`/product/${product.slug}`}
                  className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-[var(--store-radius-md)] bg-[var(--store-soft)]"
                >
                  {image?.src && (
                    <Image
                      src={image.src}
                      alt={
                        image.alt ||
                        product.name
                      }
                      fill
                      sizes="82px"
                      className="object-cover"
                    />
                  )}
                </Link>


                <div className="min-w-0 flex-1">

                  <Link
                    href={`/product/${product.slug}`}
                    className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--store-dark)]"
                  >
                    {product.name}
                  </Link>


                  <div className="mt-1 flex items-center gap-2">

                    <span className="font-bold text-[var(--store-primary)]">
                      {product.prices.currency_symbol}
                      {money(
                        product.prices.price,
                        minorUnit
                      )}
                    </span>


                    {product.on_sale &&
                      product.prices.regular_price !==
                        product.prices.price && (
                        <del className="text-xs text-neutral-400">
                          {product.prices.currency_symbol}
                          {money(
                            product.prices.regular_price,
                            minorUnit
                          )}
                        </del>
                      )}

                  </div>


                  <div className="mt-1 flex items-center gap-1">

                    <span className="text-xs tracking-[1px] text-amber-400">
                      ★★★★★
                    </span>

                    {Number(
                      product.review_count
                    ) > 0 && (
                      <span className="text-xs text-[var(--store-text)]">
                        ({product.review_count})
                      </span>
                    )}

                  </div>

                </div>

              </article>
            );
          }
        )}

      </div>


      {/* DESKTOP GRID */}
      <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-4">

        {products.map(
          (product) => {

            const image =
              product.images?.[0];

            const minorUnit =
              product.prices.currency_minor_unit ??
              2;

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-[var(--store-radius-md)] border border-[var(--store-border)] bg-white"
              >

                <Link
                  href={`/product/${product.slug}`}
                  className="relative block aspect-square bg-[var(--store-soft)]"
                >
                  {image?.src && (
                    <Image
                      src={image.src}
                      alt={
                        image.alt ||
                        product.name
                      }
                      fill
                      sizes="250px"
                      className="object-cover"
                    />
                  )}
                </Link>


                <div className="p-3">

                  <Link
                    href={`/product/${product.slug}`}
                    className="line-clamp-2 text-sm font-semibold text-[var(--store-dark)]"
                  >
                    {product.name}
                  </Link>
<div className="mt-2 flex items-center gap-1.5">

  <div
    className="relative inline-block text-xs leading-none"
    aria-label={`${product.average_rating || 0} out of 5 stars`}
  >

    {/* EMPTY STARS */}
    <span className="tracking-[1px] text-neutral-200">
      ★★★★★
    </span>

    {/* FILLED STARS */}
    <span
      className="absolute left-0 top-0 overflow-hidden whitespace-nowrap tracking-[1px] text-amber-400"
      style={{
        width: `${Math.min(
          100,
          Math.max(
            0,
            (Number(product.average_rating || 0) / 5) * 100
          )
        )}%`,
      }}
    >
      ★★★★★
    </span>

  </div>


  {Number(product.review_count) > 0 && (
    <span className="text-xs text-[var(--store-text)]">
      ({product.review_count})
    </span>
  )}

</div>

                  <p className="mt-2 font-bold text-[var(--store-primary)]">
                    {product.prices.currency_symbol}
                    {money(
                      product.prices.price,
                      minorUnit
                    )}
                  </p>

                  

                </div>

              </article>
            );
          }
        )}

      </div>

    </section>
  );
}