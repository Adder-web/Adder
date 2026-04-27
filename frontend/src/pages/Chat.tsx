import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const CHARACTERS = [
  {
    name: "호마",
    color: "#7EC8A4",
    colorBg: "rgba(126,200,164,0.15)",
    grad: "linear-gradient(135deg, #a8e6c8, #7EC8A4)",
  },
  {
    name: "무브",
    color: "#9B89D4",
    colorBg: "rgba(155,137,212,0.15)",
    grad: "linear-gradient(135deg, #c4b5f0, #9B89D4)",
  },
  {
    name: "오리온",
    color: "#F0A0A0",
    colorBg: "rgba(240,160,160,0.15)",
    grad: "linear-gradient(135deg, #f8c8c8, #F0A0A0)",
  },
  {
    name: "알고",
    color: "#F5C842",
    colorBg: "rgba(245,200,66,0.15)",
    grad: "linear-gradient(135deg, #fae090, #F5C842)",
  },
];

interface Message {
  id: number;
  role: "ai" | "user";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "안녕하세요! 저는 호마예요. 오늘 어떤 기억이나 감정을 향으로 담고 싶으신가요? 편하게 이야기해 주세요 ✦",
    time: "오후 2:30",
  },
];

const NOTES_DATA = {
  top: [
    { name: "베르가못", pct: 72 },
    { name: "레몬 제스트", pct: 45 },
  ],
  mid: [
    { name: "로즈", pct: 60 },
    { name: "자스민", pct: 38 },
  ],
  base: [
    { name: "샌달우드", pct: 55 },
    { name: "머스크", pct: 42 },
  ],
};

const NOTE_COLORS: Record<string, string> = {
  top: "#6B6ADE",
  mid: "#9B89D4",
  base: "#7EC8A4",
};

const KEYWORDS = ["고요함", "감성적", "편안함", "자연스러운", "따뜻한"];

function formatTime() {
  return new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chat() {
  const [activeChar, setActiveChar] = useState(0);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(3);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const char = CHARACTERS[activeChar];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: input,
      time: formatTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setProgress((p) => Math.min(p + 1, 7));

    // Simulated AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: "그 기억이 참 아름답네요. 그때의 온도와 향기가 느껴지는 것 같아요. 조금 더 이야기해 주실 수 있을까요? ✦",
        time: formatTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 900);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#EEF0F8" }}
    >
      <Navbar />

      <div className="flex flex-1 pt-16 h-[calc(100vh-4rem)] overflow-hidden">
        {/* ── Left: Chat area ── */}
        <div className="flex flex-col flex-1 lg:w-3/4 min-w-0">
          {/* Character selector tabs */}
          <div
            className="flex items-center gap-2 px-6 py-3 border-b overflow-x-auto"
            style={{
              borderColor: "rgba(107,106,222,0.15)",
              backgroundColor: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
            }}
          >
            {CHARACTERS.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActiveChar(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={
                  activeChar === i
                    ? {
                        background: c.colorBg,
                        color: c.color,
                        border: `1.5px solid ${c.color}40`,
                      }
                    : {
                        background: "transparent",
                        color: "#8B8BA7",
                        border: "1.5px solid transparent",
                      }
                }
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: c.grad }}
                />
                {c.name}
              </button>
            ))}

            {/* Mobile: Scent panel toggle */}
            <button
              className="ml-auto lg:hidden px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
              style={{ background: "rgba(107,106,222,0.12)", color: "#6B6ADE" }}
              onClick={() => setDrawerOpen(true)}
            >
              향 레시피 보기
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                style={{ animation: "fadeSlideUp 0.3s ease-out" }}
              >
                {/* Avatar (AI only) */}
                {msg.role === "ai" && (
                  <div
                    className="w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: char.grad }}
                  />
                )}

                <div
                  className={`flex flex-col gap-1 max-w-[72%] ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, #6B6ADE, #9B89D4)",
                            color: "white",
                            borderBottomRightRadius: 4,
                          }
                        : {
                            background: "rgba(255,255,255,0.9)",
                            color: "#1A1A2E",
                            borderBottomLeftRadius: 4,
                            boxShadow: "0 2px 12px rgba(107,106,222,0.08)",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs" style={{ color: "#8B8BA7" }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            className="px-6 py-4 border-t"
            style={{
              borderColor: "rgba(107,106,222,0.15)",
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-3 max-w-3xl mx-auto">
              <div
                className="flex-1 flex items-center rounded-full px-5 py-3 transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1.5px solid rgba(107,106,222,0.2)",
                  boxShadow: "0 2px 12px rgba(107,106,222,0.06)",
                }}
                onFocus={() => {}}
              >
                <input
                  className="flex-1 bg-transparent outline-none text-sm text-text-dark placeholder-text-gray"
                  placeholder={`${char.name}에게 이야기해요...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  onFocus={(e) => {
                    (
                      e.currentTarget.parentElement as HTMLElement
                    ).style.borderColor = "#6B6ADE";
                    (
                      e.currentTarget.parentElement as HTMLElement
                    ).style.boxShadow = "0 0 0 3px rgba(107,106,222,0.12)";
                  }}
                  onBlur={(e) => {
                    (
                      e.currentTarget.parentElement as HTMLElement
                    ).style.borderColor = "rgba(107,106,222,0.2)";
                    (
                      e.currentTarget.parentElement as HTMLElement
                    ).style.boxShadow = "0 2px 12px rgba(107,106,222,0.06)";
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #6B6ADE, #9B89D4)",
                  boxShadow: "0 4px 16px rgba(107,106,222,0.35)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 8L14 8M14 8L9 3M14 8L9 13"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Scent Profile panel (desktop) ── */}
        <aside
          className="hidden lg:flex flex-col w-72 xl:w-80 border-l overflow-y-auto"
          style={{
            borderColor: "rgba(107,106,222,0.15)",
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <ScentPanel progress={progress} />
        </aside>
      </div>

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: "rgba(26,26,46,0.5)" }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-y-auto"
            style={{
              backgroundColor: "rgba(238,240,248,0.98)",
              backdropFilter: "blur(24px)",
              maxHeight: "80vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 pt-6 pb-4">
              <p
                className="text-xs font-semibold tracking-widest text-text-gray"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                SCENT PROFILE
              </p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-text-gray hover:text-text-dark"
              >
                ✕
              </button>
            </div>
            <ScentPanel progress={progress} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Scent Profile Panel ─────────────────────────────────────
function ScentPanel({ progress }: { progress: number }) {
  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <p
          className="text-xs font-semibold tracking-widest mb-1 text-text-gray"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "0.12em",
          }}
        >
          SCENT PROFILE
        </p>
        <h2 className="font-bold text-text-dark text-lg">나의 향 레시피</h2>
        <p className="text-text-gray text-xs mt-1 leading-relaxed">
          대화가 진행되는 동안 당신의 향이 만들어지고 있어요
        </p>
      </div>

      {/* Orbital visualization */}
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 160, height: 160 }}>
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid rgba(107,106,222,0.2)",
              animation: "orbit 12s linear infinite",
            }}
          />
          {/* Middle ring */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 20,
              border: "2px solid rgba(155,137,212,0.3)",
              animation: "orbit-reverse 8s linear infinite",
            }}
          />
          {/* Inner ring */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 40,
              border: "2px solid rgba(126,200,164,0.4)",
              animation: "orbit 5s linear infinite",
            }}
          />
          {/* Center dot */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 60,
              background: "linear-gradient(135deg, #6B6ADE, #9B89D4)",
              filter: "blur(2px)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          />
        </div>
        <p
          className="text-xs text-text-gray mt-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          향 입자가 모이고 있어요 ✦
        </p>
      </div>

      {/* Notes */}
      <div>
        <p className="text-sm font-semibold text-text-dark mb-4">
          발견된 향 노트
        </p>
        {(["top", "mid", "base"] as const).map((tier) => (
          <div key={tier} className="mb-4">
            <p
              className="text-xs font-semibold tracking-wider mb-2 uppercase"
              style={{
                color: NOTE_COLORS[tier],
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {tier} note
            </p>
            {NOTES_DATA[tier].map((note) => (
              <div key={note.name} className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-dark">{note.name}</span>
                  <span style={{ color: NOTE_COLORS[tier] }}>{note.pct}%</span>
                </div>
                <div
                  className="h-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(107,106,222,0.1)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${note.pct}%`,
                      background: NOTE_COLORS[tier],
                      animation: "bar-fill 1s ease-out",
                      animationFillMode: "both",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Keywords */}
      <div>
        <p className="text-sm font-semibold text-text-dark mb-3">키워드</p>
        <div className="flex flex-wrap gap-2">
          {KEYWORDS.map((kw) => (
            <span
              key={kw}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(107,106,222,0.1)",
                color: "#6B6ADE",
                border: "1px solid rgba(107,106,222,0.2)",
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl text-sm"
        style={{ background: "rgba(107,106,222,0.08)" }}
      >
        <span className="text-text-gray">진행 중 ...</span>
        <span className="font-semibold" style={{ color: "#6B6ADE" }}>
          ({progress}/7)
        </span>
      </div>
    </div>
  );
}
