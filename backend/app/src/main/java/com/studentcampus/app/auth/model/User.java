package com.studentcampus.app.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;                  // MongoDB ObjectId — referenced by Booking.userId

    @Indexed(unique = true)
    private String email;               // Google account email

    private String name;                // Full name from Google profile
    private String pictureUrl;          // Google profile picture URL

    private String googleId;            // Google `sub` claim — used to match returning users

    @Builder.Default
    private Role role = Role.USER;      // Default role on first login

    @Builder.Default
    private boolean active = true;      // Admin can deactivate a user without deleting

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Role {
        USER,
        TECHNICIAN,
        ADMIN
    }
}