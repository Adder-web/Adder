package com.adder.backend.perfume.service;

import com.adder.backend.perfume.dto.PerfumeChatRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PerfumeChatService {

    private final RestClient restClient;

    @Value("${openai.api.key}")
    private String openAiApiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String openAiModel;

    public PerfumeChatService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.openai.com/v1")
                .build();
    }

    public String createReply(PerfumeChatRequest request) {
        String systemPrompt = createSystemPrompt(request);
        String userPrompt = createUserPrompt(request);

        List<Map<String, String>> messages = new ArrayList<>();

        messages.add(Map.of(
                "role", "system",
                "content", systemPrompt
        ));

        messages.add(Map.of(
                "role", "user",
                "content", userPrompt
        ));

        Map<String, Object> requestBody = Map.of(
                "model", openAiModel,
                "messages", messages,
                "temperature", 0.85,
                "max_tokens", 350
        );

        OpenAiChatResponse response = restClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + openAiApiKey)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(OpenAiChatResponse.class);

        if (
                response == null
                        || response.choices() == null
                        || response.choices().isEmpty()
                        || response.choices().get(0).message() == null
        ) {
            return createFallbackReply(request);
        }

        String answer = response.choices().get(0).message().content();

        if (answer == null || answer.isBlank()) {
            return createFallbackReply(request);
        }

        return answer.trim();
    }

    private String createSystemPrompt(PerfumeChatRequest request) {
        String characterName = getOrDefault(request.getCharacterName(), "AI 조향사");
        String characterDescription = getOrDefault(
                request.getCharacterDescription(),
                "사용자의 취향을 대화로 분석하는 조향사"
        );
        String speechStyle = getOrDefault(
                request.getSpeechStyle(),
                "차분하고 자연스러운 한국어로 답변한다."
        );

        return """
                너는 AI 향수 공방 Adder의 대화형 조향사다.

                현재 캐릭터:
                %s

                캐릭터 설명:
                %s

                캐릭터 말투:
                %s

                서비스 맥락:
                - Adder는 사용자가 AI와 대화하며 자신만의 향을 찾아가는 웹 기반 AI 조향 서비스다.
                - 사용자는 총 5개의 질문에 답한다.
                - 너는 사용자의 답변을 바탕으로 향 취향을 자연스럽게 탐색한다.
                - 사용자가 설문지를 작성하는 느낌이 아니라, 조향사와 대화하는 느낌을 받아야 한다.

                응답 규칙:
                1. 반드시 한국어로 답변한다.
                2. 사용자의 답변에 먼저 1~2문장 정도 공감하거나 해석한다.
                3. 그 다음 nextQuestion을 자연스럽게 이어서 질문한다.
                4. nextQuestion의 의미는 유지하되, 캐릭터 말투에 맞게 문장을 부드럽게 바꿔도 된다.
                5. 매번 같은 문장 구조를 반복하지 않는다.
                6. 답변은 2~4문장 정도로 짧게 작성한다.
                7. 향수명, 최종 향기명, 구체적인 완성 결과를 직접 공개하지 않는다.
                8. 사용자의 취향을 너무 단정하지 않는다.
                9. "당신은 ~한 사람입니다"처럼 성격을 확정하지 않는다.
                10. 향료명이나 노트명을 과하게 직접적으로 나열하지 않는다.
                11. 분석 중인 느낌은 줄 수 있지만, 결과를 미리 확정하지 않는다.
                12. 질문이 모두 끝났다면 추가 질문을 하지 말고, 결과 화면에서 완성된 향을 확인할 수 있다고 안내한다.

                금지 표현:
                - "최종 향수명은"
                - "당신의 향은"
                - "완성된 향은"
                - "결과는"
                - "정답은"

                좋은 답변 예시:
                - "그 장면은 꽤 부드럽고 선명하게 느껴져요. 아직 이름 붙이긴 이르지만, 향의 방향이 조금씩 잡히고 있어요. 그 향을 떠올렸을 때 가장 먼저 생각나는 장소는 어디인가요?"
                - "좋아요, 그 감정은 향으로 바꿨을 때 은은한 중심이 될 수 있어요. 조금 더 선명하게 보기 위해, 그 순간의 공기나 장소를 떠올려볼까요?"
                """.formatted(characterName, characterDescription, speechStyle);
    }

    private String createUserPrompt(PerfumeChatRequest request) {
        String userMessage = getOrDefault(request.getUserMessage(), "");
        String nextQuestion = request.getNextQuestion();

        int currentQuestionIndex = request.getCurrentQuestionIndex() == null
                ? 0
                : request.getCurrentQuestionIndex();

        int totalQuestionCount = request.getTotalQuestionCount() == null
                ? 5
                : request.getTotalQuestionCount();

        String progress = (currentQuestionIndex + 1) + "/" + totalQuestionCount;

        String previousMessages = buildPreviousMessagesText(request.getPreviousMessages());

        String nextQuestionText = nextQuestion == null || nextQuestion.isBlank()
                ? "모든 질문이 끝났습니다. 추가 질문 없이 결과 화면으로 이동할 수 있도록 짧게 마무리해주세요."
                : nextQuestion;

        return """
                현재 진행도:
                %s

                사용자의 이번 답변:
                %s

                다음 질문:
                %s

                이전 대화:
                %s

                작성 방식:
                - 사용자의 이번 답변을 먼저 1~2문장으로 공감하거나 해석한다.
                - 그 다음 다음 질문을 자연스럽게 이어간다.
                - 캐릭터 말투를 반드시 반영한다.
                - 너무 길게 설명하지 않는다.
                - 완성된 향기명이나 최종 결과는 공개하지 않는다.
                """.formatted(progress, userMessage, nextQuestionText, previousMessages);
    }

    private String buildPreviousMessagesText(List<PerfumeChatRequest.ChatMessageDto> previousMessages) {
        if (previousMessages == null || previousMessages.isEmpty()) {
            return "이전 대화 없음";
        }

        StringBuilder builder = new StringBuilder();

        for (PerfumeChatRequest.ChatMessageDto message : previousMessages) {
            if (message == null) {
                continue;
            }

            String role = getOrDefault(message.getRole(), "unknown");
            String content = getOrDefault(message.getContent(), "");

            if (content.isBlank()) {
                continue;
            }

            builder.append(role)
                    .append(": ")
                    .append(content)
                    .append("\\n");
        }

        String result = builder.toString().trim();

        return result.isBlank() ? "이전 대화 없음" : result;
    }

    private String createFallbackReply(PerfumeChatRequest request) {
        String nextQuestion = request.getNextQuestion();

        if (nextQuestion == null || nextQuestion.isBlank()) {
            return "좋아요. 지금까지의 답변만으로도 향의 방향이 조금씩 선명해졌어요. 이제 결과에서 완성된 향을 확인해볼 수 있어요.";
        }

        return "좋아요. 답변 속에서 취향의 단서가 조금씩 보이고 있어요. " + nextQuestion;
    }

    private String getOrDefault(String value, String defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }

        return value;
    }

    private record OpenAiChatResponse(
            List<Choice> choices
    ) {
    }

    private record Choice(
            Message message
    ) {
    }

    private record Message(
            String role,
            String content
    ) {
    }
}