package com.studentcampus.app.dto;

import com.studentcampus.app.model.Notification;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationRequestDTO {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Notification type is required")
    private Notification.NotificationType type;

    private String referenceId;

    @NotNull(message = "Reference type is required")
    private Notification.ReferenceType referenceType;
}