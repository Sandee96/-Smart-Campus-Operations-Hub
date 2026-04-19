package com.studentcampus.app.dto;

import com.studentcampus.app.model.Notification;
import lombok.experimental.UtilityClass;

@UtilityClass
public class NotificationTriggerHelper {

    public static NotificationRequestDTO booking(
            String userId,
            String title,
            String message,
            Notification.NotificationType type,
            String bookingId) {

        NotificationRequestDTO dto = new NotificationRequestDTO();
        dto.setUserId(userId);
        dto.setTitle(title);
        dto.setMessage(message);
        dto.setType(type);
        dto.setReferenceId(bookingId);
        dto.setReferenceType(Notification.ReferenceType.BOOKING);
        return dto;
    }

    public static NotificationRequestDTO ticket(
            String userId,
            String title,
            String message,
            Notification.NotificationType type,
            String ticketId) {

        NotificationRequestDTO dto = new NotificationRequestDTO();
        dto.setUserId(userId);
        dto.setTitle(title);
        dto.setMessage(message);
        dto.setType(type);
        dto.setReferenceId(ticketId);
        dto.setReferenceType(Notification.ReferenceType.TICKET);
        return dto;
    }
}