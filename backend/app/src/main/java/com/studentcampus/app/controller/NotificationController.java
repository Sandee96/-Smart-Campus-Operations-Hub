package com.studentcampus.app.controller;

import com.studentcampus.app.common.JwtUtil;
import com.studentcampus.app.dto.NotificationRequestDTO;
import com.studentcampus.app.dto.NotificationResponseDTO;
import com.studentcampus.app.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;

    // Helper — extract user ID from JWT token in request header
    private String getUserId(String authHeader) {
        return jwtUtil.extractUserId(authHeader.substring(7));
    }

    // GET /api/notifications
    // Get all notifications for logged-in user
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getMyNotifications(
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    // GET /api/notifications/unread
    // Get only unread notifications
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotifications(
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    // GET /api/notifications/unread/count
    // Get unread count — used for navbar badge number
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // PUT /api/notifications/{id}/read
    // Mark single notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        return ResponseEntity.ok(notificationService.markAsRead(id, userId));
    }

    // PUT /api/notifications/read-all
    // Mark all notifications as read
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    // DELETE /api/notifications/{id}
    // Delete a single notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.noContent().build();
    }

    // POST /api/notifications
    // Create notification — called internally by other modules
    @PostMapping
    public ResponseEntity<NotificationResponseDTO> createNotification(
            @Valid @RequestBody NotificationRequestDTO request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(notificationService.createNotification(request));
    }
}