package com.studentcampus.app.booking.repository;

import com.studentcampus.app.booking.model.Booking;
import com.studentcampus.app.booking.model.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {

    // Get all bookings for a user
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    // Get bookings by status (admin)
    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    // Get bookings for a resource
    List<Booking> findByResourceIdAndStatusNotOrderByStartTimeAsc(
            String resourceId, BookingStatus status);

    // Conflict detection query
    @Query("{ 'resourceId': ?0, 'status': { $in: ['PENDING', 'APPROVED'] }, " +
            "$and: [ { 'startTime': { $lt: ?2 } }, { 'endTime': { $gt: ?1 } } ] }")
    List<Booking> findConflictingBookings(String resourceId,
            LocalDateTime startTime,
            LocalDateTime endTime);

    // QR check-in lookup
    Optional<Booking> findByQrToken(String qrToken);

    // Find all (admin)
    List<Booking> findAllByOrderByCreatedAtDesc();
}
