import type { CharacterType } from "./perfumeQuestions";
import type { PerfumeResultResponse } from "../api/perfumeApi";

import AlgoImage from "../assets/character/Algo.png";
import HomaImage from "../assets/character/Homa.png";
import MoveImage from "../assets/character/Move.png";
import OrionImage from "../assets/character/Orion.png";

export type ScentResultData = PerfumeResultResponse & {
  perfumer: PerfumeResultResponse["perfumer"] & {
    image: string;
  };
};

export const characterImageMap: Record<CharacterType, string> = {
  algo: AlgoImage,
  homa: HomaImage,
  move: MoveImage,
  orion: OrionImage,
};

export function withCharacterImage(
  result: PerfumeResultResponse,
): ScentResultData {
  return {
    ...result,
    perfumer: {
      ...result.perfumer,
      image: characterImageMap[result.characterType] ?? HomaImage,
    },
  };
}

export const scentResultData: ScentResultData = {
  date: "2025.03.14",
  characterType: "homa",

  englishName: "Rainy Library",
  koreanName: "비 오는 날의 서재",

  summary:
    "우디 · 페트리코르 · 바닐라 — 편안하고 감성적인 향\n호마가 당신의 기억을 따라 조향했어요",

  moods: ["편안함", "감성적", "고요함"],

  perfumer: {
    name: "호마",
    role: "Curiosity Perfumer",
    image: HomaImage,
  },

  notes: [
    {
      type: "Top Note",
      name: "페트리코르",
      description: "비 온 뒤 흙과 공기의 냄새 · 신선하고 차가운 느낌",
      ratio: 62,
      color: "mint",
    },
    {
      type: "Middle Note",
      name: "시더우드",
      description: "따뜻한 나무 향 · 안정적이고 깊은 베이스",
      ratio: 76,
      color: "purple",
    },
    {
      type: "Base Note",
      name: "바닐라 머스크",
      description: "부드럽고 따뜻한 잔향 · 감성적인 마무리",
      ratio: 48,
      color: "yellow",
    },
  ],

  balance: [
    { label: "우디", value: 86 },
    { label: "프레시", value: 68 },
    { label: "스위트", value: 56 },
    { label: "플로럴", value: 45 },
    { label: "머스키", value: 74 },
  ],

  keywords: [
    "고요함",
    "감성적",
    "편안함",
    "잔잔함",
    "따뜻함",
    "오후",
    "책냄새",
    "비",
  ],
};
