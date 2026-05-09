import type { CharacterType, PerfumeQuestion } from "../data/perfumeQuestions";

type CreateCharacterReplyParams = {
  character: CharacterType;
  selectedAnswer: string;
  nextQuestion?: PerfumeQuestion;
};

const homaEmpathyTemplates = [
  (answer: string) =>
    `${answer} 쪽으로 느끼셨군요, 그 선택이 오늘의 향을 조금 더 포근하게 만들어줄 것 같아요 🌿`,
  (answer: string) =>
    `${answer}을 골라주셨네요, 좋아요. 이 감각을 조심스럽게 향 안에 담아볼게요 ✨`,
  (answer: string) =>
    `${answer}이라는 느낌, 참 좋아요. 너무 서두르지 않고 부드럽게 이어가볼게요 🫧`,
  (answer: string) =>
    `${answer}에 가까운 마음이군요. 지금의 분위기가 조금씩 향으로 모이고 있어요 🤍`,
];

const moveEmpathyTemplates = [
  (answer: string) =>
    `Oh, ${answer} vibe네요~ 이 방향이면 향이 좀 더 alive하게 움직일 수 있겠어요.`,
  (answer: string) =>
    `${answer}, nice choice! 지금 mood가 꽤 선명하게 잡히고 있어요.`,
  (answer: string) =>
    `오 ${answer}, I love it. 이 감각이면 향이 너무 무겁지 않게 톡 살아날 것 같아요.`,
  (answer: string) =>
    `${answer} 쪽이라면 kinda fresh하게 풀어볼 수 있겠네요. 이 흐름 좋아요.`,
];

const orionEmpathyTemplates = [
  (answer: string) =>
    `${answer}이라는 선택이 오늘의 향에 조용한 장면 하나를 더해주네요.`,
  (answer: string) =>
    `${answer} 쪽으로 기울어진 감각이 향의 윤곽을 조금 더 또렷하게 만들어줍니다.`,
  (answer: string) =>
    `${answer}이라는 말 안에 지금의 공기와 온도가 천천히 남아 있는 것 같아요.`,
  (answer: string) =>
    `${answer}을 선택한 순간, 향의 장면이 조금 더 깊어졌습니다.`,
];

const algoEmpathyTemplates = [
  (answer: string) =>
    `${answer}을 선택하셨으니 이 값을 향 설계 기준에 반영하겠습니다.`,
  (answer: string) =>
    `${answer}으로 입력값을 확인했습니다. 향의 방향성을 이 기준에 맞춰 조정하겠습니다.`,
  (answer: string) =>
    `${answer} 선택으로 현재 선호 축이 조금 더 명확해졌습니다.`,
  (answer: string) =>
    `${answer} 값을 기준으로 다음 향 조합 범위를 좁혀보겠습니다.`,
];

const getRandomTemplate = (
  templates: Array<(answer: string) => string>,
  selectedAnswer: string,
) => {
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex](selectedAnswer);
};

const createEmpathySentence = (
  character: CharacterType,
  selectedAnswer: string,
) => {
  switch (character) {
    case "homa":
      return getRandomTemplate(homaEmpathyTemplates, selectedAnswer);

    case "move":
      return getRandomTemplate(moveEmpathyTemplates, selectedAnswer);

    case "orion":
      return getRandomTemplate(orionEmpathyTemplates, selectedAnswer);

    case "algo":
      return getRandomTemplate(algoEmpathyTemplates, selectedAnswer);

    default:
      return `${selectedAnswer}을 선택해주셨군요.`;
  }
};

export const createCharacterReply = ({
  character,
  selectedAnswer,
  nextQuestion,
}: CreateCharacterReplyParams) => {
  const empathy = createEmpathySentence(character, selectedAnswer);

  if (!nextQuestion) {
    switch (character) {
      case "homa":
        return `${empathy}\n지금까지의 이야기를 바탕으로, 하나의 향을 조심스럽게 그려볼게요 ✨`;

      case "move":
        return `${empathy}\n이제 이 vibe를 바탕으로 final scent를 만들어볼게요.`;

      case "orion":
        return `${empathy}\n지금까지의 장면을 모아 하나의 향으로 옮겨보겠습니다.`;

      case "algo":
        return `${empathy}\n누적된 선택값을 바탕으로 최종 향 레시피를 생성하겠습니다.`;

      default:
        return `${empathy}\n지금까지의 이야기를 바탕으로 하나의 향을 그려볼게요.`;
    }
  }

  const question = nextQuestion.question[character];

  return `${empathy}\n${question}`;
};
