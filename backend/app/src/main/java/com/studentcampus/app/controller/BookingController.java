package com.studentcampus.app.controller;

import com.studentcampus.app.dto.AdminActionDto;
import com.studentcampus.app.dto.BookingRequestDto;
import com.studentcampus.app.dto.BookingResponseDto;
import com.studentcampus.app.service.BookingService;
import com.studentcampus.app.common.dto.ApiResponse;
import com.studentcampus.app.common.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.allowed-origins}")
public class BookingController {

    private final BookingService bookingService;

    // -------------------------------------------------------
    // Helper — get the currently logged-in user from JWT
    // -------------------------------------------------------
    private UserPrincipal currentUser() {
        return (UserPrincipal) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // -------------------------------------------------------
    // POST /api/bookings → Create a new booking request
    // Auth: USER, ADMIN
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponseDto>> createBooking(
            @Valid @RequestBody BookingRequestDto dto) {

        UserPrincipal user = currentUser();

        BookingResponseDto response = bookingService.createBooking(
                dto,
                user.getId(),
                user.getName(),
                user.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking request submitted successfully", response));
    }

    // -------------------------------------------------------
    // GET /api/bookings/my → Get current user's bookings
    // Auth: USER, ADMIN
    // -------------------------------------------------------
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getMyBookings() {

        String userId = currentUser().getId();

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
    // GET /api/bookings/{id} → Get a specific booking by ID
    // Auth: USER (own booking), ADMIN (any)
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getBookingById(
            @PathVariable String id) {

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

        String adminId = currentUser().getId();

        BookingResponseDto response = bookingService.processAdminAction(id, dto, adminId);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated", response));
    }

    // -------------------------------------------------------
    // DELETE /api/bookings/{id} → Cancel a booking
    // Auth: USER (own booking only), ADMIN (any)
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> cancelBooking(
            @PathVariable String id) {

        String userId = currentUser().getId();

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