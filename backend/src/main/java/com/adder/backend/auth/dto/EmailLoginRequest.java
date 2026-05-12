package com.adder.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class EmailLoginRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
