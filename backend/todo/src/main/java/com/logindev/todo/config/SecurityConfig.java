package com.logindev.todo.config;

import com.logindev.todo.config.security.CustomOAuth2UserService;
import com.logindev.todo.config.security.JwtAuthenticationFilter;
import com.logindev.todo.config.security.JwtProvider;
import com.logindev.todo.config.security.OAuth2SuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final JwtProvider jwtProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
//                .cors(Customizer.withDefaults())
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                    corsConfiguration.addAllowedOrigin("*"); // 모든 출처 허용
                    corsConfiguration.addAllowedHeader("*"); // 모든 헤더 허용
                    corsConfiguration.addAllowedMethod("*"); // 모든 HTTP 메서드 허용
                    return corsConfiguration;
                }))
                .exceptionHandling(e ->
                        e.authenticationEntryPoint((request, response, authException) -> {
                            if (authException.getMessage().contains("JWT")) {
                                // JWT 관련 에러만 401
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            } else {
                                // 그 외는 Spring 기본 흐름
                                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Bad Request");
                            }
                        })
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/", "/favicon.ico",
                                "/img/**", "/static/**", "/css/**", "/js/**",
                                "/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs", "/api-docs/**", "/v3/api-docs/**",
                                "/login",
                                "/oauth2/**", "/login/oauth2/**", "/api/public/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(endpoint -> endpoint.baseUri("/oauth2/authorize"))
                        .redirectionEndpoint(endpoint -> endpoint.baseUri("/login/oauth2/code/*"))
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                );

        return http.build();
    }
}
