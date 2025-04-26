package com.logindev.todo.domain;

import com.logindev.todo.dto.todo.TodoRequest;
import com.logindev.todo.repository.TagRepository;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "todos")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder
public class Todo extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Tag tag;

    @Column(nullable = false)
    private String title;

    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;

    @Column(nullable = false)
    private Boolean completed = false;

    private Boolean isAllDay = false;


    public void updateFromRequest(TodoRequest request, TagRepository tagRepository) {
        if (request.title() != null) {
            this.title = request.title();
        }
        if (request.startDatetime() != null) {
            this.startDatetime = request.startDatetime();
        }
        if (request.endDatetime() != null) {
            this.endDatetime = request.endDatetime();
        }
        if (request.isAllDay() != null) {
            this.isAllDay = request.isAllDay();
        }
        if(request.completed() != null) {
            this.completed = request.completed();
        }
        if (request.tagId() != null) {
            this.tag = tagRepository.findById(request.tagId())
                    .orElseThrow(() -> new IllegalArgumentException("Tag not found"));
        } else if (request.tagId() == null) {
            this.tag = null; // 태그 삭제 처리
        }
    }
}
