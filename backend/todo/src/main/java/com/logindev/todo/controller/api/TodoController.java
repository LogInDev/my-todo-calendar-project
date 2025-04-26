package com.logindev.todo.controller.api;

import com.logindev.todo.config.security.SecurityUtils;
import com.logindev.todo.domain.User;
import com.logindev.todo.dto.todo.TodoRequest;
import com.logindev.todo.dto.todo.TodoResponse;
import com.logindev.todo.service.TodoService;
import com.logindev.todo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;
    private final UserService userService;

    @PostMapping
    public TodoResponse createTodo(@RequestBody TodoRequest request) {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        return todoService.createTodo(currentUser, request);
    }

    @PatchMapping("/{id}")
    public TodoResponse updateTodo(@PathVariable Long id, @RequestBody TodoRequest request) {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        return todoService.updateTodo(currentUser, id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        todoService.deleteTodo(currentUser, id);
    }
}
