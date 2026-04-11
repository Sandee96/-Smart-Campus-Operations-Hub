package com.studentcampus.app.catalogue.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "resources")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    private String id;

    private String name;
    private ResourceType type;       // LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT
    private String location;
    private Integer capacity;        // null for equipment

    // Availability windows e.g. "MON-FRI 08:00-18:00"
    private List<String> availabilityWindows;

    private ResourceStatus status;   // ACTIVE, OUT_OF_SERVICE, UNDER_MAINTENANCE

    // Equipment specific
    private String description;
    private String imageUrl;

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}