package com.adder.backend.perfume.dto;

import java.util.List;

public class PerfumeChatRequest {

    private String userMessage;

    private String characterId;
    private String characterName;
    private String characterDescription;
    private String speechStyle;

    private Integer currentQuestionIndex;
    private Integer totalQuestionCount;

    private String nextQuestion;

    private List<ChatMessageDto> previousMessages;

    public PerfumeChatRequest() {
    }

    public String getUserMessage() {
        return userMessage;
    }

    public String getCharacterId() {
        return characterId;
    }

    public String getCharacterName() {
        return characterName;
    }

    public String getCharacterDescription() {
        return characterDescription;
    }

    public String getSpeechStyle() {
        return speechStyle;
    }

    public Integer getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public Integer getTotalQuestionCount() {
        return totalQuestionCount;
    }

    public String getNextQuestion() {
        return nextQuestion;
    }

    public List<ChatMessageDto> getPreviousMessages() {
        return previousMessages;
    }

    public static class ChatMessageDto {
        private String role;
        private String content;

        public ChatMessageDto() {
        }

        public String getRole() {
            return role;
        }

        public String getContent() {
            return content;
        }
    }
}