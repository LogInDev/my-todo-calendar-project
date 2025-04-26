package com.logindev.todo.service;

import com.logindev.todo.domain.Tag;
import com.logindev.todo.domain.Todo;
import com.logindev.todo.domain.User;
import com.logindev.todo.dto.todo.TodoRequest;
import com.logindev.todo.dto.todo.TodoResponse;
import com.logindev.todo.repository.TagRepository;
import com.logindev.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final TagRepository tagRepository;

    @Transactional
    public TodoResponse updateTodo(User user, Long todoId, TodoRequest request) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));

        if (!todo.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("User id mismatch");
        }

        // todo 업데이트
        todo.updateFromRequest(request, tagRepository);

        return TodoResponse.from(todo);
    }

    @Transactional
    public TodoResponse createTodo(User user, TodoRequest request) {
        Tag tag = null;
        if (request.tagId() != null) {
            tag = tagRepository.findById(request.tagId())
                    .orElseThrow(() -> new IllegalArgumentException("Tag not found"));
        }

        Todo todo = Todo.builder()
                .user(user)
                .tag(tag)
                .title(request.title())
                .startDatetime(request.startDatetime())
                .endDatetime(request.endDatetime())
                .isAllDay(request.isAllDay() != null ? request.isAllDay() : false)
                .build();

        todoRepository.save(todo);
        return TodoResponse.from(todo);
    }

    @Transactional
    public void deleteTodo(User user, Long todoId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));

        if (!todo.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        todoRepository.delete(todo);
    }
}
