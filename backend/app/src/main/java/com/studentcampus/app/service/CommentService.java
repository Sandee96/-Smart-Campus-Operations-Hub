package com.studentcampus.app.service;

import com.studentcampus.app.dto.CommentRequest;
import com.studentcampus.app.exception.TicketNotFoundException;
import com.studentcampus.app.exception.UnauthorizedActionException;
import com.studentcampus.app.model.Comment;
import com.studentcampus.app.repository.CommentRepository;
import com.studentcampus.app.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;

    public Comment addComment(String ticketId, CommentRequest request,
                              String userId, String userName) {
        ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        Comment comment = new Comment();
        comment.setTicketId(ticketId);
        comment.setAuthorId(userId);
        comment.setAuthorName(userName);
        comment.setBody(request.getBody());

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByTicket(String ticketId) {
        ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public Comment editComment(String commentId, CommentRequest request,
                               String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthorId().equals(userId)) {
            throw new UnauthorizedActionException(
                "You can only edit your own comments"
            );
        }

        comment.setBody(request.getBody());
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!isAdmin && !comment.getAuthorId().equals(userId)) {
            throw new UnauthorizedActionException(
                "You can only delete your own comments"
            );
        }

        commentRepository.delete(comment);
    }
}
