export type CharacterType = "homa" | "move" | "orion" | "algo";

export type PerfumeQuestion = {
  id: number;
  question: string;
};

export const PERFUME_QUESTIONS: PerfumeQuestion[] = [
  {
    id: 1,
    question: "오늘 만들고 싶은 향은 어떤 분위기였으면 좋겠나요?",
  },
  {
    id: 2,
    question: "그 향을 뿌리고 싶은 순간이나 장소가 있다면 알려주세요.",
  },
  {
    id: 3,
    question: "좋아하는 계절, 날씨, 장면이 있다면 자유롭게 말해주세요.",
  },
  {
    id: 4,
    question:
      "선호하는 향의 느낌은 가볍고 산뜻한 쪽인가요, 깊고 묵직한 쪽인가요?",
  },
  {
    id: 5,
    question:
      "마지막으로 피하고 싶은 향이나 불편하게 느끼는 향이 있다면 알려주세요.",
  },
];

export const TOTAL_QUESTION_COUNT = PERFUME_QUESTIONS.length;
