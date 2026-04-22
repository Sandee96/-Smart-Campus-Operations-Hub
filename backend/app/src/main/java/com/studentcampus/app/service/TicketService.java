package com.studentcampus.app.service;

import com.studentcampus.app.dto.AssignTechnicianRequest;
import com.studentcampus.app.dto.TicketCreateRequest;
import com.studentcampus.app.dto.TicketStatusUpdateRequest;
import com.studentcampus.app.model.Ticket;
import com.studentcampus.app.model.TicketStatus;
import com.studentcampus.app.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    public Ticket createTicket(TicketCreateRequest request, String userId) {
        Ticket ticket = Ticket.builder()
                .resourceId(request.getResourceId())
                .location(request.getLocation())
                .category(request.getCategory())
                .description(request.getDescription())
                .priority(request.getPriority())
                .contactDetails(request.getContactDetails())
                .createdBy(userId)
                .status(TicketStatus.OPEN)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    public List<Ticket> getMyTickets(String userId) {
        return ticketRepository.findByCreatedBy(userId);
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Ticket updateTicketStatus(String ticketId, TicketStatusUpdateRequest request, String userId, boolean isAdmin) {
        Ticket ticket = getTicketById(ticketId);

        if (!isAdmin && !ticket.getCreatedBy().equals(userId)) {
            throw new AccessDeniedException("You can only update your own tickets");
        }

        ticket.setStatus(request.getStatus());
        ticket.setUpdatedAt(Instant.now());
        return ticketRepository.save(ticket);
    }

    public Ticket assignTechnician(String ticketId, AssignTechnicianRequest request, boolean isAdmin) {
        if (!isAdmin) {
            throw new AccessDeniedException("Only admins can assign technicians");
        }

        Ticket ticket = getTicketById(ticketId);
        ticket.setAssignedTechnicianId(request.getTechnicianId());
        ticket.setUpdatedAt(Instant.now());
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(String ticketId, String userId, boolean isAdmin) {
        Ticket ticket = getTicketById(ticketId);

        if (!isAdmin && !ticket.getCreatedBy().equals(userId)) {
            throw new AccessDeniedException("You can only delete your own tickets");
        }

        ticketRepository.delete(ticket);
    }
}