package com.adder.backend.myperfume.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MyPerfumeItemDto {
    private Long myPerfumeId;
    private String perfumeName;
    private String summary;
    private String noteSummary;
    private String characterType;
    private String thumbnailColor;
    private LocalDateTime savedAt;
}
