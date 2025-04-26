package com.logindev.todo.dto.todo;

import java.time.LocalDateTime;

public record TodoRequest(
        String title,
        LocalDateTime startDatetime,
        LocalDateTime endDatetime,
        Boolean isAllDay,
        Long tagId,
        Boolean completed
) {}
