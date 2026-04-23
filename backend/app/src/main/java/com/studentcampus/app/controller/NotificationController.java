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

    // Helper — extract user ID from JWT token in Authorization header
    private String getUserId(String authHeader) {
        return jwtUtil.extractUserId(authHeader.substring(7));
    }

    // -------------------------------------------------------
    // GET /api/notifications
    // Get all notifications for logged-in user, newest first
    // -------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getMyNotifications(
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    // -------------------------------------------------------
    // GET /api/notifications/unread
    // Get only unread notifications for logged-in user
    // -------------------------------------------------------
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotifications(
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    // -------------------------------------------------------
    // GET /api/notifications/unread/count
    // Get count of unread notifications — used for navbar badge number
    // -------------------------------------------------------
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // -------------------------------------------------------
    // PUT /api/notifications/{id}/read
    // Mark a single notification as read
    // Security: only owner can mark their own notification
    // -------------------------------------------------------
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        return ResponseEntity.ok(notificationService.markAsRead(id, userId));
    }

    // -------------------------------------------------------
    // PUT /api/notifications/read-all
    // Mark ALL notifications as read for logged-in user
    // -------------------------------------------------------
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    // -------------------------------------------------------
    // DELETE /api/notifications/{id}
    // Delete a single notification
    // Security: only owner can delete their own notification
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.noContent().build();
    }

    // -------------------------------------------------------
    // POST /api/notifications
    // Create a new notification
    // Called internally by other modules (BookingService, TicketService)
    // Body: { "userId", "title", "message", "type", "referenceId", "referenceType" }
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<NotificationResponseDTO> createNotification(
            @Valid @RequestBody NotificationRequestDTO request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(notificationService.createNotification(request));
    }
}