import type { ScentResultData } from "../../data/scentResultData";

type ResultHeroProps = {
  result: ScentResultData;
};

export default function ResultHero({ result }: ResultHeroProps) {
  return (
    <section className="relative grid min-h-[43.875rem] grid-cols-1 items-start gap-12 px-4 pb-16 pt-14 sm:px-8 lg:grid-cols-[1fr_34rem] lg:px-12 lg:pt-16">
      {" "}
      <div className="relative z-10 pt-4 lg:pt-10">
        <p className="text-[0.6875rem] font-bold tracking-[0.34em] text-[#4B3F8C]">
          SCENT RESULT · {result.date}
        </p>

        <h1 className="mt-3 font-serif text-[3.9rem] font-medium leading-[0.98] text-[#4B3F8C] sm:text-[5.25rem]">
          {result.englishName}
        </h1>

        <h2 className="mt-2 text-[2.25rem] font-bold leading-tight text-[#1F2430] sm:text-[3rem]">
          {result.koreanName}
        </h2>

        <p className="mt-5 max-w-[26.25rem] whitespace-pre-line text-[0.9375rem] leading-[1.6] text-[#4B5563]">
          {result.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {result.moods.map((mood) => (
            <span
              key={mood}
              className="rounded-full border border-[#4B3F8C]/10 bg-[#D8D2FF]/45 px-3 py-1.5 text-[0.75rem] font-medium tracking-[0.02em] text-[#4B3F8C]"
            >
              {mood}
            </span>
          ))}
        </div>

        <div className="relative mt-4 inline-flex items-center gap-3 rounded-[1.125rem] border border-[#4B3F8C]/10 bg-white/60 py-3 pl-[4.5rem] pr-4">
          <div className="absolute left-3 top-1/2 flex h-[3.625rem] w-[3.625rem] -translate-y-1/2 items-center justify-center rounded-2xl bg-[#B5EBDC]/60 text-[1.5rem] shadow-inner">
            🫧
          </div>

          <div>
            <p className="text-[0.875rem] font-bold text-[#1F2430]">
              {result.perfumer.name}
            </p>
            <p className="mt-0.5 text-[0.75rem] font-bold tracking-[0.04em] text-[#4B3F8C]">
              {result.perfumer.role}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            type="button"
            className="rounded-full bg-gradient-to-b from-[#B8AEFF] to-[#8B7DEB] px-6 py-3.5 text-[0.875rem] font-semibold text-white shadow-[0_8px_22px_rgba(139,125,235,0.35),inset_0_1px_0_1px_rgba(255,255,255,0.4)]"
          >
            향 저장하기 ↓
          </button>

          <button
            type="button"
            className="rounded-full border border-[#4B3F8C]/15 bg-white/60 px-6 py-3.5 text-[0.875rem] font-semibold text-[#4B3F8C]"
          >
            공유하기
          </button>
        </div>
      </div>
      <div className="relative z-10 mx-auto mt-2 h-[24rem] w-full max-w-[34rem] overflow-hidden rounded-[1.75rem] border border-white/80 bg-gradient-to-br from-white/80 via-[#EEF4FF]/70 to-[#DFF6F0]/50 shadow-[0_18px_48px_rgba(75,63,140,0.14)] backdrop-blur-xl lg:mt-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(216,210,255,0.7),transparent_46%),radial-gradient(circle_at_70%_70%,rgba(181,235,220,0.55),transparent_48%)]" />
      </div>
      <div className="pointer-events-none absolute left-0 top-[22rem] hidden h-[20rem] w-[42rem] opacity-80 lg:block">
        {Array.from({ length: 28 }).map((_, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
            style={{
              width: `${3 + (index % 5)}px`,
              height: `${3 + (index % 5)}px`,
              left: `${(index * 47) % 620}px`,
              top: `${(index * 83) % 300}px`,
              opacity: 0.45 + (index % 4) * 0.12,
            }}
          />
        ))}
      </div>
    </section>
  );
}
