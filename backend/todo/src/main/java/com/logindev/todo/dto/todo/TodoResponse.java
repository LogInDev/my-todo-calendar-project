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
    private Boolean completed;
    private Long tagId; // tag가 없으면 null
    private String tagName;
    private String tagColor;

    public static TodoResponse from(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .startDatetime(todo.getStartDatetime())
                .endDatetime(todo.getEndDatetime())
                .isAllDay(todo.getIsAllDay())
                .completed(todo.getCompleted())
                .tagId(todo.getTag() != null ? todo.getTag().getId() : null)
                .tagName(todo.getTag() != null ? todo.getTag().getName() : "태그 없음")
                .tagColor(todo.getTag() != null ? todo.getTag().getColor() : "transparent")
                .build();
    }

}
