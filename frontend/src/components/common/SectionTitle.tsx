type SectionTitleProps = {
  label?: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
};

export default function SectionTitle({
  label,
  title,
  desc,
}: SectionTitleProps) {
  return (
    <div className="text-center">
      {label && (
        <p className="mb-6 inline-flex rounded-full border border-white/60 bg-white/30 px-5 py-2 text-[11px] uppercase tracking-[0.14em] text-[#4B3F8C]/70">
          {label}
        </p>
      )}

      <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] md:text-5xl">
        {title}
      </h2>

      {desc && (
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#4B3F8C]/55">
          {desc}
        </p>
      )}
    </div>
  );
}
