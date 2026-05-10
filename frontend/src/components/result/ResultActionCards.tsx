type ActionCard = {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  primary?: boolean;
};

const actionCards: ActionCard[] = [
  {
    icon: "◆",
    title: "마이페이지에 저장",
    description: "완성한 향을 컬렉션에 모아두고, 언제든 다시 만나보세요.",
    buttonText: "컬렉션으로",
    primary: true,
  },
  {
    icon: "↺",
    title: "다른 캐릭터로 다시 만들기",
    description:
      "같은 기억이라도, 무브·온·알고가 만들면 또 다른 결의 향이 나와요.",
    buttonText: "캐릭터 다시 선택",
  },
  {
    icon: "✦",
    title: "처음부터 다시 시작",
    description: "새로운 기억과 감정으로 또 다른 향을 설계해요.",
    buttonText: "새 향 설계하기",
  },
];

export default function ResultActionCards() {
  return (
    <section className="grid gap-4 px-4 pb-24 pt-10 md:grid-cols-3">
      {actionCards.map((card) => (
        <article
          key={card.title}
          className="group flex min-h-[15.875rem] flex-col rounded-[1.25rem] border border-white/70 bg-white/55 p-7 shadow-[0_8px_24px_rgba(75,63,140,0.08)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/70 hover:shadow-[0_16px_36px_rgba(75,63,140,0.14)]"
        >
          <div className="flex h-[2.875rem] w-[2.875rem] items-center justify-center rounded-[0.875rem] border border-[#4B3F8C]/10 bg-[#D8D2FF]/40 text-[1rem] text-[#1F2430] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D8D2FF]/70 group-hover:text-[#4B3F8C]">
            {card.icon}
          </div>

          <h4 className="mt-5 text-[1rem] font-bold text-[#1F2430]">
            {card.title}
          </h4>

          <p className="mt-3 min-h-[2.5rem] text-[0.8125rem] leading-[1.55] text-[#4B5563]">
            {card.description}
          </p>

          <button
            type="button"
            className={
              card.primary
                ? "mt-auto rounded-full bg-gradient-to-b from-[#B8AEFF] to-[#8B7DEB] px-5 py-3 text-center text-[0.875rem] font-semibold text-white shadow-[0_8px_22px_rgba(139,125,235,0.35),inset_0_1px_0_1px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-[1.04] hover:from-[#A89CFF] hover:to-[#7565E5] hover:shadow-[0_12px_30px_rgba(139,125,235,0.48),inset_0_1px_0_1px_rgba(255,255,255,0.45)] active:scale-[0.98]"
                : "mt-auto rounded-full border border-[#4B3F8C]/15 bg-white/60 px-5 py-3 text-center text-[0.875rem] font-semibold text-[#4B3F8C] transition-all duration-300 hover:scale-[1.04] hover:border-[#4B3F8C]/25 hover:bg-white/90 hover:text-[#352A76] hover:shadow-[0_10px_24px_rgba(75,63,140,0.14)] active:scale-[0.98]"
            }
          >
            {card.buttonText}
          </button>
        </article>
      ))}
    </section>
  );
}
