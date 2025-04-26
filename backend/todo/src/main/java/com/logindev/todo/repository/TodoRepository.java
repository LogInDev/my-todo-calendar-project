package com.logindev.todo.repository;

import com.logindev.todo.domain.Todo;
import com.logindev.todo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    // 유저별 할일 목록 조회
    List<Todo> findByUser(User user);
}
