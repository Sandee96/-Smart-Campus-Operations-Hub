package com.studentcampus.app.auth.repository;

import com.studentcampus.app.auth.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Find user by email — used during OAuth2 login
    Optional<User> findByEmail(String email);

    // Find user by Google ID — primary lookup on returning users
    Optional<User> findByGoogleId(String googleId);

    // Check if email already registered
    boolean existsByEmail(String email);
}