package com.adder.backend.myperfume.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class MyPageSummaryResponse {
    private long completedPerfumes;
    private long uniqueCharacters;
    private long chatCount;
    private List<CharacterStatDto> topCharacters;
    private Map<String, Integer> heatmap;
}
