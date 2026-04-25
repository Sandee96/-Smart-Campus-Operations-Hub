package com.studentcampus.app.service;

import com.studentcampus.app.dto.CommentRequest;
import com.studentcampus.app.dto.NotificationTriggerHelper;
import com.studentcampus.app.exception.TicketNotFoundException;
import com.studentcampus.app.exception.UnauthorizedActionException;
import com.studentcampus.app.model.Comment;
import com.studentcampus.app.model.Notification;
import com.studentcampus.app.model.Ticket;
import com.studentcampus.app.repository.CommentRepository;
import com.studentcampus.app.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    public Comment addComment(String ticketId, CommentRequest request,
                              String userId, String userName) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        Comment comment = new Comment();
        comment.setTicketId(ticketId);
        comment.setAuthorId(userId);
        comment.setAuthorName(userName);
        comment.setBody(request.getBody());

        Comment saved = commentRepository.save(comment);

        if (!ticket.getCreatedBy().equals(userId)) {
            try {
                notificationService.createNotification(
                        NotificationTriggerHelper.ticket(
                                ticket.getCreatedBy(),
                                "New Comment on Your Ticket",
                                userName + " added a comment: \"" +
                                        truncate(request.getBody(), 60) + "\"",
                                Notification.NotificationType.NEW_COMMENT,
                                ticketId
                        )
                );
            } catch (Exception e) {
                log.warn("Failed to notify ticket owner of comment: {}", e.getMessage());
            }
        }

        if (ticket.getAssignedTechnicianId() != null
                && !ticket.getAssignedTechnicianId().isBlank()
                && !ticket.getAssignedTechnicianId().equals(userId)) {
            try {
                notificationService.createNotification(
                        NotificationTriggerHelper.ticket(
                                ticket.getAssignedTechnicianId(),
                                "New Comment on Assigned Ticket",
                                userName + " added a comment: \"" +
                                        truncate(request.getBody(), 60) + "\"",
                                Notification.NotificationType.NEW_COMMENT,
                                ticketId
                        )
                );
            } catch (Exception e) {
                log.warn("Failed to notify technician of comment: {}", e.getMessage());
            }
        }

        return saved;
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
                    "You can only edit your own comments");
        }

        comment.setBody(request.getBody());
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String userId,
                              boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!isAdmin && !comment.getAuthorId().equals(userId)) {
            throw new UnauthorizedActionException(
                    "You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    private String truncate(String text, int maxLength) {
        if (text == null) return "";
        return text.length() <= maxLength
                ? text
                : text.substring(0, maxLength) + "...";
    }
}