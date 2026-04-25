package com.studentcampus.app.service;

import com.studentcampus.app.dto.NotificationRequestDTO;
import com.studentcampus.app.dto.UserResponseDTO;
import com.studentcampus.app.exception.ResourceNotFoundException;
import com.studentcampus.app.model.Notification;
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
    private final NotificationService notificationService;

    // -------------------------------------------------------
    // Called by OAuth2SuccessHandler on every Google login
    // Creates user if first time, updates name/picture if returning
    // -------------------------------------------------------
    public User findOrCreateUser(String googleId, String email,
                                 String name, String profilePicture) {
        return userRepository.findByGoogleId(googleId)
                .map(existing -> {
                    // Update profile info on every login
                    existing.setName(name);
                    existing.setProfilePicture(profilePicture);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    // First-time login — create with defaults
                    // userType and accountStatus properly set by completeRegistration()
                    User newUser = User.builder()
                            .googleId(googleId)
                            .email(email)
                            .name(name)
                            .profilePicture(profilePicture)
                            .roles(Set.of(User.Role.USER))
                            .userType(User.UserType.STUDENT)
                            .accountStatus(User.AccountStatus.ACTIVE)
                            .active(true)
                            .notificationPreferences(new User.NotificationPreferences())
                            .build();
                    log.info("New user registered: {}", email);
                    return userRepository.save(newUser);
                });
    }

    // -------------------------------------------------------
    // Check if user already exists by googleId
    // Used in OAuth2SuccessHandler to detect first-time login
    // -------------------------------------------------------
    public boolean existsByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId).isPresent();
    }

    // -------------------------------------------------------
    // Called after first Google login when user selects their type
    // Student  → ACTIVE + USER role immediately
    // Staff / Technician → PENDING until admin approves
    // -------------------------------------------------------
    public UserResponseDTO completeRegistration(String userId, User.UserType userType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        user.setUserType(userType);

        if (userType == User.UserType.STUDENT) {
            user.setRoles(Set.of(User.Role.USER));
            user.setAccountStatus(User.AccountStatus.ACTIVE);
            log.info("Student registered and activated: {}", userId);
        } else {
            // STAFF or TECHNICIAN — wait for admin approval
            user.setRoles(Set.of(User.Role.USER));
            user.setAccountStatus(User.AccountStatus.PENDING);
            log.info("User registered as {} — status PENDING: {}", userType, userId);
        }

        userRepository.save(user);
        return UserResponseDTO.from(user);
    }

    // -------------------------------------------------------
    // Admin approves a PENDING account and assigns roles
    // Sends ACCOUNT_APPROVED notification to the user
    // -------------------------------------------------------
    public UserResponseDTO approveUser(String userId, Set<User.Role> roles) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        user.setRoles(roles);
        user.setAccountStatus(User.AccountStatus.ACTIVE);
        user.setActive(true);
        userRepository.save(user);

        log.info("User approved: {} with roles: {}", userId, roles);

        // Send notification to the approved user
        NotificationRequestDTO notification = new NotificationRequestDTO();
        notification.setUserId(userId);
        notification.setTitle("Account Approved");
        notification.setMessage("Your account has been approved. You can now log in and access the system.");
        notification.setType(Notification.NotificationType.ACCOUNT_APPROVED);
        notification.setReferenceId(userId);
        notification.setReferenceType(Notification.ReferenceType.USER);
        notificationService.createNotification(notification);

        return UserResponseDTO.from(user);
    }

    // -------------------------------------------------------
    // Admin rejects a PENDING account
    // Sends ACCOUNT_REJECTED notification to the user
    // -------------------------------------------------------
    public UserResponseDTO rejectUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        user.setAccountStatus(User.AccountStatus.REJECTED);
        userRepository.save(user);

        log.info("User account rejected: {}", userId);

        // Send notification to the rejected user
        NotificationRequestDTO notification = new NotificationRequestDTO();
        notification.setUserId(userId);
        notification.setTitle("Account Not Approved");
        notification.setMessage("Your account registration was not approved. Please contact the admin for more information.");
        notification.setType(Notification.NotificationType.ACCOUNT_REJECTED);
        notification.setReferenceId(userId);
        notification.setReferenceType(Notification.ReferenceType.USER);
        notificationService.createNotification(notification);

        return UserResponseDTO.from(user);
    }

    // -------------------------------------------------------
    // Get all users — Admin only
    // -------------------------------------------------------
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponseDTO::from)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------
    // Get all PENDING users — for admin approval panel
    // -------------------------------------------------------
    public List<UserResponseDTO> getPendingUsers() {
        return userRepository.findByAccountStatus(User.AccountStatus.PENDING)
                .stream()
                .map(UserResponseDTO::from)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------
    // Get single user by ID
    // -------------------------------------------------------
    public UserResponseDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return UserResponseDTO.from(user);
    }

    // -------------------------------------------------------
    // Update user roles — Admin action
    // Sends ROLE_CHANGED notification to the user
    // -------------------------------------------------------
    public UserResponseDTO updateUserRoles(String id, Set<User.Role> newRoles) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        user.setRoles(newRoles);
        User saved = userRepository.save(user);
        log.info("Roles updated for user {}: {}", saved.getEmail(), newRoles);

        // Notify user about role change
        NotificationRequestDTO notification = new NotificationRequestDTO();
        notification.setUserId(id);
        notification.setTitle("Your Role Has Been Updated");
        notification.setMessage("Your account role has been changed to: "
                + newRoles.stream().map(Enum::name).collect(Collectors.joining(", ")));
        notification.setType(Notification.NotificationType.ROLE_CHANGED);
        notification.setReferenceId(id);
        notification.setReferenceType(Notification.ReferenceType.USER);
        notificationService.createNotification(notification);

        return UserResponseDTO.from(saved);
    }

    // -------------------------------------------------------
    // Deactivate user — soft delete, sets active=false
    // -------------------------------------------------------
    public UserResponseDTO deactivateUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        user.setActive(false);
        user.setAccountStatus(User.AccountStatus.DEACTIVATED);
        return UserResponseDTO.from(userRepository.save(user));
    }
}