package com.logindev.todo.repository;

import com.logindev.todo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 이메일로 사용자 조회
     * @param email 카카오 계정 이메일
     * @return Optional<User>
     */
    Optional<User> findByEmail(String email);
}
