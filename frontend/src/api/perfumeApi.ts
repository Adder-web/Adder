import type { CharacterType } from "../data/perfumeQuestions";

type ChatRole = "user" | "assistant";

type PreviousMessage = {
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
