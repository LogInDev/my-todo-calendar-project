package com.logindev.todo.repository;

import com.logindev.todo.domain.Tag;
import com.logindev.todo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUser(User user);
}
