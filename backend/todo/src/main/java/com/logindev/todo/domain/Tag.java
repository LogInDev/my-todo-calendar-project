package com.logindev.todo.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tags")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder
public class Tag extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String color;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public void update(String name, String color) {
        if(name != null){
            this.name = name;
        }
        if(color != null){
            this.color = color;
        }
    }
}
