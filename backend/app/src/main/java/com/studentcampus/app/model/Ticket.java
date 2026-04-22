package com.studentcampus.app.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String resourceId;
    private String location;
    private TicketCategory category;
    private String description;
    private Priority priority;
    private TicketStatus status;

    private String contactDetails;
    private String createdBy;
    private String assignedTechnicianId;

    private Instant createdAt;
    private Instant updatedAt;
}