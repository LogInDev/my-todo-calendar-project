package com.logindev.todo.dto.tag;

public record TagResponse(
        Long id,
        String name,
        String color
) {
    public static TagResponse from(com.logindev.todo.domain.Tag tag) {
        return new TagResponse(tag.getId(), tag.getName(), tag.getColor());
    }
}