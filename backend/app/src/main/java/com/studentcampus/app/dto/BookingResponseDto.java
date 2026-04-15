package com.studentcampus.app.dto;

import com.studentcampus.app.model.BookingStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingResponseDto {
    private String id;
    private String resourceId;
    private String resourceName;
    private String resourceType;
    private String userId;
    private String userName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String adminNote;
    private String qrToken;
    private LocalDateTime checkedInAt;
    private LocalDateTime createdAt;
}
