type PerfumeChatRequest = {
  message: string;
  characterName: string;
};

type PerfumeChatResponse = {
  answer: string;
};

export const sendPerfumeChat = async (
  message: string,
  characterName: string,
): Promise<PerfumeChatResponse> => {
  const response = await fetch("http://localhost:8080/api/perfume/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      characterName,
    } satisfies PerfumeChatRequest),
  });

  if (!response.ok) {
    throw new Error("AI 응답을 불러오지 못했습니다.");
  }

  return response.json();
};
