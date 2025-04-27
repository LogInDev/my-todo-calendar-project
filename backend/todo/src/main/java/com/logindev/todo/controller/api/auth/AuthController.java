package com.logindev.todo.controller.api.auth;

import com.logindev.todo.config.security.JwtProvider;
import com.logindev.todo.domain.OAuthProvider;
import com.logindev.todo.domain.User;
import com.logindev.todo.domain.UserOAuth;
import com.logindev.todo.repository.UserOAuthRepository;
import com.logindev.todo.repository.UserRepository;
import com.logindev.todo.response.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final JwtProvider jwtProvider;
    private final UserOAuthRepository userOAuthRepository;
    private final UserRepository userRepository;

    @Value(("${spring.profiles.active:local}"))
    private String activeProfile;

    // local 환경만 false
    private boolean isSecure() {
        return !"local".equals(activeProfile);
    }

    private static final long ACCESS_TOKEN_VALIDITY_SECONDS = 60 * 60 * 24; // 1일

    @PostMapping("/refresh")
    public void refresh(HttpServletRequest request, HttpServletResponse response) {
        // 1. 쿠키에서 refresh_token 꺼내기
        String refreshToken = extractTokenFromCookie(request, "REFRESH_TOKEN");

        if (refreshToken == null) {
            log.warn("리프레시 토큰 없음 → 401");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            return;
        }

        // 2. refresh_token 유효성 검사
        Optional<UserOAuth> userOAuthOpt = userOAuthRepository.findByRefreshTokenWithUser(refreshToken);

        if (userOAuthOpt.isEmpty()) {
            log.warn("refresh_token 매칭 실패 → 401");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        UserOAuth userOAuth = userOAuthOpt.get();

        if (userOAuth.getRefreshTokenExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("refresh_token 만료 → 401");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 3. access_token 새로 발급
        User user = userOAuth.getUser();
        String newAccessToken = jwtProvider.generateToken(user.getId(), user.getEmail());

        ResponseCookie accessTokenCookie = ResponseCookie.from("ACCESS_TOKEN", newAccessToken)
                .httpOnly(true)
                .secure(isSecure())
                .path("/")
                .maxAge(ACCESS_TOKEN_VALIDITY_SECONDS)
                .build();

        response.addHeader("Set-Cookie", accessTokenCookie.toString());

        log.info("AccessToken 재발급 완료 for userId={}", user.getId());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // 1. 쿠키에서 refresh_token 꺼내기
        String refreshToken = extractTokenFromCookie(request, "REFRESH_TOKEN");

        if (refreshToken != null) {
            userOAuthRepository.findByRefreshTokenWithUser(refreshToken).ifPresent(userOAuth -> {
                userOAuth.clearRefreshToken();
                userOAuthRepository.save(userOAuth);
            });
        }

        // 2. AccessToken 삭제
        ResponseCookie accessTokenCookie = ResponseCookie.from("ACCESS_TOKEN", "")
                .path("/")
                .httpOnly(true)
                .secure(isSecure())
                .sameSite("Lax")
                .maxAge(0)
                .build();

        // 3. RefreshToken 삭제
        ResponseCookie refreshTokenCookie = ResponseCookie.from("REFRESH_TOKEN", "")
                .path("/")
                .httpOnly(true)
                .secure(isSecure())
                .sameSite("Lax")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", accessTokenCookie.toString());
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());

        return ResponseEntity.ok(ApiResponse.success(null));
    }


    private String extractTokenFromCookie(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if (cookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}