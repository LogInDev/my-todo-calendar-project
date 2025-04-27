package com.logindev.todo.repository;

import com.logindev.todo.domain.OAuthProvider;
import com.logindev.todo.domain.User;
import com.logindev.todo.domain.UserOAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserOAuthRepository extends JpaRepository<UserOAuth, Long> {

    Optional<UserOAuth> findByUserAndProvider(User user, OAuthProvider provider);

    @Query("SELECT uo FROM UserOAuth uo JOIN FETCH uo.user WHERE uo.refreshToken = :refreshToken")
    Optional<UserOAuth> findByRefreshTokenWithUser(@Param("refreshToken") String refreshToken);
}
