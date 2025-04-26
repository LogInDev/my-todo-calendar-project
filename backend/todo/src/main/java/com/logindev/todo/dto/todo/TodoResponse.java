package com.logindev.todo.dto.todo;

import com.logindev.todo.domain.Todo;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TodoResponse {
    private Long id;
    private String title;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private Boolean isAllDay;
    private Long tagId; // tag가 없으면 null
    private Boolean completed;

    public static TodoResponse from(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .startDatetime(todo.getStartDatetime())
                .endDatetime(todo.getEndDatetime())
                .isAllDay(todo.getIsAllDay())
                .tagId(todo.getTag() != null ? todo.getTag().getId() : null)
                .completed(todo.getCompleted())
                .build();
    }
}
