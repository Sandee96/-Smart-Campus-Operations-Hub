package com.studentcampus.app.repository;

import com.studentcampus.app.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByTicketIdOrderByCreatedAtAsc(String ticketId);

    List<Comment> findByAuthorId(String authorId);

    void deleteByTicketId(String ticketId);
}