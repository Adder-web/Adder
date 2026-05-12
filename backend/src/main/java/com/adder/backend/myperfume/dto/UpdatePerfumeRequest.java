package com.adder.backend.myperfume.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UpdatePerfumeRequest {
    @NotBlank(message = "향수명을 입력해주세요.")
    private String customName;
}
