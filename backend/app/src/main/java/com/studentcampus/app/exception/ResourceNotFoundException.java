package com.studentcampus.app.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String id) {
        super("Resource not found with id: " + id);
    }
}
