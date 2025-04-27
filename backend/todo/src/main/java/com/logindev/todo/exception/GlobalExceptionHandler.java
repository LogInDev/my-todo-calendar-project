package com.logindev.todo.exception;

import com.logindev.todo.response.ApiResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // BusinessException 예외 처리 (커스텀 예외)
    @ExceptionHandler(BusinessException.class)
    public ApiResponse<?> handleBusinessException(BusinessException ex) {
        return ApiResponse.error(ex.getMessage());  // error 메시지로 반환
    }

    // IllegalArgumentException 예외 처리 (예: 잘못된 파라미터)
    @ExceptionHandler(IllegalArgumentException.class)
    public ApiResponse<?> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ApiResponse.error("잘못된 요청입니다. " + ex.getMessage());
    }

    // RuntimeException 예외 처리 (예: 서버 오류 등)
    @ExceptionHandler(RuntimeException.class)
    public ApiResponse<?> handleRuntimeException(RuntimeException ex) {
        return ApiResponse.internalServerError("서버에서 예상치 못한 오류가 발생했습니다.");
    }

    // 기타 모든 예외 처리
    @ExceptionHandler(Exception.class)
    public ApiResponse<?> handleException(Exception ex) {
        return ApiResponse.internalServerError("예상치 못한 오류가 발생했습니다.");
    }
}
