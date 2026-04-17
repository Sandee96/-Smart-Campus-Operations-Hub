package com.studentcampus.app.repository;

import com.studentcampus.app.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Get all notifications for a user, newest first
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    // Get only unread notifications for a user
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(String userId);

    // Count unread notifications — for the notification badge
    long countByUserIdAndReadFalse(String userId);

    // Delete all notifications for a user
    void deleteAllByUserId(String userId);
}