package com.adder.backend.perfume.service;

import com.adder.backend.perfume.dto.PerfumeChatResponse;
import com.openai.client.OpenAIClient;
import com.openai.models.ChatModel;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PerfumeChatService {

    private final OpenAIClient openAIClient;

    public PerfumeChatResponse chat(String userMessage, String characterName) {
        String selectedCharacterName = characterName == null || characterName.isBlank()
                ? "Adder"
                : characterName;

        String prompt = """
                너는 'Adder'라는 AI 조향사 서비스의 향수 추천 어시스턴트야.

                현재 사용자가 대화 중인 캐릭터 이름:
                %s

                서비스 컨셉:
                - 사용자가 AI와 대화하며 자신만의 향을 설계한다.
                - 설문지가 아니라 자연스러운 채팅 경험이 중요하다.
                - 결과는 향료 조합, 비율, 향의 분위기, 추천 이유로 정리한다.
                - 톤은 차분하고 세련되며, 고급 실험실 같은 느낌이다.

                응답 규칙:
                1. 사용자의 감정, 상황, 취향을 바탕으로 향을 제안한다.
                2. 너무 길게 설명하지 말고, 채팅 UI에 들어가기 좋은 문장으로 답한다.
                3. 필요하면 향료 조합과 비율을 제안한다.
                4. 향료 비율을 제안할 때는 전체 합이 100%%가 되도록 한다.
                5. 마지막에는 사용자가 다음 대화를 이어갈 수 있도록 질문을 하나 던진다.

                사용자 메시지:
                %s
                """.formatted(selectedCharacterName, userMessage);

        ResponseCreateParams params = ResponseCreateParams.builder()
                .model(ChatModel.GPT_5_2)
                .input(prompt)
                .build();

        Response response = openAIClient.responses().create(params);

        String answer = response.output().stream()
                .flatMap(outputItem -> outputItem.message().stream())
                .flatMap(message -> message.content().stream())
                .flatMap(content -> content.outputText().stream())
                .map(outputText -> outputText.text())
                .findFirst()
                .orElse("응답을 생성하지 못했어요. 다시 시도해 주세요.");

        return new PerfumeChatResponse(answer);
    }
}