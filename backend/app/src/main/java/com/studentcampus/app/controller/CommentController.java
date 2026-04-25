package com.studentcampus.app.controller;

import com.studentcampus.app.common.security.UserPrincipal;
import com.studentcampus.app.dto.CommentRequest;
import com.studentcampus.app.model.Comment;
import com.studentcampus.app.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class CommentController {

        private final CommentService commentService;

        private UserPrincipal getCurrentUser() {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                return (UserPrincipal) auth.getPrincipal();
        }

        private boolean isAdmin() {
                return getCurrentUser().getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        @PostMapping("/{ticketId}/comments")
        public ResponseEntity<Comment> addComment(
                        @PathVariable String ticketId,
                        @RequestBody CommentRequest request) {
                UserPrincipal user = getCurrentUser();

                Comment comment = commentService.addComment(
                                ticketId,
                                request,
                                user.getId(),
                                user.getName());

                return ResponseEntity.ok(comment);
        }

        @GetMapping("/{ticketId}/comments")
        public ResponseEntity<List<Comment>> getCommentsByTicket(
                        @PathVariable String ticketId) {
                return ResponseEntity.ok(
                                commentService.getCommentsByTicket(ticketId));
        }

        @PutMapping("/comments/{commentId}")
        public ResponseEntity<Comment> editComment(
                        @PathVariable String commentId,
                        @RequestBody CommentRequest request) {
                return ResponseEntity.ok(
                                commentService.editComment(
                                                commentId,
                                                request,
                                                getCurrentUser().getId()));
        }

        @DeleteMapping("/comments/{commentId}")
        public ResponseEntity<String> deleteComment(
                        @PathVariable String commentId) {
                commentService.deleteComment(
                                commentId,
                                getCurrentUser().getId(),
                                isAdmin());

                return ResponseEntity.ok("Comment deleted successfully");
        }
}