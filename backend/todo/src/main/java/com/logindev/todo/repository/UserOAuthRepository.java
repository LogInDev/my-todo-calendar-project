package com.logindev.todo.repository;

import com.logindev.todo.domain.OAuthProvider;
import com.logindev.todo.domain.User;
import com.logindev.todo.domain.UserOAuth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserOAuthRepository extends JpaRepository<UserOAuth, Long> {

    Optional<UserOAuth> findByUserAndProvider(User user, OAuthProvider provider);

    Optional<UserOAuth> findByRefreshToken(String refreshToken);
}
