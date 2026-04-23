package com.studentcampus.app.service;

import com.studentcampus.app.dto.NotificationRequestDTO;
import com.studentcampus.app.dto.NotificationResponseDTO;
import com.studentcampus.app.exception.ResourceNotFoundException;
import com.studentcampus.app.exception.UnauthorizedException;
import com.studentcampus.app.model.Notification;
import com.studentcampus.app.model.User;
import com.studentcampus.app.repository.NotificationRepository;
import com.studentcampus.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // -------------------------------------------------------
    // Create a new notification
    // Checks user's notification preferences before saving
    // Called by UserService, BookingService, TicketService, CommentService
    // -------------------------------------------------------
    public NotificationResponseDTO createNotification(NotificationRequestDTO request) {

        // Check user's notification preferences — skip if user has disabled this type
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isPresent()) {
            User.NotificationPreferences prefs = userOpt.get().getNotificationPreferences();
            if (prefs != null && !isAllowedByPreferences(prefs, request.getType())) {
                log.debug("Notification suppressed by user preferences: userId={}, type={}",
                        request.getUserId(), request.getType());
                // Return a dummy DTO — notification was intentionally skipped
                // This does NOT throw an exception — callers handle it gracefully
                return NotificationResponseDTO.builder()
                        .userId(request.getUserId())
                        .title(request.getTitle())
                        .message(request.getMessage())
                        .type(request.getType())
                        .read(false)
                        .build();
            }
        }

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
        log.info("Notification created: userId={}, type={}", request.getUserId(), request.getType());
        return NotificationResponseDTO.from(saved);
    }

    // -------------------------------------------------------
    // Get all notifications for a user, newest first
    // -------------------------------------------------------
    public List<NotificationResponseDTO> getUserNotifications(String userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponseDTO::from)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------
    // Get only unread notifications for a user
    // -------------------------------------------------------
    public List<NotificationResponseDTO> getUnreadNotifications(String userId) {
        return notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponseDTO::from)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------
    // Get count of unread notifications — used for navbar badge
    // -------------------------------------------------------
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    // -------------------------------------------------------
    // Mark a single notification as read
    // Security: only owner can mark their own notification
    // -------------------------------------------------------
    public NotificationResponseDTO markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));

        // Security check — only owner can mark as read
        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own notifications");
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        log.debug("Notification marked as read: {}", notificationId);
        return NotificationResponseDTO.from(saved);
    }

    // -------------------------------------------------------
    // Mark ALL notifications as read for a user
    // -------------------------------------------------------
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        log.info("All notifications marked as read for user: {}", userId);
    }

    // -------------------------------------------------------
    // Delete a single notification
    // Security: only owner can delete their own notification
    // -------------------------------------------------------
    public void deleteNotification(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));

        // Security check — only owner can delete
        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own notifications");
        }

        notificationRepository.delete(notification);
        log.info("Notification deleted: {}", notificationId);
    }

    // -------------------------------------------------------
    // Helper — check if a notification type is allowed
    // by the user's notification preferences
    // -------------------------------------------------------
    private boolean isAllowedByPreferences(User.NotificationPreferences prefs,
                                            Notification.NotificationType type) {
        return switch (type) {
            case BOOKING_APPROVED, BOOKING_REJECTED, BOOKING_CANCELLED
                    -> prefs.isBookingUpdates();
            case TICKET_STATUS_CHANGED
                    -> prefs.isTicketUpdates();
            case TICKET_ASSIGNED
                    -> prefs.isTicketAssigned();
            case NEW_COMMENT
                    -> prefs.isNewComments();
            case ROLE_CHANGED, ACCOUNT_APPROVED, ACCOUNT_REJECTED
                    -> prefs.isRoleChanges();
            case GENERAL
                    -> prefs.isGeneralNotifications();
        };
    }
}