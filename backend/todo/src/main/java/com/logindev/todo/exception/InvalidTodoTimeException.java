package com.logindev.todo.exception;

public class InvalidTodoTimeException extends BusinessException {
    public InvalidTodoTimeException() {
        super("시작시간은 종료시간보다 빨라야 합니다.");
    }
}