import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    title: "캐릭터 선택",
    desc: "나의 대화 스타일과 감성에 맞는 AI 캐릭터를 선택해요.",
    icon: "🎭",
  },
  {
    num: "02",
    title: "기억과 감정을 이야기해요",
    desc: "AI와의 자연스러운 대화 속에서 기억과 감정을 나눠요.",
    icon: "💭",
  },
  {
    num: "03",
    title: "향 레시피 완성",
    desc: "Top·Mid·Base 노트로 구성된 나만의 향 레시피가 완성돼요.",
    icon: "🌸",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      });

      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        gsap.from(step, {
          y: 48,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: i * 0.15,
          scrollTrigger: { trigger: step, start: "top 88%" },
        });
      });

      // SVG dash animation
      if (lineRef.current) {
        const totalLength = 800;
        gsap.set(lineRef.current, {
          strokeDasharray: totalLength,
          strokeDashoffset: totalLength,
        });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-8 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-20">
          <p
            className="text-xs font-semibold tracking-widest mb-4 text-text-gray"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.12em" }}
          >
            PROCESS
          </p>
          <h2
            className="font-bold text-text-dark"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            3단계로 나만의 향을 설계해요
          </h2>
        </div>

        {/* Steps with connecting SVG line */}
        <div className="relative">
          {/* SVG connector (desktop only) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none" style={{ top: 40 }}>
            <svg
              className="w-full"
              height="4"
              viewBox="0 0 800 4"
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              <line
                ref={lineRef}
                x1="0"
                y1="2"
                x2="800"
                y2="2"
                stroke="#C5C4F5"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => { stepsRef.current[i] = el; }}
                className="flex flex-col items-center text-center"
              >
                {/* Step number bubble */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
                  style={{
                    background: "linear-gradient(135deg, #C5C4F5, #6B6ADE)",
                    boxShadow: "0 8px 24px rgba(107,106,222,0.3)",
                  }}
                >
                  <span
                    className="text-2xl"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                  >
                    {step.icon}
                  </span>
                  <span
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "#1A1A2E",
                      color: "white",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                <h3
                  className="font-bold text-text-dark mb-3"
                  style={{ fontSize: "1.1rem", letterSpacing: "-0.01em" }}
                >
                  {step.title}
                </h3>
                <p className="text-text-gray text-sm leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
