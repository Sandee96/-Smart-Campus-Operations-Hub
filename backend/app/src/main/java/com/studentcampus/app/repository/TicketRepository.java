package com.studentcampus.app.repository;

import com.studentcampus.app.model.Ticket;
import com.studentcampus.app.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByReportedBy(String reportedBy);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByAssignedTo(String assignedTo);

    List<Ticket> findByCategory(String category);

    List<Ticket> findByLocation(String location);

    List<Ticket> findByReportedByAndStatus(String reportedBy, TicketStatus status);
}
