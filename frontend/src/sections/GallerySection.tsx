import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_CARDS = [
  {
    bg: "linear-gradient(135deg, #C5C4F5, #6B6ADE)",
    label: "Rose & Amber",
    sub: "따뜻한 저녁의 기억",
  },
  {
    bg: "linear-gradient(135deg, #A8E6C8, #7EC8A4)",
    label: "Cedarwood & Moss",
    sub: "숲 속 산책의 향기",
  },
  {
    bg: "linear-gradient(135deg, #F8C8C8, #F0A0A0)",
    label: "Peony & Musk",
    sub: "봄날의 설렘",
  },
  {
    bg: "linear-gradient(135deg, #FAE090, #F5C842)",
    label: "Vanilla & Sandalwood",
    sub: "편안한 오후의 포근함",
  },
  {
    bg: "linear-gradient(135deg, #C4B5F0, #9B89D4)",
    label: "Iris & Vetiver",
    sub: "도시의 밤 산책",
  },
  {
    bg: "linear-gradient(135deg, #DDE0F5, #A8A7F0)",
    label: "Bergamot & Tea",
    sub: "조용한 아침의 시작",
  },
];

const MARQUEE_TEXT = "당신의 기억에 작은 반짝임을  ✦  Your Scent Story  ✦  기억에 향을 더하다  ✦  ";

export default function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 48,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: (i % 3) * 0.1,
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });
    }, sectionRef);

    // Parallax on mouse move
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const depth = ((i % 3) - 1) * 0.4;
        card.style.transform = `translate(${dx * depth * 12}px, ${dy * depth * 8}px)`;
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #EEF0F8 0%, #DDE0F5 100%)",
      }}
    >
      {/* Marquee */}
      <div className="overflow-hidden mb-16 select-none">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 18s linear infinite" }}
        >
          {/* Duplicate text to create seamless loop */}
          {[0, 1].map((k) => (
            <span
              key={k}
              className="inline-block pr-8"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "transparent",
                WebkitTextStroke: "1.5px #C5C4F5",
              }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {GALLERY_CARDS.map((card, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-transform duration-500"
              style={{
                aspectRatio: i % 3 === 1 ? "3/4" : "4/3",
                background: card.bg,
                willChange: "transform",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 24px 48px rgba(107,106,222,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(26,26,46,0.3)" }}
              />

              {/* Label */}
              <div
                className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                style={{
                  background: "linear-gradient(to top, rgba(26,26,46,0.7), transparent)",
                }}
              >
                <p
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {card.label}
                </p>
                <p className="text-white/70 text-xs mt-0.5">{card.sub}</p>
              </div>

              {/* Sparkle */}
              <div
                className="absolute top-4 right-4 text-white/60 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
              >
                ✦
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
