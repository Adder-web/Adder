package com.adder.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class SocialLoginRequest {

    @NotBlank
    private String provider;

    @NotBlank
    private String accessToken;
}
