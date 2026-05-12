import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import homaImg from "../assets/character/Homa.png";
import moveImg from "../assets/character/Move.png";
import orionImg from "../assets/character/Orion.png";
import algoImg from "../assets/character/Algo.png";

type Tab = "brand" | "team";

const PRETENDARD =
  "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif";

const HERO_GRADIENT =
  "radial-gradient(circle at 35% 30%, #ffffff 0%, #ede8ff 45%, #d4c5f9 80%, #c0aef5 100%)";

const CHARACTERS = [
  {
    id: "homa",
    name: "호마",
    role: "Curiosity Perfumer",
    description: "호기심 많은 탐험가형 조향사. 예상 밖의 향 조합을 즐겨요.",
    tags: ["호기심", "실험", "탐험"],
    img: homaImg,
    cardBg: "linear-gradient(145deg, #f0fdf8, #e8f5ff)",
    tagBg: "#B5EBDC",
    tagColor: "#2D7A5A",
  },
  {
    id: "move",
    name: "무브",
    role: "Vibe Perfumer",
    description: "감각적인 분위기를 읽는 조향사. 느낌 가는 대로 연대해요.",
    tags: ["감각", "직관", "분위기"],
    img: moveImg,
    cardBg: "linear-gradient(145deg, #f5f3ff, #eef0ff)",
    tagBg: "#D8D2FF",
    tagColor: "#5B4BA0",
  },
  {
    id: "orion",
    name: "온",
    role: "Balance Perfumer",
    description: "차분하게 감정 밸런스를 유지하는 균형 조향사.",
    tags: ["균형", "고요", "안정"],
    img: orionImg,
    cardBg: "linear-gradient(145deg, #fff5f5, #ffeef8)",
    tagBg: "#FFD8D8",
    tagColor: "#A04040",
  },
  {
    id: "algo",
    name: "알고",
    role: "Algorithm Perfumer",
    description: "향을 구조적으로 분석하는 조향사. 단계별로 설계해요.",
    tags: ["분석", "구조", "단계"],
    img: algoImg,
    cardBg: "linear-gradient(145deg, #fffbeb, #fff7e6)",
    tagBg: "#FFF3B5",
    tagColor: "#8A6A00",
  },
];

const TEAM = [
  {
    name: "양윤영",
    role: "AI · PROMPT",
    description:
      "AI 조향사의 말투와 대화 흐름을 설계합니다. 캐릭터에 영혼을 불어넣어요.",
    tags: ["LLM", "Prompt", "Persona"],
    orbColor: HERO_GRADIENT,
  },
  {
    name: "심채민",
    role: "AI · PROMPT",
    description:
      "AI 조향사의 말투와 대화 흐름을 설계합니다. 캐릭터에 영혼을 불어넣어요.",
    tags: ["LLM", "Prompt", "Persona"],
    orbColor:
      "radial-gradient(circle at 35% 30%, #e0faf2 0%, #9de8c8 50%, #6dc89e 100%)",
  },
];

// ── Particle Canvas ──────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const PALETTE = [
      "#C0B0F0",
      "#B5EBDC",
      "#D8D2FF",
      "#E2DEFF",
      "#9DE8C8",
      "#A8A0FF",
      "#EDE8FF",
    ];

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
      alpha: number;
    };

    const particles: Particle[] = Array.from({ length: 72 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      r: 1.8 + Math.random() * 3.8,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      alpha: 0.18 + Math.random() * 0.38,
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const REPEL = 145;

      for (const p of particles) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL && dist > 0) {
          const force = ((REPEL - dist) / REPEL) * 0.2;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.8) {
          p.vx = (p.vx / speed) * 2.8;
          p.vy = (p.vy / speed) * 2.8;
        }

        p.vx *= 0.974;
        p.vy *= 0.974;
        p.x += p.vx;
        p.y += p.vy;

        // Soft wrap
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0, opacity: 0.9 }}
    />
  );
}

// ── Section Label ────────────────────────────────────────────────────────────
function Label({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p
      className={`text-[0.625rem] font-bold tracking-[0.36em] uppercase ${className}`}
      style={{ color: "rgba(75,63,140,0.48)", fontFamily: PRETENDARD }}
    >
      {children}
    </p>
  );
}

// ── Hero Orb ─────────────────────────────────────────────────────────────────
function HeroOrb({ size = 300 }: { size?: number }) {
  const cx = size / 2;
  const cy = size * 0.64;
  const rx = size * 0.7;
  const ry = size * 0.21;

  return (
    <div
      className="relative mx-auto"
      style={{
        width: size,
        height: size,
        animation: "float-slow 6s ease-in-out infinite",
      }}
    >
      {/* Ring — back half */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={size}
        height={size}
        style={{ overflow: "visible", zIndex: 0 }}
      >
        <defs>
          <clipPath id="ringBack">
            <rect x={-size} y={0} width={size * 3} height={cy} />
          </clipPath>
        </defs>
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="#C0B0F0"
          strokeWidth="1.5"
          opacity="0.32"
          clipPath="url(#ringBack)"
        />
      </svg>

      {/* Sphere */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: HERO_GRADIENT,
          boxShadow:
            "0 30px 70px rgba(139,125,235,0.22), inset 0 -10px 30px rgba(139,125,235,0.08)",
          zIndex: 1,
        }}
      />

      {/* Ring — front half */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={size}
        height={size}
        style={{ overflow: "visible", zIndex: 2 }}
      >
        <defs>
          <clipPath id="ringFront">
            <rect x={-size} y={cy} width={size * 3} height={size} />
          </clipPath>
        </defs>
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="#C0B0F0"
          strokeWidth="2"
          opacity="0.54"
          clipPath="url(#ringFront)"
        />
      </svg>

      {/* Satellite dots */}
      <div
        className="absolute rounded-full"
        style={{
          width: 18,
          height: 18,
          top: "18%",
          left: "-5%",
          background: "radial-gradient(circle at 35% 30%, #e8e0ff, #c0b0f0)",
          boxShadow: "0 4px 12px rgba(139,125,235,0.25)",
          zIndex: 3,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 11,
          height: 11,
          top: "30%",
          left: "-9%",
          background: "radial-gradient(circle at 35% 30%, white, #d8d0f8)",
          opacity: 0.65,
          zIndex: 3,
        }}
      />
    </div>
  );
}

// ── About ────────────────────────────────────────────────────────────────────
export default function About() {
  const [tab, setTab] = useState<Tab>("brand");

  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: "#EEF0FF", fontFamily: PRETENDARD }}
    >
      <ParticleCanvas />
      <Navbar />

      {/* Breadcrumb */}
      <div
        className="fixed top-16 right-8 hidden md:block"
        style={{
          zIndex: 40,
          fontSize: "0.6rem",
          letterSpacing: "0.24em",
          fontWeight: 700,
          color: "rgba(75,63,140,0.4)",
          fontFamily: PRETENDARD,
        }}
      >
        ABOUT · {tab === "brand" ? "브랜드 소개" : "팀 소개"}
      </div>

      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center text-center px-6 pt-28 pb-6"
        style={{ zIndex: 10 }}
      >
        <Label>Adera Planet Project</Label>

        <h1
          className="mt-5 max-w-2xl"
          style={{
            fontSize: "clamp(2.1rem, 5vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.16,
            letterSpacing: "-0.025em",
            color: "#1F2430",
            wordBreak: "keep-all",
            fontFamily: PRETENDARD,
          }}
        >
          우리는 향으로
          <br />
          이야기를 짓는 행성에서 왔어요
        </h1>

        <p
          className="mt-5 max-w-[28rem]"
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.82,
            color: "#4B5563",
            wordBreak: "keep-all",
          }}
        >
          4명의 조향사가 지구인의 기억에 작은 반짝임을 더하기 위해
          <br className="hidden sm:block" />
          만들어진 Adder의 이야기
        </p>

        {/* Tab switcher */}
        <div
          className="mt-9 flex rounded-full p-1 backdrop-blur-sm shadow-sm"
          style={{
            backgroundColor: "rgba(255,255,255,0.62)",
            border: "1px solid rgba(75,63,140,0.1)",
          }}
        >
          {(["brand", "team"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={
                tab === t
                  ? {
                      backgroundColor: "#6B5CE7",
                      color: "#fff",
                      boxShadow: "0 4px 14px rgba(107,92,231,0.35)",
                      borderRadius: "9999px",
                      padding: "0.625rem 1.75rem",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      transition: "all 0.2s",
                      fontFamily: PRETENDARD,
                    }
                  : {
                      color: "#4B3F8C",
                      borderRadius: "9999px",
                      padding: "0.625rem 1.75rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      transition: "all 0.2s",
                      fontFamily: PRETENDARD,
                    }
              }
            >
              {t === "brand" ? "브랜드 소개" : "팀 소개"}
            </button>
          ))}
        </div>

        <div className="mt-14 mb-4">
          <HeroOrb size={300} />
        </div>
      </section>

      {/* ── Tab Content ── */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {tab === "brand" ? <BrandContent /> : <TeamContent />}
      </div>
    </div>
  );
}

// ── Brand Content ─────────────────────────────────────────────────────────────
function BrandContent() {
  return (
    <>
      {/* Our Story */}
      <section
        className="py-20 px-6 text-center"
        style={{ backgroundColor: "rgba(255,255,255,0.35)" }}
      >
        <Label>Our Story</Label>
        <h2
          className="mt-4"
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)",
            fontWeight: 800,
            lineHeight: 1.22,
            letterSpacing: "-0.025em",
            color: "#1F2430",
            fontFamily: PRETENDARD,
          }}
        >
          향은 기억의 언어입니다
        </h2>
        <p
          className="mt-4 max-w-xs mx-auto"
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.82,
            color: "#4B5563",
            wordBreak: "keep-all",
          }}
        >
          Adder 행성의 조향사들이 지구인의 기억에
          <br />
          작은 반짝임을 더하기 위해 시작했습니다.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/chat"
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "9999px",
              backgroundColor: "#6B5CE7",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 700,
              boxShadow: "0 6px 20px rgba(107,92,231,0.35)",
              fontFamily: PRETENDARD,
            }}
          >
            향 찾기 시작하기
          </Link>
          <button
            onClick={() =>
              document
                .getElementById("characters")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "9999px",
              border: "1px solid rgba(75,63,140,0.18)",
              backgroundColor: "rgba(255,255,255,0.62)",
              color: "#4B3F8C",
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: PRETENDARD,
            }}
          >
            캐릭터 만나보기
          </button>
        </div>
      </section>

      {/* 01 Origin */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <span
              style={{
                display: "block",
                fontSize: "5.5rem",
                fontWeight: 800,
                lineHeight: 1,
                color: "rgba(75,63,140,0.08)",
                userSelect: "none",
                fontFamily: PRETENDARD,
              }}
            >
              01
            </span>
            <Label className="mt-1">The Origin</Label>
            <h3
              className="mt-3"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)",
                fontWeight: 800,
                lineHeight: 1.22,
                letterSpacing: "-0.022em",
                color: "#1F2430",
                wordBreak: "keep-all",
                fontFamily: PRETENDARD,
              }}
            >
              향으로 감정을 전달하는 행성,
              <br />
              Adera
            </h3>
            <p
              className="mt-5 max-w-sm"
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.88,
                color: "#4B5563",
                wordBreak: "keep-all",
              }}
            >
              Adera는 말이나 문자 대신 향을 통해 감정과 기억을 전달하는 문명
              행성입니다. 이 행성의 조향사들은 향 입자로 감정의 언어를
              설계하고, 기억을 기록합니다.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["감정의 언어", "기억의 기록", "마음의 균형"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "0.35rem 0.875rem",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(216,210,255,0.5)",
                    color: "#4B3F8C",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    fontFamily: PRETENDARD,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                width: 290,
                height: 220,
                borderRadius: "1.75rem",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(238,240,255,0.72))",
                border: "1px solid rgba(255,255,255,0.88)",
                boxShadow: "0 20px 56px rgba(107,92,231,0.1)",
              }}
            >
              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: "50%",
                  background: HERO_GRADIENT,
                  boxShadow: "0 16px 40px rgba(139,125,235,0.22)",
                }}
              />
              <p
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 16,
                  fontSize: "0.52rem",
                  letterSpacing: "0.1em",
                  color: "rgba(75,63,140,0.18)",
                }}
              >
                Adera 행성 이미지
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 Glow */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            <div
              className="flex items-center justify-center"
              style={{
                width: 290,
                height: 220,
                borderRadius: "1.75rem",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(223,246,240,0.72))",
                border: "1px solid rgba(255,255,255,0.88)",
                boxShadow: "0 20px 56px rgba(107,92,231,0.08)",
              }}
            >
              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 35% 30%, #e0faf2 0%, #9de8c8 50%, #6dc89e 100%)",
                  boxShadow: "0 16px 40px rgba(126,200,164,0.3)",
                }}
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span
              style={{
                display: "block",
                fontSize: "5.5rem",
                fontWeight: 800,
                lineHeight: 1,
                color: "rgba(75,63,140,0.08)",
                userSelect: "none",
                fontFamily: PRETENDARD,
              }}
            >
              02
            </span>
            <Label className="mt-1">Glow</Label>
            <h3
              className="mt-3"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)",
                fontWeight: 800,
                lineHeight: 1.22,
                letterSpacing: "-0.022em",
                color: "#1F2430",
                wordBreak: "keep-all",
                fontFamily: PRETENDARD,
              }}
            >
              기억 속 순간을 다시 반짝이게
            </h3>
            <p
              className="mt-5 max-w-sm"
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.88,
                color: "#4B5563",
                wordBreak: "keep-all",
              }}
            >
              향을 맡았을 때 문득 떠오르는 장면처럼, Glow는 기억을 다시 빛나게
              하고 그 순간을 조금 더 특별하게 만들어요.
            </p>
          </div>
        </div>
      </section>

      {/* Characters */}
      <section
        id="characters"
        className="py-24 px-6"
        style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Label>Characters</Label>
            <h2
              className="mt-4"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.025em",
                color: "#1F2430",
                fontFamily: PRETENDARD,
              }}
            >
              조향사가 당신을 기다리고 있어요
            </h2>
            <p
              className="mt-4"
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.78,
                color: "#4B5563",
                wordBreak: "keep-all",
              }}
            >
              각자 다른 방식으로 향을 설계하는 Adera의 조향사들을 만나보세요
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CHARACTERS.map((char) => (
              <div
                key={char.id}
                className="flex flex-col items-center text-center"
                style={{
                  borderRadius: "1.5rem",
                  padding: "1.375rem 1.125rem",
                  background: char.cardBg,
                  border: "1px solid rgba(255,255,255,0.78)",
                  boxShadow: "0 8px 28px rgba(107,92,231,0.07)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-6px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 16px 40px rgba(107,92,231,0.13)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 8px 28px rgba(107,92,231,0.07)";
                }}
              >
                <div className="w-[4.5rem] h-[4.5rem] flex items-center justify-center">
                  <img
                    src={char.img}
                    alt={char.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p
                  className="mt-3"
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 800,
                    color: "#1F2430",
                    fontFamily: PRETENDARD,
                  }}
                >
                  {char.name}
                </p>
                <p
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "#4B3F8C",
                    marginTop: "0.125rem",
                  }}
                >
                  {char.role}
                </p>
                <p
                  style={{
                    marginTop: "0.625rem",
                    fontSize: "0.76rem",
                    lineHeight: 1.7,
                    color: "#4B5563",
                    wordBreak: "keep-all",
                  }}
                >
                  {char.description}
                </p>
                <div
                  className="flex flex-wrap justify-center"
                  style={{ marginTop: "0.75rem", gap: "0.375rem" }}
                >
                  {char.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "9999px",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        backgroundColor: char.tagBg,
                        color: char.tagColor,
                        fontFamily: PRETENDARD,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── Team Content ──────────────────────────────────────────────────────────────
function TeamContent() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Label>The Team</Label>
          <h2
            className="mt-4"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "#1F2430",
              fontFamily: PRETENDARD,
            }}
          >
            기억에 반짝임을 더하는 사람들
          </h2>
          <p
            className="mt-4 max-w-sm mx-auto"
            style={{
              fontSize: "0.9375rem",
              lineHeight: 1.82,
              color: "#4B5563",
              wordBreak: "keep-all",
            }}
          >
            Adera 행성의 조향사들을 지구로 데려온 팀,
            <br />
            당신의 기억에 반짝임을 더할 수 있도록 노력하고 있어요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center text-center"
              style={{
                borderRadius: "1.75rem",
                padding: "2.25rem 2rem",
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.8), rgba(238,240,255,0.55))",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 16px 48px rgba(107,92,231,0.09)",
              }}
            >
              <div
                style={{
                  width: "7rem",
                  height: "7rem",
                  borderRadius: "50%",
                  background: member.orbColor,
                  boxShadow: "0 16px 40px rgba(139,125,235,0.2)",
                }}
              />
              <p
                style={{
                  marginTop: "1.25rem",
                  fontSize: "1.0625rem",
                  fontWeight: 800,
                  color: "#1F2430",
                  fontFamily: PRETENDARD,
                }}
              >
                {member.name}
              </p>
              <p
                style={{
                  marginTop: "0.25rem",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#4B3F8C",
                }}
              >
                {member.role}
              </p>
              <p
                style={{
                  marginTop: "0.875rem",
                  fontSize: "0.875rem",
                  lineHeight: 1.78,
                  color: "#4B5563",
                  wordBreak: "keep-all",
                }}
              >
                {member.description}
              </p>
              <div
                className="flex flex-wrap justify-center"
                style={{ marginTop: "1rem", gap: "0.5rem" }}
              >
                {member.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "0.3rem 0.875rem",
                      borderRadius: "9999px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      backgroundColor: "rgba(216,210,255,0.55)",
                      color: "#4B3F8C",
                      fontFamily: PRETENDARD,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
