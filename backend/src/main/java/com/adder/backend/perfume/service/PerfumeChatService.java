package com.adder.backend.perfume.service;

import com.adder.backend.perfume.dto.PerfumeChatRequest;
import com.adder.backend.perfume.dto.PerfumeResultRequest;
import com.adder.backend.perfume.dto.PerfumeResultResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PerfumeChatService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

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

    public PerfumeResultResponse createResult(PerfumeResultRequest request) {
        String characterType = normalizeCharacterType(request.getCharacterType());
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

        String systemPrompt = createResultSystemPrompt();
        String userPrompt = createResultUserPrompt(
                today,
                characterType,
                request.getMessages()
        );

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
                "temperature", 0.75,
                "max_tokens", 1200
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
            return createFallbackResult(today, characterType);
        }

        String content = response.choices().get(0).message().content();

        if (content == null || content.isBlank()) {
            return createFallbackResult(today, characterType);
        }

        try {
            String json = extractJson(content);
            PerfumeResultResponse result = objectMapper.readValue(json, PerfumeResultResponse.class);

            if (result.getCharacterType() == null || result.getCharacterType().isBlank()) {
                result.setCharacterType(characterType);
            }

            if (result.getDate() == null || result.getDate().isBlank()) {
                result.setDate(today);
            }

            PerfumeResultResponse.Perfumer perfumer = new PerfumeResultResponse.Perfumer();
            perfumer.setName(getPerfumerName(characterType));
            perfumer.setRole(getPerfumerRole(characterType));
            result.setPerfumer(perfumer);

            if (result.getSummary() != null && !result.getSummary().isBlank()) {
                result.setSummary(fixPerfumerNameInSummary(result.getSummary(), characterType));
            }

            return result;
        } catch (Exception e) {
            return createFallbackResult(today, characterType);
        }
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
                13. 마지막 질문이 '빼고 싶은 향/피하고 싶은 향'에 대한 답변이라면, 사용자가 말한 향을 포함할 것처럼 말하지 않는다.
                14. 마지막 질문에서는 그 향을 제외하는 선택이 향의 방향을 더 선명하게 만든다는 식으로 긍정적으로 공감한다.

                금지 표현:
                - "최종 향수명은"
                - "당신의 향은"
                - "완성된 향은"
                - "결과는"
                - "정답은"
                - 마지막 질문에서 "그 향을 살려볼게요"
                - 마지막 질문에서 "그 향을 중심에 둘게요"
                - 마지막 질문에서 "그 향이 잘 어울려요"
                - 마지막 질문에서 "그 향을 더해볼게요"
                - 마지막 질문에서 "그 향을 포함해볼게요"

                좋은 답변 예시:
                - "그 장면은 꽤 부드럽고 선명하게 느껴져요. 아직 이름 붙이긴 이르지만, 향의 방향이 조금씩 잡히고 있어요. 그 향을 떠올렸을 때 가장 먼저 생각나는 장소는 어디인가요?"
                - "좋아요, 그 감정은 향으로 바꿨을 때 은은한 중심이 될 수 있어요. 조금 더 선명하게 보기 위해, 그 순간의 공기나 장소를 떠올려볼까요?"
                - "좋아요, 그 향을 덜어내는 건 전체 분위기를 더 맑고 선명하게 만드는 좋은 선택이에요. 그 부분은 비워두고, 지금까지의 답변을 바탕으로 향의 균형을 정리해볼게요. 이제 결과에서 완성된 향을 확인해볼 수 있어요."
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

        boolean isLastQuestion = currentQuestionIndex + 1 >= totalQuestionCount;

        String previousMessages = buildPreviousMessagesText(request.getPreviousMessages());

        String nextQuestionText = nextQuestion == null || nextQuestion.isBlank()
                ? "모든 질문이 끝났습니다. 추가 질문 없이 결과 화면으로 이동할 수 있도록 짧게 마무리해주세요."
                : nextQuestion;

        String situationGuide = isLastQuestion
                ? """
                현재 질문은 마지막 질문이다.
                마지막 질문의 목적은 사용자가 '넣고 싶은 향'이 아니라 '빼고 싶은 향/피하고 싶은 향/선호하지 않는 향'을 말하도록 하는 것이다.

                마지막 질문 응답 규칙:
                - 사용자의 이번 답변을 '추가할 향'이 아니라 '제외할 향'으로 해석한다.
                - 사용자가 말한 향을 포함할 것처럼 말하지 않는다.
                - "그 향을 살려볼게요", "그 향을 중심에 둘게요", "그 향이 잘 어울려요", "그 향을 더해볼게요", "그 향을 포함해볼게요" 같은 표현을 쓰지 않는다.
                - 사용자가 피하고 싶은 향을 알려준 것은 좋은 선택이라는 느낌으로 공감한다.
                - 해당 향을 덜어내면 전체 향이 더 선명해지거나, 부담스럽지 않아지거나, 사용자의 취향에 더 가까워진다는 식으로 말한다.
                - 마지막이므로 추가 질문을 하지 않는다.
                - 결과 화면에서 완성된 향을 확인할 수 있다고 자연스럽게 안내한다.

                마지막 질문 좋은 답변 예시:
                - "좋아요, 그 향을 덜어내는 건 전체 분위기를 더 맑고 선명하게 만드는 좋은 선택이에요. 그 부분은 비워두고, 지금까지의 답변을 바탕으로 향의 균형을 정리해볼게요. 이제 결과에서 완성된 향을 확인해볼 수 있어요."
                - "그 향을 피하고 싶다고 알려준 건 아주 좋아요. 덕분에 향이 과하게 무거워지지 않도록 더 담백한 방향으로 정리할 수 있어요. 이제 결과에서 완성된 향을 확인해볼 수 있어요."
                - "좋아요, 그 부분을 빼두면 향이 훨씬 더 편안하고 자연스럽게 느껴질 수 있어요. 지금까지의 취향을 바탕으로 균형을 맞춰볼게요. 이제 결과에서 완성된 향을 확인해볼 수 있어요."
                """
                : """
                현재 질문은 일반 취향 탐색 질문이다.

                일반 질문 응답 규칙:
                - 사용자의 이번 답변을 먼저 1~2문장으로 공감하거나 해석한다.
                - 그 다음 다음 질문을 자연스럽게 이어간다.
                - 사용자가 말한 감정, 장소, 분위기를 향의 방향성으로 부드럽게 연결한다.
                - 아직 최종 결과를 확정하지 않는다.
                """;

        return """
                현재 진행도:
                %s

                마지막 질문 여부:
                %s

                사용자의 이번 답변:
                %s

                다음 질문:
                %s

                이전 대화:
                %s

                상황별 작성 규칙:
                %s

                공통 작성 방식:
                - 캐릭터 말투를 반드시 반영한다.
                - 너무 길게 설명하지 않는다.
                - 답변은 2~4문장 정도로 작성한다.
                - 완성된 향기명이나 최종 결과는 공개하지 않는다.
                - 사용자의 취향을 너무 단정하지 않는다.
                """.formatted(
                progress,
                isLastQuestion ? "true" : "false",
                userMessage,
                nextQuestionText,
                previousMessages,
                situationGuide
        );
    }

    private String createResultSystemPrompt() {
        return """
                너는 AI 향수 공방 Adder의 결과 화면을 설계하는 AI 조향사다.

                역할:
                - 사용자와 AI 조향사가 나눈 대화를 분석한다.
                - 대화 속 장소, 감정, 색감, 계절감, 분위기, 취향을 향수 결과 데이터로 변환한다.
                - 프론트엔드 결과 화면에서 바로 사용할 수 있는 JSON만 생성한다.

                매우 중요한 출력 규칙:
                - 반드시 JSON 객체만 응답한다.
                - markdown 코드블럭을 절대 쓰지 않는다.
                - 설명 문장, 주석, 앞뒤 안내문을 절대 붙이지 않는다.
                - JSON 밖에 어떤 텍스트도 쓰지 않는다.
                """;
    }

    private String createResultUserPrompt(
            String today,
            String characterType,
            List<PerfumeResultRequest.MessageDto> messages
    ) {
        String perfumerName = getPerfumerName(characterType);
        String perfumerRole = getPerfumerRole(characterType);
        String conversation = buildResultConversationText(messages);

        return """
                아래 대화를 바탕으로 향수 결과 화면용 JSON을 생성해라.

                [캐릭터 정보]
                characterType: %s
                perfumer.name: %s
                perfumer.role: %s

                [대화 내용]
                %s

                [필드 작성 규칙]
                1. date는 "%s"를 그대로 사용한다.
                2. characterType은 "%s"를 그대로 사용한다.
                3. englishName은 감성적인 영어 향수 이름으로 작성한다.
                4. koreanName은 englishName과 어울리는 한국어 향 이름으로 작성한다.
                5. summary는 2줄 정도로 작성한다. 줄바꿈은 \\n으로 넣는다.
                6. moods는 사용자의 감정/분위기를 나타내는 한국어 단어 3개만 작성한다.
                7. perfumer.name은 "%s"를 그대로 사용한다.
                8. perfumer.role은 "%s"를 그대로 사용한다.
                9. notes는 반드시 3개만 작성한다.
                10. notes[0].type은 "Top Note"로 작성한다.
                11. notes[1].type은 "Middle Note"로 작성한다.
                12. notes[2].type은 "Base Note"로 작성한다.
                13. notes.color는 각각 "mint", "purple", "yellow" 중 하나만 사용한다.
                14. notes.ratio는 0 이상 100 이하 숫자로 작성한다.
                15. balance는 반드시 "우디", "프레시", "스위트", "플로럴", "머스키" 5개를 포함한다.
                16. balance.value는 0 이상 100 이하 숫자로 작성한다.
                17. keywords는 한국어 단어 6개 이상 8개 이하로 작성한다.
                18. 향료명은 너무 전문적으로만 쓰지 말고 사용자의 기억과 연결되는 단어를 섞어라.
                19. 결과는 너무 과장하지 말고, 차분하고 세련된 톤으로 작성한다.
                20. 마지막 대화에서 사용자가 '빼고 싶은 향/피하고 싶은 향'으로 말한 향은 중심 노트로 넣지 않는다.
                21. 사용자가 피하고 싶다고 말한 향은 notes.name에 그대로 넣지 않는다.

                [반드시 아래 JSON 구조와 key를 그대로 사용]
                {
                  "date": "%s",
                  "characterType": "%s",
                  "englishName": "Rainy Library",
                  "koreanName": "비 오는 날의 서재",
                  "summary": "우디 · 페트리코르 · 바닐라 — 편안하고 감성적인 향\\n%s가 당신의 기억을 따라 조향했어요",
                  "moods": ["편안함", "감성적", "고요함"],
                  "perfumer": {
                    "name": "%s",
                    "role": "%s"
                  },
                  "notes": [
                    {
                      "type": "Top Note",
                      "name": "페트리코르",
                      "description": "비 온 뒤 흙과 공기의 냄새 · 신선하고 차가운 느낌",
                      "ratio": 62,
                      "color": "mint"
                    },
                    {
                      "type": "Middle Note",
                      "name": "시더우드",
                      "description": "따뜻한 나무 향 · 안정적이고 깊은 베이스",
                      "ratio": 76,
                      "color": "purple"
                    },
                    {
                      "type": "Base Note",
                      "name": "바닐라 머스크",
                      "description": "부드럽고 따뜻한 잔향 · 감성적인 마무리",
                      "ratio": 48,
                      "color": "yellow"
                    }
                  ],
                  "balance": [
                    { "label": "우디", "value": 86 },
                    { "label": "프레시", "value": 68 },
                    { "label": "스위트", "value": 56 },
                    { "label": "플로럴", "value": 45 },
                    { "label": "머스키", "value": 74 }
                  ],
                  "keywords": ["고요함", "감성적", "편안함", "잔잔함", "따뜻함", "오후", "책냄새", "비"]
                }
                """.formatted(
                characterType,
                perfumerName,
                perfumerRole,
                conversation,
                today,
                characterType,
                perfumerName,
                perfumerRole,
                today,
                characterType,
                perfumerName,
                perfumerName,
                perfumerRole
        );
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

    private String buildResultConversationText(List<PerfumeResultRequest.MessageDto> messages) {
        if (messages == null || messages.isEmpty()) {
            return "대화 내용 없음";
        }

        StringBuilder builder = new StringBuilder();

        for (PerfumeResultRequest.MessageDto message : messages) {
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

        return result.isBlank() ? "대화 내용 없음" : result;
    }

    private String extractJson(String content) {
        String cleaned = content.trim();

        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.replaceFirst("```json", "").trim();
        }

        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("```", "").trim();
        }

        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3).trim();
        }

        int start = cleaned.indexOf("{");
        int end = cleaned.lastIndexOf("}");

        if (start >= 0 && end >= start) {
            return cleaned.substring(start, end + 1);
        }

        return cleaned;
    }

    private PerfumeResultResponse createFallbackResult(String today, String characterType) {
        String perfumerName = getPerfumerName(characterType);
        String perfumerRole = getPerfumerRole(characterType);

        PerfumeResultResponse result = new PerfumeResultResponse();
        result.setDate(today);
        result.setCharacterType(characterType);
        result.setEnglishName("Rainy Library");
        result.setKoreanName("비 오는 날의 서재");
        result.setSummary("우디 · 페트리코르 · 바닐라 — 편안하고 감성적인 향\n" + perfumerName + "가 당신의 기억을 따라 조향했어요");
        result.setMoods(List.of("편안함", "감성적", "고요함"));

        PerfumeResultResponse.Perfumer perfumer = new PerfumeResultResponse.Perfumer();
        perfumer.setName(perfumerName);
        perfumer.setRole(perfumerRole);
        result.setPerfumer(perfumer);

        PerfumeResultResponse.ScentNote topNote = new PerfumeResultResponse.ScentNote();
        topNote.setType("Top Note");
        topNote.setName("페트리코르");
        topNote.setDescription("비 온 뒤 흙과 공기의 냄새 · 신선하고 차가운 느낌");
        topNote.setRatio(62);
        topNote.setColor("mint");

        PerfumeResultResponse.ScentNote middleNote = new PerfumeResultResponse.ScentNote();
        middleNote.setType("Middle Note");
        middleNote.setName("시더우드");
        middleNote.setDescription("따뜻한 나무 향 · 안정적이고 깊은 베이스");
        middleNote.setRatio(76);
        middleNote.setColor("purple");

        PerfumeResultResponse.ScentNote baseNote = new PerfumeResultResponse.ScentNote();
        baseNote.setType("Base Note");
        baseNote.setName("바닐라 머스크");
        baseNote.setDescription("부드럽고 따뜻한 잔향 · 감성적인 마무리");
        baseNote.setRatio(48);
        baseNote.setColor("yellow");

        result.setNotes(List.of(topNote, middleNote, baseNote));

        PerfumeResultResponse.ScentBalance woody = new PerfumeResultResponse.ScentBalance();
        woody.setLabel("우디");
        woody.setValue(86);

        PerfumeResultResponse.ScentBalance fresh = new PerfumeResultResponse.ScentBalance();
        fresh.setLabel("프레시");
        fresh.setValue(68);

        PerfumeResultResponse.ScentBalance sweet = new PerfumeResultResponse.ScentBalance();
        sweet.setLabel("스위트");
        sweet.setValue(56);

        PerfumeResultResponse.ScentBalance floral = new PerfumeResultResponse.ScentBalance();
        floral.setLabel("플로럴");
        floral.setValue(45);

        PerfumeResultResponse.ScentBalance musky = new PerfumeResultResponse.ScentBalance();
        musky.setLabel("머스키");
        musky.setValue(74);

        result.setBalance(List.of(woody, fresh, sweet, floral, musky));
        result.setKeywords(List.of("고요함", "감성적", "편안함", "잔잔함", "따뜻함", "오후", "책냄새", "비"));

        return result;
    }

    private String createFallbackReply(PerfumeChatRequest request) {
        String nextQuestion = request.getNextQuestion();

        int currentQuestionIndex = request.getCurrentQuestionIndex() == null
                ? 0
                : request.getCurrentQuestionIndex();

        int totalQuestionCount = request.getTotalQuestionCount() == null
                ? 5
                : request.getTotalQuestionCount();

        boolean isLastQuestion = currentQuestionIndex + 1 >= totalQuestionCount;

        if (isLastQuestion) {
            return "좋아요. 그 향을 덜어내는 건 전체 분위기를 더 편안하고 선명하게 만드는 좋은 선택이에요. 그 부분은 비워두고, 지금까지의 답변을 바탕으로 향의 균형을 정리해볼게요. 이제 결과에서 완성된 향을 확인해볼 수 있어요.";
        }

        if (nextQuestion == null || nextQuestion.isBlank()) {
            return "좋아요. 지금까지의 답변만으로도 향의 방향이 조금씩 선명해졌어요. 이제 결과에서 완성된 향을 확인해볼 수 있어요.";
        }

        return "좋아요. 답변 속에서 취향의 단서가 조금씩 보이고 있어요. " + nextQuestion;
    }

    private String normalizeCharacterType(String characterType) {
        if (characterType == null || characterType.isBlank()) {
            return "homa";
        }

        String normalized = characterType.toLowerCase();

        return switch (normalized) {
            case "homa", "move", "orion", "algo" -> normalized;
            default -> "homa";
        };
    }

    private String getPerfumerName(String characterType) {
        return switch (characterType) {
            case "algo" -> "알고";
            case "orion" -> "오리온";
            case "move" -> "무브";
            case "homa" -> "호마";
            default -> "호마";
        };
    }

    private String getPerfumerRole(String characterType) {
        return switch (characterType) {
            case "algo" -> "Logical Perfumer";
            case "orion" -> "Intuitive Perfumer";
            case "move" -> "Vibe Perfumer";
            case "homa" -> "Curiosity Perfumer";
            default -> "Curiosity Perfumer";
        };
    }

    private String fixPerfumerNameInSummary(String summary, String characterType) {
        String correctPerfumerName = getPerfumerName(characterType);

        return summary
                .replace("호마가 당신의 기억을 따라 조향했어요", correctPerfumerName + "가 당신의 기억을 따라 조향했어요")
                .replace("무브가 당신의 기억을 따라 조향했어요", correctPerfumerName + "가 당신의 기억을 따라 조향했어요")
                .replace("오리온이 당신의 기억을 따라 조향했어요", correctPerfumerName + "이 당신의 기억을 따라 조향했어요")
                .replace("알고가 당신의 기억을 따라 조향했어요", correctPerfumerName + "가 당신의 기억을 따라 조향했어요");
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