package com.studentcampus.app.service;

import com.studentcampus.app.dto.UserResponseDTO;
import com.studentcampus.app.model.User;
import com.studentcampus.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Called by OAuth2 handler — create user if first login, update if returning
    public User findOrCreateUser(String googleId, String email,
                                  String name, String profilePicture) {
        return userRepository.findByGoogleId(googleId)
                .map(existing -> {
                    // Update profile info on every login (name/pic may change)
                    existing.setName(name);
                    existing.setProfilePicture(profilePicture);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .googleId(googleId)
                            .email(email)
                            .name(name)
                            .profilePicture(profilePicture)
                            .roles(Set.of(User.Role.USER))
                            .active(true)
                            .build();
                    log.info("New user registered: {}", email);
                    return userRepository.save(newUser);
                });
    }

    // Get all users — Admin only
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponseDTO::from)
                .collect(Collectors.toList());
    }

    // Get single user by ID
    public UserResponseDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        return UserResponseDTO.from(user);
    }

    // Update roles — Admin only
    public UserResponseDTO updateUserRoles(String id, Set<User.Role> newRoles) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setRoles(newRoles);
        User saved = userRepository.save(user);
        log.info("Roles updated for user {}: {}", saved.getEmail(), newRoles);
        return UserResponseDTO.from(saved);
    }

    // Deactivate user — Admin only
    public UserResponseDTO deactivateUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setActive(false);
        return UserResponseDTO.from(userRepository.save(user));
    }
}