package com.studentcampus.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    // Used by teammates: new ResourceNotFoundException(id)
    // e.g. ResourceServiceImpl, BookingService
    public ResourceNotFoundException(String id) {
        super("Resource not found with id: " + id);
    }

    // Used by your code: new ResourceNotFoundException("User", id)
    // e.g. UserService, NotificationService
    public ResourceNotFoundException(String resourceType, String id) {
        super(resourceType + " not found with id: " + id);
    }
}