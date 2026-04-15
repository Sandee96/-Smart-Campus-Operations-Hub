package com.studentcampus.app.auth;

import com.studentcampus.app.common.JwtUtil;
import com.studentcampus.app.dto.UserResponseDTO;
import com.studentcampus.app.model.User;
import com.studentcampus.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // GET /auth/login/google  → returns the Google login URL
    @GetMapping("/login/google")
    public ResponseEntity<Map<String, String>> getGoogleLoginUrl() {
        return ResponseEntity.ok(Map.of(
            "loginUrl", "http://localhost:8080/oauth2/authorization/google"
        ));
    }

    // GET /auth/me  → returns current logged-in user info from JWT
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7); // Remove "Bearer "
        String userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(UserResponseDTO.from(user));
    }
}