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
    private final NotificationService notificationService; // ✅ added

    // -------------------------------------------------------
    // ADD COMMENT — notify ticket owner and assigned technician
    // -------------------------------------------------------
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

        // ✅ Notify ticket OWNER — if commenter is NOT the owner
        if (!ticket.getReportedBy().equals(userId)) {
            try {
                notificationService.createNotification(
                    NotificationTriggerHelper.ticket(
                        ticket.getReportedBy(),
                        "New Comment on Your Ticket",
                        userName + " added a comment: \"" +
                        truncate(request.getBody(), 60) + "\"",
                        Notification.NotificationType.NEW_COMMENT,
                        ticketId
                    )
                );
            } catch (Exception e) {
                log.warn("Failed to notify ticket owner of comment: {}",
                        e.getMessage());
            }
        }

        // ✅ Notify assigned TECHNICIAN — if exists and is NOT the commenter
        if (ticket.getAssignedTo() != null
                && !ticket.getAssignedTo().isBlank()
                && !ticket.getAssignedTo().equals(userId)) {
            try {
                notificationService.createNotification(
                    NotificationTriggerHelper.ticket(
                        ticket.getAssignedTo(),
                        "New Comment on Assigned Ticket",
                        userName + " added a comment: \"" +
                        truncate(request.getBody(), 60) + "\"",
                        Notification.NotificationType.NEW_COMMENT,
                        ticketId
                    )
                );
            } catch (Exception e) {
                log.warn("Failed to notify technician of comment: {}",
                        e.getMessage());
            }
        }

        return saved;
    }

    // -------------------------------------------------------
    // GET COMMENTS BY TICKET
    // -------------------------------------------------------
    public List<Comment> getCommentsByTicket(String ticketId) {
        ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    // -------------------------------------------------------
    // EDIT COMMENT — only comment owner
    // -------------------------------------------------------
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

    // -------------------------------------------------------
    // DELETE COMMENT — owner or admin
    // -------------------------------------------------------
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

    // -------------------------------------------------------
    // HELPER — truncate long comment previews
    // -------------------------------------------------------
    private String truncate(String text, int maxLength) {
        if (text == null) return "";
        return text.length() <= maxLength
                ? text
                : text.substring(0, maxLength) + "...";
    }
}