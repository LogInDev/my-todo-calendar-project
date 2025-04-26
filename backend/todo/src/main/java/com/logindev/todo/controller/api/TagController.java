package com.logindev.todo.controller.api;

import com.logindev.todo.config.security.SecurityUtils;
import com.logindev.todo.domain.User;
import com.logindev.todo.dto.tag.TagRequest;
import com.logindev.todo.dto.tag.TagResponse;
import com.logindev.todo.service.TagService;
import com.logindev.todo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;
    private final UserService userService;

    @PostMapping
    public TagResponse createTag(@RequestBody TagRequest request) {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        return tagService.createTag(currentUser, request);
    }

    @GetMapping
    public List<TagResponse> getTags() {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        return tagService.getTagsByUser(currentUser);
    }

    @DeleteMapping("/{tagId}")
    public void deleteTag(@PathVariable Long tagId) {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        tagService.deleteTag(currentUser, tagId);
    }
}
