package com.studentcampus.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String name;

    private String profilePicture;   // Google profile pic URL

    private String googleId;         // Google sub (unique Google user ID)

    // What the user selected during registration
    @Builder.Default
    private UserType userType = UserType.STUDENT;

    // Account approval status
    @Builder.Default
    private AccountStatus accountStatus = AccountStatus.ACTIVE;

    @Builder.Default
    private Set<Role> roles = Set.of(Role.USER);

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private NotificationPreferences notificationPreferences
            = new NotificationPreferences();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // -------------------------------------------------------
    // Enums
    // -------------------------------------------------------

    public enum Role {
        USER,
        ADMIN,
        TECHNICIAN
    }

    // What type the user selected at registration
    public enum UserType {
        STUDENT,
        STAFF,
        TECHNICIAN
    }

    // Account approval workflow
    public enum AccountStatus {
        ACTIVE,       // Student: auto-active. Staff/Technician: after admin approves
        PENDING,      // Staff/Technician waiting for admin approval
        REJECTED,     // Admin rejected the account
        DEACTIVATED   // Admin deactivated the account
    }

    // -------------------------------------------------------
    // Nested class — Notification Preferences
    // -------------------------------------------------------

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NotificationPreferences {
        private boolean bookingUpdates       = true;
        private boolean ticketUpdates        = true;
        private boolean ticketAssigned       = true;
        private boolean newComments          = true;
        private boolean roleChanges          = true;
        private boolean generalNotifications = true;
    }
}