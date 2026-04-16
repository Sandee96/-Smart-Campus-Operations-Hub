package com.studentcampus.app.dto;

import com.studentcampus.app.model.Resource;
import com.studentcampus.app.model.ResourceStatus;
import com.studentcampus.app.model.ResourceType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ResourceResponseDto {

    private String id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private String description;
    private ResourceStatus status;
    private List<Resource.AvailabilityWindow> availabilityWindows;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}