import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { sendPerfumeChat } from "../api/perfumeApi";
import type { CharacterType } from "../data/perfumeQuestions";
import { CHARACTER_TONES } from "../data/characterTone";

type CharacterItem = {
  id: CharacterType;
  name: string;
  color: string;
  colorBg: string;
  grad: string;
};

const CHARACTERS: CharacterItem[] = [
  {
    id: "homa",
    name: "호마",
    color: "#7EC8A4",
    colorBg: "rgba(126,200,164,0.15)",
    grad: "linear-gradient(135deg, #a8e6c8, #7EC8A4)",
  },
  {
    id: "move",
    name: "무브",
    color: "#9B89D4",
    colorBg: "rgba(155,137,212,0.15)",
    grad: "linear-gradient(135deg, #c4b5f0, #9B89D4)",
  },
  {
    id: "orion",
    name: "오리온",
    color: "#F0A0A0",
    colorBg: "rgba(240,160,160,0.15)",
    grad: "linear-gradient(135deg, #f8c8c8, #F0A0A0)",
  },
  {
    id: "algo",
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

const TOTAL_QUESTION_COUNT = 5;

const PERFUME_QUESTIONS = [
  "오늘 어떤 기억이나 감정을 향으로 담고 싶으신가요?",
  "그 향을 떠올렸을 때 가장 먼저 생각나는 장소나 순간은 어디인가요?",
  "그 장면의 분위기는 가볍고 산뜻한 쪽인가요, 깊고 차분한 쪽인가요?",
  "좋아하는 계절, 날씨, 색감이 있다면 함께 알려주세요.",
  "마지막으로 피하고 싶은 향이나 불편하게 느끼는 향이 있다면 알려주세요.",
];

function formatTime() {
  return new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function createInitialMessage(character: CharacterItem): Message {
  const tone = CHARACTER_TONES[character.id];

  return {
    id: Date.now(),
    role: "ai",
    text: `안녕하세요. 저는 ${tone.name}예요. ${PERFUME_QUESTIONS[0]}`,
    time: formatTime(),
  };
}

export default function Chat() {
  const navigate = useNavigate();

  const [activeChar, setActiveChar] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    createInitialMessage(CHARACTERS[0]),
  ]);
  const [input, setInput] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const char = CHARACTERS[activeChar];
  const characterTone = CHARACTER_TONES[char.id];

  const isCompleted = currentQuestionIndex >= TOTAL_QUESTION_COUNT;
  const currentStep = Math.min(currentQuestionIndex + 1, TOTAL_QUESTION_COUNT);

  const progressLabel = isCompleted
    ? "결과 보기"
    : `${currentStep}/${TOTAL_QUESTION_COUNT}`;

  const progressPercent = (currentStep / TOTAL_QUESTION_COUNT) * 100;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleChangeCharacter = (index: number) => {
    if (isLoading) return;

    setActiveChar(index);

    const hasUserMessage = messages.some((message) => message.role === "user");

    if (!hasUserMessage) {
      setMessages([createInitialMessage(CHARACTERS[index])]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || isCompleted) return;

    const userInput = input.trim();

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: userInput,
      time: formatTime(),
    };

    const nextQuestionIndex = currentQuestionIndex + 1;

    const nextQuestion =
      nextQuestionIndex < TOTAL_QUESTION_COUNT
        ? PERFUME_QUESTIONS[nextQuestionIndex]
        : null;

    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const result = await sendPerfumeChat({
        userMessage: userInput,
        characterId: char.id,
        characterName: characterTone.name,
        characterDescription: characterTone.description,
        speechStyle: characterTone.speechStyle,
        currentQuestionIndex,
        totalQuestionCount: TOTAL_QUESTION_COUNT,
        nextQuestion,
        previousMessages: updatedMessages.map((message) => ({
          role: message.role === "ai" ? "assistant" : "user",
          content: message.text,
        })),
      });

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: result.answer,
        time: formatTime(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (nextQuestionIndex >= TOTAL_QUESTION_COUNT) {
        setCurrentQuestionIndex(TOTAL_QUESTION_COUNT);
      } else {
        setCurrentQuestionIndex(nextQuestionIndex);
      }
    } catch (error) {
      console.error("향수 채팅 API 호출 실패:", error);

      const fallbackText =
        nextQuestion === null
          ? characterTone.completedFallbackReply
          : `${getRandomItem(characterTone.fallbackReplies)} ${nextQuestion}`;

      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: fallbackText,
        time: formatTime(),
      };

      setMessages((prev) => [...prev, errorMsg]);

      if (nextQuestionIndex >= TOTAL_QUESTION_COUNT) {
        setCurrentQuestionIndex(TOTAL_QUESTION_COUNT);
      } else {
        setCurrentQuestionIndex(nextQuestionIndex);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoResult = () => {
    if (!isCompleted) return;

    navigate("/result", {
      state: {
        character: char.id,
        characterName: characterTone.name,
        messages,
      },
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="flex h-dvh overflow-hidden flex-col"
      style={{ backgroundColor: "#EEF0F8" }}
    >
      <Navbar />

      <main className="flex min-h-0 flex-1 overflow-hidden pt-16">
        <section className="flex min-w-0 min-h-0 flex-1 flex-col lg:w-3/4">
          <div
            className="flex shrink-0 items-center gap-2 overflow-x-auto border-b px-4 py-2.5 sm:px-6 sm:py-3"
            style={{
              borderColor: "rgba(107,106,222,0.15)",
              backgroundColor: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
            }}
          >
            {CHARACTERS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => handleChangeCharacter(i)}
                disabled={isLoading}
                className="flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
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
                  className="h-3.5 w-3.5 rounded-full sm:h-4 sm:w-4"
                  style={{ background: c.grad }}
                />
                {c.name}
              </button>
            ))}

            <button
              className="ml-auto whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm lg:hidden"
              style={{
                background: "rgba(107,106,222,0.12)",
                color: "#6B6ADE",
              }}
              onClick={() => setDrawerOpen(true)}
            >
              분석 보기
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:space-y-4 sm:px-6 sm:py-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 sm:gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
                style={{ animation: "fadeSlideUp 0.3s ease-out" }}
              >
                {msg.role === "ai" && (
                  <div
                    className="h-8 w-8 flex-shrink-0 rounded-full sm:h-9 sm:w-9"
                    style={{ background: char.grad }}
                  />
                )}

                <div
                  className={`flex max-w-[82%] flex-col gap-1 sm:max-w-[72%] ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className="rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:px-4 sm:py-3"
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

            {isLoading && (
              <div
                className="flex flex-row items-end gap-2.5 sm:gap-3"
                style={{ animation: "fadeSlideUp 0.3s ease-out" }}
              >
                <div
                  className="h-8 w-8 flex-shrink-0 rounded-full sm:h-9 sm:w-9"
                  style={{ background: char.grad }}
                />

                <div className="flex max-w-[82%] flex-col items-start gap-1 sm:max-w-[72%]">
                  <div
                    className="rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:px-4 sm:py-3"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      color: "#1A1A2E",
                      borderBottomLeftRadius: 4,
                      boxShadow: "0 2px 12px rgba(107,106,222,0.08)",
                    }}
                  >
                    {characterTone.name}가 답변을 조향하는 중이에요...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div
            className="shrink-0 border-t px-4 py-3 sm:px-6 sm:py-4"
            style={{
              borderColor: "rgba(107,106,222,0.15)",
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="mx-auto flex max-w-3xl items-center gap-2.5 sm:gap-3">
              <div
                className="flex flex-1 items-center rounded-full px-4 py-2.5 transition-all duration-200 sm:px-5 sm:py-3"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1.5px solid rgba(107,106,222,0.2)",
                  boxShadow: "0 2px 12px rgba(107,106,222,0.06)",
                }}
              >
                <input
                  className="text-text-dark placeholder-text-gray flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed"
                  placeholder={
                    isCompleted
                      ? "모든 질문이 완료되었어요. 결과를 확인해보세요."
                      : isLoading
                        ? `${characterTone.name}가 향을 조합하고 있어요...`
                        : `${characterTone.name}에게 이야기해요...`
                  }
                  value={input}
                  disabled={isLoading || isCompleted}
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
                disabled={isLoading || isCompleted || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
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
        </section>

        <aside
          className="hidden w-[300px] shrink-0 flex-col overflow-hidden border-l xl:w-[340px] lg:flex"
          style={{
            borderColor: "rgba(107,106,222,0.15)",
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <ScentPanel
            currentStep={currentStep}
            totalStep={TOTAL_QUESTION_COUNT}
            progressLabel={progressLabel}
            progressPercent={progressPercent}
            isCompleted={isCompleted}
            onResultClick={handleGoResult}
          />
        </aside>
      </main>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: "rgba(26,26,46,0.5)" }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 overflow-y-auto rounded-t-3xl"
            style={{
              backgroundColor: "rgba(238,240,248,0.98)",
              backdropFilter: "blur(24px)",
              maxHeight: "80dvh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <p
                className="text-text-gray text-xs font-semibold tracking-widest"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                SCENT ANALYSIS
              </p>

              <button
                onClick={() => setDrawerOpen(false)}
                className="text-text-gray hover:text-text-dark"
              >
                ✕
              </button>
            </div>

            <ScentPanel
              currentStep={currentStep}
              totalStep={TOTAL_QUESTION_COUNT}
              progressLabel={progressLabel}
              progressPercent={progressPercent}
              isCompleted={isCompleted}
              onResultClick={handleGoResult}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbit-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }

        @keyframes bar-fill {
          from { width: 0; }
        }
      `}</style>
    </div>
  );
}

type ScentPanelProps = {
  currentStep: number;
  totalStep: number;
  progressLabel: string;
  progressPercent: number;
  isCompleted: boolean;
  onResultClick: () => void;
};

function ScentPanel({
  currentStep,
  totalStep,
  progressLabel,
  progressPercent,
  isCompleted,
  onResultClick,
}: ScentPanelProps) {
  const safeStep = Math.min(currentStep, totalStep);

  return (
    <div className="flex h-full min-h-0 flex-col px-4 py-4 xl:px-5 xl:py-5">
      <div className="shrink-0">
        <p
          className="mb-1 text-[10px] font-semibold tracking-[0.16em]"
          style={{
            color: "#8B8BA7",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          SCENT ANALYSIS
        </p>

        <h2 className="text-[15px] font-bold leading-snug text-[#1A1A2E] xl:text-base">
          내 취향 분석 중
        </h2>

        <p className="mt-1.5 text-[11px] leading-[1.55] text-[#8B8BA7]">
          완성된 향은 아직 공개하지 않고, 취향의 흐름만 조용히 정리하고 있어요.
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-center py-4 xl:py-5">
        <div className="relative h-28 w-28 xl:h-32 xl:w-32">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1.5px solid rgba(107,106,222,0.2)",
              animation: "orbit 12s linear infinite",
            }}
          />

          <div
            className="absolute rounded-full"
            style={{
              inset: "13%",
              border: "1.5px solid rgba(155,137,212,0.28)",
              animation: "orbit-reverse 8s linear infinite",
            }}
          />

          <div
            className="absolute rounded-full"
            style={{
              inset: "27%",
              border: "1.5px solid rgba(126,200,164,0.36)",
              animation: "orbit 5s linear infinite",
            }}
          />

          <div
            className="absolute rounded-full"
            style={{
              inset: "39%",
              background: "linear-gradient(135deg, #6B6ADE, #9B89D4)",
              filter: "blur(1.5px)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          />
        </div>

        <p
          className="mt-2 text-center text-[10px] leading-relaxed"
          style={{
            color: "#8B8BA7",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          향의 윤곽을 조합하고 있어요 ✦
        </p>
      </div>

      <div
        className="shrink-0 rounded-[20px] px-4 py-4"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(107,106,222,0.12)",
          boxShadow: "0 8px 24px rgba(107,106,222,0.05)",
        }}
      >
        <p
          className="text-[10px] font-semibold tracking-[0.16em]"
          style={{
            color: "#9A99B5",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          SCENT NAME
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "rgba(107,106,222,0.08)",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 10V7.8C8 5.70132 9.79086 4 12 4C14.2091 4 16 5.70132 16 7.8V10"
                stroke="#6B6ADE"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect
                x="6"
                y="10"
                width="12"
                height="10"
                rx="2.5"
                stroke="#6B6ADE"
                strokeWidth="1.8"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-[#1A1A2E]">
              예상 향기명
            </h3>

            <p className="mt-1 text-[11px] leading-[1.5] text-[#8B8BA7]">
              결과 페이지에서 공개돼요.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 shrink-0">
        <p className="mb-2 text-[13px] font-bold text-[#1A1A2E]">분석 상태</p>

        <div className="flex flex-col gap-2">
          {["감정의 온도", "장면의 밀도", "향의 방향성"].map((item, index) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-xl px-3 py-2"
              style={{
                background: "rgba(107,106,222,0.07)",
                border: "1px solid rgba(107,106,222,0.08)",
              }}
            >
              <span className="text-[11px] text-[#8B8BA7]">{item}</span>

              <span
                className="text-[11px] font-semibold"
                style={{
                  color:
                    index === 0
                      ? "#6B6ADE"
                      : index === 1
                        ? "#9B89D4"
                        : "#7EC8A4",
                }}
              >
                분석 중
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-auto shrink-0 rounded-2xl p-3"
        style={{ background: "rgba(107,106,222,0.08)" }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] text-[#8B8BA7]">진행 상태</span>
          <span className="text-xs font-semibold" style={{ color: "#6B6ADE" }}>
            {safeStep}/{totalStep}
          </span>
        </div>

        <div
          className="mb-3 h-1.5 overflow-hidden rounded-full"
          style={{ background: "rgba(107,106,222,0.12)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              background: "linear-gradient(135deg, #6B6ADE, #9B89D4)",
            }}
          />
        </div>

        <button
          type="button"
          disabled={!isCompleted}
          onClick={onResultClick}
          className="w-full rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed"
          style={
            isCompleted
              ? {
                  background: "linear-gradient(135deg, #6B6ADE, #9B89D4)",
                  color: "white",
                  boxShadow: "0 8px 24px rgba(107,106,222,0.28)",
                }
              : {
                  background: "rgba(255,255,255,0.72)",
                  color: "#8B8BA7",
                  border: "1px solid rgba(107,106,222,0.12)",
                }
          }
        >
          {progressLabel}
        </button>
      </div>
    </div>
  );
}
