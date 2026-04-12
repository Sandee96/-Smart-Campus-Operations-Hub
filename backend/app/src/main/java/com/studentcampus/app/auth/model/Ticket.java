package com.studentcampus.app.auth.model;

import com.studentcampus.app.enums.Category;
import com.studentcampus.app.enums.Priority;
import com.studentcampus.app.enums.TicketStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String resourceId;
    private String resourceOrLocation;

    private Category category;
    private String description;
    private Priority priority;
    private TicketStatus status;

    private String preferredContact;
    private String createdBy;
    private String assignedTechnicianId;

    private String rejectionReason;
    private String resolutionNotes;

    private List<Attachment> attachments = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;

    public Ticket() {
    }

    public String getId() {
        return id;
    }

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

    public TicketStatus getStatus() {
        return status;
    }

    public String getPreferredContact() {
        return preferredContact;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public String getAssignedTechnicianId() {
        return assignedTechnicianId;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public List<Attachment> getAttachments() {
        return attachments;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setId(String id) {
        this.id = id;
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

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public void setPreferredContact(String preferredContact) {
        this.preferredContact = preferredContact;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public void setAssignedTechnicianId(String assignedTechnicianId) {
        this.assignedTechnicianId = assignedTechnicianId;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}