package com.studentcampus.app.dto;

import com.studentcampus.app.model.TicketStatus;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {
    private TicketStatus status;
    private String rejectionReason;
    private String resolutionNotes;
    private String assignedTo;
}
