package com.studentcampus.app.controller;

import com.studentcampus.app.common.security.UserPrincipal;
import com.studentcampus.app.dto.CommentRequest;
import com.studentcampus.app.model.Comment;
import com.studentcampus.app.model.User;
import com.studentcampus.app.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // ✅ Get current user from JWT
    private UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder
                .getContext().getAuthentication();
        return (UserPrincipal) auth.getPrincipal();
    }

    // ✅ Check if current user is ADMIN
    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder
                .getContext().getAuthentication();
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    // POST /api/tickets/{ticketId}/comments
    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable String ticketId,
            @RequestBody CommentRequest request) {
        String userId   = getCurrentUser().getId();   // ✅
        String userName = getCurrentUser().getName(); // ✅
        Comment comment = commentService.addComment(
                ticketId, request, userId, userName);
        return ResponseEntity.ok(comment);
    }

    // GET /api/tickets/{ticketId}/comments
    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByTicket(
            @PathVariable String ticketId) {
        return ResponseEntity.ok(
                commentService.getCommentsByTicket(ticketId));
    }

    // PUT /api/tickets/comments/{commentId}
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable String commentId,
            @RequestBody CommentRequest request) {
        String userId = getCurrentUser().getId(); // ✅
        return ResponseEntity.ok(
                commentService.editComment(commentId, request, userId));
    }

    // DELETE /api/tickets/comments/{commentId}
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable String commentId) {
        String userId = getCurrentUser().getId(); // ✅
        boolean admin = isAdmin();                // ✅
        commentService.deleteComment(commentId, userId, admin);
        return ResponseEntity.ok("Comment deleted successfully");
    }
}