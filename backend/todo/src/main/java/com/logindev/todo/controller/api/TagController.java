package com.logindev.todo.controller.api;

import com.logindev.todo.config.security.SecurityUtils;
import com.logindev.todo.domain.User;
import com.logindev.todo.dto.tag.TagRequest;
import com.logindev.todo.dto.tag.TagResponse;
import com.logindev.todo.dto.tag.TagUpdateRequest;
import com.logindev.todo.response.ApiResponse;
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
    public ApiResponse<TagResponse> createTag(@RequestBody TagRequest request) {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        TagResponse tag = tagService.createTag(currentUser, request);
        return ApiResponse.success(tag);
    }

    @GetMapping
    public ApiResponse<List<TagResponse>> getTags() {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        List<TagResponse> tags = tagService.getTagsByUser(currentUser);
        return ApiResponse.success(tags);
    }

    @DeleteMapping("/{tagId}")
    public ApiResponse<Void> deleteTag(@PathVariable Long tagId) {
        final User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        tagService.deleteTag(currentUser, tagId);
        return ApiResponse.success(null); // 삭제는 데이터 없이 성공
    }

    @PatchMapping("/{tagId}")
    public ApiResponse<TagResponse> updateTag(@PathVariable Long tagId, @RequestBody TagUpdateRequest request) {
        User currentUser = userService.findById(SecurityUtils.getCurrentUserId());
        TagResponse updatedTag = tagService.updateTag(currentUser, tagId, request);
        return ApiResponse.success(updatedTag);
    }
}
