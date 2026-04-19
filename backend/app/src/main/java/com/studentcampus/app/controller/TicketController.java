package com.studentcampus.app.controller;

import com.studentcampus.app.common.security.UserPrincipal;
import com.studentcampus.app.dto.TicketCreateRequest;
import com.studentcampus.app.dto.TicketStatusUpdateRequest;
import com.studentcampus.app.model.Ticket;
import com.studentcampus.app.model.TicketStatus;
import com.studentcampus.app.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // ✅ Returns UserPrincipal NOT String
    private UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder
                .getContext().getAuthentication();
        return (UserPrincipal) auth.getPrincipal();
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @RequestBody TicketCreateRequest request) {
        String userId = getCurrentUser().getId(); // ✅
        Ticket createdTicket = ticketService.createTicket(request, userId);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<Ticket> getTicketById(
            @PathVariable String ticketId) {
        return ResponseEntity.ok(ticketService.getTicketById(ticketId));
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(
            @RequestParam(required = false) TicketStatus status) {
        if (status != null) {
            return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
        }
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets() {
        String userId = getCurrentUser().getId(); // ✅
        return ResponseEntity.ok(ticketService.getMyTickets(userId));
    }

    @GetMapping("/assigned/{technicianId}")
    public ResponseEntity<List<Ticket>> getAssignedTickets(
            @PathVariable String technicianId) {
        return ResponseEntity.ok(
                ticketService.getAssignedTickets(technicianId));
    }

    @PatchMapping("/{ticketId}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable String ticketId,
            @RequestBody TicketStatusUpdateRequest request) {
        return ResponseEntity.ok(
                ticketService.updateTicketStatus(ticketId, request));
    }

    @PostMapping("/{ticketId}/attachments")
    public ResponseEntity<Ticket> addAttachments(
            @PathVariable String ticketId,
            @RequestParam("files") MultipartFile[] files) throws IOException {
        return ResponseEntity.ok(
                ticketService.addAttachments(ticketId, files));
    }

    @DeleteMapping("/{ticketId}")
    public ResponseEntity<String> deleteTicket(
            @PathVariable String ticketId) {
        ticketService.deleteTicket(ticketId);
        return ResponseEntity.ok("Ticket deleted successfully");
    }
}