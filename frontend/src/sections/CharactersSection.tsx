import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHARACTERS = [
  {
    name: "호마",
    role: "Warm Curator",
    color: "#7EC8A4",
    colorLight: "rgba(126,200,164,0.15)",
    colorGrad: "linear-gradient(135deg, #a8e6c8, #7EC8A4, #5bb88a)",
    desc: "따뜻하고 감성적인 대화로 당신의 기억을 따라가요.",
    quote: "\"기억은 향이 되고, 향은 기억이 돼요.\"",
  },
  {
    name: "무브",
    role: "Flow Artist",
    color: "#9B89D4",
    colorLight: "rgba(155,137,212,0.15)",
    colorGrad: "linear-gradient(135deg, #c4b5f0, #9B89D4, #7a6bc0)",
    desc: "자유롭게 흐르는 대화 속에서 향의 흐름을 찾아요.",
    quote: "\"향은 흐름이에요. 멈추지 말고 이야기해요.\"",
  },
  {
    name: "오리온",
    role: "Star Navigator",
    color: "#F0A0A0",
    colorLight: "rgba(240,160,160,0.15)",
    colorGrad: "linear-gradient(135deg, #f8c8c8, #F0A0A0, #e07070)",
    desc: "별처럼 빛나는 감각으로 당신의 향을 길들여요.",
    quote: "\"모든 감각은 별처럼 연결되어 있어요.\"",
  },
  {
    name: "알고",
    role: "Data Poet",
    color: "#F5C842",
    colorLight: "rgba(245,200,66,0.15)",
    colorGrad: "linear-gradient(135deg, #fae090, #F5C842, #e0a800)",
    desc: "데이터 속에서 시를 발견하고 향을 수식화해요.",
    quote: "\"숫자 너머에 당신의 향이 있어요.\"",
  },
];

export default function CharactersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 px-8"
      style={{
        background: "linear-gradient(180deg, #E8E6FA 0%, #DDE0F5 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-widest mb-4 text-text-gray"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.12em" }}
          >
            CHARACTERS
          </p>
          <h2
            className="font-bold text-text-dark"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            어떤 방식으로 향을 설계할까요?
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CHARACTERS.map((char, i) => (
            <div
              key={char.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group relative rounded-3xl bg-white p-6 flex flex-col items-center text-center overflow-hidden cursor-pointer transition-all duration-300"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = char.colorLight;
                el.style.boxShadow = `0 20px 48px ${char.color}33`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = "white";
                el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
              }}
            >
              {/* Blob avatar */}
              <div
                className="relative mb-5"
                style={{ width: 100, height: 100 }}
              >
                <div
                  className="w-full h-full group-hover:[animation-play-state:running]"
                  style={{
                    background: char.colorGrad,
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    animation: "blob-wobble 3s ease-in-out infinite paused",
                    boxShadow: `0 8px 24px ${char.color}40`,
                  }}
                />
              </div>

              {/* Name */}
              <h3
                className="font-bold text-text-dark mb-1"
                style={{ fontSize: "1.1rem" }}
              >
                {char.name}
              </h3>

              {/* Role */}
              <p
                className="text-xs font-semibold tracking-widest mb-3"
                style={{
                  color: char.color,
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                {char.role}
              </p>

              {/* Desc */}
              <p className="text-text-gray text-sm leading-relaxed mb-4">
                {char.desc}
              </p>

              {/* Quote */}
              <p
                className="text-xs italic leading-relaxed"
                style={{ color: char.color }}
              >
                {char.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
