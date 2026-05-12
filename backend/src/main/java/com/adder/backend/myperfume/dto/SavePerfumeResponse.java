package com.adder.backend.myperfume.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SavePerfumeResponse {
    private Long myPerfumeId;
    private String perfumeName;
    private LocalDateTime savedAt;
}
