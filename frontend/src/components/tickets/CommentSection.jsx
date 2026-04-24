import { useEffect, useState } from "react";
import { addComment, getComments } from "../../api/ticketApi";

export default function CommentSection({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      const res = await getComments(ticketId);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handleAddComment = async () => {
    if (!body.trim()) return;

    try {
      await addComment(ticketId, { body });
      setBody("");
      fetchComments();
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  return (
    <div className="comments-card">
      <h3 className="form-title" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        Comments
      </h3>

      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p className="comment-author">{comment.authorName || "User"}</p>
            <p className="comment-text">{comment.body}</p>
          </div>
        ))}
      </div>

      <div className="comment-input-row">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment} className="primary-btn">
          Add
        </button>
      </div>
    </div>
  );
}