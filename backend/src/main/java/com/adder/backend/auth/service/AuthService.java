package com.adder.backend.auth.service;

import com.adder.backend.auth.dto.*;
import com.adder.backend.auth.entity.AuthProvider;
import com.adder.backend.auth.entity.User;
import com.adder.backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    public AuthResponse socialLogin(SocialLoginRequest request) {
        if (!"google".equalsIgnoreCase(request.getProvider())) {
            throw new IllegalArgumentException("지원하지 않는 provider입니다.");
        }

        Map<String, Object> googleUser = verifyGoogleToken(request.getAccessToken());
        String googleId = (String) googleUser.get("sub");
        String email = (String) googleUser.get("email");
        String name = (String) googleUser.get("name");
        String picture = (String) googleUser.get("picture");

        boolean[] isNewUser = {false};
        User user = userRepository.findByProviderAndProviderId(AuthProvider.GOOGLE, googleId)
                .orElseGet(() -> {
                    isNewUser[0] = true;
                    User newUser = User.builder()
                            .email(email != null ? email : googleId + "@google.com")
                            .nickname(name != null ? name : "Google User")
                            .profileImage(picture)
                            .provider(AuthProvider.GOOGLE)
                            .providerId(googleId)
                            .build();
                    return userRepository.save(newUser);
                });

        return buildAuthResponse(user, isNewUser[0]);
    }

    public AuthResponse emailLogin(EmailLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .filter(u -> u.getProvider() == AuthProvider.EMAIL)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return buildAuthResponse(user, false);
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getName())
                .provider(AuthProvider.EMAIL)
                .build();
        userRepository.save(user);

        return buildAuthResponse(user, true);
    }

    public UserInfoResponse getMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return UserInfoResponse.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .build();
    }

    private AuthResponse buildAuthResponse(User user, boolean isNewUser) {
        return AuthResponse.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .accessToken(jwtService.generateAccessToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .newUser(isNewUser)
                .build();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> verifyGoogleToken(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new IllegalArgumentException("유효하지 않은 Google 토큰입니다.");
            }
            return response.getBody();
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Google 인증에 실패했습니다. 다시 시도해 주세요.");
        }
    }
}
