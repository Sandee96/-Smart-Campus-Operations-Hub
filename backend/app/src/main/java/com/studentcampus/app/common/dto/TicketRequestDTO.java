package com.studentcampus.app.common.dto;

import com.studentcampus.app.enums.Category;
import com.studentcampus.app.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TicketRequestDTO {

    private String resourceId;

    @NotBlank(message = "Resource or location is required")
    private String resourceOrLocation;

    @NotNull(message = "Category is required")
    private Category category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotBlank(message = "Preferred contact is required")
    private String preferredContact;

    @NotBlank(message = "CreatedBy is required")
    private String createdBy;

    public String getResourceId() {
        return resourceId;
    }

    public String getResourceOrLocation() {
        return resourceOrLocation;
    }

    public Category getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public Priority getPriority() {
        return priority;
    }

    public String getPreferredContact() {
        return preferredContact;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public void setResourceOrLocation(String resourceOrLocation) {
        this.resourceOrLocation = resourceOrLocation;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public void setPreferredContact(String preferredContact) {
        this.preferredContact = preferredContact;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}