package com.studentcampus.app.service;

import com.studentcampus.app.dto.*;
import com.studentcampus.app.exception.BookingConflictException;
import com.studentcampus.app.model.Booking;
import com.studentcampus.app.model.BookingStatus;
import com.studentcampus.app.model.Notification;
import com.studentcampus.app.model.Resource;
import com.studentcampus.app.model.ResourceStatus;
import com.studentcampus.app.repository.BookingRepository;
import com.studentcampus.app.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService; // ✅ injected

    // -------------------------------------------------------
    // CREATE BOOKING
    // -------------------------------------------------------
    public BookingResponseDto createBooking(BookingRequestDto dto,
            String userId, String userName, String userEmail) {

        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(), dto.getStartTime(), dto.getEndTime());
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "Resource is already booked during this time slot. " +
                            conflicts.size() + " conflicting booking(s) found.");
        }

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new RuntimeException(
                        "Resource not found: " + dto.getResourceId()));
        if (resource.getStatus() != ResourceStatus.ACTIVE) {
            throw new IllegalStateException("Resource is not available for booking");
        }

        Booking booking = Booking.builder()
                .resourceId(dto.getResourceId())
                .resourceName(resource.getName())
                .resourceType(resource.getType().name())
                .userId(userId)
                .userName(userName)
                .userEmail(userEmail)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .expectedAttendees(dto.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);

        // ✅ Notify user — booking submitted
        try {
            notificationService.createNotification(
                NotificationTriggerHelper.booking(
                    userId,
                    "Booking Submitted",
                    "Your booking request for " + resource.getName() +
                    " has been submitted and is pending approval.",
                    Notification.NotificationType.GENERAL,
                    saved.getId()
                )
            );
        } catch (Exception e) {
            log.warn("Failed to send booking submitted notification: {}", e.getMessage());
        }

        return toDto(saved);
    }

    // -------------------------------------------------------
    // GET BOOKINGS FOR CURRENT USER
    // -------------------------------------------------------
    public List<BookingResponseDto> getMyBookings(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // -------------------------------------------------------
    // GET ALL BOOKINGS (ADMIN)
    // -------------------------------------------------------
    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // -------------------------------------------------------
    // GET BOOKING BY ID
    // -------------------------------------------------------
    public BookingResponseDto getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
        return toDto(booking);
    }

    // -------------------------------------------------------
    // ADMIN: APPROVE OR REJECT
    // -------------------------------------------------------
    public BookingResponseDto processAdminAction(String bookingId,
            AdminActionDto dto, String adminId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException(
                    "Only PENDING bookings can be approved or rejected");
        }

        if (dto.getAction() == BookingStatus.APPROVED) {
            booking.setStatus(BookingStatus.APPROVED);
            booking.setQrToken(UUID.randomUUID().toString());
            booking.setApprovedBy(adminId);

            // ✅ Notify user — booking approved
            try {
                notificationService.createNotification(
                    NotificationTriggerHelper.booking(
                        booking.getUserId(),
                        "Booking Approved ✓",
                        "Your booking for " + booking.getResourceName() +
                        " has been approved. Check your QR code for check-in.",
                        Notification.NotificationType.BOOKING_APPROVED,
                        booking.getId()
                    )
                );
            } catch (Exception e) {
                log.warn("Failed to send booking approved notification: {}", e.getMessage());
            }

        } else if (dto.getAction() == BookingStatus.REJECTED) {
            booking.setStatus(BookingStatus.REJECTED);

            // ✅ Notify user — booking rejected
            try {
                notificationService.createNotification(
                    NotificationTriggerHelper.booking(
                        booking.getUserId(),
                        "Booking Rejected",
                        "Your booking for " + booking.getResourceName() +
                        " has been rejected." +
                        (dto.getNote() != null ? " Reason: " + dto.getNote() : ""),
                        Notification.NotificationType.BOOKING_REJECTED,
                        booking.getId()
                    )
                );
            } catch (Exception e) {
                log.warn("Failed to send booking rejected notification: {}", e.getMessage());
            }

        } else {
            throw new IllegalArgumentException("Action must be APPROVED or REJECTED");
        }

        booking.setAdminNote(dto.getNote());
        booking.setUpdatedAt(LocalDateTime.now());

        return toDto(bookingRepository.save(booking));
    }

    // -------------------------------------------------------
    // CANCEL BOOKING
    // -------------------------------------------------------
    public BookingResponseDto cancelBooking(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found: " + bookingId));

        if (!booking.getUserId().equals(userId)) {
            throw new SecurityException("You can only cancel your own bookings");
        }
        if (booking.getStatus() != BookingStatus.APPROVED &&
                booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException(
                    "Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);

        // ✅ Notify user — booking cancelled
        try {
            notificationService.createNotification(
                NotificationTriggerHelper.booking(
                    userId,
                    "Booking Cancelled",
                    "Your booking for " + booking.getResourceName() +
                    " has been cancelled.",
                    Notification.NotificationType.BOOKING_CANCELLED,
                    booking.getId()
                )
            );
        } catch (Exception e) {
            log.warn("Failed to send booking cancelled notification: {}", e.getMessage());
        }

        return toDto(saved);
    }

    // -------------------------------------------------------
    // QR CHECK-IN
    // -------------------------------------------------------
    public BookingResponseDto checkInByQr(String qrToken) {
        Booking booking = bookingRepository.findByQrToken(qrToken)
                .orElseThrow(() -> new RuntimeException(
                        "Invalid or expired QR code"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException(
                    "Only APPROVED bookings can be checked in");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = booking.getStartTime().minusMinutes(15);
        LocalDateTime windowEnd   = booking.getEndTime();

        if (now.isBefore(windowStart) || now.isAfter(windowEnd)) {
            throw new IllegalStateException(
                    "Check-in is only allowed within 15 minutes before " +
                    "start time until end time");
        }

        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setCheckedInAt(now);
        booking.setUpdatedAt(now);
        return toDto(bookingRepository.save(booking));
    }

    // -------------------------------------------------------
    // MAPPER
    // -------------------------------------------------------
    private BookingResponseDto toDto(Booking b) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(b.getId());
        dto.setResourceId(b.getResourceId());
        dto.setResourceName(b.getResourceName());
        dto.setResourceType(b.getResourceType());
        dto.setUserId(b.getUserId());
        dto.setUserName(b.getUserName());
        dto.setStartTime(b.getStartTime());
        dto.setEndTime(b.getEndTime());
        dto.setPurpose(b.getPurpose());
        dto.setExpectedAttendees(b.getExpectedAttendees());
        dto.setStatus(b.getStatus());
        dto.setAdminNote(b.getAdminNote());
        dto.setQrToken(b.getQrToken());
        dto.setCheckedInAt(b.getCheckedInAt());
        dto.setCreatedAt(b.getCreatedAt());
        return dto;
    }
}