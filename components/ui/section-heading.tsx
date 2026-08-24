import Link from "next/link";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllText?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllText = "View All",
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--store-primary)] sm:text-xs">
            {eyebrow}
          </p>
        )}

        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[var(--store-dark)] sm:text-2xl lg:text-[28px]">
          {title}
        </h2>

        {description && (
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[var(--store-text)] sm:text-sm">
            {description}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="shrink-0 text-xs font-bold text-[var(--store-primary)] hover:underline sm:text-sm"
        >
          {viewAllText} →
        </Link>
      )}
    </div>
  );
}