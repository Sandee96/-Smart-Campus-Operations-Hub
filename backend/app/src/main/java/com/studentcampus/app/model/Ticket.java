package com.studentcampus.app.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String resourceId;
    private String location;
    private String category;
    private String description;
    private Priority priority;
    private TicketStatus status = TicketStatus.OPEN;

    private String reportedBy;
    private String assignedTo;
    private String contactDetails;

    private List<String> attachments = new ArrayList<>();

    private String resolutionNotes;
    private String rejectionReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}