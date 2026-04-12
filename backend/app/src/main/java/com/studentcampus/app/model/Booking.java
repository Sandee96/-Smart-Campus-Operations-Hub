package com.studentcampus.app.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    private String id;

    // Resource reference – populated by Catalog module
    private String resourceId;
    private String resourceName; // Denormalized for display
    private String resourceType; // ROOM, LAB, EQUIPMENT

    // User reference – populated by Auth module
    private String userId;
    private String userName; // Denormalized for display
    private String userEmail;

    // Booking details
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private Integer expectedAttendees;

    // Workflow
    private BookingStatus status; // PENDING, APPROVED, REJECTED, CANCELLED, CHECKED_IN
    private String adminNote; // Reason for rejection or approval note
    private String approvedBy; // Admin userId

    // QR Check-In
    private String qrToken; // Unique token for QR code
    private LocalDateTime checkedInAt;

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
