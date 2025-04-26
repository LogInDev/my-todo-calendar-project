package com.logindev.todo.service;

import com.logindev.todo.domain.Tag;
import com.logindev.todo.domain.User;
import com.logindev.todo.dto.tag.TagRequest;
import com.logindev.todo.dto.tag.TagResponse;
import com.logindev.todo.dto.tag.TagUpdateRequest;
import com.logindev.todo.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional
    public TagResponse createTag(User user, TagRequest request) {
        final Tag tag = Tag.builder()
                .user(user)
                .name(request.name())
                .color(request.color())
                .build();
        final Tag saved = tagRepository.save(tag);
        return TagResponse.from(saved);
    }

    public List<TagResponse> getTagsByUser(User user) {
        return tagRepository.findByUser(user).stream()
                .map(TagResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteTag(User user, Long tagId) {
        final Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found"));
        if(!tag.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("User not owned by this tag");
        }
        tagRepository.delete(tag);
    }

    @Transactional
    public TagResponse updateTag(User user, Long tagId, TagUpdateRequest request) {
        final Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found"));

        if(!tag.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("User not owned by this tag");
        }

        tag.update(request.name(), request.color());
        return TagResponse.from(tag);
    }
}
