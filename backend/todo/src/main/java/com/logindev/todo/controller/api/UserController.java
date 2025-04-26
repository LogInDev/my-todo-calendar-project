package com.logindev.todo.controller.api;

import com.logindev.todo.domain.User;
import com.logindev.todo.repository.UserRepository;
import com.logindev.todo.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me") // ✨
    public ApiResponse<UserInfoDto> getCurrentUser(@AuthenticationPrincipal Object principal) {
        if (principal == null) {
            return ApiResponse.unauthorized("로그인이 필요합니다.");
        }

        Long userId = (Long) principal;
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        UserInfoDto userInfo = new UserInfoDto(user.getId(), user.getEmail(), user.getNickname(), user.getProfileImageUrl());

        return ApiResponse.success(userInfo);
    }

    // 유저 정보 응답용 DTO
    public record UserInfoDto(
            Long id,
            String email,
            String nickname,
            String profileImageUrl
    ) {}
}
