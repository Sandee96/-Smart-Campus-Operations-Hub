import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getTicketById,
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../api/ticketApi";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("smartcampus_user"));
  } catch {
    return null;
  }
}

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const user = getStoredUser();

  const isAdmin =
    user?.role === "ROLE_ADMIN" ||
    (user?.roles || "").includes("ADMIN");

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, []);

  const fetchTicket = async () => {
    const res = await getTicketById(id);
    setTicket(res.data);
  };

  const fetchComments = async () => {
    const res = await getComments(id);
    setComments(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    await addComment(id, { body: commentBody });
    setCommentBody("");
    fetchComments();
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    await deleteComment(commentId);
    fetchComments();
  };

  const handleEdit = async (commentId) => {
    await updateComment(commentId, { body: editText });
    setEditingId(null);
    fetchComments();
  };

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="main-content">
      <h2>{ticket.category}</h2>

      {/* ❌ Hide input if CLOSED */}
      {ticket.status !== "CLOSED" && (
        <form onSubmit={handleAdd} className="comment-form">
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Add a comment..."
            className="comment-input"
          />
          <button className="ticket-primary-btn">Add Comment</button>
        </form>
      )}

      {ticket.status === "CLOSED" && (
        <p className="closed-note">
          Comments are disabled because this ticket is closed.
        </p>
      )}

      <div className="comments-list">
        {comments.map((c) => {
          const isOwner = c.authorId === user?.id;

          return (
            <div key={c.id} className="comment-card">
              <div className="comment-header">
                <strong>{c.authorName}</strong>
                <span>{c.createdAt}</span>
              </div>

              {/* ✏️ EDIT MODE */}
              {editingId === c.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />

                  <button onClick={() => handleEdit(c.id)}>
                    Save
                  </button>

                  <button onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <p>{c.body}</p>
              )}

              {/* ✅ Show buttons based on rules */}
              <div className="comment-actions">
                {/* EDIT → only owner */}
                {isOwner && editingId !== c.id && (
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditText(c.body);
                    }}
                  >
                    Edit
                  </button>
                )}

                {/* DELETE → owner OR admin */}
                {(isOwner || isAdmin) && (
                  <button
                    className="danger-btn"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}