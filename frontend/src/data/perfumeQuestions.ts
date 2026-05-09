export type CharacterType = "homa" | "move" | "orion" | "algo";

export type QuestionPhase =
  | "intro"
  | "preChat"
  | "mainChat"
  | "preference"
  | "transition";

export type PerfumeQuestion = {
  id: string;
  phase: QuestionPhase;
  receiptEnabled: boolean;
  question: Record<CharacterType, string>;
  chips: string[];
};

export const PERFUME_QUESTIONS: PerfumeQuestion[] = [
  {
    id: "imageSense",
    phase: "preChat",
    receiptEnabled: false,
    question: {
      homa: "향을 떠올렸을 때, 가장 먼저 다가오는 결은 어떤 쪽에 가까울까요?",
      move: "지금 떠오르는 향 이미지, soft한 쪽이에요 아니면 또렷하게 pop 되는 쪽이에요?",
      orion:
        "그 향의 윤곽을 조용히 바라본다면, 어떤 이미지가 더 선명하게 남나요?",
      algo: "향의 첫 인상을 기준으로 보면, 어떤 이미지 값에 가장 가까운가요?",
    },
    chips: ["부드러움", "선명함", "가변적"],
  },
  {
    id: "noveltyDistance",
    phase: "preChat",
    receiptEnabled: false,
    question: {
      homa: "새로운 향을 만날 때, 어느 정도의 낯섦이 편안하게 느껴지나요?",
      move: "새로운 향은 익숙한 comfort zone이 좋아요, 아니면 살짝 new vibe로 가볼까요?",
      orion: "낯선 향을 마주할 때, 어느 거리감이 가장 안정적으로 느껴지나요?",
      algo: "새로운 향에 대한 선호 범위를 고른다면 어디에 가까울까요?",
    },
    chips: ["익숙함", "적당히", "도전적"],
  },
  {
    id: "usageContext",
    phase: "preChat",
    receiptEnabled: false,
    question: {
      homa: "이 향이 가장 자연스럽게 머물 순간은 언제일까요?",
      move: "이 향, 어디에 데려가면 제일 vibe가 살아날 것 같아요?",
      orion: "이 향이 놓일 장면을 떠올린다면, 어떤 순간에 가까울까요?",
      algo: "사용 빈도가 가장 높을 상황을 기준으로 선택해 주세요.",
    },
    chips: ["일상", "특별", "유동적"],
  },
  {
    id: "questionDepth",
    phase: "preChat",
    receiptEnabled: false,
    question: {
      homa: "오늘은 어떤 깊이로 향을 같이 만져볼까요?",
      move: "오늘은 quick하게 톡톡 고를까요, 아니면 imagination을 좀 더 흔들어볼까요?",
      orion: "오늘의 이야기는 어느 깊이까지 내려가볼까요?",
      algo: "대화의 탐색 깊이를 선택해 주세요.",
    },
    chips: ["직관적", "상상형", "깊게"],
  },
  {
    id: "pace",
    phase: "preChat",
    receiptEnabled: false,
    question: {
      homa: "향을 만드는 속도는 어느 쪽이 편안할까요?",
      move: "향 만드는 tempo는 빠르게 착착, 아니면 slow하게 몽글몽글 갈까요?",
      orion: "향의 윤곽을 어떤 속도로 그려보면 좋을까요?",
      algo: "진행 방식을 선택해 주세요.",
    },
    chips: ["빠르게", "천천히", "자세히"],
  },

  {
    id: "environment",
    phase: "mainChat",
    receiptEnabled: true,
    question: {
      homa: "이 향이 가장 편안하게 머물 공간은 어디일까요?",
      move: "이 향은 어디서 제일 반짝하고 살아날까요? Indoor, outdoor, or both?",
      orion: "이 향을 놓아둘 공간을 떠올린다면 어디에 가까울까요?",
      algo: "주 사용 환경을 선택해 주세요.",
    },
    chips: ["실내에서", "실외에서", "상황에 따라"],
  },
  {
    id: "reason",
    phase: "mainChat",
    receiptEnabled: true,
    question: {
      homa: "이 향을 만들고 싶은 마음은 어디에서 시작됐나요?",
      move: "이 향은 누구를 향해 움직이는 향에 가까워요?",
      orion: "이 향이 필요한 이유를 조용히 들여다보면, 무엇에 가까울까요?",
      algo: "향 제작 목적에 가장 가까운 항목을 선택해 주세요.",
    },
    chips: [
      "나를 위한 향",
      "누군가에게 보여지는 향",
      "기념이나 선물을 위한 향",
    ],
  },
  {
    id: "mood",
    phase: "mainChat",
    receiptEnabled: true,
    question: {
      homa: "이 향을 맡았을 때, 가장 먼저 어떤 기분이 피어났으면 하나요?",
      move: "이 향은 나를 위한 energy예요, 아니면 누군가에게 보여주고 싶은 mood예요?",
      orion: "향의 첫 장면에 남았으면 하는 분위기는 무엇인가요?",
      algo: "향의 주요 무드 값을 선택해 주세요.",
    },
    chips: ["차분한", "생기 있는", "묵직한", "맑은"],
  },
  {
    id: "light",
    phase: "mainChat",
    receiptEnabled: true,
    question: {
      homa: "이 향은 햇빛 아래와 조명 아래 중 어디에서 더 예쁘게 느껴질까요?",
      move: "첫 향이 딱 닿는 순간, 어떤 mood로 켜지면 좋겠어요?",
      orion: "이 향이 가장 잘 보이는 빛은 어떤 빛일까요?",
      algo: "향이 어울릴 조도 환경을 선택해 주세요.",
    },
    chips: ["햇빛 아래", "조명 아래", "둘 다"],
  },
  {
    id: "uniqueness",
    phase: "mainChat",
    receiptEnabled: true,
    question: {
      homa: "이 향은 살짝 눈에 띄는 편이 좋을까요, 자연스럽게 스며드는 편이 좋을까요?",
      move: "이 향은 존재감 있게 pop 되면 좋을까요, 아니면 natural하게 스며들면 좋을까요?",
      orion: "향의 존재 방식은 선명한 편과 은은한 편 중 어디에 가까울까요?",
      algo: "개성의 강도를 선택해 주세요.",
    },
    chips: ["유니크하게", "내추럴하게", "상황에 따라"],
  },

  {
    id: "longevity",
    phase: "preference",
    receiptEnabled: true,
    question: {
      homa: "이 향은 어느 정도 오래 곁에 남았으면 하나요?",
      move: "향의 여운은 살짝 톡 남기고 사라질까요, 아니면 long-lasting하게 반짝이면 좋을까요?",
      orion: "향의 여운은 얼마나 길게 이어지면 좋을까요?",
      algo: "선호하는 지속력을 선택해 주세요.",
    },
    chips: ["금방 사라져도 괜찮아요", "은은하게 오래", "확실하게 오래"],
  },
  {
    id: "temperature",
    phase: "preference",
    receiptEnabled: true,
    question: {
      homa: "이 향은 따뜻한 숨결에 가까울까요, 차가운 공기에 가까울까요?",
      move: "이 향의 temperature는 warm하게 데워질까요, 아니면 cool하게 깨어날까요?",
      orion: "이 향의 온도를 느껴본다면 어디에 가까울까요?",
      algo: "향의 온도감을 선택해 주세요.",
    },
    chips: ["따뜻한", "차가운", "중간"],
  },
  {
    id: "weight",
    phase: "preference",
    receiptEnabled: true,
    question: {
      homa: "향의 존재감은 어느 정도가 편안할까요?",
      move: "이 향은 light하게 통통 튀면 좋을까요, 아니면 조금 더 deep하게 착 붙으면 좋을까요?",
      orion: "향의 무게를 손에 올린다면 어느 정도일까요?",
      algo: "향의 무게감을 선택해 주세요.",
    },
    chips: ["가벼운 편", "적당한 편", "묵직한 편"],
  },
  {
    id: "avoid",
    phase: "preference",
    receiptEnabled: true,
    question: {
      homa: "혹시 피하고 싶은 향이 있다면 편하게 골라주세요. 없다면 넘어가도 괜찮아요.",
      move: "이건 살짝 not my vibe! 싶은 향이 있다면 톡 골라주세요.",
      orion: "향을 만들 때 멀리 두고 싶은 느낌이 있다면 알려주세요.",
      algo: "제외하고 싶은 향의 성격을 선택해 주세요.",
    },
    chips: [
      "너무 달콤한 향",
      "너무 스파이시한 향",
      "너무 인위적인 향",
      "딱히 없어요",
    ],
  },
];
