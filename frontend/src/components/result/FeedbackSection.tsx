const reactions = ["💜", "😌", "🤔", "↻"];

export default function FeedbackSection() {
  return (
    <section className="px-4 pt-20 text-center">
      <h3 className="text-[2rem] font-bold text-[#1F2430]">
        이 향, 마음에 드셨나요?
      </h3>
      <p className="mt-3 text-[1rem] leading-[1.6] text-[#4B5563]">
        호마가 다음 대화를 더 정확하게 설계할 수 있도록 알려주세요
      </p>

      <div className="mt-5 flex justify-center gap-3.5">
        {reactions.map((reaction) => (
          <button
            key={reaction}
            type="button"
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[#4B3F8C]/10 bg-white/60 text-[1.5rem] transition hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_10px_24px_rgba(75,63,140,0.12)]"
          >
            {reaction}
          </button>
        ))}
      </div>
    </section>
  );
}
