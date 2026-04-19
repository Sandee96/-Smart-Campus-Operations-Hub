package com.studentcampus.app.service;

import com.studentcampus.app.dto.NotificationTriggerHelper;
import com.studentcampus.app.dto.TicketCreateRequest;
import com.studentcampus.app.dto.TicketStatusUpdateRequest;
import com.studentcampus.app.exception.TicketNotFoundException;
import com.studentcampus.app.model.Notification;
import com.studentcampus.app.model.Ticket;
import com.studentcampus.app.model.TicketStatus;
import com.studentcampus.app.repository.CommentRepository;
import com.studentcampus.app.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService; // ✅ injected

    // -------------------------------------------------------
    // CREATE TICKET
    // -------------------------------------------------------
    public Ticket createTicket(TicketCreateRequest request, String userId) {
        Ticket ticket = new Ticket();
        ticket.setResourceId(request.getResourceId());
        ticket.setLocation(request.getLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setContactDetails(request.getContactDetails());
        ticket.setReportedBy(userId);
        ticket.setStatus(TicketStatus.OPEN);
        Ticket saved = ticketRepository.save(ticket);

        // ✅ Notify user — ticket created
        try {
            notificationService.createNotification(
                NotificationTriggerHelper.ticket(
                    userId,
                    "Ticket Submitted",
                    "Your incident ticket for " + request.getLocation() +
                    " has been submitted successfully.",
                    Notification.NotificationType.GENERAL,
                    saved.getId()
                )
            );
        } catch (Exception e) {
            log.warn("Failed to send ticket created notification: {}", e.getMessage());
        }

        return saved;
    }

    // -------------------------------------------------------
    // GET SINGLE TICKET
    // -------------------------------------------------------
    public Ticket getTicketById(String ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));
    }

    // -------------------------------------------------------
    // GET ALL TICKETS — ADMIN ONLY
    // -------------------------------------------------------
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // -------------------------------------------------------
    // GET TICKETS BY STATUS
    // -------------------------------------------------------
    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    // -------------------------------------------------------
    // GET MY TICKETS
    // -------------------------------------------------------
    public List<Ticket> getMyTickets(String userId) {
        return ticketRepository.findByReportedBy(userId);
    }

    // -------------------------------------------------------
    // GET ASSIGNED TICKETS — TECHNICIAN
    // -------------------------------------------------------
    public List<Ticket> getAssignedTickets(String technicianId) {
        return ticketRepository.findByAssignedTo(technicianId);
    }

    // -------------------------------------------------------
    // UPDATE TICKET STATUS
    // -------------------------------------------------------
    public Ticket updateTicketStatus(String ticketId,
            TicketStatusUpdateRequest request) {

        Ticket ticket = getTicketById(ticketId);
        validateStatusTransition(ticket.getStatus(), request.getStatus());
        ticket.setStatus(request.getStatus());

        if (request.getStatus() == TicketStatus.REJECTED) {
            if (request.getRejectionReason() == null ||
                    request.getRejectionReason().isBlank()) {
                throw new RuntimeException("Rejection reason is required");
            }
            ticket.setRejectionReason(request.getRejectionReason());
        }

        if (request.getStatus() == TicketStatus.RESOLVED) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }

        if (request.getAssignedTo() != null &&
                !request.getAssignedTo().isBlank()) {
            ticket.setAssignedTo(request.getAssignedTo());

            // ✅ Notify technician — assigned to ticket
            try {
                notificationService.createNotification(
                    NotificationTriggerHelper.ticket(
                        request.getAssignedTo(),
                        "Ticket Assigned to You",
                        "You have been assigned to ticket #" + ticketId +
                        " at " + ticket.getLocation() + ".",
                        Notification.NotificationType.TICKET_ASSIGNED,
                        ticketId
                    )
                );
            } catch (Exception e) {
                log.warn("Failed to send ticket assigned notification: {}", e.getMessage());
            }
        }

        Ticket saved = ticketRepository.save(ticket);

        // ✅ Notify ticket owner — status changed
        try {
            String statusMessage = switch (request.getStatus()) {
                case IN_PROGRESS -> "Your ticket is now being worked on by a technician.";
                case RESOLVED    -> "Your ticket has been resolved. " +
                                    (request.getResolutionNotes() != null ?
                                    "Notes: " + request.getResolutionNotes() : "");
                case CLOSED      -> "Your ticket has been closed.";
                case REJECTED    -> "Your ticket has been rejected. Reason: " +
                                    request.getRejectionReason();
                default          -> "Your ticket status has been updated to " +
                                    request.getStatus().name();
            };

            notificationService.createNotification(
                NotificationTriggerHelper.ticket(
                    ticket.getReportedBy(),
                    "Ticket Status Updated",
                    statusMessage,
                    Notification.NotificationType.TICKET_STATUS_CHANGED,
                    ticketId
                )
            );
        } catch (Exception e) {
            log.warn("Failed to send ticket status notification: {}", e.getMessage());
        }

        return saved;
    }

    // -------------------------------------------------------
    // ADD ATTACHMENTS
    // -------------------------------------------------------
    public Ticket addAttachments(String ticketId,
            MultipartFile[] files) throws IOException {

        Ticket ticket = getTicketById(ticketId);
        int currentCount = ticket.getAttachments() != null ?
                ticket.getAttachments().size() : 0;

        if (currentCount + files.length > 3) {
            throw new RuntimeException(
                    "Maximum 3 attachments allowed per ticket");
        }

        List<String> newFilePaths = fileStorageService.storeFiles(files);
        ticket.getAttachments().addAll(newFilePaths);
        return ticketRepository.save(ticket);
    }

    // -------------------------------------------------------
    // DELETE TICKET — ADMIN ONLY
    // -------------------------------------------------------
    public void deleteTicket(String ticketId) {
        Ticket ticket = getTicketById(ticketId);

        if (ticket.getAttachments() != null) {
            ticket.getAttachments().forEach(fileStorageService::deleteFile);
        }

        commentRepository.deleteByTicketId(ticketId);
        ticketRepository.delete(ticket);
    }

    // -------------------------------------------------------
    // VALIDATE STATUS TRANSITIONS
    // -------------------------------------------------------
    private void validateStatusTransition(TicketStatus current,
            TicketStatus next) {
        boolean valid = switch (current) {
            case OPEN        -> next == TicketStatus.IN_PROGRESS ||
                                next == TicketStatus.REJECTED;
            case IN_PROGRESS -> next == TicketStatus.RESOLVED ||
                                next == TicketStatus.REJECTED;
            case RESOLVED    -> next == TicketStatus.CLOSED;
            case CLOSED, REJECTED -> false;
        };

        if (!valid) {
            throw new RuntimeException(
                "Invalid status transition from " + current + " to " + next);
        }
    }
}