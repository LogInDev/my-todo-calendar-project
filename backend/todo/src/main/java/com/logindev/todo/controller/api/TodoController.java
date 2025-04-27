package com.logindev.todo.controller.api;

import com.logindev.todo.config.security.SecurityUtils;
import com.logindev.todo.domain.User;
import com.logindev.todo.dto.todo.TodoRequest;
import com.logindev.todo.dto.todo.TodoResponse;
import com.logindev.todo.response.ApiResponse;
import com.logindev.todo.service.TodoService;
import com.logindev.todo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;
    private final UserService userService;

    @GetMapping
    public ApiResponse<List<TodoResponse>> getTodos() {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        List<TodoResponse> todos = todoService.getTodos(currentUser);
        return ApiResponse.success(todos);
    }

    @PostMapping
    public ApiResponse<TodoResponse> createTodo(@RequestBody TodoRequest request) { // ✅ 리턴타입 수정
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        TodoResponse todoResponse = todoService.createTodo(currentUser, request);
        return ApiResponse.success(todoResponse);
    }

    @PatchMapping("/{id}")
    public ApiResponse<TodoResponse> updateTodo(@PathVariable Long id, @RequestBody TodoRequest request) {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        TodoResponse todoResponse = todoService.updateTodo(currentUser, id, request);
        return ApiResponse.success(todoResponse);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTodo(@PathVariable Long id) { // ✅ 리턴타입 수정
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        todoService.deleteTodo(currentUser, id);
        return ApiResponse.success(null);
    }
}
