package com.studentcampus.app.dto;

import com.studentcampus.app.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class UserResponseDTO {

    private String id;
    private String email;
    private String name;
    private String profilePicture;
    private Set<User.Role> roles;
    private User.UserType userType;           // STUDENT / STAFF / TECHNICIAN
    private User.AccountStatus accountStatus; // ACTIVE / PENDING / REJECTED / DEACTIVATED
    private boolean active;
    private LocalDateTime createdAt;

    // Static factory — converts User model to DTO (hides internal fields)
    public static UserResponseDTO from(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profilePicture(user.getProfilePicture())
                .roles(user.getRoles())
                .userType(user.getUserType())
                .accountStatus(user.getAccountStatus())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}