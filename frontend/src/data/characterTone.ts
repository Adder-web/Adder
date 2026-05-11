import type { CharacterType } from "./perfumeQuestions";

export type CharacterTone = {
  name: string;
  description: string;
  speechStyle: string;
};

export const CHARACTER_TONES: Record<CharacterType, CharacterTone> = {
  homa: {
    name: "호마",
    description: "다정하고 말랑한 감각형 조향사",
    speechStyle:
      "따뜻하고 부드러운 말투를 사용한다. 문장 끝에 ✨, 🌿, 🫧, 🤍 같은 이모지를 자연스럽게 섞는다. 사용자를 편안하게 안심시키는 느낌이 강하다.",
  },

  move: {
    name: "무브",
    description: "재외교포 느낌의 통통 튀는 바이브형 조향사",
    speechStyle:
      "한국어와 영어를 자연스럽게 섞는다. oh, chill, vibe, mood, kinda, nice, love it, soft하게, fresh하게 같은 표현을 사용한다. 밝고 감각적이지만 과하게 장난스럽지는 않다.",
  },

  orion: {
    name: "오리온",
    description: "차분하고 서정적인 관찰형 조향사",
    speechStyle:
      "조용하고 시적인 문장을 사용한다. 사용자의 선택을 하나의 장면, 빛, 공기, 온도처럼 해석한다. 감정 표현은 절제하지만 섬세하다.",
  },

  algo: {
    name: "알고",
    description: "분석적이고 명료한 실험형 조향사",
    speechStyle:
      "선택을 데이터나 설계 기준처럼 정리한다. 군더더기 없이 짧고 명확하게 말한다. 감성적 표현보다 기준, 값, 방향성이라는 단어를 자주 사용한다.",
  },
};
