package com.studentcampus.app.service;

import com.studentcampus.app.dto.*;
import com.studentcampus.app.exception.BookingConflictException;
import com.studentcampus.app.model.Booking;
import com.studentcampus.app.model.BookingStatus;
import com.studentcampus.app.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    // -------------------------------------------------------
    // CREATE BOOKING
    // -------------------------------------------------------
    public BookingResponseDto createBooking(BookingRequestDto dto, String userId, String userName, String userEmail) {
        // Validate time range
        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        // Check for conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(), dto.getStartTime(), dto.getEndTime());
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "Resource is already booked during this time slot. " +
                            conflicts.size() + " conflicting booking(s) found.");
        }

        // Resource resourceInfo =
        // resourceServiceClient.getResource(dto.getResourceId());

        Booking booking = Booking.builder()
                .resourceId(dto.getResourceId())
                .resourceName("Pending Catalog Integration") // Replace with catalog lookup
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
    public BookingResponseDto processAdminAction(String bookingId, AdminActionDto dto, String adminId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved or rejected");
        }

        if (dto.getAction() == BookingStatus.APPROVED) {
            booking.setStatus(BookingStatus.APPROVED);
            booking.setQrToken(UUID.randomUUID().toString()); // Generate QR token on approval
            booking.setApprovedBy(adminId);
        } else if (dto.getAction() == BookingStatus.REJECTED) {
            booking.setStatus(BookingStatus.REJECTED);
        } else {
            throw new IllegalArgumentException("Action must be APPROVED or REJECTED");
        }

        booking.setAdminNote(dto.getNote());
        booking.setUpdatedAt(LocalDateTime.now());

        // notificationService.notifyBookingStatusChange(booking);

        return toDto(bookingRepository.save(booking));
    }

    // -------------------------------------------------------
    // CANCEL BOOKING (user cancels own approved booking)
    // -------------------------------------------------------
    public BookingResponseDto cancelBooking(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        if (!booking.getUserId().equals(userId)) {
            throw new SecurityException("You can only cancel your own bookings");
        }
        if (booking.getStatus() != BookingStatus.APPROVED && booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        return toDto(bookingRepository.save(booking));
    }

    // -------------------------------------------------------
    // QR CHECK-IN
    // -------------------------------------------------------
    public BookingResponseDto checkInByQr(String qrToken) {
        Booking booking = bookingRepository.findByQrToken(qrToken)
                .orElseThrow(() -> new RuntimeException("Invalid or expired QR code"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED bookings can be checked in");
        }

        // Validate check-in is within booking time window (±15 min tolerance)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = booking.getStartTime().minusMinutes(15);
        LocalDateTime windowEnd = booking.getEndTime();

        if (now.isBefore(windowStart) || now.isAfter(windowEnd)) {
            throw new IllegalStateException(
                    "Check-in is only allowed within 15 minutes before start time until end time");
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
