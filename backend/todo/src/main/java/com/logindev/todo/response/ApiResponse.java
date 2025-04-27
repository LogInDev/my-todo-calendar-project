package com.logindev.todo.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "success", data);
    }

    // access_token이 없거나 유효하지 않을 경우
    public static <T> ApiResponse<T> unauthorized(String message) {
        return new ApiResponse<>(401, message, null);
    }

    // 일반적인 에러 응답
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), message, null);
    }

    // 내부 서버 오류 응답
    public static <T> ApiResponse<T> internalServerError(String message) {
        return new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), message, null);
    }

    // 지정된 상태 코드로 에러 응답
    public static <T> ApiResponse<T> customError(HttpStatus status, String message) {
        return new ApiResponse<>(status.value(), message, null);
    }
}
