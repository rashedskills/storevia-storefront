type Props = {
  description?: string;
};

export function ProductDescription({
  description,
}: Props) {
  if (!description) return null;

  return (
    <section className="rounded-[var(--store-radius-lg)] border border-[var(--store-border)] bg-white p-5 sm:p-7">

      <h2 className="text-xl font-bold text-[var(--store-dark)] sm:text-2xl">
        Description
      </h2>

      <div
        className="prose prose-neutral mt-5 max-w-none text-sm leading-7 text-[var(--store-text)]"
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />

    </section>
  );
}