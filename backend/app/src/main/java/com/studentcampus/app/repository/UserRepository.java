package com.studentcampus.app.repository;

import com.studentcampus.app.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    boolean existsByEmail(String email);

    // Get all users with a specific account status (e.g., PENDING)
    List<User> findByAccountStatus(User.AccountStatus accountStatus);
}