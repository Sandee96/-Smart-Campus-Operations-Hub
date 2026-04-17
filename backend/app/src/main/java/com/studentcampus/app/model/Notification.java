package com.studentcampus.app.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    // Who receives this notification
    @Indexed
    private String userId;

    private String title;
    private String message;

    // Type of notification
    private NotificationType type;

    // Related resource ID (booking ID, ticket ID etc.)
    private String referenceId;

    // Reference type so frontend knows where to navigate
    private ReferenceType referenceType;

    @Builder.Default
    private boolean read = false;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum NotificationType {
        BOOKING_APPROVED,
        BOOKING_REJECTED,
        BOOKING_CANCELLED,
        TICKET_STATUS_CHANGED,
        TICKET_ASSIGNED,
        NEW_COMMENT,
        ROLE_CHANGED,
        GENERAL
    }

    public enum ReferenceType {
        BOOKING,
        TICKET,
        USER,
        NONE
    }
}