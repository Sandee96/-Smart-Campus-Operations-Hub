package com.studentcampus.app.auth;

import com.studentcampus.app.common.JwtUtil;
import com.studentcampus.app.dto.UserResponseDTO;
import com.studentcampus.app.model.User;
import com.studentcampus.app.repository.UserRepository;
import com.studentcampus.app.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserService userService;

    // -------------------------------------------------------
    // GET /auth/login/google
    // Returns the Google OAuth2 login URL
    // Frontend calls this to get the redirect URL
    // -------------------------------------------------------
    @GetMapping("/login/google")
    public ResponseEntity<Map<String, String>> getGoogleLoginUrl() {
        return ResponseEntity.ok(Map.of(
                "loginUrl", "http://localhost:8080/oauth2/authorization/google"
        ));
    }

    // -------------------------------------------------------
    // GET /auth/me
    // Returns current logged-in user's profile from JWT
    // Used by frontend navbar to show name and picture
    // -------------------------------------------------------
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7); // Remove "Bearer "
        String userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(UserResponseDTO.from(user));
    }

    // -------------------------------------------------------
    // POST /auth/register/complete
    // Called after first Google login when user selects their type
    // Body: { "userType": "STUDENT" } or "STAFF" or "TECHNICIAN"
    // Student → returns token + ACTIVE status immediately
    // Staff/Technician → returns PENDING status (no token yet)
    // -------------------------------------------------------
    @PostMapping("/register/complete")
    public ResponseEntity<Map<String, Object>> completeRegistration(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {

        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);

        String userTypeStr = body.get("userType");

        if (userTypeStr == null || userTypeStr.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "userType is required. Must be STUDENT, STAFF, or TECHNICIAN"
            ));
        }

        User.UserType userType;
        try {
            userType = User.UserType.valueOf(userTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid userType. Must be STUDENT, STAFF, or TECHNICIAN"
            ));
        }

        UserResponseDTO updatedUser = userService.completeRegistration(userId, userType);

        if (userType == User.UserType.STUDENT) {
            // Student — generate a real token and send to dashboard
            User user = userRepository.findById(userId).orElseThrow();
            String newToken = jwtUtil.generateToken(user);
            log.info("Student registration complete, token issued: {}", userId);
            return ResponseEntity.ok(Map.of(
                    "status", "ACTIVE",
                    "token", newToken,
                    "user", updatedUser
            ));
        }

        // Staff or Technician — pending admin approval
        log.info("Staff/Technician registration complete, awaiting approval: {}", userId);
        return ResponseEntity.ok(Map.of(
                "status", "PENDING",
                "message", "Your account is pending admin approval. You will be notified once approved."
        ));
    }
}