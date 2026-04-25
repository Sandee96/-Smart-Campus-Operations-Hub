import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addComment,
  getComments,
  getTicketById,
} from "../api/ticketApi";
import TicketStatusBadge from "../components/tickets/TicketStatusBadge";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await getTicketById(id);
      setTicket(res.data);
    } catch (error) {
      console.error("Failed to fetch ticket", error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getComments(id);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentBody.trim()) return;

    try {
      await addComment(id, { body: commentBody });
      setCommentBody("");
      fetchComments();
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("Failed to add comment");
    }
  };

  if (!ticket) {
    return <div className="main-content">Loading...</div>;
  }

  return (
    <div className="main-content">
      <div className="details-card">
        <div className="ticket-card-header">
          <div>
            <h1 className="page-title">{ticket.category}</h1>
            <p className="page-subtitle">{ticket.location}</p>
          </div>
          <TicketStatusBadge status={ticket.status} />
        </div>

        <p className="ticket-desc">{ticket.description}</p>

        <div className="info-boxes">
          <div className="info-box">
            <p className="info-label">Priority</p>
            <p className="info-value">{ticket.priority}</p>
          </div>

          <div className="info-box">
            <p className="info-label">Resource ID</p>
            <p className="info-value">{ticket.resourceId || "No resource"}</p>
          </div>

          <div className="info-box">
            <p className="info-label">Contact Details</p>
            <p className="info-value">{ticket.contactDetails}</p>
          </div>

          <div className="info-box">
            <p className="info-label">Assigned Technician</p>
            <p className="info-value">
              {ticket.assignedTechnicianId || "Not assigned"}
            </p>
          </div>
        </div>

        <div className="comments-section">
          <h2 className="comments-title">Comments</h2>

          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Add a comment..."
              className="comment-input"
            />

            <button type="submit" className="ticket-primary-btn">
              Add Comment
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="page-subtitle">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <strong>{comment.authorName || "User"}</strong>
                    <span>{comment.createdAt || ""}</span>
                  </div>
                  <p>{comment.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}