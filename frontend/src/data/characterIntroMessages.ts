import type { CharacterType } from "./perfumeQuestions";

export const CHARACTER_INTRO_MESSAGES: Record<CharacterType, string> = {
  homa: `000님, 오늘은 어떤 느낌을 향으로 남기고 싶으신가요?

말로 설명하지 않아도 괜찮아요.
떠오르는 이미지를 하나씩 같이 정리해볼게요.`,

  move: `000님, 오늘의 감각을 향으로 움직여볼까요?

정확한 문장이 아니어도 괜찮아요.
가까운 느낌부터 하나씩 잡아볼게요.`,

  orion: `000님, 오늘 마음에 남은 장면을 향으로 옮겨볼게요.

천천히 떠올려도 괜찮아요.
흐릿한 이미지부터 함께 정리해보겠습니다.`,

  algo: `000님, 오늘 만들 향의 기준값을 함께 설정해볼게요.

명확하지 않아도 괜찮습니다.
선택과 대화를 바탕으로 향의 방향을 구성하겠습니다.`,
};
