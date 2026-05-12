package com.adder.backend.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {
    private Long userId;
    private String nickname;
    private String profileImage;
    private String accessToken;
    private String refreshToken;

    @JsonProperty("isNewUser")
    private boolean newUser;
}
