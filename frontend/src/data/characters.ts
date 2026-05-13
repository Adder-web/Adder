import Homa from "@/assets/character/Homa.png";
import Move from "@/assets/character/Move.png";
import Orion from "@/assets/character/Orion.png";
import Algo from "@/assets/character/Algo.png";

export type CharacterType = "homa" | "move" | "orion" | "algo";

export type Character = {
  id: CharacterType;
  name: string;
  role: string;
  desc: string;
  ment: string;
  img: string;
  gradient: string;
};

export const CHARACTERS: Character[] = [
  {
    id: "homa",
    name: "호마",
    role: "Curiosity Perfumer",
    desc: "호기심 많은 탐험가형 조향사. 예상 밖의 향 조합을 즐겨요.",
    ment: "오, 이 향 재밌겠는걸요?",
    img: Homa,
    gradient: "from-char-bg-1-start to-char-bg-1-end",
  },
  {
    id: "move",
    name: "무브",
    role: "Vibe Perfumer",
    desc: "감각적인 분위기를 읽는 조향사. 느낌 가는 대로 선택해요.",
    ment: "깊게 생각 말고 느낌 가는 대로 가보자!",
    img: Move,
    gradient: "from-char-bg-2-start to-char-bg-2-end",
  },
  {
    id: "orion",
    name: "오리온",
    role: "Balance Perfumer",
    desc: "차분하게 감정을 정리해주는 균형 조향사.",
    ment: "천천히 생각해도 괜찮아요.",
    img: Orion,
    gradient: "from-char-bg-3-start to-char-bg-3-end",
  },
  {
    id: "algo",
    name: "알고",
    role: "Algorithm Perfumer",
    desc: "향을 구조적으로 분석하는 조향사. 단계별로 설계해요.",
    ment: "포근함을 선호하시나요?",
    img: Algo,
    gradient: "from-char-bg-4-start to-char-bg-4-end",
  },
];
