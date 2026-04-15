package com.studentcampus.app.controller;

import com.studentcampus.app.dto.*;
import com.studentcampus.app.service.BookingService;
import com.studentcampus.app.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.allowed-origins}")
public class BookingController {

    private final BookingService bookingService;

    // -------------------------------------------------------
    // POST /api/bookings → Create a new booking request
    // Auth: USER, ADMIN
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponseDto>> createBooking(
            @Valid @RequestBody BookingRequestDto dto) {

        // TODO: Replace hardcoded values with SecurityContextHolder once Auth module is
        // ready
        String userId = "placeholder-user-id";
        String userName = "Placeholder User";
        String userEmail = "user@example.com";

        BookingResponseDto response = bookingService.createBooking(dto, userId, userName, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking request submitted successfully", response));
    }

    // -------------------------------------------------------
    // GET /api/bookings/my → Get current user's bookings
    // Auth: USER, ADMIN
    // -------------------------------------------------------
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getMyBookings() {
        String userId = "placeholder-user-id"; // Replace with auth context
        List<BookingResponseDto> bookings = bookingService.getMyBookings(userId);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookings));
    }

    // -------------------------------------------------------
    // GET /api/bookings → Get all bookings (Admin only)
    // Auth: ADMIN
    // -------------------------------------------------------
    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getAllBookings() {
        List<BookingResponseDto> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success("All bookings retrieved", bookings));
    }

    // -------------------------------------------------------
    // GET /api/bookings/{id} → Get a specific booking
    // Auth: USER (own), ADMIN (any)
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getBookingById(@PathVariable String id) {
        BookingResponseDto booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved", booking));
    }

    // -------------------------------------------------------
    // PATCH /api/bookings/{id}/action → Admin approve/reject
    // Auth: ADMIN
    // -------------------------------------------------------
    @PatchMapping("/{id}/action")
    public ResponseEntity<ApiResponse<BookingResponseDto>> processAdminAction(
            @PathVariable String id,
            @Valid @RequestBody AdminActionDto dto) {
        String adminId = "placeholder-admin-id"; // Replace with auth context
        BookingResponseDto response = bookingService.processAdminAction(id, dto, adminId);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated", response));
    }

    // -------------------------------------------------------
    // DELETE /api/bookings/{id} → Cancel a booking
    // Auth: USER (own booking), ADMIN (any)
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> cancelBooking(@PathVariable String id) {
        String userId = "placeholder-user-id"; // Replace with auth context
        BookingResponseDto response = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", response));
    }

    // -------------------------------------------------------
    // POST /api/bookings/checkin → QR code check-in
    // Auth: Public (token is the auth mechanism)
    // -------------------------------------------------------
    @PostMapping("/checkin")
    public ResponseEntity<ApiResponse<BookingResponseDto>> checkIn(
            @RequestParam String token) {
        BookingResponseDto response = bookingService.checkInByQr(token);
        return ResponseEntity.ok(ApiResponse.success("Check-in successful!", response));
    }
}