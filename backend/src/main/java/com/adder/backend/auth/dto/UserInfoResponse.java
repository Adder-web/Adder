package com.adder.backend.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserInfoResponse {
    private Long userId;
    private String nickname;
    private String profileImage;
}
