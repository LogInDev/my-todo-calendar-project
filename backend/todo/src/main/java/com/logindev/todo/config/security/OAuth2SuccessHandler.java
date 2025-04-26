package com.logindev.todo.config.security;

import com.logindev.todo.domain.OAuthProvider;
import com.logindev.todo.domain.User;
import com.logindev.todo.domain.UserOAuth;
import com.logindev.todo.repository.UserOAuthRepository;
import com.logindev.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.http.ResponseCookie;

import jakarta.servlet.http.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final UserOAuthRepository userOAuthRepository;

    @Value(("${spring.profiles.active:local}"))
    private String activeProfile;

    private static final long REFRESH_TOKEN_VALIDITY_SECONDS = 60 * 60 * 24 * 14; // 14일
    private static final long ACCESS_TOKEN_VALIDITY_SECONDS = 60 * 60 * 24; // 1일

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        // 1. 인증된 사용자 정보 꺼내기
        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> kakaoAccount = (Map<String, Object>) oauthUser.getAttributes().get("kakao_account");
        String email = (String) kakaoAccount.get("email");

        // 2. DB에서 User 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("로그인했는데 유저 정보가 없습니다: " + email));

        // 3. access_token (JWT) 발급
        String accessToken = jwtProvider.generateToken(user.getId(), user.getEmail());

        // 4. refresh_token 생성 (랜덤 UUID)
        String refreshToken = UUID.randomUUID().toString();
        LocalDateTime refreshTokenExpiresAt = LocalDateTime.now().plusSeconds(REFRESH_TOKEN_VALIDITY_SECONDS);

        // 5. UserOAuth 업데이트 (refresh_token 저장)
        OAuthProvider provider = OAuthProvider.KAKAO; // 고정 (추후 Google/Naver 확장 가능)

        Optional<UserOAuth> userOAuthOpt = userOAuthRepository.findByUserAndProvider(user, provider);

        userOAuthOpt.ifPresentOrElse(
                userOAuth -> {
                    userOAuth.updateRefreshToken(refreshToken, refreshTokenExpiresAt);
                    userOAuthRepository.save(userOAuth);
                },
                () -> {
                    // 예외 시 예비용
                    userOAuthRepository.save(
                            UserOAuth.builder()
                                    .user(user)
                                    .provider(provider)
                                    .oauthId(null)
                                    .refreshToken(refreshToken)
                                    .refreshTokenExpiresAt(refreshTokenExpiresAt)
                                    .build()
                    );
                }
        );

        // 6. access_token 쿠키로 내려주기
        boolean isSecure = !"local".equals(activeProfile);  // local 환경만 false

        ResponseCookie accessTokenCookie = ResponseCookie.from("ACCESS_TOKEN", accessToken)
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .maxAge(ACCESS_TOKEN_VALIDITY_SECONDS)
                .build();

        // 7. refresh_token 쿠키로 내려주기
        ResponseCookie refreshTokenCookie = ResponseCookie.from("REFRESH_TOKEN", refreshToken)
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .maxAge(REFRESH_TOKEN_VALIDITY_SECONDS)
                .build();

        response.setHeader("Set-Cookie", accessTokenCookie.toString());
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());

        // 8. 로그인 성공 후 리다이렉트
        response.sendRedirect("http://localhost:3000");
    }
}