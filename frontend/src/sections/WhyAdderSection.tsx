import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    icon: "🧠",
    iconBg: "linear-gradient(135deg, #EEF0F8, #C5C4F5)",
    title: "기억",
    desc: "당신의 소중한 기억과 감정을 이야기해요. AI가 그 속에서 향의 실마리를 찾아냅니다.",
    from: "left",
  },
  {
    icon: "💬",
    iconBg: "linear-gradient(135deg, #DDE0F5, #A8A7F0)",
    title: "대화",
    desc: "자연스러운 대화를 통해 당신의 취향을 파악해요. 질문에 답하다 보면 향이 완성됩니다.",
    from: "bottom",
  },
  {
    icon: "✨",
    iconBg: "linear-gradient(135deg, #E8E6FA, #6B6ADE)",
    title: "Glow",
    desc: "완성된 나만의 향 레시피. Top·Mid·Base 노트로 구성된 특별한 향수를 선물받아요.",
    from: "right",
  },
];

export default function WhyAdderSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.from(titleRef.current, {
        y: 48,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
        },
      });

      // Cards from different directions
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const fromMap = { left: { x: -80, y: 0 }, bottom: { x: 0, y: 60 }, right: { x: 80, y: 0 } };
        const from = fromMap[CARDS[i].from as keyof typeof fromMap];
        gsap.from(card, {
          ...from,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
          },
          delay: i * 0.1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-widest mb-4 text-text-gray"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.12em" }}
          >
            WHY ADDER?
          </p>
          <h2
            className="font-bold text-text-dark"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            향을 고르는 것이 아닌,
            <br />
            향을 만들어가는 경험
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group relative rounded-2xl bg-white p-8 overflow-hidden transition-all duration-300"
              style={{
                boxShadow: "0 4px 24px rgba(107,106,222,0.08)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-8px)";
                el.style.boxShadow = "0 20px 48px rgba(107,106,222,0.18)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 24px rgba(107,106,222,0.08)";
              }}
            >
              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.2s ease-in-out",
                }}
              />

              {/* Icon area */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl"
                style={{ background: card.iconBg }}
              >
                {card.icon}
              </div>

              <h3
                className="font-bold text-text-dark mb-3"
                style={{ fontSize: "1.2rem", letterSpacing: "-0.01em" }}
              >
                {card.title}
              </h3>
              <p className="text-text-gray text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
