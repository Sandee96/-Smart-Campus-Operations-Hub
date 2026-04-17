package com.studentcampus.app.dto;

import com.studentcampus.app.model.Resource;
import com.studentcampus.app.model.ResourceStatus;
import com.studentcampus.app.model.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ResourceRequestDto {

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String description;

    private ResourceStatus status;

    private List<Resource.AvailabilityWindow> availabilityWindows;
}