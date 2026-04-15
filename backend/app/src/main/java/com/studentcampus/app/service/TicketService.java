package com.studentcampus.app.service;

import com.studentcampus.app.dto.TicketCreateRequest;
import com.studentcampus.app.dto.TicketStatusUpdateRequest;
import com.studentcampus.app.exception.TicketNotFoundException;
import com.studentcampus.app.model.Ticket;
import com.studentcampus.app.model.TicketStatus;
import com.studentcampus.app.repository.CommentRepository;
import com.studentcampus.app.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final FileStorageService fileStorageService;

    // create a new ticket
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
        return ticketRepository.save(ticket);
    }

    // get single ticket
    public Ticket getTicketById(String ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));
    }

    // get all tickets - admin only
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // get tickets by status
    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    // get tickets by logged in user
    public List<Ticket> getMyTickets(String userId) {
        return ticketRepository.findByReportedBy(userId);
    }

    // get tickets assigned to technician
    public List<Ticket> getAssignedTickets(String technicianId) {
        return ticketRepository.findByAssignedTo(technicianId);
    }

    // update ticket status
    public Ticket updateTicketStatus(String ticketId, TicketStatusUpdateRequest request) {
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
        }

        return ticketRepository.save(ticket);
    }

    // add attachments to ticket
    public Ticket addAttachments(String ticketId, MultipartFile[] files) throws IOException {
        Ticket ticket = getTicketById(ticketId);

        int currentCount = ticket.getAttachments() != null ? 
                           ticket.getAttachments().size() : 0;
        if (currentCount + files.length > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed per ticket");
        }

        List<String> newFilePaths = fileStorageService.storeFiles(files);
        ticket.getAttachments().addAll(newFilePaths);
        return ticketRepository.save(ticket);
    }

    // delete ticket - admin only
    public void deleteTicket(String ticketId) {
        Ticket ticket = getTicketById(ticketId);

        if (ticket.getAttachments() != null) {
            ticket.getAttachments().forEach(fileStorageService::deleteFile);
        }

        commentRepository.deleteByTicketId(ticketId);
        ticketRepository.delete(ticket);
    }

    // enforce valid status transitions
    private void validateStatusTransition(TicketStatus current, TicketStatus next) {
        boolean valid = switch (current) {
            case OPEN -> next == TicketStatus.IN_PROGRESS || 
                         next == TicketStatus.REJECTED;
            case IN_PROGRESS -> next == TicketStatus.RESOLVED || 
                                next == TicketStatus.REJECTED;
            case RESOLVED -> next == TicketStatus.CLOSED;
            case CLOSED, REJECTED -> false;
        };

        if (!valid) {
            throw new RuntimeException(
                "Invalid status transition from " + current + " to " + next
            );
        }
    }
}