package com.studentcampus.app.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequestDto {

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @NotBlank(message = "Purpose is required")
    @Size(max = 500, message = "Purpose must be under 500 characters")
    private String purpose;

    @Min(value = 1, message = "Expected attendees must be at least 1")
    private Integer expectedAttendees;
}
