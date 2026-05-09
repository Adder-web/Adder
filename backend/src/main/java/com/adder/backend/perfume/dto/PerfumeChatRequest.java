package com.adder.backend.perfume.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PerfumeChatRequest {

    @NotBlank(message = "사용자 메시지는 비어 있을 수 없습니다.")
    private String message;
}