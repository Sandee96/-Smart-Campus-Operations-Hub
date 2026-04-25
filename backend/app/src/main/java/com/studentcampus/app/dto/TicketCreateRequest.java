package com.studentcampus.app.dto;

import com.studentcampus.app.model.TicketCategory;
import com.studentcampus.app.model.Priority;
import lombok.Data;

@Data
public class TicketCreateRequest {
    private String resourceId;
    private String location;
    private TicketCategory category;
    private String description;
    private Priority priority;
    private String contactDetails;
}