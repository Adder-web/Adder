const WHY_CARDS = [
  {
    title: "기억",
    desc: "기억 속 장면을 이야기 해요",
    gradient: "from-card-blue-start via-card-blue-mid to-card-blue-end",
  },
  {
    title: "대화",
    desc: "AI 캐릭터와 대화를 통해 향을 설계해요",
    gradient: "from-card-purple-start via-card-purple-mid to-card-purple-end",
  },
  {
    title: "Glow",
    desc: "향이 기억을 반짝이게 만들어요",
    gradient: "from-card-mint-start via-card-mint-mid to-card-mint-end",
  },
];

type WhyCardProps = {
  title: string;
  desc: string;
  gradient: string;
};

export default function WhyAdderSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 md:py-28">
      <div className="text-center">
        <p className="mb-6 inline-flex rounded-full border border-white/60 bg-white/30 px-5 py-2 text-label uppercase text-primary/70">
          WHY ADDER?
        </p>

        <h2 className="text-title-lg text-primary-dark md:text-title-xl">
          향을 고르는 것이 아닌,
          <br />
          향을 만들어가는 경험
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-body-sm text-primary/60 sm:text-body-md">
          Adder는 완성된 향을 추천하지 않습니다.
          <br />
          당신의 기억과 감정을 이야기하면, 조향사 캐릭터가 함께 향을 설계합니다.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {WHY_CARDS.map((card) => (
          <WhyCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}

function WhyCard({ title, desc, gradient }: WhyCardProps) {
  return (
    <article
      className={`group relative h-56 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${gradient} p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08),0_20px_50px_rgba(75,63,140,0.10)] transition-all duration-300 hover:-translate-y-1`}
    >
      {/* 오른쪽 위 반원 */}
      <div className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-white/25" />

      {/* 빛 스윕 */}
      <div className="absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100" />

      {/* 아이콘 박스 */}
      <div className="relative z-10 h-14 w-14 rounded-2xl bg-white/60 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1" />

      {/* 텍스트 */}
      <div className="absolute bottom-7 left-8 z-10">
        <h3 className="text-title-md text-primary-dark">{title}</h3>
        <p className="mt-3 text-body-sm text-primary/70">{desc}</p>
      </div>
    </article>
  );
}
