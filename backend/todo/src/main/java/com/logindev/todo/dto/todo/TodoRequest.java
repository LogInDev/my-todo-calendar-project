package com.logindev.todo.dto.todo;

import java.time.OffsetDateTime;

public record TodoRequest(
        String title,
        OffsetDateTime startDatetime,
        OffsetDateTime endDatetime,
        Boolean isAllDay,
        Long tagId,
        Boolean completed
) {}
