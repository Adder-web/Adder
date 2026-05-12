package com.adder.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SignupRequest {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6, message = "비밀번호는 6자 이상이어야 합니다.")
    private String password;

    private boolean agreeTerms;
    private boolean agreePrivacy;
    private boolean agreeAiData;
}
