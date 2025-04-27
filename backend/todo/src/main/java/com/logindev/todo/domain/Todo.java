package com.logindev.todo.domain;

import com.logindev.todo.dto.todo.TodoRequest;
import com.logindev.todo.exception.InvalidTodoTimeException;
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

    @Builder.Default
    @Column(nullable = false)
    private Boolean completed = false;
    @Builder.Default
    private Boolean isAllDay = false;


    public void updateFromRequest(TodoRequest request, TagRepository tagRepository) {
        this.title = request.title() != null ? request.title() : this.title;
        this.startDatetime = request.startDatetime() != null ? request.startDatetime().toLocalDateTime() : null;
        this.endDatetime = request.endDatetime() != null ? request.endDatetime().toLocalDateTime() : null;
        this.isAllDay = request.isAllDay() != null ? request.isAllDay() : this.isAllDay;
        this.completed = request.completed() != null ? request.completed() : this.completed;

        if (request.tagId() != null) {
            this.tag = tagRepository.findById(request.tagId())
                    .orElseThrow(() -> new IllegalArgumentException("Tag not found"));
        }
        // 시작시간이 종료시간보다 늦으면 예외 던짐.
        if (this.startDatetime != null && this.endDatetime != null && this.startDatetime.isAfter(this.endDatetime)) {
            throw new InvalidTodoTimeException();
        }
    }
}
