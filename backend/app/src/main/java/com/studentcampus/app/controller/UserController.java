package com.studentcampus.app.controller;

import com.studentcampus.app.dto.RoleUpdateRequestDTO;
import com.studentcampus.app.dto.UserResponseDTO;
import com.studentcampus.app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users  → Admin: get all users
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // GET /api/users/{id}  → get single user
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // PUT /api/users/{id}/roles  → Admin: update roles
    @PutMapping("/{id}/roles")
    public ResponseEntity<UserResponseDTO> updateRoles(
            @PathVariable String id,
            @Valid @RequestBody RoleUpdateRequestDTO request) {
        return ResponseEntity.ok(userService.updateUserRoles(id, request.getRoles()));
    }

    // DELETE /api/users/{id}  → Admin: deactivate user
    @DeleteMapping("/{id}")
    public ResponseEntity<UserResponseDTO> deactivateUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.deactivateUser(id));
    }
}