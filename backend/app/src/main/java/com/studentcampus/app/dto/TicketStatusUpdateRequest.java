package com.studentcampus.app.dto;

import com.studentcampus.app.model.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private TicketStatus status;

    private String rejectionReason;
    private String resolutionNotes;
    private String assignedTo;
}