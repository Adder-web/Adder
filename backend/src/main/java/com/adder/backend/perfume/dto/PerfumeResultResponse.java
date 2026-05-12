package com.adder.backend.perfume.dto;

import java.util.List;

public class PerfumeResultResponse {

    private Long resultId;
    private String date;
    private String characterType;
    private String englishName;
    private String koreanName;
    private String summary;
    private List<String> moods;
    private Perfumer perfumer;
    private List<ScentNote> notes;
    private List<ScentBalance> balance;
    private List<String> keywords;

    public Long getResultId() {
        return resultId;
    }

    public void setResultId(Long resultId) {
        this.resultId = resultId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCharacterType() {
        return characterType;
    }

    public void setCharacterType(String characterType) {
        this.characterType = characterType;
    }

    public String getEnglishName() {
        return englishName;
    }

    public void setEnglishName(String englishName) {
        this.englishName = englishName;
    }

    public String getKoreanName() {
        return koreanName;
    }

    public void setKoreanName(String koreanName) {
        this.koreanName = koreanName;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getMoods() {
        return moods;
    }

    public void setMoods(List<String> moods) {
        this.moods = moods;
    }

    public Perfumer getPerfumer() {
        return perfumer;
    }

    public void setPerfumer(Perfumer perfumer) {
        this.perfumer = perfumer;
    }

    public List<ScentNote> getNotes() {
        return notes;
    }

    public void setNotes(List<ScentNote> notes) {
        this.notes = notes;
    }

    public List<ScentBalance> getBalance() {
        return balance;
    }

    public void setBalance(List<ScentBalance> balance) {
        this.balance = balance;
    }

    public List<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }

    public static class Perfumer {
        private String name;
        private String role;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class ScentNote {
        private String type;
        private String name;
        private String description;
        private int ratio;
        private String color;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public int getRatio() {
            return ratio;
        }

        public void setRatio(int ratio) {
            this.ratio = ratio;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }
    }

    public static class ScentBalance {
        private String label;
        private int value;

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public int getValue() {
            return value;
        }

        public void setValue(int value) {
            this.value = value;
        }
    }
}