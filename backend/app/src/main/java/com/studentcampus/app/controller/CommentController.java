package com.studentcampus.app.controller;

import com.studentcampus.app.dto.CommentRequest;
import com.studentcampus.app.model.Comment;
import com.studentcampus.app.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable String ticketId,
            @RequestBody CommentRequest request) {

        String userId = "user123"; // replace later with auth user
        String userName = "Chamini"; // replace later with auth user name

        Comment comment = commentService.addComment(ticketId, request, userId, userName);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByTicket(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable String commentId,
            @RequestBody CommentRequest request) {

        String userId = "user123"; // replace later with auth user
        return ResponseEntity.ok(commentService.editComment(commentId, request, userId));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable String commentId) {
        String userId = "user123"; // replace later with auth user
        boolean isAdmin = false;   // replace later with role check

        commentService.deleteComment(commentId, userId, isAdmin);
        return ResponseEntity.ok("Comment deleted successfully");
    }
}