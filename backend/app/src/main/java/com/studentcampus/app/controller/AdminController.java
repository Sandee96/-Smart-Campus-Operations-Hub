package com.studentcampus.app.controller;

import com.studentcampus.app.dto.RoleUpdateRequestDTO;
import com.studentcampus.app.dto.UserResponseDTO;
import com.studentcampus.app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")   // Entire controller — ADMIN only
public class AdminController {

    private final UserService userService;

    // -------------------------------------------------------
    // GET /api/admin/users
    // View all users — Admin User Management Panel
    // -------------------------------------------------------
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // -------------------------------------------------------
    // GET /api/admin/users/pending
    // View all users with PENDING account status
    // Used in admin approval panel
    // -------------------------------------------------------
    @GetMapping("/users/pending")
    public ResponseEntity<List<UserResponseDTO>> getPendingUsers() {
        return ResponseEntity.ok(userService.getPendingUsers());
    }

    // -------------------------------------------------------
    // GET /api/admin/users/{id}
    // View single user details
    // -------------------------------------------------------
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // -------------------------------------------------------
    // PUT /api/admin/users/{id}/roles
    // Change user roles (e.g., promote USER to ADMIN or TECHNICIAN)
    // Body: { "roles": ["ADMIN"] }
    // -------------------------------------------------------
    @PutMapping("/users/{id}/roles")
    public ResponseEntity<UserResponseDTO> updateUserRoles(
            @PathVariable String id,
            @Valid @RequestBody RoleUpdateRequestDTO request) {
        return ResponseEntity.ok(
                userService.updateUserRoles(id, request.getRoles()));
    }

    // -------------------------------------------------------
    // PUT /api/admin/users/{id}/approve
    // Approve a PENDING account and assign roles
    // Body: { "roles": ["TECHNICIAN"] }
    // Sends ACCOUNT_APPROVED notification to the user
    // -------------------------------------------------------
    @PutMapping("/users/{id}/approve")
    public ResponseEntity<UserResponseDTO> approveUser(
            @PathVariable String id,
            @Valid @RequestBody RoleUpdateRequestDTO request) {
        return ResponseEntity.ok(
                userService.approveUser(id, request.getRoles()));
    }

    // -------------------------------------------------------
    // PUT /api/admin/users/{id}/reject
    // Reject a PENDING account
    // Sends ACCOUNT_REJECTED notification to the user
    // -------------------------------------------------------
    @PutMapping("/users/{id}/reject")
    public ResponseEntity<UserResponseDTO> rejectUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.rejectUser(id));
    }

    // -------------------------------------------------------
    // DELETE /api/admin/users/{id}
    // Deactivate a user (soft delete — sets active=false)
    // -------------------------------------------------------
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deactivateUser(
            @PathVariable String id) {
        userService.deactivateUser(id);
        return ResponseEntity.ok(
                Map.of("message", "User deactivated successfully"));
    }

    // -------------------------------------------------------
    // GET /api/admin/users/stats
    // User statistics for admin dashboard cards
    // -------------------------------------------------------
    @GetMapping("/users/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        List<UserResponseDTO> allUsers = userService.getAllUsers();

        long totalUsers = allUsers.size();
        long activeUsers = allUsers.stream()
                .filter(UserResponseDTO::isActive).count();
        long adminCount = allUsers.stream()
                .filter(u -> u.getRoles().stream()
                        .anyMatch(r -> r.name().equals("ADMIN"))).count();
        long technicianCount = allUsers.stream()
                .filter(u -> u.getRoles().stream()
                        .anyMatch(r -> r.name().equals("TECHNICIAN"))).count();
        long pendingCount = allUsers.stream()
                .filter(u -> u.getAccountStatus() != null
                        && u.getAccountStatus().name().equals("PENDING")).count();

        return ResponseEntity.ok(Map.of(
                "totalUsers",     totalUsers,
                "activeUsers",    activeUsers,
                "adminCount",     adminCount,
                "technicianCount",technicianCount,
                "pendingCount",   pendingCount
        ));
    }
}