package com.studentcampus.app.auth.repository;

import com.studentcampus.app.auth.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface TicketRepository extends MongoRepository<Ticket, String> {
}