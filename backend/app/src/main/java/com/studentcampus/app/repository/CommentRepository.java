package com.studentcampus.app.repository;

import com.studentcampus.app.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    // Get all comments for a ticket (oldest first)
    List<Comment> findByTicketIdOrderByCreatedAtAsc(String ticketId);

    // Get all comments made by a specific user
    List<Comment> findByAuthorId(String authorId);

    // Delete all comments related to a ticket (used when ticket is deleted)
    void deleteByTicketId(String ticketId);
}