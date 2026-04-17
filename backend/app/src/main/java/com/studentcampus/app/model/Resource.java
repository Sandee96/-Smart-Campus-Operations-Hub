package com.studentcampus.app.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private String description;

    @Builder.Default
    private ResourceStatus status = ResourceStatus.ACTIVE;

    private List<AvailabilityWindow> availabilityWindows;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ── Inner class — no separate file needed ──────────────
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AvailabilityWindow {
        private String dayOfWeek;  // e.g. "MONDAY", "TUESDAY"
        private String startTime;  // e.g. "08:00"
        private String endTime;    // e.g. "18:00"
    }
}