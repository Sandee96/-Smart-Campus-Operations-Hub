package com.studentcampus.app.controller;

import com.studentcampus.app.common.security.UserPrincipal;
import com.studentcampus.app.dto.AssignTechnicianRequest;
import com.studentcampus.app.dto.TicketCreateRequest;
import com.studentcampus.app.dto.TicketStatusUpdateRequest;
import com.studentcampus.app.dto.TicketUpdateRequest;
import com.studentcampus.app.model.Ticket;
import com.studentcampus.app.model.TicketStatus;
import com.studentcampus.app.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    private UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) auth.getPrincipal();
    }

    private boolean isAdmin() {
        return getCurrentUser().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody TicketCreateRequest request) {
        Ticket created = ticketService.createTicket(request, getCurrentUser().getId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(
            @RequestParam(required = false) String status
    ) {
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            TicketStatus ticketStatus = TicketStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(ticketService.getTicketsByStatus(ticketStatus));
        }

        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets() {
        return ResponseEntity.ok(ticketService.getMyTickets(getCurrentUser().getId()));
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String ticketId) {
        return ResponseEntity.ok(ticketService.getTicketById(ticketId));
    }

    @PutMapping("/{ticketId}")
    public ResponseEntity<Ticket> updateTicketDetails(
            @PathVariable String ticketId,
            @RequestBody TicketUpdateRequest request
    ) {
        return ResponseEntity.ok(
                ticketService.updateTicketDetails(
                        ticketId,
                        request,
                        getCurrentUser().getId(),
                        isAdmin()
                )
        );
    }

    @PatchMapping("/{ticketId}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable String ticketId,
            @RequestBody TicketStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(
                ticketService.updateTicketStatus(
                        ticketId,
                        request,
                        getCurrentUser().getId(),
                        isAdmin()
                )
        );
    }

    @PatchMapping("/{ticketId}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable String ticketId,
            @RequestBody AssignTechnicianRequest request
    ) {
        return ResponseEntity.ok(
                ticketService.assignTechnician(ticketId, request, isAdmin())
        );
    }

    @DeleteMapping("/{ticketId}")
    public ResponseEntity<String> deleteTicket(@PathVariable String ticketId) {
        ticketService.deleteTicket(ticketId, getCurrentUser().getId(), isAdmin());
        return ResponseEntity.ok("Ticket deleted successfully");
    }
}