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

const hiddenScentNames = ["???", "?? ?", "? ??", "???", "?? ??"];

const analysisMessages = [
  "아직 이름 붙일 수 없는 향의 첫 단서를 모으고 있어요.",
  "답변 속 분위기가 향의 방향으로 천천히 변환되고 있어요.",
  "취향의 결이 조금씩 겹치며 하나의 향으로 정리되고 있어요.",
  "선호하는 무드와 감각의 흐름을 조심스럽게 분석하고 있어요.",
  "거의 완성 단계에 가까워지고 있어요. 마지막 단서를 정리하는 중이에요.",
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
      /**
       * 여기서 매 답변마다 백엔드로 요청을 보냄.
       * 백엔드는 이 정보를 바탕으로 GPT 응답을 생성해야 함.
       */
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

      /**
       * API 실패 시에만 fallbackReplies 사용.
       * 질문은 PERFUME_QUESTIONS의 nextQuestion을 이어붙임.
       */
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
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "#EEF0F8" }}
    >
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)] flex-1 overflow-hidden pt-16">
        <div className="flex min-w-0 flex-1 flex-col lg:w-3/4">
          <div
            className="flex items-center gap-2 overflow-x-auto border-b px-6 py-3"
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
                className="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="h-4 w-4 rounded-full"
                  style={{ background: c.grad }}
                />
                {c.name}
              </button>
            ))}

            <button
              className="ml-auto whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium lg:hidden"
              style={{
                background: "rgba(107,106,222,0.12)",
                color: "#6B6ADE",
              }}
              onClick={() => setDrawerOpen(true)}
            >
              분석 보기
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
                style={{ animation: "fadeSlideUp 0.3s ease-out" }}
              >
                {msg.role === "ai" && (
                  <div
                    className="h-9 w-9 flex-shrink-0 rounded-full"
                    style={{ background: char.grad }}
                  />
                )}

                <div
                  className={`flex max-w-[72%] flex-col gap-1 ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
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

            {isLoading && (
              <div
                className="flex flex-row items-end gap-3"
                style={{ animation: "fadeSlideUp 0.3s ease-out" }}
              >
                <div
                  className="h-9 w-9 flex-shrink-0 rounded-full"
                  style={{ background: char.grad }}
                />

                <div className="flex max-w-[72%] flex-col items-start gap-1">
                  <div
                    className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
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
            className="border-t px-6 py-4"
            style={{
              borderColor: "rgba(107,106,222,0.15)",
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="mx-auto flex max-w-3xl items-center gap-3">
              <div
                className="flex flex-1 items-center rounded-full px-5 py-3 transition-all duration-200"
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
                className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
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

        <aside
          className="hidden w-72 flex-col overflow-y-auto border-l lg:flex xl:w-80"
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
      </div>

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
              maxHeight: "80vh",
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
  const hiddenScentName = hiddenScentNames[safeStep - 1] ?? "???";
  const analysisMessage = analysisMessages[safeStep - 1] ?? analysisMessages[0];

  return (
    <div className="flex min-h-full flex-col gap-6 p-6">
      <div>
        <p
          className="text-text-gray mb-1 text-xs font-semibold tracking-widest"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "0.12em",
          }}
        >
          SCENT ANALYSIS
        </p>

        <h2 className="text-text-dark text-lg font-bold">내 취향 분석 중</h2>

        <p className="text-text-gray mt-1 text-xs leading-relaxed">
          완성된 향은 아직 공개하지 않고, 취향의 흐름만 조용히 정리하고 있어요.
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 160, height: 160 }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid rgba(107,106,222,0.2)",
              animation: "orbit 12s linear infinite",
            }}
          />

          <div
            className="absolute rounded-full"
            style={{
              inset: 20,
              border: "2px solid rgba(155,137,212,0.3)",
              animation: "orbit-reverse 8s linear infinite",
            }}
          />

          <div
            className="absolute rounded-full"
            style={{
              inset: 40,
              border: "2px solid rgba(126,200,164,0.4)",
              animation: "orbit 5s linear infinite",
            }}
          />

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
          className="text-text-gray mt-3 text-xs"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          향의 윤곽을 조합하고 있어요 ✦
        </p>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(107,106,222,0.14)",
          boxShadow: "0 10px 30px rgba(107,106,222,0.08)",
        }}
      >
        <p className="text-text-gray text-xs font-medium">예상 향기명</p>

        <div className="mt-3 flex items-center gap-2">
          <span
            className="text-3xl font-bold tracking-[0.22em]"
            style={{
              color: "#1A1A2E",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {hiddenScentName}
          </span>

          <span
            className="h-2 w-2 rounded-full"
            style={{
              background: "#6B6ADE",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
        </div>

        <p className="text-text-gray mt-4 text-xs leading-relaxed">
          {analysisMessage}
        </p>
      </div>

      <div>
        <p className="text-text-dark mb-3 text-sm font-semibold">분석 상태</p>

        <div className="flex flex-col gap-2">
          {["감정의 온도", "장면의 밀도", "향의 방향성"].map((item, index) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-xs"
              style={{
                background: "rgba(107,106,222,0.07)",
                border: "1px solid rgba(107,106,222,0.08)",
              }}
            >
              <span className="text-text-gray">{item}</span>
              <span
                className="font-semibold"
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
        className="mt-auto rounded-2xl p-4"
        style={{ background: "rgba(107,106,222,0.08)" }}
      >
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-text-gray">진행 상태</span>
          <span className="font-semibold" style={{ color: "#6B6ADE" }}>
            {safeStep}/{totalStep}
          </span>
        </div>

        <div
          className="mb-4 h-2 overflow-hidden rounded-full"
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
          className="w-full rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed"
          style={
            isCompleted
              ? {
                  background: "linear-gradient(135deg, #6B6ADE, #9B89D4)",
                  color: "white",
                  boxShadow: "0 8px 24px rgba(107,106,222,0.28)",
                }
              : {
                  background: "rgba(255,255,255,0.65)",
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
