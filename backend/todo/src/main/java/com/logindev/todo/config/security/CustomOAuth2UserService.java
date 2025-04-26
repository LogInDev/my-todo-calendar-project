package com.logindev.todo.config.security;

import com.logindev.todo.domain.OAuthProvider;
import com.logindev.todo.domain.User;
import com.logindev.todo.domain.UserOAuth;
import com.logindev.todo.repository.UserOAuthRepository;
import com.logindev.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final UserOAuthRepository userOAuthRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        // 1. 사용자 기본 정보 로드
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // 2. OAuth2 provider 구분 (kakao - google, naver등 확장 가능)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuthProvider provider = OAuthProvider.valueOf(registrationId.toUpperCase());

        // 3. 사용자 정보 파싱
        Map<String, Object> attributes = oAuth2User.getAttributes();
        Long oauthId = ((Number) attributes.get("id")).longValue();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String email = (String) kakaoAccount.get("email");
        String nickname = (String) profile.get("nickname");
        String profileImageUrl = (String) profile.get("profile_image_url");

        // 4. User 저장 or 조회
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .email(email)
                                .nickname(nickname)
                                .profileImageUrl(profileImageUrl)
                                .build()
                ));

        // 5. UserOAuth 저장 or 조회 (이때 refresh_token은 OAuth2SuccessHandler에서 관리)
        userOAuthRepository.findByUserAndProvider(user, provider)
                .orElseGet(() -> userOAuthRepository.save(
                        UserOAuth.builder()
                                .user(user)
                                .provider(provider)
                                .oauthId(String.valueOf(oauthId))
                                .build()
                ));

        // 6. DefaultOAuth2User 반환
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "id"
        );
    }
}