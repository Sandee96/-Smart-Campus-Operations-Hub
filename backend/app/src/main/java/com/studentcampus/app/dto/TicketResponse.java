package com.studentcampus.app.dto;

import com.studentcampus.app.model.Priority;
import com.studentcampus.app.model.TicketStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketResponse {
    private String id;
    private String resourceId;
    private String location;
    private String category;
    private String description;
    private Priority priority;
    private TicketStatus status;
    private String reportedBy;
    private String assignedTo;
    private String contactDetails;
    private List<String> attachments;
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}