package com.studentcampus.app.repository;

import com.studentcampus.app.model.Ticket;
import com.studentcampus.app.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByCreatedBy(String createdBy);
    List<Ticket> findByStatus(TicketStatus status);
}