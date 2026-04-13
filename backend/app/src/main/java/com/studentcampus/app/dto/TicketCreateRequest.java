package com.studentcampus.app.dto;

import com.studentcampus.app.model.Priority;
import lombok.Data;

@Data
public class TicketCreateRequest {
    private String resourceId;
    private String location;
    private String category;
    private String description;
    private Priority priority;
    private String contactDetails;
}
