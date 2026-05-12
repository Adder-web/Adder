import type { CharacterType } from "../data/perfumeQuestions";
import { CHARACTER_TONES } from "../data/characterTone";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type CreateCharacterReplyParams = {
  character: CharacterType;
  userAnswer: string;
  nextQuestion: string | null;
  currentQuestionIndex: number;
  totalQuestionCount: number;
  previousMessages: ChatMessage[];
};

type CreateCharacterReplyResponse = {
  message: string;
};

export const createCharacterReply = async ({
  character,
  userAnswer,
  nextQuestion,
  currentQuestionIndex,
  totalQuestionCount,
  previousMessages,
}: CreateCharacterReplyParams): Promise<string> => {
  const characterTone = CHARACTER_TONES[character];

  const response = await fetch("http://localhost:8080/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      character,
      characterName: characterTone.name,
      characterDescription: characterTone.description,
      speechStyle: characterTone.speechStyle,
      userAnswer,
      nextQuestion,
      currentQuestionIndex,
      totalQuestionCount,
      previousMessages,
    }),
  });

  if (!response.ok) {
    throw new Error("GPT 답변 생성에 실패했습니다.");
  }

  const data: CreateCharacterReplyResponse = await response.json();

  return data.message;
};
