import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ── Particle system ──────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  color: string;
}

const COLORS = [
  "rgba(107, 106, 222,",
  "rgba(168, 167, 240,",
  "rgba(197, 196, 245,",
  "rgba(155, 137, 212,",
];

function createParticles(w: number, h: number): Particle[] {
  return Array.from({ length: 65 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -Math.random() * 0.5 - 0.1,
    r: Math.random() * 3 + 1,
    alpha: Math.random() * 0.4 + 0.2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

function initCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  let w = (canvas.width = canvas.offsetWidth);
  let h = (canvas.height = canvas.offsetHeight);
  let particles = createParticles(w, h);
  let mouse = { x: -999, y: -999 };
  let raf = 0;

  const onResize = () => {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    particles = createParticles(w, h);
  };

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      // Repel from mouse
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const force = (80 - dist) / 80;
        p.vx += (dx / dist) * force * 0.5;
        p.vy += (dy / dist) * force * 0.5;
      }

      // Dampen velocity
      p.vx *= 0.98;
      p.vy = p.vy * 0.98 - 0.05;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  };

  window.addEventListener("resize", onResize);
  canvas.addEventListener("mousemove", onMouseMove);
  draw();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    canvas.removeEventListener("mousemove", onMouseMove);
  };
}

// ── Split text helper ────────────────────────────────────
function SplitChars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="hero-char inline-block"
          style={{ display: ch === " " ? "inline" : "inline-block" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

// ── Component ────────────────────────────────────────────
export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    if (canvasRef.current) cleanup = initCanvas(canvasRef.current);
    return cleanup;
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const chars = headlineRef.current?.querySelectorAll(".hero-char");
    if (chars) {
      tl.from(chars, { y: 60, opacity: 0, stagger: 0.025, duration: 0.7 });
    }
    tl.from(subRef.current, { y: 24, opacity: 0, duration: 0.6 }, "-=0.3");
    tl.from(ctaRef.current, { y: 16, opacity: 0, duration: 0.5 }, "-=0.3");
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #EEF0F8 0%, #DDE0F5 50%, #E8E6FA 100%)",
      }}
    >
      {/* Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full flex items-center justify-between gap-12 pt-24">
        {/* Left */}
        <div className="flex-1 max-w-xl">
          <div ref={headlineRef} className="overflow-hidden">
            <h1
              className="font-bold leading-tight mb-6"
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
                letterSpacing: "-0.02em",
                color: "#1A1A2E",
              }}
            >
              <span className="block">
                <SplitChars text="기억에 작은" />
              </span>
              <span className="block">
                <SplitChars text="반짝임을" />
              </span>
              <span className="block" style={{ color: "#6B6ADE" }}>
                <SplitChars text="더해드릴게요" />
              </span>
            </h1>
          </div>

          <p
            ref={subRef}
            className="mb-10 text-text-gray"
            style={{ fontSize: "1.125rem", lineHeight: 1.7 }}
          >
            AI 캐릭터와 대화하며 나만의 향을 설계하세요
          </p>

          <button
            ref={ctaRef}
            className="px-8 py-4 text-white rounded-full font-medium text-base transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #6B6ADE, #9B89D4)",
              boxShadow: "0 8px 32px rgba(107,106,222,0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 16px 48px rgba(107,106,222,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 8px 32px rgba(107,106,222,0.35)";
            }}
          >
            향 설계 시작하기
          </button>
        </div>

        {/* Right – Blob */}
        <div
          className="hidden lg:flex flex-1 items-center justify-center relative"
          style={{ minHeight: 480 }}
        >
          {/* Outer glow */}
          <div
            className="absolute"
            style={{
              width: 440,
              height: 440,
              background:
                "radial-gradient(circle, rgba(197,196,245,0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
              animation: "blob-morph 10s ease-in-out infinite",
            }}
          />
          {/* Main blob */}
          <div
            style={{
              width: 380,
              height: 380,
              background:
                "linear-gradient(135deg, #C5C4F5 0%, #9B89D4 40%, #6B6ADE 100%)",
              animation: "blob-morph 7s ease-in-out infinite",
              filter: "blur(1px)",
              opacity: 0.85,
            }}
          />
          {/* Inner blob */}
          <div
            className="absolute"
            style={{
              width: 240,
              height: 240,
              background:
                "linear-gradient(135deg, #A8A7F0 0%, #6B6ADE 60%, #5554C4 100%)",
              animation: "blob-morph 5s ease-in-out infinite reverse",
              opacity: 0.7,
            }}
          />
          {/* Floating label */}
          <div
            className="absolute bottom-8 right-8 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              color: "#6B6ADE",
              fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: "0 4px 16px rgba(107,106,222,0.2)",
              animation: "float-slow 4s ease-in-out infinite",
            }}
          >
            ✦ Your Scent
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "#8B8BA7" }}
      >
        <span className="text-xs tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          SCROLL
        </span>
        <div
          className="w-px h-12"
          style={{
            background: "linear-gradient(to bottom, #8B8BA7, transparent)",
          }}
        />
      </div>
    </section>
  );
}
