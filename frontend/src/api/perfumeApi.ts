import type { CharacterType } from "../data/perfumeQuestions";

export type ChatRole = "user" | "assistant";

export type PreviousMessage = {
  role: ChatRole;
  content: string;
};

type SendPerfumeChatParams = {
  userMessage: string;
  characterId: CharacterType;
  characterName: string;
  characterDescription: string;
  speechStyle: string;
  currentQuestionIndex: number;
  totalQuestionCount: number;
  nextQuestion: string | null;
  previousMessages: PreviousMessage[];
};

type SendPerfumeChatResponse = {
  answer: string;
};

export type PerfumeMessage = {
  role: ChatRole;
  content: string;
};

export type PerfumeResultRequest = {
  characterType: CharacterType;
  messages: PerfumeMessage[];
};

export type ScentNote = {
  type: "Top Note" | "Middle Note" | "Base Note";
  name: string;
  description: string;
  ratio: number;
  color: "mint" | "purple" | "yellow";
};

export type ScentBalance = {
  label: string;
  value: number;
};

export type PerfumeResultResponse = {
  resultId?: number;
  date: string;
  characterType: CharacterType;
  englishName: string;
  koreanName: string;
  summary: string;
  moods: string[];
  perfumer: {
    name: string;
    role: string;
  };
  notes: ScentNote[];
  balance: ScentBalance[];
  keywords: string[];
};

export async function sendPerfumeChat({
  userMessage,
  characterId,
  characterName,
  characterDescription,
  speechStyle,
  currentQuestionIndex,
  totalQuestionCount,
  nextQuestion,
  previousMessages,
}: SendPerfumeChatParams): Promise<SendPerfumeChatResponse> {
  const response = await fetch("/api/perfume/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userMessage,
      characterId,
      characterName,
      characterDescription,
      speechStyle,
      currentQuestionIndex,
      totalQuestionCount,
      nextQuestion,
      previousMessages,
    }),
  });

  if (!response.ok) {
    throw new Error("향수 채팅 응답을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function createPerfumeResult(
  request: PerfumeResultRequest,
): Promise<PerfumeResultResponse> {
  const response = await fetch("/api/perfume/result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("향 결과 생성에 실패했습니다.");
  }

  return response.json();
}
