import WhyAdderSection from "../sections/WhyAdderSection";
import Navbar from "../components/Navbar";
import CharactersSection from "../sections/CharactersSection";
import Footer from "../components/Footer";

const PROCESS = [
  {
    step: "01",
    title: "캐릭터 선택",
    desc: "대화 스타일이 맞는 조향사를 선택하세요",
  },
  {
    step: "02",
    title: "기억과 감정을 이야기해요",
    desc: "캐릭터와 대화하며 감정, 기억, 분위기를 공유해요",
  },
  {
    step: "03",
    title: "향 레시피 완성",
    desc: "대화로 모인 단서를 바탕으로 향료와 비율을 제안해요",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-[#F8FAFF] via-[#DCE9FF] to-[#E9E3FF] text-[#4B3F8C]">
      <Navbar />

      {/* Hero */}
      <section className="relative mx-auto flex min-h-[760px] max-w-6xl flex-col justify-center px-6 pt-20">
        <div className="absolute left-[-120px] top-24 h-[420px] w-[420px] rounded-full bg-[#DFF6F0]/60 blur-3xl" />
        <div className="absolute right-[-80px] bottom-20 h-[520px] w-[520px] rounded-full bg-[#D8D2FF]/60 blur-3xl" />

        <div className="relative max-w-xl">
          <p className="mb-6 inline-flex rounded-full border border-[#C4B5FD]/40 bg-white/30 px-4 py-1 text-[10px] uppercase tracking-[0.16em] text-[#4B3F8C]/50">
            Adera Planet Project
          </p>

          <h1 className="text-[42px] font-bold leading-[1.25] tracking-[-0.04em] md:text-[58px]">
            기억에 작은 반짝임을
            <br />
            더해드릴게요
          </h1>

          <p className="mt-5 text-sm leading-7 text-[#4B3F8C]/45">
            AI 캐릭터와 대화하며 나만의 향을 설계하세요.
          </p>

          <button className="mt-10 rounded-full bg-[#4B3F8C] px-7 py-3 text-sm font-medium text-white shadow-xl shadow-[#4B3F8C]/20 transition hover:-translate-y-0.5">
            향 설계 시작하기
          </button>
        </div>
      </section>

      <WhyAdderSection />
      <CharactersSection />

      {/* Process */}
      <section className="relative mx-auto max-w-6xl px-6 py-28">
        <SectionTitle label="PROCESS" title="3단계로 나만의 향을 설계해요" />

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-12 hidden border-t border-dashed border-[#4B3F8C]/20 md:block" />

          {PROCESS.map((item) => (
            <div key={item.step} className="relative text-center">
              <div className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/60 bg-white/40 text-lg font-semibold shadow-xl shadow-[#4B3F8C]/10 backdrop-blur-xl">
                {item.step}
              </div>

              <GlassCard className="mt-8 px-6 py-7">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4B3F8C]/60">
                  {item.desc}
                </p>
              </GlassCard>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="mypage" className="relative px-6 py-28">
        <SectionTitle title="당신의 기억에 작은 반짝임을" />

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded-3xl border border-white/60 bg-white/25 p-4 shadow-xl shadow-[#4B3F8C]/10 backdrop-blur-xl"
            >
              <div className="h-full rounded-2xl border border-white/50 bg-[#F5FBFF]/60" />
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function SectionTitle({
  label,
  title,
  desc,
}: {
  label?: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
}) {
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

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/50 bg-white/25 shadow-2xl shadow-[#4B3F8C]/10 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
