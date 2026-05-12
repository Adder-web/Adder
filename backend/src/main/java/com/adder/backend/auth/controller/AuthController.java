package com.adder.backend.auth.controller;

import com.adder.backend.auth.dto.*;
import com.adder.backend.auth.service.AuthService;
import com.adder.backend.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> socialLogin(
            @Valid @RequestBody SocialLoginRequest request) {
        AuthResponse data = authService.socialLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", data));
    }

    @PostMapping("/email-login")
    public ResponseEntity<ApiResponse<AuthResponse>> emailLogin(
            @Valid @RequestBody EmailLoginRequest request) {
        AuthResponse data = authService.emailLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", data));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(
            @Valid @RequestBody SignupRequest request) {
        AuthResponse data = authService.signup(request);
        return ResponseEntity.status(201).body(ApiResponse.created("회원가입에 성공했습니다.", data));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getMe(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        UserInfoResponse data = authService.getMe(userId);
        return ResponseEntity.ok(ApiResponse.ok("사용자 정보를 조회했습니다.", data));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.ok("로그아웃에 성공했습니다.", null));
    }
}
