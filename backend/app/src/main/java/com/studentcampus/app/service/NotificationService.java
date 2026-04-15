package com.studentcampus.app.service;

import com.studentcampus.app.dto.NotificationRequestDTO;
import com.studentcampus.app.dto.NotificationResponseDTO;
import com.studentcampus.app.exception.ResourceNotFoundException;
import com.studentcampus.app.exception.UnauthorizedException;
import com.studentcampus.app.model.Notification;
import com.studentcampus.app.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Called by other modules (booking, ticket) to create notifications
    public NotificationResponseDTO createNotification(NotificationRequestDTO request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .referenceId(request.getReferenceId())
                .referenceType(request.getReferenceType())
                .read(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("Notification created for user {}: {}", request.getUserId(), request.getTitle());
        return NotificationResponseDTO.from(saved);
    }

    // Get all notifications for logged-in user
    public List<NotificationResponseDTO> getUserNotifications(String userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponseDTO::from)
                .collect(Collectors.toList());
    }

    // Get only unread notifications
    public List<NotificationResponseDTO> getUnreadNotifications(String userId) {
        return notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponseDTO::from)
                .collect(Collectors.toList());
    }

    // Get unread notification count — for navbar badge
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    // Mark single notification as read
    public NotificationResponseDTO markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));

        // Security check — user can only mark their own notifications
        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own notifications");
        }

        notification.setRead(true);
        return NotificationResponseDTO.from(notificationRepository.save(notification));
    }

    // Mark ALL notifications as read for a user
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        log.info("Marked all notifications as read for user: {}", userId);
    }

    // Delete a single notification
    public void deleteNotification(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));

        // Security check — user can only delete their own notifications
        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own notifications");
        }

        notificationRepository.delete(notification);
        log.info("Notification deleted: {}", notificationId);
    }
}