package com.studentcampus.app.controller;

import com.studentcampus.app.common.JwtUtil;
import com.studentcampus.app.dto.UserResponseDTO;
import com.studentcampus.app.exception.ResourceNotFoundException;
import com.studentcampus.app.model.User;
import com.studentcampus.app.repository.UserRepository;
import com.studentcampus.app.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // -------------------------------------------------------
    // GET /api/users
    // Get all users — Admin only (protected in SecurityConfig)
    // -------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // -------------------------------------------------------
    // GET /api/users/{id}
    // Get single user by ID — any authenticated user
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // -------------------------------------------------------
    // GET /api/users/me/preferences
    // Get current user's notification preferences
    // -------------------------------------------------------
    @GetMapping("/me/preferences")
    public ResponseEntity<User.NotificationPreferences> getPreferences(
            @RequestHeader("Authorization") String authHeader) {

        String userId = jwtUtil.extractUserId(authHeader.substring(7));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        User.NotificationPreferences prefs = user.getNotificationPreferences();
        if (prefs == null) prefs = new User.NotificationPreferences();

        return ResponseEntity.ok(prefs);
    }

    // -------------------------------------------------------
    // PUT /api/users/me/preferences
    // Update current user's notification preferences
    // Body: { "bookingUpdates": true, "ticketUpdates": false, ... }
    // -------------------------------------------------------
    @PutMapping("/me/preferences")
    public ResponseEntity<User.NotificationPreferences> updatePreferences(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody User.NotificationPreferences preferences) {

        String userId = jwtUtil.extractUserId(authHeader.substring(7));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        user.setNotificationPreferences(preferences);
        userRepository.save(user);
        log.info("Notification preferences updated for user: {}", userId);

        return ResponseEntity.ok(preferences);
    }

    // -------------------------------------------------------
    // DELETE /api/users/{id}
    // Deactivate user — Admin only (protected in SecurityConfig)
    // NOTE: Role management is in AdminController only
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<UserResponseDTO> deactivateUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.deactivateUser(id));
    }
}