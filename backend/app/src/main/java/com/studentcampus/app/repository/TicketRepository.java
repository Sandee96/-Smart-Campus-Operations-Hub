package com.studentcampus.app.repository;

import com.studentcampus.app.model.Ticket;
import com.studentcampus.app.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    // ✅ FIXED: match your Ticket model field names
    List<Ticket> findByCreatedBy(String createdBy);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByAssignedTechnicianId(String assignedTechnicianId);

    List<Ticket> findByCategory(String category);

    List<Ticket> findByLocation(String location);

    List<Ticket> findByCreatedByAndStatus(String createdBy, TicketStatus status);
}